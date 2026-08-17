import { player } from '../data/character.js'
import { getItemById } from '../data/items/index.js'

const AUTO_KEY = 'game.combat.auto.settings.v2'
const DEFAULT_AUTO = { attack: true, hp: false, mp: false, buff: true, skill: true, loot: true, hpThreshold: 40, mpThreshold: 30 }

function readAuto() {
  try { return { ...DEFAULT_AUTO, ...(JSON.parse(localStorage.getItem(AUTO_KEY)) || {}) } } catch { return { ...DEFAULT_AUTO } }
}
function saveAuto(value) { localStorage.setItem(AUTO_KEY, JSON.stringify(value)) }
function inventoryHas(type) {
  return player.inventory.some((id) => {
    const item = getItemById(id)
    return item?.type === 'consumable' && item?.effect?.[type]
  })
}
function compactSlots(root) {
  root.querySelectorAll('.combat-skill').forEach((slot, index) => {
    slot.classList.add('combat-compact-slot')
    slot.innerHTML = `<span class="empty-skill-number">${index + 1}</span>`
    slot.disabled = true
    slot.title = 'Chưa trang bị kỹ năng'
  })

  const itemSlots = root.querySelectorAll('.combat-item-slot')
  if (itemSlots.length >= 2) {
    const hasHp = inventoryHas('hp')
    const hasMp = inventoryHas('mp')
    const configure = (slot, kind, available) => {
      slot.classList.add('combat-compact-slot')
      slot.style.display = available ? 'flex' : 'none'
      slot.title = available ? (kind === 'hp' ? 'Đan hồi HP' : 'Đan hồi MP') : ''
      if (!available) return
      slot.querySelector('small')?.remove()
    }
    configure(itemSlots[0], 'hp', hasHp)
    configure(itemSlots[1], 'mp', hasMp)
  }
}
function enhanceAutoMenu(root) {
  const menu = root.querySelector('.combat-auto-menu')
  if (!menu || menu.dataset.simplifiedEnhanced === '1') return
  const settings = readAuto()
  menu.innerHTML = `
    <b>CÀI ĐẶT AUTO</b>
    <label><input type="checkbox" data-auto="attack" ${settings.attack ? 'checked' : ''}> Tự động đánh thường</label>
    <label><input type="checkbox" data-auto="hp" ${settings.hp ? 'checked' : ''}> Tự hồi HP khi thấp hơn <input class="auto-threshold" data-auto-threshold="hp" type="number" min="1" max="99" value="${settings.hpThreshold}">%</label>
    <label><input type="checkbox" data-auto="mp" ${settings.mp ? 'checked' : ''}> Tự hồi MP khi thấp hơn <input class="auto-threshold" data-auto-threshold="mp" type="number" min="1" max="99" value="${settings.mpThreshold}">%</label>
    <label><input type="checkbox" data-auto-extra="buff" ${settings.buff ? 'checked' : ''}> Tự buff</label>
    <label><input type="checkbox" data-auto-extra="skill" ${settings.skill ? 'checked' : ''}> Tự dùng kỹ năng</label>
    <label><input type="checkbox" data-auto-extra="loot" ${settings.loot ? 'checked' : ''}> Tự nhặt đồ</label>
    <button id="combat-auto-close" type="button">ĐÓNG</button>`
  menu.dataset.simplifiedEnhanced = '1'

  menu.querySelectorAll('[data-auto]').forEach((input) => {
    input.addEventListener('change', () => {
      const next = readAuto()
      next[input.dataset.auto] = input.checked
      saveAuto(next)
      window.dispatchEvent(new CustomEvent('game:auto-setting-changed', { detail: { key: input.dataset.auto, value: input.checked } }))
    })
  })
  menu.querySelectorAll('[data-auto-extra]').forEach((input) => {
    input.addEventListener('change', () => {
      const next = readAuto(); next[input.dataset.autoExtra] = input.checked; saveAuto(next)
      window.dispatchEvent(new CustomEvent('game:auto-setting-changed', { detail: { key: input.dataset.autoExtra, value: input.checked } }))
    })
  })
  menu.querySelectorAll('[data-auto-threshold]').forEach((input) => {
    input.addEventListener('change', () => {
      const next = readAuto()
      const value = Math.max(1, Math.min(99, Number(input.value) || (input.dataset.autoThreshold === 'hp' ? 40 : 30)))
      input.value = value
      next[`${input.dataset.autoThreshold}Threshold`] = value
      saveAuto(next)
    })
  })
  menu.querySelector('#combat-auto-close')?.addEventListener('click', () => root.querySelector('#combat-auto')?.click())
}

function apply(root) {
  compactSlots(root)
  enhanceAutoMenu(root)
}

function boot() {
  const root = document.querySelector('#combat-root')
  if (!root) return
  let scheduled = false
  const run = () => { scheduled = false; if (root.querySelector('.combat-window')) apply(root) }
  const observer = new MutationObserver(() => {
    if (scheduled) return
    scheduled = true
    requestAnimationFrame(run)
  })
  observer.observe(root, { childList: true, subtree: true })
  run()
  window.addEventListener('game:inventory-changed', run)
  window.addEventListener('game:item-equipped', run)
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
else boot()
