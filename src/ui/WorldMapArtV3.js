const W=3000
const H=1800

const hash=s=>{let h=2166136261;for(const c of String(s||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
const rng=seed=>()=>{seed=(seed+0x6D2B79F5)|0;let t=seed;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}
const esc=s=>String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
const themeOf=a=>{const t=`${a?.name||''} ${a?.terrain||''}`.toLowerCase();if(t.includes('sa mạc'))return'desert';if(t.includes('tuyết'))return'snow';if(t.includes('độc'))return'poison';if(t.includes('bến')||t.includes('nước'))return'water';if(t.includes('hang')||t.includes('động')||t.includes('lăng')||t.includes('huyệt'))return'cave';if(t.includes('núi')||t.includes('côn lôn')||t.includes('đạo sơn'))return'mountain';if(t.includes('cổ địa'))return'ruins';if(t.includes('linh cốc'))return'grove';if(t.includes('thung lũng'))return'valley';return'forest'}
export function getAreaThemeV3(area){return themeOf(area)}

const P={forest:['#76b85b','#4c8d43','#244f31','#d4aa67'],grove:['#91c96b','#559747','#285c37','#d8b26d'],valley:['#80bd61','#4e8c43','#285734','#d6ac68'],water:['#74b965','#478d49','#25583b','#d9b16b'],mountain:['#829b76','#526f59','#30483d','#c39a68'],snow:['#e1eee9','#a9c7bd','#4d7068','#c5a77b'],desert:['#dfbd70','#c7964e','#775b3c','#d8a45a'],cave:['#68796d','#4d6155','#293e35','#9d7b58'],ruins:['#83a865','#52794b','#2f563a','#ae8864'],poison:['#8bae55','#5d873e','#294e35','#9b7a58']}

const tree=(x,y,s,c,pine=false)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="39" rx="38" ry="11" fill="#17341e" opacity=".32"/><rect x="-8" y="-1" width="16" height="45" fill="#67462e"/><path d="M-8 12L-31 27M8 9L30 24" stroke="#4b3525" stroke-width="8"/><path d="${pine?'M0-80L40-17H21L51 25H-51L-21-17H-40Z':'M-33-4Q-56-38-26-57Q-8-84 21-60Q54-40 30-7Q47 20 17 33H-18Q-53 20-33-4Z'}" fill="${c[1]}" stroke="${c[2]}" stroke-width="6"/><path d="${pine?'M0-65L25-28H12L33 4H-33L-12-28H-25Z':'M-18-12Q-29-35-7-48Q15-57 29-32Q35-8 11 5Q-4 16-18-12Z'}" fill="${c[0]}"/><path d="M-20-32l14-9M8-30l17-8" stroke="#d1e47b" stroke-width="5" opacity=".48"/></g>`
const bush=(x,y,s,c)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="13" rx="32" ry="10" fill="#17351f" opacity=".22"/><circle cx="-20" cy="2" r="18" fill="${c[2]}"/><circle cx="0" cy="-10" r="23" fill="${c[1]}"/><circle cx="20" cy="2" r="18" fill="${c[0]}"/></g>`
const rock=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="18" rx="29" ry="9" fill="#1d3528" opacity=".28"/><path d="M-30 11L-19-21 6-31 30-13 23 15 0 24-26 17Z" fill="#7d8980" stroke="#4b5b50" stroke-width="5"/><path d="M-15-16L5-25 15-8-4 2Z" fill="#e0e4dc" opacity=".72"/></g>`
const flower=(x,y,s,c)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0v14" stroke="#42703b" stroke-width="3"/><path d="M0 7l-8-3M0 9l8-3" stroke="#548442" stroke-width="3"/><rect x="-5" y="-9" width="10" height="10" fill="${c}"/><rect x="-9" y="-5" width="18" height="8" fill="${c}"/><rect x="-3" y="-3" width="6" height="6" fill="#f0d36a"/></g>`
const grass=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})" opacity=".8"><path d="M0 0L-2-16M5 0L9-13M-5 0L-12-11" stroke="#39753d" stroke-width="3"/><path d="M16 1L20-10M22 1L29-8" stroke="#6e9d4b" stroke-width="3"/></g>`
const log=(x,y,s)=>`<g transform="translate(${x} ${y}) rotate(-18) scale(${s})"><rect x="-50" y="-13" width="100" height="26" rx="7" fill="#754c2d" stroke="#4b3425" stroke-width="5"/><ellipse cx="-49" rx="12" ry="12" fill="#b17a46" stroke="#513725" stroke-width="4"/><path d="M-35-5H35M-24 5H26" stroke="#9b6840" stroke-width="4" opacity=".6"/></g>`
const stump=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="4" rx="25" ry="16" fill="#70472a" stroke="#493224" stroke-width="5"/><path d="M-18 0Q0-12 18 0Q0 12-18 0Z" fill="#c18a50"/><path d="M-11 0Q0-7 11 0Q0 7-11 0Z" fill="#70472a"/></g>`
const pond=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-150 16C-136-65-55-91 8-54 82-87 153-39 140 22 126 83 43 91-9 59-82 86-151 69-150 16Z" fill="#3c8199" stroke="#284f58" stroke-width="10"/><path d="M-110 0C-50-33 32-29 103 4" fill="none" stroke="#8fd0d8" stroke-width="7" stroke-dasharray="20 22"/><g fill="#63a34b"><ellipse cx="-65" cy="23" rx="18" ry="10"/><ellipse cx="76" cy="-3" rx="16" ry="9"/></g><g fill="#d8e66e"><rect x="-68" y="-1" width="6" height="6"/><rect x="73" y="-22" width="6" height="6"/></g></g>`
const stream=(d,w=115)=>`<path d="${d}" fill="none" stroke="#244f59" stroke-width="${w+18}" opacity=".72"/><path d="${d}" fill="none" stroke="#3d8da5" stroke-width="${w}"/><path d="${d}" fill="none" stroke="#82ced9" stroke-width="6" stroke-dasharray="28 32" opacity=".7"/>`
const road=(d,w=54)=>`<path d="${d}" fill="none" stroke="#67472f" stroke-width="${w+18}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#d2aa68" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#e2c17d" stroke-width="7" stroke-dasharray="3 30" stroke-linecap="round" opacity=".72"/>`
const bridge=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-128" y="-27" width="256" height="54" rx="7" fill="#543b29" stroke="#35271e" stroke-width="6"/><rect x="-111" y="-18" width="222" height="36" fill="#b47c47"/><path d="M-90-19v38m45-38v38M0-19v38M45-19v38M90-19v38" stroke="#68452c" stroke-width="7"/></g>`
const house=(x,y,s,roof='#70472e')=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="52" rx="70" ry="13" fill="#203a27" opacity=".25"/><rect x="-50" y="-12" width="100" height="64" fill="#b9814b" stroke="#60412d" stroke-width="5"/><path d="M-66-12L0-74 66-12Z" fill="${roof}" stroke="#493229" stroke-width="5"/><rect x="-12" y="11" width="24" height="41" fill="#54392b"/><rect x="22" y="0" width="18" height="19" fill="#a9d7d6" stroke="#4f6866" stroke-width="3"/><rect x="-40" y="0" width="18" height="19" fill="#a9d7d6" stroke="#4f6866" stroke-width="3"/><rect x="-68" y="-5" width="18" height="12" fill="#8d5f3a"/></g>`
const watchtower=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="53" rx="55" ry="12" fill="#203a27" opacity=".24"/><path d="M-35 47L-24-47H24L35 47Z" fill="#8a6947" stroke="#543d2b" stroke-width="5"/><rect x="-42" y="-59" width="84" height="27" fill="#a77745" stroke="#563b29" stroke-width="5"/><path d="M-35-59L0-83 35-59" fill="#6a472f" stroke="#4a3325" stroke-width="5"/><rect x="-8" y="-34" width="16" height="15" fill="#9ed2d1"/></g>`
const ruin=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="45" rx="75" ry="13" fill="#203a27" opacity=".2"/><path d="M-74 43V-18L-48-68-10-24 21-76 75-19V43Z" fill="#818a80" stroke="#4e5b51" stroke-width="6"/><path d="M-39 42V-8M16 42V-20" stroke="#56645a" stroke-width="10"/><path d="M-9-63l19 20-12 12-19-16Z" fill="#d2d5ce" opacity=".55"/></g>`
const shrine=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-70 35H70M-52 28V-22M52 28V-22" stroke="#6c452d" stroke-width="11"/><path d="M-63-22H63M-83-24L0-68 83-24" fill="none" stroke="#a86e3f" stroke-width="11"/><rect x="-20" y="-1" width="40" height="36" fill="#54382a"/><rect x="-6" y="7" width="12" height="28" fill="#2e3028"/></g>`
const cliff=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-125 43L-125-27-91-58-61-18-31-69 0-24 30-75 63-20 94-55 125-19V43Z" fill="#766c5c" stroke="#4d4b43" stroke-width="7"/><path d="M-106 16L-80-8-55 13M-43 24L-15-5 11 19M40 16L65-10 97 16" stroke="#b8aa92" stroke-width="9" opacity=".68"/></g>`
const fence=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})" stroke="#65452d" stroke-width="8"><path d="M-90 0H90M-65-32V32M-15-32V32M35-32V32M85-32V32"/><path d="M-78-18H78M-78 18H78" stroke="#9a6940" stroke-width="6"/></g>`
const flowers=(r,n,c1,c2)=>{let out='';for(let i=0;i<n;i++){const x=160+r()*2680,y=100+r()*1570,s=.45+r()*.7;out+=flower(x,y,s,i%2?c1:c2)}return out}
const scatter=(r,n,c)=>{let out='';for(let i=0;i<n;i++){const x=90+r()*2820,y=80+r()*1640,s=.45+r()*.8;out+=i%3===0?bush(x,y,s,c):i%3===1?rock(x,y,s):grass(x,y,s)}return out}

