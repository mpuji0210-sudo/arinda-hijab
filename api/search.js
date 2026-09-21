export default async function handler(req, res) {
  const key = 'ONEPO4GDc28b29aeb7bcc7c9YYaTXAkr';
  const { q } = req.query;
  const r = await fetch(`https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=${q}&limit=10`, {
    headers: { 'key': key }
  });
  const data = await r.json();
  res.status(200).json(data);
}
