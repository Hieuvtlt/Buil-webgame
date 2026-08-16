const W=3000
const H=1800

const hash=s=>{let h=2166136261;for(const c of String(s||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
const rng=seed=>()=>{seed=(seed+0x6D2B79F5)|0;let t=seed;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}
const themeOf=a=>{const t=`${a?.name||''} ${a?.terrain||''}`.toLowerCase();if(t.includes('sa mạc'))return'desert';if(t.includes('tuyết'))return'snow';if(t.includes('độc'))return'poison';if(t.includes('bến')||t.includes('nước'))return'water';if(t.includes('hang')||t.includes('động')||t.includes('lăng')||t.includes('huyệt'))return'cave';if(t.includes('núi')||t.includes('côn lôn')||t.includes('đạo sơn'))return'mountain';if(t.includes('cổ địa'))return'ruins';if(t.includes('linh cốc'))return'grove';if(t.includes('thung lũng'))return'valley';return'forest'}
export function getAreaThemeV3(area){return themeOf(area)}

const P={forest:['#78bd5b','#4f9447','#234f31','#d4aa67'],grove:['#91c96b','#559747','#285c37','#d8b26d'],valley:['#80bd61','#4e8c43','#285734','#d6ac68'],water:['#74b965','#478d49','#25583b','#d9b16b'],mountain:['#829b76','#526f59','#30483d','#c39a68'],snow:['#e1eee9','#a9c7bd','#4d7068','#c5a77b'],desert:['#dfbd70','#c7964e','#775b3c','#d8a45a'],cave:['#68796d','#4d6155','#293e35','#9d7b58'],ruins:['#83a865','#52794b','#2f563a','#ae8864'],poison:['#8bae55','#5d873e','#294e35','#9b7a58']}

const tree=(x,y,s,c,pine=false)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="42" rx="46" ry="13" fill="#17341e" opacity=".38"/><rect x="-9" y="-2" width="18" height="48" fill="#62432d"/><path d="M-7 15L-38 34M8 12L39 31" stroke="#493425" stroke-width="9"/><path d="${pine?'M0-86L42-22H24L56 25H-56L-24-22H-42Z':'M-36-5Q-60-42-29-63Q-8-93 25-64Q60-42 33-7Q52 22 19 37H-20Q-58 22-36-5Z'}" fill="${c[1]}" stroke="${c[2]}" stroke-width="7"/><path d="${pine?'M0-70L27-31H13L36 3H-36L-13-31H-27Z':'M-18-13Q-33-38-8-52Q18-63 34-35Q39-9 12 7Q-5 19-18-13Z'}" fill="${c[0]}"/><path d="M-25-35l16-10M8-33l19-9" stroke="#d9ed91" stroke-width="6" opacity=".48"/></g>`
const bush=(x,y,s,c)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="15" rx="36" ry="11" fill="#17351f" opacity=".26"/><circle cx="-23" cy="2" r="20" fill="${c[2]}"/><circle cx="0" cy="-12" r="26" fill="${c[1]}"/><circle cx="23" cy="2" r="20" fill="${c[0]}"/><circle cx="-4" cy="-18" r="8" fill="#b4dc68" opacity=".55"/></g>`
const rock=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="20" rx="34" ry="10" fill="#1d3528" opacity=".3"/><path d="M-33 12L-21-23 6-35 34-14 26 17 0 27-28 19Z" fill="#707b73" stroke="#435149" stroke-width="6"/><path d="M-16-17L5-28 17-9-4 2Z" fill="#e2e5dd" opacity=".76"/><path d="M-23 8L-5 15" stroke="#929b91" stroke-width="5" opacity=".55"/></g>`
const flower=(x,y,s,c)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0v15M0 8l-8-4M0 10l8-4" stroke="#42703b" stroke-width="3"/><rect x="-5" y="-10" width="10" height="11" fill="${c}"/><rect x="-10" y="-6" width="20" height="9" fill="${c}"/><rect x="-3" y="-4" width="6" height="6" fill="#f2d56b"/></g>`
const grass=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})" opacity=".82"><path d="M0 0L-2-17M5 0L9-14M-5 0L-12-12M16 1L20-11M22 1L29-9" stroke="#39753d" stroke-width="3"/></g>`
const reed=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0C-2-35 7-54 2-76M8 0C18-29 25-48 23-67M-7 0C-18-28-17-44-12-59" fill="none" stroke="#3c7842" stroke-width="6"/><path d="M-2-73l8-4M21-65l8-3M-12-57l7-4" stroke="#9b8c54" stroke-width="7"/></g>`
const log=(x,y,s)=>`<g transform="translate(${x} ${y}) rotate(-18) scale(${s})"><rect x="-54" y="-14" width="108" height="28" rx="8" fill="#754c2d" stroke="#4b3425" stroke-width="6"/><ellipse cx="-53" rx="13" ry="13" fill="#b17a46" stroke="#513725" stroke-width="4"/><path d="M-36-5H37M-25 5H28" stroke="#9b6840" stroke-width="4" opacity=".6"/></g>`
const stump=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="4" rx="27" ry="17" fill="#70472a" stroke="#493224" stroke-width="5"/><path d="M-19 0Q0-13 19 0Q0 13-19 0Z" fill="#c18a50"/><path d="M-11 0Q0-8 11 0Q0 8-11 0Z" fill="#70472a"/></g>`
const road=(d,w=54)=>`<path d="${d}" fill="none" stroke="#60422d" stroke-width="${w+20}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#d1a666" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#e6c57f" stroke-width="7" stroke-dasharray="4 32" stroke-linecap="round" opacity=".78"/>`
const stream=(d,w=115)=>`<path d="${d}" fill="none" stroke="#214e59" stroke-width="${w+28}" opacity=".9"/><path d="${d}" fill="none" stroke="#2f7893" stroke-width="${w+8}"/><path d="${d}" fill="none" stroke="#4aa0b7" stroke-width="${w}"/><path d="${d}" fill="none" stroke="#9bd8df" stroke-width="6" stroke-dasharray="32 38" opacity=".72"/>`
const bridge=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="35" rx="145" ry="18" fill="#17351f" opacity=".25"/><rect x="-140" y="-31" width="280" height="62" rx="8" fill="#4d3525" stroke="#2f241c" stroke-width="7"/><rect x="-124" y="-20" width="248" height="40" fill="#b47c47"/><path d="M-104-21v42m52-42v42M0-21v42M52-21v42M104-21v42" stroke="#6a452d" stroke-width="8"/><path d="M-140-31H140" stroke="#c18b50" stroke-width="7"/></g>`
const house=(x,y,s,roof='#70472e')=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="58" rx="76" ry="14" fill="#203a27" opacity=".28"/><rect x="-54" y="-12" width="108" height="70" fill="#b9814b" stroke="#60412d" stroke-width="6"/><path d="M-71-12L0-79 71-12Z" fill="${roof}" stroke="#493229" stroke-width="6"/><rect x="-14" y="10" width="28" height="48" fill="#54392b"/><rect x="25" y="-1" width="20" height="21" fill="#a9d7d6" stroke="#4f6866" stroke-width="3"/><rect x="-45" y="-1" width="20" height="21" fill="#a9d7d6" stroke="#4f6866" stroke-width="3"/><rect x="-74" y="-5" width="20" height="13" fill="#8d5f3a"/></g>`
const watchtower=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="58" rx="62" ry="14" fill="#203a27" opacity=".26"/><path d="M-38 50L-27-50H27L38 50Z" fill="#8a6947" stroke="#543d2b" stroke-width="6"/><rect x="-47" y="-63" width="94" height="31" fill="#a77745" stroke="#563b29" stroke-width="6"/><path d="M-40-63L0-90 40-63" fill="#6a472f" stroke="#4a3325" stroke-width="6"/><rect x="-9" y="-37" width="18" height="16" fill="#9ed2d1"/></g>`
const well=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="42" rx="58" ry="14" fill="#203a27" opacity=".25"/><path d="M-48 35V-6Q0-32 48-6V35" fill="#6b6e68" stroke="#404842" stroke-width="6"/><ellipse cy="-5" rx="48" ry="17" fill="#303a36" stroke="#454c48" stroke-width="5"/><path d="M-56-20H56M-45-20V-57M45-20V-57" stroke="#6a452d" stroke-width="8"/><path d="M-55-57H55" stroke="#8f633e" stroke-width="10"/></g>`
const cave=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="62" rx="100" ry="18" fill="#17351f" opacity=".35"/><path d="M-94 52V5Q-85-79 0-92Q85-79 94 5V52Z" fill="#6d716b" stroke="#414942" stroke-width="8"/><path d="M-65 51V5Q-59-45 0-55Q59-45 65 5V51Z" fill="#1c2521"/><path d="M-20-77L0-91 18-77" stroke="#9da398" stroke-width="8"/><rect x="-72" y="18" width="12" height="25" fill="#dba34c"/><rect x="60" y="18" width="12" height="25" fill="#dba34c"/><path d="M-66 18l6-12 6 12M66 18l6-12 6 12" stroke="#f2c766" stroke-width="4"/></g>`
const sign=(x,y,s,text)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0v80" stroke="#65452d" stroke-width="10"/><path d="M-6 10L70 0 74 34-4 45Z" fill="#9a6940" stroke="#573a27" stroke-width="5"/><text x="7" y="27" font-family="monospace" font-size="13" fill="#f0d9a1">${text}</text></g>`
const fence=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})" stroke="#65452d"><path d="M-105 0H105M-80-34V34M-25-34V34M30-34V34M85-34V34" stroke-width="9"/><path d="M-90-19H90M-90 19H90" stroke="#a16d43" stroke-width="6"/></g>`
const lily=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="18" ry="11" fill="#72a94f"/><path d="M0 0L7-7" stroke="#315d3b" stroke-width="3"/><circle cx="7" cy="-7" r="4" fill="#e7d77c"/></g>`

function rungRamVenHo(){
  const r=rng(hash('Rừng Rậm Ven Hồ|MASTER|V5'))
  const c=P.forest
  const mainRoad='M-120 1290 C180 1250 350 1040 600 1010 C850 980 960 1150 1160 1130 C1390 1105 1450 900 1290 735 C1140 580 1010 475 1170 335 C1340 185 1580 220 1760 390 C1920 540 1850 720 2020 835 C2200 955 2400 870 2580 690 C2740 535 2900 590 3120 690'
  const northRoad='M-80 500 C280 460 540 510 770 650 C920 735 1050 690 1160 560 C1280 420 1450 410 1620 520 C1780 620 1940 560 2070 430 C2230 270 2460 250 2660 390 C2810 500 2930 430 3090 330'
  const southRoad='M-80 1510 C330 1430 520 1340 770 1420 C1020 1500 1180 1570 1450 1460 C1680 1370 1900 1390 2090 1510 C2310 1650 2580 1570 3100 1370'
  const streamA='M-20 140 C250 250 330 430 275 620 C220 790 350 900 560 960 C720 1010 780 1160 700 1320 C620 1470 700 1610 920 1880'
  const streamB='M2140-100 C2010 110 2110 300 2010 440 C1910 575 1990 720 2130 820 C2290 930 2280 1110 2140 1240 C2020 1360 2040 1510 2200 1900'
  let back='',mid='',front=''
  const belts=[[40,60,760,440,28],[760,40,760,420,27],[1560,45,650,430,27],[2260,55,680,500,30],[20,520,430,680,22],[2450,520,520,700,25],[40,1180,620,560,28],[2180,1180,760,520,30]]
  for(const [bx,by,bw,bh,n] of belts){for(let i=0;i<n;i++){const x=bx+r()*bw,y=by+r()*bh,s=.62+r()*1.05;back+=tree(x,y,s,c,r()<.23)}}
  for(let i=0;i<65;i++){const x=70+r()*2860,y=80+r()*1640,s=.55+r()*.9;mid+=bush(x,y,s,c)}
  for(let i=0;i<110;i++){const x=90+r()*2820,y=100+r()*1550,s=.42+r()*.85;mid+=i%4===0?rock(x,y,s):i%3===0?grass(x,y,s):flower(x,y,s,i%2?'#f1d45d':'#ef9bb0')}
  for(let i=0;i<26;i++){const x=80+r()*2840,y=80+r()*1600,s=.55+r()*.8;front+=tree(x,y,s,c,r()<.18)}
  for(let i=0;i<34;i++){const x=1040+r()*1170,y=170+r()*1470,s=.5+r()*.65;mid+=reed(x,y,s)}
  const waterDetails=[[290,570,.8],[350,760,.65],[465,910,.8],[620,1060,.65],[760,1290,.8],[2020,370,.7],[2110,560,.8],[2200,760,.65],[2250,1020,.8],[2150,1270,.75],[2070,1490,.7]]
  for(const [x,y,s] of waterDetails)mid+=lily(x,y,s)
  front+=cave(520,300,1.02)+house(650,1110,1.08,'#6f442c')+house(2550,530,.92,'#6b4934')
  front+=watchtower(2700,420,.9)+watchtower(1680,1040,1.0)+well(1010,1460,.9)
  front+=fence(380,1180,.8)+fence(2390,650,.72)+fence(2750,1050,.65)
  front+=sign(300,560,.9,'VEN HO')+sign(1840,610,.82,'CAU GO')+sign(2460,930,.78,'TRAM GAC')
  front+=log(360,1030,1)+log(1850,1160,.85)+stump(760,850,.85)+stump(1940,500,.7)+stump(2680,800,.85)
  front+=bridge(720,980,1.0)+bridge(2140,825,1.02)+bridge(2160,1510,.72)
  const clears=`<g fill="#c9a766" opacity=".20"><ellipse cx="1120" cy="1210" rx="175" ry="105"/><ellipse cx="1830" cy="930" rx="165" ry="105"/><ellipse cx="2560" cy="1180" rx="150" ry="90"/></g>`
  const labels=`<g font-family="monospace" fill="#f4e4b4" stroke="#2b241d" stroke-width="8" paint-order="stroke"><text x="420" y="1080" font-size="34">LÀNG VEN HỒ</text><text x="430" y="245" font-size="30">HANG ĐÁ</text><text x="2410" y="485" font-size="28">TRẠM GÁC</text></g>`
  return {objects:back+mid+front,paths:`${stream(streamA,112)}${stream(streamB,106)}${road(mainRoad,66)}${road(northRoad,50)}${road(southRoad,48)}`,spawnClears:clears,labels}
}

function genericMap(area){
  const r=rng(hash(area?.name||'world')),theme=themeOf(area),c=P[theme]||P.forest
  let objs=''
  for(let i=0;i<190;i++){const x=60+r()*2880,y=60+r()*1680,s=.45+r()*.9;objs+=theme==='snow'?tree(x,y,s,c,true):theme==='desert'?(i%3?rock(x,y,s):`<path d="M${x-25} ${y+30}V${y-40}" stroke="#547641" stroke-width="14"/>`):theme==='mountain'?(i%2?rock(x,y,s):tree(x,y,s,c,true)):theme==='cave'?rock(x,y,s):tree(x,y,s,c,i%5===0)}
  const d='M-100 1280 C450 1200 520 650 1040 760 C1500 860 1510 380 1970 540 C2410 700 2480 1100 3100 760'
  return {objects:objs,paths:road(d,60),spawnClears:'',labels:''}
}

function artSvg(area){
  const theme=themeOf(area)
  const special=(area?.name||'')==='Rừng Rậm Ven Hồ'?rungRamVenHo():genericMap(area)
  const c=P[theme]||P.forest
  const terrain=theme==='desert'?'#d9b56d':theme==='snow'?'#dce9e5':theme==='cave'?'#53665c':c[0]
  const soil=theme==='desert'?'#e4c27a':theme==='snow'?'#eaf1ed':c[1]
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges"><defs><pattern id="g" width="64" height="64" patternUnits="userSpaceOnUse"><rect width="64" height="64" fill="${terrain}"/><rect x="8" y="12" width="5" height="9" fill="${soil}" opacity=".5"/><rect x="39" y="50" width="4" height="7" fill="${c[2]}" opacity=".45"/><path d="M20 56l4-10m8 10l3-7M49 22l5-5" stroke="${c[2]}" stroke-width="3" opacity=".5"/></pattern><pattern id="px" width="16" height="16" patternUnits="userSpaceOnUse"><rect x="2" y="3" width="3" height="3" fill="#fff" opacity=".035"/><rect x="11" y="9" width="2" height="2" fill="#000" opacity=".035"/></pattern></defs><rect width="3000" height="1800" fill="url(#g)"/><rect width="3000" height="1800" fill="url(#px)"/><path d="M0 0H3000V80H0Z" fill="#173c27" opacity=".28"/>${special.paths}${special.spawnClears}${special.objects}${special.labels}</svg>`
  return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`
}

export function getAreaArtV3(area){return artSvg(area)}
export function getAreaArt(area){return artSvg(area)}
