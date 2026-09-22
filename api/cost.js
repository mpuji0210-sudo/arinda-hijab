// CACHE ONGKIR - biar 100 orang Cengkareng -> Bandung cuma kepotong 1 kuota
const costCache = new Map();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST, GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const KEY = 'ONEPO4GDc28b29aeb7bcc7c9YYaTXAkr'; // key kamu yang YY 2
  // Support GET dan POST
  const body = req.method === 'GET' ? req.query : req.body;
  const origin = body.origin || '17523'; // Cengkareng
  const destination = body.destination;
  const weight = body.weight || 300; // berat hijab Arinda
  const courier = (body.courier || 'jne').toLowerCase();

  if (!destination) return res.status(400).json({ error: 'destination kosong' });

  // Bikin kunci cache: contoh "17523-1513-300-jne"
  const cacheKey = `${origin}-${destination}-${weight}-${courier}`;

  // 1. CEK LACI DULU
  if (costCache.has(cacheKey)) {
    const item = costCache.get(cacheKey);
    if (Date.now() - item.time < 21600000) { // 6 jam cache
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json({ data: item.data, from: 'cache' });
    }
  }

  try {
    const r = await fetch('https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'key': KEY 
      },
      body: new URLSearchParams({
        origin: String(origin),
        destination: String(destination),
        weight: String(weight),
        courier: courier
      })
    });

    const j = await r.json();
    
    if (!j.data || j.data.length === 0) {
      return res.status(200).json({ data: [], note: j.meta?.message || 'kuota habis / rute tidak ada', raw: j });
    }

    // 2. SIMPAN KE LACI
    costCache.set(cacheKey, { data: j.data, time: Date.now() });

    // 3. SURUH VERCEL SIMPAN 6 JAM JUGA
    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400');
    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json({ data: j.data, from: 'live' });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