function rungRamVenHo(){
  const r=rng(hash('Rừng Rậm Ven Hồ|MASTER|V4'))
  const c=P.forest
  const mainRoad='M-120 1280 C250 1240 360 1020 620 1000 C900 980 930 1160 1160 1130 C1400 1095 1430 850 1280 730 C1120 600 980 470 1160 330 C1330 195 1590 230 1760 390 C1930 550 1840 730 2010 840 C2200 960 2390 870 2580 690 C2730 550 2870 590 3120 690'
  const northRoad='M-80 520 C300 470 560 520 770 650 C930 750 1050 690 1160 560 C1280 420 1450 410 1620 520 C1780 620 1940 560 2070 430 C2230 270 2460 250 2660 390 C2810 500 2930 430 3090 330'
  const southRoad='M-80 1510 C330 1430 520 1340 770 1420 C1020 1500 1180 1570 1450 1460 C1680 1370 1900 1390 2090 1510 C2310 1650 2580 1570 3100 1370'
  const streamA='M-20 170 C240 280 330 450 270 630 C220 790 350 900 560 960 C720 1005 780 1160 700 1310 C620 1450 690 1580 900 1850'
  const streamB='M2140-100 C2010 110 2110 300 2010 440 C1910 575 1990 720 2130 820 C2290 930 2280 1110 2140 1240 C2020 1360 2040 1510 2200 1900'
  let objs=''
  // Dense forest belts: intentionally clustered around paths and water, not random single trees.
  const clusters=[
    [90,80,700,480,20],[500,80,980,470,22],[1550,80,1260,500,28],[2350,60,570,520,22],
    [60,560,520,820,24],[2320,540,620,760,26],[70,1220,600,520,28],[2150,1170,700,500,25]
  ]
  for(const [bx,by,bw,bh,n] of clusters){for(let i=0;i<n;i++){const x=bx+r()*bw,y=by+r()*bh,s=.72+r()*1.0;objs+=tree(x,y,s,c,r()<.18)}}
  for(let i=0;i<34;i++){const x=120+r()*2760,y=100+r()*1540,s=.55+r()*1.0;objs+=bush(x,y,s,c)}
  objs+=scatter(r,75,c)
  objs+=flowers(r,110,'#f1d45d','#ed8fa1')
  objs+=flowers(r,55,'#fff0bd','#8cb7ee')
  // Landmarks and authored composition.
  objs+=pond(500,400,1.25)+pond(2380,1280,.9)
  objs+=house(900,720,1.15,'#70462d')+house(2460,520,.85,'#6a4933')
  objs+=watchtower(1660,1010,1.05)+watchtower(2740,1040,.8)
  objs+=shrine(520,1320,.85)+ruin(1510,430,.8)
  objs+=fence(1030,520,.8)+fence(2380,650,.72)
  objs+=log(390,1110,1)+log(1830,1170,.8)+stump(650,830,.8)+stump(1940,520,.7)+stump(2700,820,.8)
  objs+=cliff(180,760,1.0)+cliff(2810,780,.9)+cliff(1420,1660,.85)
  objs+=bridge(690,980,1.0)+bridge(2130,820,1.0)
  const spawnClears=`<g fill="#b9975e" opacity=".3"><ellipse cx="1120" cy="1210" rx="150" ry="90"/><ellipse cx="1830" cy="920" rx="150" ry="100"/><ellipse cx="2560" cy="1180" rx="130" ry="85"/></g>`
  const labels=`<g font-family="monospace" fill="#f4e4b4" stroke="#2d241d" stroke-width="7" paint-order="stroke"><text x="850" y="660" font-size="34">LÀNG VEN HỒ</text><text x="1510" y="350" font-size="30">PHẾ TÍCH CỔ</text><text x="2460" y="455" font-size="28">TRẠM GÁC</text><text x="1080" y="1340" font-size="27">BÌA RỪNG SÂU</text></g>`
  const paths=`${road(mainRoad,64)}${road(northRoad,48)}${road(southRoad,46)}${stream(streamA,108)}${stream(streamB,100)}`
  return {objects:objs,paths,spawnClears,labels}
}

