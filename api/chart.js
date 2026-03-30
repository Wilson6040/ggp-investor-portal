// Vercel Edge Function — Yahoo Finance CORS proxy for GGP charts
export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const sym  = url.searchParams.get('sym') || 'GGP.L';
  const range = url.searchParams.get('range') || '6mo';
  
  const yhUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=${range}`;
  
  try {
    const res = await fetch(yhUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 's-maxage=300',
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
