export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).json({message:'Method not allowed'});
  const key = process.env.RAJAONGKIR_KEY || 'ONEPO4GDC28029aeb7bcc7c9YYaTtAKr';
  try{
    const { origin, destination, weight, courier } = req.body;
    const w = String(weight || 1000);
    const c = String(courier||'jne').toLowerCase().split(':')[0].split(',')[0];

    const endpoints = [
      'https://rajaongkir.komerce.id/api/v1/calculate/subdistrict/domestic-cost',
      'https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost',
      'https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost'
    ];

    let allData = [];
    let lastRaw = null;

    for (let url of endpoints) {
      const params = new URLSearchParams();
      params.append('origin', origin);
      params.append('destination', destination);
      params.append('weight', w);
      params.append('courier', c);
      params.append('price', 'lowest');

      try{
        const r = await fetch(url, {
          method: 'POST',
          headers: { 'key': key, 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params
        });
        const j = await r.json();
        lastRaw = { url, response: j };
        if (j.data && Array.isArray(j.data) && j.data.length > 0) {
          allData = j.data;
          break; // udah ketemu yang ada isinya, stop
        }
      }catch(e){}
    }

    if (allData.length > 0) {
      return res.status(200).json({ data: allData });
    }
    // biar kamu lihat di Vercel log kalau masih kosong
    console.log('KOSONG:', lastRaw);
    return res.status(200).json({ data: [], debug: lastRaw, message: 'Tidak ada layanan - coba ganti kurir POS' });

  }catch(e){
    return res.status(500).json({error: e.message, data: []});
  }
}
