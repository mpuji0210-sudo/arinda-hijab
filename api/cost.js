export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).json({message:'Method not allowed'});
  const key = process.env.RAJAONGKIR_KEY || 'ONEPO4GDC28029aeb7bcc7c9YYaTtAKr';
  try{
    const { origin, destination, weight, courier } = req.body;
    const w = String(weight || 1000);

    // Coba 3 endpoint, yang mana yang ada isinya
    const couriersToTry = ['pos','jne','jnt'];
    // kalau user pilih 1 kurir, utamakan itu dulu
    const first = String(courier||'pos').toLowerCase().split(':')[0].split(',')[0];
    couriersToTry.unshift(first);
    const uniqCouriers = [...new Set(couriersToTry)];

    let allData = [];
    let lastRaw = null;

    for (let c of uniqCouriers) {
      const params = new URLSearchParams();
      params.append('origin', origin);
      params.append('destination', destination);
      params.append('weight', w);
      params.append('courier', c);
      params.append('price', 'lowest');

      const r = await fetch('https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost', {
        method: 'POST',
        headers: { 'key': key, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      });
      const j = await r.json();
      lastRaw = j;
      if (j.data && Array.isArray(j.data) && j.data.length > 0) {
        allData = allData.concat(j.data);
      }
    }

    if (allData.length > 0) {
      return res.status(200).json({ data: allData });
    }
    // kalau tetap kosong, balikin raw biar frontend bisa lihat pesan error Komerce
    return res.status(200).json(lastRaw || { data: [], message: 'Tidak ada layanan untuk rute ini' });

  }catch(e){
    return res.status(500).json({error: e.message, data: []});
  }
}
