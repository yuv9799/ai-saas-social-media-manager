const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

/**
 * Trigger an automation workflow hook (like n8n) on post updates
 */
export async function triggerWebhook(event: string, payload: any) {
  if (!WEBHOOK_URL) {
    console.log(`[Webhook Service] No N8N_WEBHOOK_URL configured. Event ${event} logging payload:`, JSON.stringify(payload));
    return;
  }

  try {
    console.log(`[Webhook Service] Dispatching event ${event} to automation endpoint...`);
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event,
        timestamp: new Date(),
        data: payload,
      }),
    });

    if (res.ok) {
      console.log(`[Webhook Service] Successfully triggered webhook for event ${event}`);
    } else {
      console.warn(`[Webhook Service] Webhook response failed: ${res.status}`);
    }
  } catch (error: any) {
    console.error(`[Webhook Service] Failed to dispatch webhook for event ${event}:`, error.message);
  }
}
