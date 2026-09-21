export default async function handler(req, res) {
  const key = process.env.RAJAONGKIR_KEY || 'ONEPO4GDC28029aeb7bcc7c9YYaTtAKr';
  const q = req.query.q || req.query.search || '';
  if(!q || q.length < 2) return res.status(200).json({ data: [] });
  try{
    const r = await fetch(`https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=${encodeURIComponent(q)}&limit=15`, {
      headers: { 'key': key }
    });
    const j = await r.json();
    // Komerce balikin data array
    return res.status(200).json(j);
  }catch(e){
    return res.status(500).json({ data: [], error: e.message });
  }
}
