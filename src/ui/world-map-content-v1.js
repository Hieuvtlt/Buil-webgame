const WORLD_W=3000,WORLD_H=1800
const NPCS=[
  {id:'hunter',name:'Lão Thợ Săn',role:'NPC',x:470,y:760,icon:'🏹',text:'Có dấu chân thú lớn ở phía bắc. Hãy cẩn thận khi vào rừng sâu.'},
  {id:'herbalist',name:'Cô Dược Sư',role:'NPC',x:690,y:1120,icon:'⚗',text:'Ta có thể giúp ngươi nhận biết các loại thảo dược ven hồ.'},
  {id:'watcher',name:'Người Gác Cầu',role:'NPC',x:2210,y:870,icon:'🛡',text:'Cây cầu này dẫn vào khu rừng phía đông. Quái vật ở đó mạnh hơn.'},
]
const ZONES=[
  {id:'safe',name:'Bìa rừng · Lv.1–3',x:360,y:760,w:760,h:520,kind:'safe'},
  {id:'wild',name:'Rừng hoang · Lv.3–6',x:1030,y:360,w:930,h:720,kind:'wild'},
  {id:'lake',name:'Ven hồ · Lv.4–7',x:1910,y:500,w:700,h:700,kind:'lake'},
  {id:'deep',name:'Rừng sâu · Lv.6–8',x:820,y:1120,w:980,h:560,kind:'deep'},
  {id:'danger',name:'Khu nguy hiểm · Lv.8–10',x:2050,y:1150,w:760,h:500,kind:'danger'},
]
function injectStyle(){
  if(document.getElementById('world-content-v1-style'))return
  const style=document.createElement('style');style.id='world-content-v1-style';style.textContent=`
    .world-map-content-layer{position:absolute;inset:0;z-index:8;pointer-events:none}
    .world-zone-label{position:absolute;transform:translate(-50%,-50%);padding:6px 10px;border:1px solid rgba(222,190,103,.48);background:rgba(8,18,13,.72);color:#e7d38b;font:700 11px/1.1 Arial,sans-serif;letter-spacing:.2px;text-shadow:0 1px 2px #000;white-space:nowrap;border-radius:3px;box-shadow:0 3px 10px rgba(0,0,0,.25)}
    .world-zone-label.safe{border-color:rgba(105,190,110,.55);color:#b8e7ad}.world-zone-label.danger{border-color:rgba(190,75,54,.7);color:#ffb1a0}.world-zone-label.lake{border-color:rgba(76,156,190,.7);color:#a9e7ff}
    .world-npc-node{position:absolute;transform:translate(-50%,-100%);width:110px;text-align:center;pointer-events:auto;cursor:pointer;filter:drop-shadow(0 3px 3px rgba(0,0,0,.7));z-index:12}
    .world-npc-node .npc-icon{display:block;font-size:28px;line-height:32px}.world-npc-node b{display:block;padding:3px 5px;background:rgba(5,12,9,.82);border:1px solid rgba(221,185,92,.55);color:#f1dda0;font:700 10px Arial,sans-serif;white-space:nowrap;border-radius:3px}.world-npc-node small{display:block;color:#9fd39b;font:9px Arial,sans-serif;margin-top:2px}
    .world-npc-node:hover{filter:drop-shadow(0 0 6px rgba(232,201,103,.8))}.world-npc-node:focus-visible{outline:2px solid #e8cf72;outline-offset:3px}
    .world-map-location{position:absolute;transform:translate(-50%,-50%);padding:4px 7px;background:rgba(4,10,7,.65);border-left:3px solid #c9a64a;color:#e9d58f;font:700 10px Arial,sans-serif;pointer-events:none}
    .world-content-toast{position:absolute;left:50%;top:14%;transform:translateX(-50%);z-index:50;max-width:360px;padding:10px 14px;background:rgba(5,11,8,.94);border:1px solid #c9a64a;box-shadow:0 6px 22px rgba(0,0,0,.55);color:#eee4bc;font:12px/1.45 Arial,sans-serif;text-align:center;opacity:0;transition:opacity .15s}.world-content-toast.open{opacity:1}
  `;document.head.appendChild(style)
}
function openToast(root,text){let toast=root.querySelector('.world-content-toast');if(!toast){toast=document.createElement('div');toast.className='world-content-toast';root.querySelector('.world-explorer-window')?.appendChild(toast)}toast.textContent=text;toast.classList.add('open');clearTimeout(toast._timer);toast._timer=setTimeout(()=>toast.classList.remove('open'),3600)}
function moveToNpc(root,n){
  const field=root.querySelector('#world-field'),camera=root.querySelector('#world-camera');if(!field||!camera)return
  const rect=field.getBoundingClientRect(),nums=camera.style.transform.match(/-?[\d.]+/g)||[],tx=Number(nums[0]||0),ty=Number(nums[1]||0)
  const clientX=rect.left+tx+n.x,clientY=rect.top+ty+n.y
  field.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,clientX,clientY}))
}
function mountContent(){
  const root=document.querySelector('#world-explorer-root');const ground=root?.querySelector('.world-ground');if(!root||!ground||ground.querySelector('.world-map-content-layer'))return
  injectStyle()
  const layer=document.createElement('div');layer.className='world-map-content-layer';
  ZONES.forEach(z=>{const el=document.createElement('div');el.className=`world-zone-label ${z.kind}`;el.style.left=(z.x+z.w/2)+'px';el.style.top=(z.y+z.h/2)+'px';el.textContent=z.name;layer.appendChild(el)})
  const locations=[['LỐI VÀO RỪNG',620,690],['BẾN VEN HỒ',2070,470],['CẦU GỖ',2250,850],['RỪNG SÂU',1320,1420],['KHU NGUY HIỂM',2440,1370]]
  locations.forEach(([name,x,y])=>{const el=document.createElement('div');el.className='world-map-location';el.style.left=x+'px';el.style.top=y+'px';el.textContent=name;layer.appendChild(el)})
  NPCS.forEach(n=>{const el=document.createElement('button');el.type='button';el.className='world-npc-node';el.dataset.npcId=n.id;el.style.left=n.x+'px';el.style.top=n.y+'px';el.setAttribute('aria-label',n.name);el.innerHTML=`<span class="npc-icon">${n.icon}</span><b>${n.name}</b><small>${n.role}</small>`;el.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();moveToNpc(root,n);openToast(root,`${n.name}: ${n.text}`)});layer.appendChild(el)})
  ground.appendChild(layer)
}
function observe(){
  if(window.__worldContentV1Installed)return
  window.__worldContentV1Installed=true
  const observer=new MutationObserver(()=>{if(document.querySelector('#world-explorer-root'))mountContent()})
  observer.observe(document.body,{childList:true,subtree:true})
  mountContent()
}
observe()