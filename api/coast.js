export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({message:'Method not allowed'});
  const key = 'ONEPO4GDc28b29aeb7bcc7c9YYaTXAkr';
  const { origin, destination, weight, courier } = req.body;
  const params = new URLSearchParams();
  params.append('origin', origin);
  params.append('destination', destination);
  params.append('weight', weight || 1000);
  params.append('courier', courier || 'jne:jnt:pos');
  params.append('price', 'lowest');
  const r = await fetch('https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost', {
    method: 'POST',
    headers: { 'key': key, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
  const data = await r.json();
  res.status(200).json(data);
}
