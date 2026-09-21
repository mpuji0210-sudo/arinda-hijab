export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const key = process.env.RAJAONGKIR_KEY || 'ONEPO4GDc28b29aeb7bcc7c9YYaTXAkr';
  const { origin, destination, weight, courier } = req.body;

  const params = new URLSearchParams({
    origin: String(origin),
    destination: String(destination),
    weight: String(weight || 1000),
    courier: String(courier || 'jne').toLowerCase()
  });

  try {
    const r = await fetch('https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost', {
      method: 'POST',
      headers: { key, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });
    const j = await r.json();
    if (j.data && j.data.length > 0) return res.json(j);
    
    // kalau masih kosong, coba endpoint district
    const r2 = await fetch('https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost', {
      method: 'POST', headers: { key, 'Content-Type': 'application/x-www-form-urlencoded' }, body: params
    });
    const j2 = await r2.json();
    return res.json(j2);
  } catch (e) {
    return res.json({ data: [], error: e.message });
  }
}