function genericMap(area){
  const seed=hash(area?.name||'world')
  const r=rng(seed)
  const theme=themeOf(area)
  const c=P[theme]||P.forest
  let bg=c[0]
  if(theme==='snow')bg='#d7e5e1'
  if(theme==='desert')bg='#d7b36b'
  if(theme==='cave')bg='#55675d'
  let objs=''
  for(let i=0;i<170;i++){const x=60+r()*2880,y=60+r()*1680,s=.45+r()*.9;objs+=theme==='snow'?tree(x,y,s,c,true):theme==='desert'?(i%3?rock(x,y,s):`<path d="M${x-25} ${y+30}V${y-40}" stroke="#547641" stroke-width="14"/>`):theme==='mountain'?(i%2?cliff(x,y,s):rock(x,y,s)):theme==='cave'?rock(x,y,s):tree(x,y,s,c,i%5===0)}
  const d=`M-100 1280 C450 1200 520 650 1040 760 C1500 860 1510 380 1970 540 C2410 700 2480 1100 3100 760`
  return {objects:objs,paths:road(d,60),spawnClears:'',labels:''}
}

function artSvg(area){
  const theme=themeOf(area)
  const special=(area?.name||'')==='Rừng Rậm Ven Hồ'?rungRamVenHo():genericMap(area)
  const c=P[theme]||P.forest
  const terrain=theme==='desert'?'#d9b56d':theme==='snow'?'#dce9e5':theme==='cave'?'#53665c':c[0]
  const soil=theme==='desert'?'#e4c27a':theme==='snow'?'#eaf1ed':c[1]
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges"><defs><pattern id="g" width="72" height="72" patternUnits="userSpaceOnUse"><rect width="72" height="72" fill="${terrain}"/><rect x="8" y="12" width="5" height="9" fill="${soil}" opacity=".5"/><rect x="39" y="50" width="4" height="7" fill="${c[2]}" opacity=".45"/><rect x="59" y="23" width="6" height="4" fill="#d7e78a" opacity=".35"/><path d="M20 60l4-9m7 9l3-6" stroke="${c[2]}" stroke-width="3" opacity=".45"/></pattern><pattern id="d" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="28" height="28" fill="#203c27" opacity=".06"/><rect x="4" y="5" width="5" height="5" fill="#fff" opacity=".025"/><rect x="17" y="16" width="4" height="4" fill="#000" opacity=".03"/></pattern></defs><rect width="3000" height="1800" fill="url(#g)"/><rect width="3000" height="1800" fill="url(#d)" opacity=".7"/><path d="M0 0H3000V90H0Z" fill="#173c27" opacity=".34"/><path d="M0 1710H3000V1800H0Z" fill="#183a24" opacity=".28"/>${special.paths}${special.spawnClears}${special.objects}${special.labels}<g opacity=".7"><rect x="42" y="42" width="340" height="54" fill="#183423" stroke="#d0aa68" stroke-width="3"/><text x="62" y="78" font-family="monospace" font-size="25" fill="#f0d890">RỪNG RẬM VEN HỒ</text></g></svg>`
  return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`
}

export function getAreaArtV3(area){return artSvg(area)}
export function getAreaArt(area){return artSvg(area)}
