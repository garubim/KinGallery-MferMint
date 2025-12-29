# Netlify environment variables (do not store secrets here)

Este arquivo documenta as variáveis de ambiente que o site Netlify/Functions precisa. NÃO colocar valores secretos neste ficheiro. Use o Netlify UI ou CLI para inserir os valores.

Formato (Key / onde colar):

1. AWS_ACCESS_KEY_ID
   - Production: REPLACE_WITH_ACCESS_KEY_ID
   - Deploy Previews: REPLACE_WITH_ACCESS_KEY_ID
   - Branch deploys: REPLACE_WITH_ACCESS_KEY_ID
   - Preview Server & Agent Runners: REPLACE_WITH_ACCESS_KEY_ID
   - Local development (Netlify CLI): REPLACE_WITH_ACCESS_KEY_ID
   - Recommended alternative (avoid reserved names): `KIN_AWS_ACCESS_KEY_ID`

2. AWS_SECRET_ACCESS_KEY
   - Production: REPLACE_WITH_SECRET_ACCESS_KEY
   - Deploy Previews: REPLACE_WITH_SECRET_ACCESS_KEY
   - Branch deploys: REPLACE_WITH_SECRET_ACCESS_KEY
   - Preview Server & Agent Runners: REPLACE_WITH_SECRET_ACCESS_KEY
   - Local development (Netlify CLI): REPLACE_WITH_SECRET_ACCESS_KEY
   - Recommended alternative (avoid reserved names): `KIN_AWS_SECRET_ACCESS_KEY`

3. AWS_REGION
   - Production: us-east-1
   - Deploy Previews: us-east-1
   - Branch deploys: us-east-1
   - Preview Server & Agent Runners: us-east-1
   - Local development (Netlify CLI): us-east-1
   - Recommended alternative: `KIN_AWS_REGION`

4. KIN_SECRET_NAME
   - Production: kin-gallery/paymaster
   - Deploy Previews: kin-gallery/paymaster
   - Branch deploys: kin-gallery/paymaster
   - Preview Server & Agent Runners: kin-gallery/paymaster
   - Local development (Netlify CLI): kin-gallery/paymaster
   - Note: this one already uses the `KIN_` prefix and is preferred.

---

Instruções rápidas (UI):
- Netlify → Site settings → Build & deploy → Environment → New environment variable
- Em Key: colocar exatamente o nome (ex.: `AWS_ACCESS_KEY_ID`)
- Em Value: colar SOMENTE o valor do CSV / secret (sem aspas, sem o nome da variável)
- Marcar "Contains secret values" para as secret keys
- Salvar cada variável e, depois, Deploys → Trigger deploy → Clear cache and deploy

Instruções rápidas (CLI):
```bash
# substitua <site-id>, <ACCESS_KEY_ID>, <SECRET_ACCESS_KEY>
netlify env:set AWS_ACCESS_KEY_ID <ACCESS_KEY_ID> --site <site-id>
netlify env:set AWS_SECRET_ACCESS_KEY <SECRET_ACCESS_KEY> --site <site-id>
netlify env:set AWS_REGION us-east-1 --site <site-id>
netlify env:set KIN_SECRET_NAME kin-gallery/paymaster --site <site-id>
```

Boas práticas:
- Não guardar secrets no repositório.
- Salvar o CSV em um password manager.
- Rotacionar chaves periodicamente.
- Migrar para OIDC/AssumeRole quando possível.

Se quiser, eu gero os comandos `netlify env:set` prontos se você colar o `<site-id>` aqui.