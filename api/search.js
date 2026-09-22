// CACHE sederhana di memory Vercel - tahan 1 jam
const cache = new Map();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  const KEY = 'ONEPO4GDc28b29aeb7bcc7c9YYaTXAkr'; // key kamu yang ada YY 2
  const q = (req.query.q || '').toLowerCase().trim();
  
  if (q.length < 3) return res.json({ data: [] });

  // 1. CEK LACI DULU, kalau ada Bandung di laci, langsung kasih tanpa potong kuota
  if (cache.has(q)) {
    const item = cache.get(q);
    if (Date.now() - item.time < 3600000) { // 1 jam
      return res.json({ data: item.data, from: 'cache' });
    }
  }

  try {
    const url = `https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=${q}&limit=10`;
    const r = await fetch(url, { headers: { key: KEY } });
    const j = await r.json();

    if (!j.data || j.data.length === 0) {
      return res.json({ data: [], note: 'kuota habis atau tidak ditemukan' });
    }

    const data = j.data.map(d => ({
      id: d.id,
      label: `${d.subdistrict_name ? d.subdistrict_name + ', ' : ''}${d.district_name}, ${d.city_name} - ${d.province_name}`.toUpperCase()
    }));

    // 2. SIMPAN KE LACI, jadi besok ada yang ketik Bandung lagi gak perlu telpon Komerce
    cache.set(q, { data, time: Date.now() });

    // 3. SURUH BROWSER JUGA SIMPAN 1 HARI (biar gak hit server kamu terus)
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    return res.json({ data, from: 'live' });

  } catch (e) {
    return res.json({ data: [], error: e.message });
  }
}
