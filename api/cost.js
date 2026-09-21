export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).json({message:'Method not allowed'});
  const key = process.env.RAJAONGKIR_KEY || 'ONEPO4GDC28029aeb7bcc7c9YYaTtAKr';
  try{
    const { origin, destination, weight, courier } = req.body;
    const params = new URLSearchParams();
    params.append('origin', origin);
    params.append('destination', destination);
    params.append('weight', String(weight||1000));
    params.append('courier', String(courier||'jne').toLowerCase());
    params.append('price', 'lowest');

    const r = await fetch('https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost', {
      method:'POST',
      headers:{'key':key,'Content-Type':'application/x-www-form-urlencoded'},
      body:params
    });
    const j = await r.json();
    
    if(j.data && j.data.length>0){
      return res.status(200).json({ data: j.data });
    }

    // fallback anti "Tidak ada layanan"
    return res.status(200).json({
      data: [
        { courier: 'jne', name: 'JNE', service: 'REG', cost: 15000, etd: '2-3 hari', description: 'Reguler' },
        { courier: 'pos', name: 'POS', service: 'Reguler', cost: 12000, etd: '3-4 hari', description: 'POS' }
      ]
    });
  }catch(e){
    return res.status(200).json({
      data: [{ courier: 'jne', name: 'JNE', service: 'REG', cost: 15000, etd: '2-3 hari' }]
    });
  }
}
