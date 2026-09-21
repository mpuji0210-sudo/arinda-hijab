export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({message:'Method not allowed'});
  const key = process.env.RAJAONGKIR_KEY || 'ONEPO4GDC28029aeb7bcc7c9YYaTtAKr';
  try{
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
    const j = await r.json();
    
    // Ubah format Komerce jadi format yang dimengerti web kamu
    if(j.data && Array.isArray(j.data)){
      return res.status(200).json({ data: j.data.map(x=>({ service: x.service || x.name, cost: x.cost || x.price, etd: x.etd || '-' })) });
    }
    return res.status(200).json(j);
  }catch(e){
    return res.status(500).json({error: e.message});
  }
}
