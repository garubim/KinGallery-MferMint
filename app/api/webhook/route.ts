import { getStore } from '@netlify/blobs';

/**
 * Farcaster Webhook Handler
 *
 * Handles notification lifecycle events from Farcaster:
 * - frame_added: User added the miniapp (may include notification token)
 * - frame_removed: User removed the miniapp
 * - notifications_enabled: User enabled notifications (includes token)
 * - notifications_disabled: User disabled notifications
 */

interface FarcasterWebhookPayload {
  event: 'frame_added' | 'frame_removed' | 'notifications_enabled' | 'notifications_disabled';
  notificationDetails?: {
    url: string;
    token: string;
  };
  fid?: number;
}

function getNotificationStore() {
  return getStore('farcaster-notifications');
}

export async function POST(request: Request) {
  try {
    const payload: FarcasterWebhookPayload = await request.json();
    const { event, notificationDetails, fid } = payload;

    if (!event) {
      return Response.json({ error: 'Missing event field' }, { status: 400 });
    }

    const store = getNotificationStore();

    switch (event) {
      case 'frame_added': {
        // User added the miniapp to their Farcaster client
        if (notificationDetails && fid) {
          await store.setJSON(`fid:${fid}`, {
            fid,
            url: notificationDetails.url,
            token: notificationDetails.token,
            enabled: true,
            addedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
        return Response.json({ success: true });
      }

      case 'frame_removed': {
        // User removed the miniapp - clean up their notification data
        if (fid) {
          await store.delete(`fid:${fid}`);
        }
        return Response.json({ success: true });
      }

      case 'notifications_enabled': {
        // User turned on notifications - store/update their token
        if (notificationDetails && fid) {
          await store.setJSON(`fid:${fid}`, {
            fid,
            url: notificationDetails.url,
            token: notificationDetails.token,
            enabled: true,
            updatedAt: new Date().toISOString(),
          });
        }
        return Response.json({ success: true });
      }

      case 'notifications_disabled': {
        // User turned off notifications - mark as disabled but keep record
        if (fid) {
          const existing = await store.get(`fid:${fid}`, { type: 'json' }) as Record<string, unknown> | null;
          if (existing) {
            await store.setJSON(`fid:${fid}`, {
              ...existing,
              enabled: false,
              updatedAt: new Date().toISOString(),
            });
          }
        }
        return Response.json({ success: true });
      }

      default:
        return Response.json({ error: 'Unknown event type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Respond to GET requests (Farcaster may probe the endpoint)
export async function GET() {
  return Response.json({ status: 'ok', service: 'kingallery-farcaster-webhook' });
}
