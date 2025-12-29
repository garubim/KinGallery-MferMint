#!/usr/bin/env bash
set -euo pipefail

# purge_secrets.sh
# Safe helper to create a mirror, run git-filter-repo with replacements
# and prepare a cleaned repository for inspection before force-push.
# IMPORTANT: this script does NOT force-push automatically. You must
# inspect the cleaned mirror and run the final push command manually.

REPO_SSH="$(git config --get remote.origin.url || echo 'git@github.com:garubim/Whaaaaaaa.git')"
TIMESTAMP=$(date -u +%Y%m%dT%H%M%SZ)
MIRROR_DIR="repo-mirror-${TIMESTAMP}.git"
BACKUP_TAR="repo-backup-${TIMESTAMP}.tar.gz"

echo "[1/6] Creating bare mirror clone: ${MIRROR_DIR}"
git clone --mirror "${REPO_SSH}" "${MIRROR_DIR}"

echo "[2/6] Backing up mirror to ${BACKUP_TAR}"
tar -czf "${BACKUP_TAR}" "${MIRROR_DIR}"

echo "[3/6] Ensure git-filter-repo is installed"
if ! command -v git-filter-repo >/dev/null 2>&1; then
  echo "git-filter-repo not found. Installing via pip (user)..."
  python3 -m pip install --user git-filter-repo
  export PATH="$PATH:$(python3 -m site --user-base)/bin"
fi

echo "[4/6] Running git-filter-repo with replacements.txt (in parent workspace)"
pushd "${MIRROR_DIR}" >/dev/null

if [ ! -f ../scripts/replacements.txt ]; then
  echo "ERROR: ../scripts/replacements.txt not found. Aborting." >&2
  exit 1
fi

# Run replace-text to scrub secret patterns
git filter-repo --replace-text ../scripts/replacements.txt

echo "[5/6] Cleaning reflog and running garbage collection"
git reflog expire --expire=now --all || true
git gc --prune=now --aggressive || true

popd >/dev/null

echo "[6/6] Done. Cleaned mirror is: ${MIRROR_DIR}"
echo "Backup tar: ${BACKUP_TAR}"
echo
echo "REVIEW the cleaned mirror before force-pushing. To inspect, run:" 
echo "  cd ${MIRROR_DIR} && git log --all --grep PRIVATE_KEY -n 20 || true"
echo
echo "If you are happy, push the cleaned mirror to origin with:" 
echo "  cd ${MIRROR_DIR} && git push --force --all && git push --force --tags"
echo
echo "WARNING: force-pushing rewrites history. All collaborators must re-clone." 

exit 0
