import rungRamVenHoMap from './rung-ram-ven-ho-map.jpg'
import bachThuyDongMap from './bach-thuy-dong-map.svg'

const themeOf=area=>{
  const t=`${area?.name||''} ${area?.terrain||''}`.toLowerCase()
  if(t.includes('sa mạc'))return'desert'
  if(t.includes('tuyết'))return'snow'
  if(t.includes('độc'))return'poison'
  if(t.includes('bến')||t.includes('nước'))return'water'
  if(t.includes('hang')||t.includes('động')||t.includes('lăng')||t.includes('huyệt'))return'cave'
  if(t.includes('núi')||t.includes('côn lôn')||t.includes('đạo sơn'))return'mountain'
  if(t.includes('cổ địa'))return'ruins'
  if(t.includes('linh cốc'))return'grove'
  if(t.includes('thung lũng'))return'valley'
  return'forest'
}

export function getAreaThemeV3(area){return themeOf(area)}

export function getAreaArtV3(area){
  const name=`${area?.name||''}`.toLowerCase()
  if(name.includes('bạch thủy động'))return`url("${bachThuyDongMap}")`
  return`url("${rungRamVenHoMap}")`
}
