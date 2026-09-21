export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).json({message:'Method not allowed'});
  try{
    const { origin, destination, weight, courier } = req.body;
    const key = process.env.RAJAONGKIR_KEY || 'ONEPO4GDC28029aeb7bcc7c9YYaTtAKr';
    
    const params = new URLSearchParams();
    params.append('origin', origin);
    params.append('destination', destination);
    params.append('weight', String(weight||1000));
    params.append('courier', String(courier||'jne').toLowerCase());
    params.append('price', 'lowest');

    const endpoints = [
      'https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost',
      'https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost',
      'https://rajaongkir.komerce.id/api/v1/calculate/subdistrict/domestic-cost'
    ];

    for(let url of endpoints){
      try{
        const r = await fetch(url, { method:'POST', headers:{'key':key,'Content-Type':'application/x-www-form-urlencoded'}, body:params });
        const j = await r.json();
        if(j.data && j.data.length>0) return res.status(200).json({data:j.data});
      }catch(e){}
    }

    // FALLBACK WAJIB BIAR GAK "Tidak ada layanan" - customer tetap bisa checkout
    const kur = String(courier||'jne').toUpperCase();
    return res.status(200).json({
      data: [
        { courier: kur, service: 'REG', cost: 15000, etd: '2-3 hari', name: kur, description: 'Reguler' },
        { courier: 'POS', service: 'Reguler', cost: 12000, etd: '3-4 hari', name: 'POS', description: 'POS Reguler' }
      ]
    });
  }catch(e){
    return res.status(200).json({data:[{courier:'JNE',service:'REG',cost:15000,etd:'2-3 hari'}]});
  }
}
