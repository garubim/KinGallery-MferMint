exports.handler = async function (event, context) {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    console.log('Received unsignedPayload:', body.unsignedPayload || body);

    if (!body.unsignedPayload) return { statusCode: 400, body: 'missing unsignedPayload' };

    const crypto = require('crypto');
    const secret = process.env.PAYMASTER_SECRET || null;
    let signature = null;
    if (secret) {
      signature = crypto.createHmac('sha256', secret).update(JSON.stringify(body.unsignedPayload)).digest('hex');
    }

    const forwardUrl = process.env.WALLET_SERVER_V2_URL || null;
    if (forwardUrl) {
      try {
        const res = await fetch(forwardUrl, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ unsignedPayload: body.unsignedPayload, signature }),
        });
        const text = await res.text();
        return { statusCode: res.status || 200, body: JSON.stringify({ forwarded: true, resp: text }) };
      } catch (e) {
        return { statusCode: 502, body: `forward-failed: ${String(e)}` };
      }
    }

    return { statusCode: 200, body: JSON.stringify({ signed: !!signature, signature }) };
  } catch (e) {
    return { statusCode: 500, body: `error: ${String(e)}` };
  }
