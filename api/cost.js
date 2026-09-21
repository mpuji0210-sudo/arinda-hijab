export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).json({message:'Method not allowed'});
  const key = process.env.RAJAONGKIR_KEY || 'ONEPO4GDC28029aeb7bcc7c9YYaTtAKr';
  try{
    const { origin, destination, weight, courier } = req.body;

    // Fix: ambil 1 kurir aja & huruf kecil
    let kurir = String(courier||'jne').toLowerCase().split(':')[0].split(',')[0];
    if(!['jne','jnt','pos','sicepat','anteraja'].includes(kurir)) kurir = 'jne';

    const params = new URLSearchParams();
    params.append('origin', origin);
    params.append('destination', destination);
    params.append('weight', String(weight || 1000));
    params.append('courier', kurir);
    params.append('price', 'lowest');

    const r = await fetch('https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost', {
      method: 'POST',
      headers: { 'key': key, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });
    const j = await r.json();

    // Balikin apa adanya dari Komerce biar frontend kamu bisa baca
    if(j.data && Array.isArray(j.data) && j.data.length > 0){
      return res.status(200).json({ data: j.data });
    }
    // kalau tetap kosong, kasih tau biar gak bingung
    return res.status(200).json(j);
  }catch(e){
    return res.status(500).json({error: e.message});
  }
}
