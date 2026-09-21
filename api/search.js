export default async function handler(req, res) {
  const key = process.env.RAJAONGKIR_KEY || 'ONEPO4GDC28029aeb7bcc7c9YYaTtAKr';
  const q = (req.query.q || req.query.search || '').trim();
  if(!q || q.length < 2) return res.status(200).json({ data: [] });

  try{
    const r = await fetch(`https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=${encodeURIComponent(q)}`, {
      headers: { 'key': key }
    });
    const j = await r.json();
    
    if(j.data && Array.isArray(j.data)){
      const data = j.data.map(x => ({
        id: x.id,
        name: `${x.subdistrict_name ? x.subdistrict_name + ', ' : ''}${x.district_name}, ${x.city_name}, ${x.province_name}, ${x.zip_code}`.toUpperCase(),
        zip_code: x.zip_code,
        subdistrict_name: x.subdistrict_name,
        district_name: x.district_name,
        city_name: x.city_name,
        province_name: x.province_name
      }));
      return res.status(200).json({ data });
    }
    return res.status(200).json({ data: [] });
  }catch(e){
    return res.status(200).json({ data: [], error: e.message });
  }
}
