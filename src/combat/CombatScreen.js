import { CombatEngine } from './CombatEngine.js'
import { player } from '../data/character.js'
import { getActiveCombatMap, setActiveCombatEngine } from './combatSession.js'
import './CombatScreen.css'

const esc = value => String(value ?? '').replace(/[&<>\"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]))

function actionSlot(skill, index, type) {
  const label = type === 'attack' ? 'TẤN CÔNG' : 'BUFF'
  return `<button type="button" class="combat-action-slot ${skill ? 'has-skill' : 'empty-slot'} ${type}" data-skill="${skill?.id ?? ''}" data-skill-type="${type}" ${skill ? '' : 'disabled'}>
    <span class="slot-key">${index + 1}</span><span class="slot-type">${label}</span>
    ${skill ? `<img src="${esc(skill.icon)}" alt=""><b>${esc(skill.name)}</b><small>${Number(skill.manaCost ?? 0)} MP</small>` : '<span class="slot-empty">TRỐNG</span>'}
  </button>`
}

function potionSlot(item, type, key) {
  return `<button type="button" class="combat-potion-slot ${item ? 'has-potion' : 'empty-slot'} ${type}" data-potion="${type}" ${item ? '' : 'disabled'}>
    <span class="slot-key">${key}</span>${item ? `<img src="${esc(item.icon)}" alt=""><b>${esc(item.name)}</b><small>+${item.effect[type]}</small>` : `<span class="slot-empty">${type === 'hp' ? 'HP' : 'MP'}<br>TRỐNG</span>`}
  </button>`
}

export function CombatScreen() {
  const map = getActiveCombatMap()
  if (!map) return `<section class="combat-screen combat-empty"><div class="combat-empty-box"><h3>CHƯA CÓ CHIẾN TRƯỜNG</h3><p>Hãy chọn một bản đồ trong Ngoại cảnh và bấm TIẾN VÀO.</p></div></section>`
  return `<section class="combat-screen">
    <header class="combat-topbar"><div><span class="eyebrow">CHIẾN TRƯỜNG • ${esc(map.key)}</span><h2>${esc(map.name)}</h2></div><div class="combat-wave"><span>WAVE</span><strong id="combat-wave">1</strong></div><button class="combat-leave" type="button" data-leave>RỜI CHIẾN TRƯỜNG</button></header>
    <div class="combat-log-panel"><div class="panel-label">DIỄN BIẾN TRẬN ĐÁNH</div><div class="combat-log" id="combat-log"></div></div>
    <main class="combat-field">
      <section class="combat-side player-side"><div class="fighter-card player-card"><div class="fighter-avatar player-avatar">♙</div><div class="fighter-name">${esc(player.name)}<small>Lv.${player.level} • ${esc(player.sect)}</small></div><div class="fighter-bars"><div class="fighter-bar hp"><span>HP</span><i id="combat-hp-bar"></i><b id="combat-hp-text"></b></div><div class="fighter-bar mp"><span>MP</span><i id="combat-mp-bar"></i><b id="combat-mp-text"></b></div></div></div><div class="fighter-effects" id="player-buffs"></div></section>
      <section class="combat-middle"><div class="vs-mark">VS</div><div class="battle-floor"></div></section>
      <section class="combat-side enemy-side"><div id="combat-enemies"></div><div class="enemy-target-detail" id="combat-target-detail">Chọn mục tiêu</div></section>
    </main>
    <footer class="combat-command-bar">
      <div class="command-group skill-group"><span class="group-title">KỸ NĂNG</span><div class="command-row" id="combat-skills"></div></div>
      <div class="command-group potion-group"><span class="group-title">ĐAN DƯỢC</span><div class="command-row" id="combat-potions"></div></div>
      <div class="command-group auto-group"><span class="group-title">TỰ ĐỘNG</span><button type="button" class="auto-main is-on" data-auto>BẬT AUTO</button><button type="button" class="auto-options-button" data-auto-menu>⚙ LỰA CHỌN</button></div>
    </footer>
    <div class="auto-menu hidden" id="auto-menu"><div class="auto-menu-head"><strong>TỰ ĐỘNG CHIẾN ĐẤU</strong><button type="button" data-auto-close>×</button></div><label><input type="checkbox" data-auto-option="autoBuff"> Tự buff</label><label><input type="checkbox" data-auto-option="autoSkill"> Tự dùng kỹ năng</label><label><input type="checkbox" data-auto-option="autoLoot" checked> Tự nhặt đồ</label><div class="auto-range"><label>Tự hồi HP khi dưới <b id="hp-threshold-value">50%</b></label><input type="range" min="10" max="90" value="50" data-auto-option="hpThreshold"></div><div class="auto-range"><label>Tự hồi MP khi dưới <b id="mp-threshold-value">30%</b></label><input type="range" min="10" max="90" value="30" data-auto-option="mpThreshold"></div></div>
  </section>`
}

export function mountCombatScreen() {
  const screen = document.querySelector('.combat-screen')
  const map = getActiveCombatMap()
  if (!screen || !map) return () => {}
  const field = screen.querySelector('.combat-field')
  const enemiesRoot = screen.querySelector('#combat-enemies')
  const logRoot = screen.querySelector('#combat-log')
  const targetDetail = screen.querySelector('#combat-target-detail')
  const hpText = screen.querySelector('#combat-hp-text')
  const mpText = screen.querySelector('#combat-mp-text')
  const hpBar = screen.querySelector('#combat-hp-bar')
  const mpBar = screen.querySelector('#combat-mp-bar')
  const wave = screen.querySelector('#combat-wave')
  const skillsRoot = screen.querySelector('#combat-skills')
  const potionsRoot = screen.querySelector('#combat-potions')
  const buffsRoot = screen.querySelector('#player-buffs')
  const autoButton = screen.querySelector('[data-auto]')
  const autoMenu = screen.querySelector('#auto-menu')
  let ended = false

  const log = (message, type = 'system') => {
    const line = document.createElement('div')
    line.className = `combat-log-line ${type}`
    line.textContent = message
    logRoot.appendChild(line)
    while (logRoot.children.length > 80) logRoot.removeChild(logRoot.firstElementChild)
    logRoot.scrollTop = logRoot.scrollHeight
  }

  const engine = new CombatEngine(map, { onChange: render, onLog: log, onEnd: result => { ended = true; render(); showEnd(result) } })
  setActiveCombatEngine(engine)

  function showEnd(result) {
    const box = document.createElement('div')
    box.className = `combat-result ${result}`
    box.innerHTML = `<div><span>${result === 'victory' ? '✦' : '☠'}</span><h3>${result === 'victory' ? 'CHIẾN THẮNG' : 'THẤT BẠI'}</h3><p>${result === 'victory' ? `Đã hoàn thành chiến trường ${esc(map.name)}.` : 'Bạn cần hồi phục và chuẩn bị lại.'}</p><button type="button" data-result-leave>RỜI CHIẾN TRƯỜNG</button></div>`
    field.appendChild(box)
  }

  function enemyCard(enemy, selected) {
    const hpPct = enemy.maxHp ? Math.max(0, enemy.hp / enemy.maxHp * 100) : 0
    return `<button type="button" class="combat-enemy-row ${selected ? 'is-selected' : ''} ${enemy.dead ? 'is-dead' : ''}" data-target="${enemy.id}" ${enemy.dead ? 'disabled' : ''}><span class="enemy-mini-icon ${enemy.color}">${enemy.color === 'ice' ? '❄' : enemy.color === 'poison' ? '☠' : enemy.color === 'mythic' ? '✦' : '◆'}</span><span class="enemy-info"><b>${esc(enemy.name)}</b><small>Lv.${enemy.level}</small><span class="enemy-hp"><i style="width:${hpPct}%"></i></span></span></button>`
  }

  function render() {
    const state = engine.snapshot()
    wave.textContent = state.wave
    hpText.textContent = `${Math.round(state.player.hp)} / ${Math.round(state.player.maxHp)}`
    mpText.textContent = `${Math.round(state.player.mp)} / ${Math.round(state.player.maxMp)}`
    hpBar.style.width = `${Math.max(0, state.player.hp / state.player.maxHp * 100)}%`
    mpBar.style.width = `${Math.max(0, state.player.mp / state.player.maxMp * 100)}%`
    autoButton.textContent = state.autoAttack ? 'BẬT AUTO' : 'TẮT AUTO'
    autoButton.classList.toggle('is-on', state.autoAttack)
    enemiesRoot.innerHTML = state.enemies.map(enemy => enemyCard(enemy, enemy.id === state.selectedEnemyId)).join('')
    const target = state.enemies.find(enemy => enemy.id === state.selectedEnemyId && !enemy.dead)
    targetDetail.innerHTML = target ? `<strong>🎯 ${esc(target.name)}</strong><small>Lv.${target.level}</small><div class="target-hp"><i style="width:${target.hp / target.maxHp * 100}%"></i></div><span>${Math.round(target.hp)} / ${target.maxHp} HP</span>` : 'Chọn mục tiêu'
    skillsRoot.innerHTML = state.attackSkills.map((skill, index) => actionSlot(skill, index + 1, 'attack')).concat(state.buffSkills.map((skill, index) => actionSlot(skill, index + 3, 'buff'))).join('')
    potionsRoot.innerHTML = potionSlot(state.potions.hp, 'hp', 'Q') + potionSlot(state.potions.mp, 'mp', 'E')
    const activeBuffs = Object.entries(state.buffs).filter(([, expires]) => expires > Date.now()).map(([id, expires]) => { const skill = state.buffSkills.find(item => item?.id === id); return skill ? `<span title="${esc(skill.name)}">${esc(skill.name)} <b>${Math.ceil((expires - Date.now()) / 1000)}s</b></span>` : '' }).join('')
    buffsRoot.innerHTML = activeBuffs
    for (const input of autoMenu.querySelectorAll('[data-auto-option]')) {
      const key = input.dataset.autoOption
      input.value = key === 'hpThreshold' || key === 'mpThreshold' ? state.autoSettings[key] : input.checked
      if (key !== 'hpThreshold' && key !== 'mpThreshold') input.checked = Boolean(state.autoSettings[key])
    }
    screen.querySelector('#hp-threshold-value').textContent = `${state.autoSettings.hpThreshold}%`
    screen.querySelector('#mp-threshold-value').textContent = `${state.autoSettings.mpThreshold}%`
  }

  const onClick = event => {
    const target = event.target.closest('[data-target]')
    if (target) { engine.selectEnemy(target.dataset.target); return }
    const skill = event.target.closest('[data-skill]')
    if (skill?.dataset.skill) { skill.dataset.skillType === 'buff' ? engine.useBuff(skill.dataset.skill) : engine.useSkill(skill.dataset.skill); return }
    const potion = event.target.closest('[data-potion]')
    if (potion) { engine.usePotion(potion.dataset.potion); return }
    if (event.target.closest('[data-auto]')) engine.toggleAutoAttack()
    if (event.target.closest('[data-auto-menu]')) autoMenu.classList.toggle('hidden')
    if (event.target.closest('[data-auto-close]')) autoMenu.classList.add('hidden')
    if (event.target.closest('[data-leave]') || event.target.closest('[data-result-leave]')) window.dispatchEvent(new CustomEvent('game:combat-leave'))
  }
  const onInput = event => {
    const control = event.target.closest('[data-auto-option]')
    if (!control) return
    const key = control.dataset.autoOption
    engine.setAutoOption(key, key === 'hpThreshold' || key === 'mpThreshold' ? Number(control.value) : control.checked)
    if (key === 'hpThreshold') screen.querySelector('#hp-threshold-value').textContent = `${control.value}%`
    if (key === 'mpThreshold') screen.querySelector('#mp-threshold-value').textContent = `${control.value}%`
  }
  const onKey = event => {
    if (event.code === 'Space') { event.preventDefault(); engine.basicAttack() }
    if (event.key === 'q') engine.usePotion('hp')
    if (event.key === 'e') engine.usePotion('mp')
  }

  screen.addEventListener('click', onClick)
  screen.addEventListener('input', onInput)
  window.addEventListener('keydown', onKey)
  log(`Tiến vào ${map.name}.`, 'system')
  log('Chiến trường trái–phải đã sẵn sàng. Chọn quái bên phải và dùng thanh lệnh phía dưới.', 'combat')
  render()

  return () => {
    screen.removeEventListener('click', onClick)
    screen.removeEventListener('input', onInput)
    window.removeEventListener('keydown', onKey)
    engine.stop()
    if (!ended) setActiveCombatEngine(null)
  }
}
