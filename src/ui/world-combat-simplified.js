// Simplified encounter flow: click a monster -> small “TIẾN VÀO” menu -> open the dedicated combat UI.
(function(){
  let menu=null
  const closeMenu=()=>{if(menu){menu.remove();menu=null}}
  const areaName=()=>document.querySelector('#world-explorer-root .world-explorer-window header b')?.textContent?.replace(/^⚔\s*/,'')||'Khu vực'
  const showMenu=(node,event)=>{
    closeMenu()
    const selectedArea=areaName()
    const label=node.querySelector('b')?.textContent||'Quái vật'
    const match=label.match(/·\s*Lv\.(\d+)/)
    const level=Number(match?.[1]||1)
    const name=label.replace(/\s*·\s*Lv\.\d+.*$/,'').trim()
    const rank=node.classList.contains('gold')?'goldboss':node.classList.contains('blue')?'subboss':'normal'
    menu=document.createElement('div')
    menu.className='world-enter-menu'
    menu.innerHTML=`<div class="world-enter-title">${name} · Lv.${level}</div><button type="button">TIẾN VÀO</button>`
    document.body.appendChild(menu)
    menu.style.left=Math.min(window.innerWidth-175,Math.max(10,event.clientX+10))+'px'
    menu.style.top=Math.min(window.innerHeight-80,Math.max(10,event.clientY+10))+'px'
    menu.querySelector('button').addEventListener('click',()=>{
      closeMenu()
      document.querySelector('#world-exit')?.click()
      const area={name:selectedArea,min:level,max:level,terrain:'Khu vực',monsters:[[name,level,level]]}
      const monster={id:'click-'+Date.now(),name,level,rank}
      window.dispatchEvent(new CustomEvent('game:start-combat',{detail:{area,monster}}))
    })
  }
  document.addEventListener('click',event=>{
    const node=event.target.closest?.('.world-monster-node')
    if(node&&document.querySelector('#world-explorer-root')){
      event.preventDefault();event.stopPropagation();showMenu(node,event);return
    }
    if(menu&&!event.target.closest('.world-enter-menu'))closeMenu()
  },true)
  const hideLegacy=()=>document.querySelectorAll('.world-action-bar').forEach(el=>el.classList.add('simplified-hidden'))
  new MutationObserver(hideLegacy).observe(document.body,{childList:true,subtree:true})
  hideLegacy()
})()
