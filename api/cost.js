export default async function handler(req, res) {
  const q = req.query.q || req.query.search || '';
  if(!q || q.length < 2) return res.status(200).json({ data: [] });
  try{
    const r = await fetch(`https://api.rajaongkir.biteship.com/v1/maps/areas?countries=ID&input=${encodeURIComponent(q)}&type=single`, {
      headers: { 'authorization': 'biteship_test.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.e30.o5c3Fztmh-3fZ1aUCXfo0onw-e2q2N3wL5A1V5Z5V5Z5' }
    });
    // kalau pakai key kamu yang lama, pakai yang ini:
    // headers: { 'authorization': process.env.BITESHIP_KEY || 'biteship_test.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.e30.o5c3Fztmh-3fZ1aUCXfo0onw-e2q2N3wL5A1V5Z5V5Z5' }
    const j = await r.json();
    return res.status(200).json(j);
  }catch(e){
    // fallback pakai Komerce kalau Biteship error
    try{
      const key = process.env.RAJAONGKIR_KEY || 'ONEPO4GDC28029aeb7bcc7c9YYaTtAKr';
      const rr = await fetch(`https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=${encodeURIComponent(q)}`, {
        headers: { 'key': key }
      });
      const jj = await rr.json();
      // ubah format Komerce jadi mirip Biteship biar frontend gak error
      const data = (jj.data||[]).map(x=>({ id: x.id, name: `${x.subdistrict_name||''}, ${x.district_name}, ${x.city_name}, ${x.province_name}, ${x.zip_code}`.replace(/^, /,''), zip_code: x.zip_code }));
      return res.status(200).json({ data });
    }catch(ee){
      return res.status(200).json({ data: [], error: e.message });
    }
  }
}
