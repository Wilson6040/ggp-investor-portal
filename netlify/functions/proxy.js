// Netlify serverless function: CORS proxy for Stooq data
// Deployed at: /.netlify/functions/proxy?url=<encoded_url>
exports.handler = async (event) => {
  const target = event.queryStringParameters?.url;
  if (!target) return { statusCode: 400, body: 'Missing url param' };

  // Allowlist - only permit Stooq and Frankfurter
  const allowed = ['stooq.com', 'api.frankfurter.app'];
  const isAllowed = allowed.some(h => target.includes(h));
  if (!isAllowed) return { statusCode: 403, body: 'Domain not allowed' };

  try {
    const res = await fetch(target, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GGP-Portal/1.0)' }
    });
    const body = await res.text();
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Content-Type': res.headers.get('content-type') || 'text/plain',
        'Cache-Control': 'public, max-age=60',
      },
      body,
    };
  } catch (e) {
    return { statusCode: 502, body: `Proxy error: ${e.message}` };
  }
};
