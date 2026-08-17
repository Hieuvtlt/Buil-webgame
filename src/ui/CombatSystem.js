import './combat-system.css'
import { player, getPlayerStats, syncDerivedStats, gainExperience } from '../data/character.js'
import { getItemById } from '../data/items/index.js'
import { getSkillById } from '../data/skills/index.js'
import { getCharacterImageSrc } from './screens/CharacterScreen.js'

const clamp = (v,a,b) => Math.max(a, Math.min(b, v))
const rand = (a,b) => Math.floor(Math.random() * (b-a+1)) + a
const potionFor = type => {
  const category = type === 'hp' ? 'hp_pill' : 'mp_pill'
  for (const id of player.inventory ?? []) {
    const item = getItemById(id)
    if (item?.category === category) return item
  }
  return null
}
const consume = item => {
  if (!item) return false
  const index = (player.inventory ?? []).findIndex(id => String(id) === String(item.id))
  if (index < 0) return false
  player.inventory.splice(index, 1)
  window.dispatchEvent(new CustomEvent('game:inventory-changed'))
  return true
}
const equippedSkills = () => (player.skillBar ?? []).map(id => getSkillById(id)).filter(Boolean).slice(0,5)

let root = null
let state = null
let timer = null

function stopTimer(){ if(timer) clearInterval(timer); timer = null }
function closeCombat(){ stopTimer(); if(root) root.innerHTML=''; state=null; window.dispatchEvent(new CustomEvent('game:combat-closed')) }
function log(message,type='system') { state.logs.push({message,type}); if(state.logs.length>80) state.logs.shift(); renderLogOnly() }
function renderLogOnly(){ const el=root?.querySelector('#new-combat-log'); if(!el || !state) return; el.innerHTML=state.logs.map(x=>`<div class="new-combat-log-line ${x.type}">${x.message}</div>`).join(''); el.scrollTop=el.scrollHeight }
function createEnemy(area, source){
  const entry = source ?? area.monsters[rand(0, area.monsters.length-1)]
  const level = source?.level ?? rand(Number(entry[1]), Number(entry[2]))
  const maxHp = Math.max(60, Math.round(70 + level * 38))
  return { id:source?.id ?? `enemy-${Date.now()}`, name:source?.name ?? entry[0], level, hp:maxHp, maxHp, attack:Math.max(5,Math.round(6+level*2.8)), defense:Math.round(2+level*1.1), dead:false }
}
function syncBars(){
  if(!state || !root) return
  const stats=getPlayerStats(), enemy=state.enemy
  const hpPct=clamp(player.hp/stats.maxHp*100,0,100), mpPct=clamp(player.mp/stats.maxMp*100,0,100), enemyPct=clamp(enemy.hp/enemy.maxHp*100,0,100)
  root.querySelector('#combat-player-hp')?.style.setProperty('width',`${hpPct}%`)
  root.querySelector('#combat-player-mp')?.style.setProperty('width',`${mpPct}%`)
  root.querySelector('#combat-enemy-hp')?.style.setProperty('width',`${enemyPct}%`)
  const hpText=root.querySelector('#combat-player-hp-text'); if(hpText) hpText.textContent=`${Math.max(0,Math.floor(player.hp))}/${stats.maxHp}`
  const mpText=root.querySelector('#combat-player-mp-text'); if(mpText) mpText.textContent=`${Math.max(0,Math.floor(player.mp))}/${stats.maxMp}`
  const enemyText=root.querySelector('#combat-enemy-hp-text'); if(enemyText) enemyText.textContent=`${Math.max(0,Math.floor(enemy.hp))}/${enemy.maxHp}`
}
function renderLogOnly(){
  const el=root?.querySelector('#new-combat-log'); if(!el || !state) return
  el.innerHTML=state.logs.map(x=>`<div class="new-combat-log-line ${x.type}">${x.message}</div>`).join('')
  el.scrollTop=el.scrollHeight
}
function playerAttack(){
  if(!state || state.enemy.dead || player.hp<=0) return
  const stats=getPlayerStats(); const damage=rand(stats.attackMin,Math.max(stats.attackMin,stats.attackMax))
  state.enemy.hp=Math.max(0,state.enemy.hp-damage)
  log(`⚔ Bạn gây ${damage} sát thương lên ${state.enemy.name}.`,'hit')
  if(state.enemy.hp<=0){ finishCombat(); return }
  enemyAttack()
  syncBars()
}
function enemyAttack(){
  const stats=getPlayerStats(); const damage=Math.max(1,state.enemy.attack-Math.floor(stats.defense*.55))
  player.hp=Math.max(0,player.hp-damage)
  log(`◆ ${state.enemy.name} gây ${damage} sát thương.`,'damage')
  if(player.hp<=0){ stopTimer(); state.defeated=true; log('✖ Nhân vật đã gục ngã.','damage'); renderState(); }
}
function useSkill(slot){
  const skill=equippedSkills()[slot]
  if(!skill || state.defeated || state.enemy.dead) return
  const cost=Number(skill.manaCost ?? skill.cost ?? 0)
  if(player.mp<cost){ log(`Không đủ MP để dùng ${skill.name}.`,'damage'); return }
  player.mp-=cost
  const stats=getPlayerStats(); const percent=Number(skill.effects?.externalAttackPercent ?? 100); const damage=Math.max(1,Math.round(rand(stats.attackMin,Math.max(stats.attackMin,stats.attackMax))*Math.max(.5,percent/100)))
  if(Number(skill.effects?.externalAttackPercent ?? 0)>0){ state.enemy.hp=Math.max(0,state.enemy.hp-damage); log(`✦ ${skill.name} gây ${damage} sát thương.`,'hit') }
  else log(`✦ ${skill.name} đã được sử dụng.`,'buff')
  if(state.enemy.hp<=0){ finishCombat(); return }
  enemyAttack(); syncBars()
}
function usePotion(type){
  if(!state || state.defeated || player.hp<=0) return
  const item=potionFor(type); if(!item){ log(`Không có đan dược ${type==='hp'?'HP':'MP'}.`,'damage'); return }
  if(!consume(item)) return
  const stats=getPlayerStats(); const amount=Number(item.effect?.[type] ?? (type==='hp'?Math.round(stats.maxHp*.25):Math.round(stats.maxMp*.25)))
  if(type==='hp') player.hp=Math.min(stats.maxHp,player.hp+amount); else player.mp=Math.min(stats.maxMp,player.mp+amount)
  log(`🧪 Dùng ${item.name}, hồi ${amount} ${type.toUpperCase()}.`,'heal'); syncBars()
}
function finishCombat(){
  stopTimer(); state.enemy.dead=true; state.defeated=true
  const exp=10+state.enemy.level*4, gold=5+state.enemy.level*2
  gainExperience(exp); player.gold+=gold; syncDerivedStats(); window.dispatchEvent(new CustomEvent('game:character-changed'))
  log(`✓ Đã hạ ${state.enemy.name} Lv.${state.enemy.level}.`,'reward')
  log(`🎁 +${exp} EXP · +${gold} vàng.`,'reward')
  if(state.auto.pickup) log('✦ AUTO nhặt đồ: đã nhặt chiến lợi phẩm.','item')
  renderState()
}
function autoTick(){
  if(!state || !state.auto.enabled || state.defeated || player.hp<=0) return
  const stats=getPlayerStats()
  if(state.auto.hp && player.hp/stats.maxHp*100 <= state.auto.hpThreshold) usePotion('hp')
  if(state.auto.mp && player.mp/stats.maxMp*100 <= state.auto.mpThreshold) usePotion('mp')
  const skills=equippedSkills()
  if(state.auto.buff){ const buff=skills.find(skill=>Number(skill.effects?.externalAttackPercent ?? 0)<=0); if(buff) useSkill(skills.indexOf(buff)) }
  if(state.auto.skill && skills.length){ const attack=skills.findIndex(skill=>Number(skill.effects?.externalAttackPercent ?? 0)>0); if(attack>=0) useSkill(attack); else playerAttack() }
  else playerAttack()
}
function renderState(){
  if(!state || !root) return
  const stats=getPlayerStats(), skills=equippedSkills(), hpPotion=potionFor('hp'), mpPotion=potionFor('mp')
  root.innerHTML=`<div class="new-combat-overlay"><section class="new-combat-window" role="dialog" aria-modal="true">
    <header class="new-combat-header"><div><b>⚔ ${state.area.name}</b><small>Chiến đấu · ${state.enemy.name} · Lv.${state.enemy.level}</small></div><button id="new-combat-close" type="button">×</button></header>
    <section class="new-combat-log" id="new-combat-log">${state.logs.map(x=>`<div class="new-combat-log-line ${x.type}">${x.message}</div>`).join('')}</section>
    <main class="new-combat-field"><div class="new-combat-enemy"><div class="new-unit-name">${state.enemy.name} · Lv.${state.enemy.level}</div><div class="new-bar hp"><i id="combat-enemy-hp" style="width:${clamp(state.enemy.hp/state.enemy.maxHp*100,0,100)}%"></i></div><span id="combat-enemy-hp-text">${Math.max(0,Math.floor(state.enemy.hp))}/${state.enemy.maxHp}</span><div class="enemy-symbol">☠</div><strong>${state.enemy.dead?'ĐÃ HẠ':'QUÁI'}</strong></div><div class="new-combat-vs">VS</div><div class="new-combat-player"><div class="new-unit-name">${player.name} · Lv.${player.level}</div><div class="new-bar hp"><i id="combat-player-hp" style="width:${clamp(player.hp/stats.maxHp*100,0,100)}%"></i></div><span id="combat-player-hp-text">${Math.max(0,Math.floor(player.hp))}/${stats.maxHp}</span><div class="new-bar mp"><i id="combat-player-mp" style="width:${clamp(player.mp/stats.maxMp*100,0,100)}%"></i></div><span id="combat-player-mp-text">${Math.max(0,Math.floor(player.mp))}/${stats.maxMp}</span><img src="${getCharacterImageSrc()}" alt="Nhân vật"/><strong>NHÂN VẬT</strong></div></main>
    <footer class="new-combat-footer"><div class="new-hotbar">${[0,1,2,3,4].map(i=>{const skill=skills[i];return `<button class="new-slot ${skill?'filled':'empty'}" data-skill="${i}" type="button" ${!skill||state.defeated?'disabled':''}><kbd>${i+1}</kbd>${skill?`<img src="${skill.icon}" alt=""/><small>${skill.name}</small>`:''}</button>`}).join('')}</div><div class="new-potions"><button class="new-slot potion ${hpPotion?'filled':''}" data-potion="hp" type="button" ${!hpPotion||state.defeated?'disabled':''}>${hpPotion?`<img src="${hpPotion.icon}" alt=""/>`:''}</button><button class="new-slot potion ${mpPotion?'filled':''}" data-potion="mp" type="button" ${!mpPotion||state.defeated?'disabled':''}>${mpPotion?`<img src="${mpPotion.icon}" alt=""/>`:''}</button></div><button id="new-auto" class="new-auto ${state.auto.enabled?'on':''}" type="button">AUTO</button><button id="new-attack" class="new-attack" type="button" ${state.defeated?'disabled':''}>ĐÁNH</button><button id="new-leave" class="new-leave" type="button">RỜI</button></footer>
    ${state.autoMenu?`<section class="new-auto-menu"><b>AUTO</b><label><input type="checkbox" data-auto="hp" ${state.auto.hp?'checked':''}/> Tự hồi HP khi dưới <input class="threshold" data-threshold="hp" value="${state.auto.hpThreshold}"/>%</label><label><input type="checkbox" data-auto="mp" ${state.auto.mp?'checked':''}/> Tự hồi MP khi dưới <input class="threshold" data-threshold="mp" value="${state.auto.mpThreshold}"/>%</label><label><input type="checkbox" data-auto="buff" ${state.auto.buff?'checked':''}/> Tự buff</label><label><input type="checkbox" data-auto="skill" ${state.auto.skill?'checked':''}/> Tự dùng kỹ năng</label><label><input type="checkbox" data-auto="pickup" ${state.auto.pickup?'checked':''}/> Tự nhặt đồ</label><button id="new-auto-close" type="button">ĐÓNG</button></section>`:''}
  </section></div>`
  root.querySelector('#new-combat-close').onclick=closeCombat
  root.querySelector('#new-leave').onclick=closeCombat
  root.querySelector('#new-attack').onclick=playerAttack
  root.querySelector('#new-auto').onclick=()=>{state.auto.enabled=!state.auto.enabled;state.autoMenu=true;renderState();startTimer()}
  root.querySelector('#new-auto-close')?.addEventListener('click',()=>{state.autoMenu=false;renderState()})
  root.querySelectorAll('[data-skill]').forEach(b=>b.addEventListener('click',()=>useSkill(Number(b.dataset.skill))))
  root.querySelectorAll('[data-potion]').forEach(b=>b.addEventListener('click',()=>usePotion(b.dataset.potion)))
  root.querySelectorAll('[data-auto]').forEach(b=>b.addEventListener('change',()=>state.auto[b.dataset.auto]=b.checked))
  root.querySelectorAll('[data-threshold]').forEach(b=>b.addEventListener('change',()=>state.auto[`${b.dataset.threshold}Threshold`]=clamp(Number(b.value)||50,1,99)))
  renderLogOnly(); syncBars()
}
function startTimer(){ stopTimer(); if(state?.auto.enabled && !state.defeated) timer=setInterval(autoTick,1500) }
export function openCombat(area, monster){
  if(!root){ root=document.createElement('div'); root.id='new-combat-root'; document.body.appendChild(root) }
  stopTimer(); state={area,enemy:createEnemy(area,monster),defeated:false,auto:{enabled:true,hp:false,mp:false,buff:false,skill:false,pickup:true,hpThreshold:50,mpThreshold:30},autoMenu:false,logs:[{message:`⚔ Tiến vào ${area.name}.`},{message:`Mục tiêu: ${monster?.name ?? area.monsters[0][0]} · Lv.${monster?.level ?? area.min}.`}]}; renderState(); startTimer()
}
window.addEventListener('game:start-combat',e=>openCombat(e.detail?.area,e.detail?.monster))
export function mountCombatSystem(){ return ()=>closeCombat() }
