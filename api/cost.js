export default async function handler(req,res){
if(req.method!=='POST') return res.status(405).end();
const key='ONEPO4GDc28b29aeb7bcc7c9YYaTXAkr';
const {origin,destination,weight,courier}=req.body;
const params=new URLSearchParams({origin:String(origin),destination:String(destination),weight:String(weight||1000),courier:String(courier||'jne').toLowerCase()});
try{
const r=await fetch('https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost',{method:'POST',headers:{key,'Content-Type':'application/x-www-form-urlencoded'},body:params});
const j=await r.json();
return res.status(200).json(j);
}catch(e){return res.json({data:[]});}
}
