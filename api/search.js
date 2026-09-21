export default async function handler(req, res) {
  const key = process.env.RAJAONGKIR_KEY || 'ONEPO4GDc28b29aeb7bcc7c9YYaTXAkr';
  const q = (req.query.q || '').trim();
  if (q.length < 3) return res.json({ data: [] });
  try {
    const r = await fetch(`https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=${encodeURIComponent(q)}&limit=10`, {
      headers: { key }
    });
    const j = await r.json();
    const data = (j.data || []).map(d => ({
      id: d.id,
      name: `${d.subdistrict_name ? d.subdistrict_name+', ' : ''}${d.district_name}, ${d.city_name}, ${d.province_name}, ${d.zip_code}`.toUpperCase()
    }));
    return res.json({ data });
  } catch (e) {
    return res.json({ data: [] });
  }
}
