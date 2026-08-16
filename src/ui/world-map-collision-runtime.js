import { isWalkable, findNearestWalkable } from './world-map-collision.js'

const nativeRAF=window.requestAnimationFrame.bind(window)
let installed=false
let correcting=false

function worldPoint(el,field,camera){
  const x=parseFloat(el.style.left)||0,y=parseFloat(el.style.top)||0
  return {x,y,field,camera}
}

function nearest(x,y){return findNearestWalkable(x,y,340)||{x,y}}

function correctVisualUnits(){
  if(correcting)return
  const root=document.querySelector('#world-explorer-root'),field=root?.querySelector('#world-field'),camera=root?.querySelector('#world-camera')
  if(!root||!field||!camera)return
  correcting=true
  try{
    const player=root.querySelector('#world-player')
    if(player){
      const p=worldPoint(player,field,camera)
      if(!isWalkable(p.x,p.y)){
        const q=nearest(p.x,p.y)
        player.style.left=q.x+'px';player.style.top=q.y+'px'
      }
    }
    root.querySelectorAll('.world-monster-node').forEach(monster=>{
      const p=worldPoint(monster,field,camera)
      if(!isWalkable(p.x,p.y)){
        const q=nearest(p.x,p.y)
        monster.style.left=q.x+'px';monster.style.top=q.y+'px'
      }
    })
  }finally{correcting=false}
}

if(!installed){
  installed=true
  document.addEventListener('click',event=>{
    const field=event.target.closest?.('#world-field')
    if(!field||event.target.closest('.world-action-bar,.world-minimap,.world-combat-hud'))return
    const camera=field.querySelector('#world-camera'),player=field.querySelector('#world-player')
    if(!camera||!player)return
    const tr=camera.style.transform.match(/translate3d\\(([-\\d.]+)px,\\s*([-\\d.]+)px/)
    const tx=tr?Number(tr[1]):0,ty=tr?Number(tr[2]):0,r=field.getBoundingClientRect()
    const x=Math.max(35,Math.min(2965,event.clientX-r.left-tx)),y=Math.max(35,Math.min(1765,event.clientY-r.top-ty))
    if(!isWalkable(x,y)){
      event.preventDefault();event.stopImmediatePropagation()
      const q=nearest(x,y)
      const synthetic=new MouseEvent('click',{bubbles:true,cancelable:true,clientX:r.left+tx+q.x,clientY:r.top+ty+q.y})
      field.dispatchEvent(synthetic)
    }
  },true)

  window.requestAnimationFrame=function(callback){
    return nativeRAF(time=>{callback(time);correctVisualUnits()})
  }
}
