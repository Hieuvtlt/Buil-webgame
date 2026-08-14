import {
  QUALITY_META,
  getAlchemyRecipe,
  getForgingRecipe,
} from '../../data/craftData.js'
import { getVltkIcon } from '../../data/vltkIconCatalog.js'
import {
  player,
  getCraftingTraining,
  getCraftingTrainingText,
  isRecipeLearned,
  learnCraftRecipe,
  gainCraftingExp,
} from '../../data/character.js'

const ASSET_BASE = `${import.meta.env.BASE_URL}assets/`

const ALCHEMY_TYPES = {
  hoimau: { name: 'Hồi Khí Đan', effect: (level) => `Phục hồi ${500 * level} HP`, icon: `${ASSET_BASE}vltk/danduoc/hoimau.png` },
  hoimana: { name: 'Hồi Nguyên Đan', effect: (level) => `Phục hồi ${300 * level} MP`, icon: `${ASSET_BASE}vltk/danduoc/hoimana.png` },
  exp: { name: 'Tụ Linh Đan', effect: (level) => `Nhận ${1000 * level} EXP`, icon: `${ASSET_BASE}vltk/danduoc/exp.png` },
  expskill: { name: 'Ngộ Đạo Đan', effect: (level) => `Nhận ${100 * level} EXP võ kỹ`, icon: `${ASSET_BASE}vltk/danduoc/expskill.png` },
}

const FORGING_TYPES = {
  vu_khi: { name: 'Vũ khí', category: 'sword', type: 'weapon', effect: 'Trang bị vũ khí' },
  mu: { name: 'Mũ', category: 'helmet', type: 'armor', effect: 'Trang bị mũ' },
  ao: { name: 'Áo', category: 'body', type: 'armor', effect: 'Trang bị áo' },
  baotay: { name: 'Bao tay', category: 'gauntlet', type: 'armor', effect: 'Trang bị bao tay' },
  dailung: { name: 'Đai lưng', category: 'belt', type: 'armor', effect: 'Trang bị đai lưng' },
  giay: { name: 'Giày', category: 'boots', type: 'armor', effect: 'Trang bị giày' },
  daychuyen: { name: 'Dây chuyền', category: 'necklace', type: 'accessory', effect: 'Trang sức dây chuyền' },
  ngocboi: { name: 'Ngọc bội', category: 'amulet', type: 'accessory', effect: 'Trang sức ngọc bội' },
  nhan: { name: 'Nhẫn', category: 'ring', type: 'accessory', effect: 'Trang sức nhẫn' },
}

const FORGING_TIER_NAMES = {
  1: 'Hoàng cấp',
  31: 'Huyền cấp',
  61: 'Địa cấp',
  91: 'Thiên cấp',
}

const QUALITY_KEYS = {
  'Hạ phẩm': 'haPham',
  'Trung phẩm': 'trungPham',
  'Thượng phẩm': 'thuongPham',
  'Cực phẩm': 'cucPham',
}

function getInventoryRoot() { return globalThis.gameState?.inventory ?? player.inventory ?? globalThis.inventory ?? null }

function getOwnedCount(itemId, itemName) {
  const inventory = getInventoryRoot()
  if (!inventory) return 0
  if (Array.isArray(inventory)) return inventory.reduce((sum, entry) => (entry?.id === itemId || entry?.itemId === itemId || entry?.name === itemName || entry === itemId) ? sum + Number(entry?.quantity ?? entry?.count ?? entry?.amount ?? 1) : sum, 0)
  if (typeof inventory === 'object') {
    const entry = inventory[itemId] ?? inventory[itemName]
    if (typeof entry === 'number') return entry
    if (entry) return Number(entry.quantity ?? entry.count ?? entry.amount ?? 0)
  }
  return 0
}

function removeInventoryItem(itemId, amount = 1) {
  if (!Array.isArray(player.inventory) || amount < 1) return false
  let remaining = amount
  for (let i = player.inventory.length - 1; i >= 0 && remaining > 0; i -= 1) {
    if (player.inventory[i] === itemId) { player.inventory.splice(i, 1); remaining -= 1 }
  }
  return remaining === 0
}

function qualityColor(quality) { return QUALITY_META[quality]?.color ?? '#d7d7d7' }

function renderMaterials(recipe, kind) {
  return recipe.map((material) => {
    const current = getOwnedCount(material.id, material.name)
    const enough = current >= material.amount
    const icon = material.icon?.startsWith('/')
      ? `${import.meta.env.BASE_URL}${material.icon.replace(/^\/+/, '')}`
      : material.icon || ''
    return `<div class="craft-material-row ${enough ? 'is-enough' : 'is-short'}"><span class="craft-material-main"><img src="${icon}" alt="" class="craft-material-icon" /><span>${material.name}</span></span><b>${current}/${material.amount}</b></div>`
  }).join('')
}

function renderLearnButton(kind, data) {
  const learned = isRecipeLearned(kind, data)
  const itemId = kind === 'alchemy' ? 'dan_phuong' : 'ban_ve'
  const itemName = kind === 'alchemy' ? 'Đan phương' : 'Bản vẽ'
  const owned = getOwnedCount(itemId, itemName)
  if (learned) return '<div class="craft-recipe-learned">✓ Công thức đã học vĩnh viễn</div>'
  return `<button class="craft-button craft-learn-button" type="button" data-learn-recipe="${kind}">${itemName} • Học công thức (${owned}/1)</button>`
}

function renderAlchemy(root) {
  const type = root.querySelector('[data-craft-type]')?.value
  const level = Number(root.querySelector('[data-craft-level]')?.value || 0)
  const quality = root.querySelector('[data-craft-quality]')?.value || ''
  const info = root.querySelector('[data-craft-info]')
  if (!info) return
  if (!type || !level || !quality) { info.innerHTML = `<div class="craft-result-placeholder">Chọn loại đan, level và phẩm cấp để xem thông tin và nguyên liệu.<br><br><strong>Luyện Đan Training:</strong> ${getCraftingTrainingText('alchemy')} • EXP chỉ tăng khi luyện thành công.</div>`; return }
  const data = ALCHEMY_TYPES[type]
  const recipe = getAlchemyRecipe(level)
  const learned = isRecipeLearned('alchemy', { type, level })
  info.innerHTML = `<div class="craft-selected-head"><img class="craft-selected-icon" src="${data.icon}" alt="" /><div><div class="craft-selected-name" style="color:${qualityColor(quality)}">${data.name} Lv${level}</div><div class="craft-subtitle" style="color:${qualityColor(quality)}">${quality} • Đẳng cấp yêu cầu ${level * 10 - 9}-${level === 10 ? 200 : level * 10}</div></div></div><div class="craft-effect">${data.effect(level)}</div><div class="craft-training">Luyện Đan Training: <strong>${getCraftingTrainingText('alchemy')}</strong></div><div class="craft-recipe-box"><div class="craft-material-title">Công thức</div>${renderLearnButton('alchemy', { type, level })}</div><div class="craft-material-title">Nguyên liệu cần:</div><div class="craft-material-list">${renderMaterials(recipe, 'alchemy')}</div><button class="craft-button" type="button" data-craft-action="alchemy" ${learned ? '' : 'disabled'}>${learned ? 'LUYỆN ĐAN' : 'CẦN HỌC ĐAN PHƯƠNG'}</button>`
}

function renderForging(root) {
  const type = root.querySelector('[data-craft-type]')?.value
  const level = Number(root.querySelector('[data-craft-level]')?.value || 0)
  const quality = root.querySelector('[data-craft-quality]')?.value || ''
  const info = root.querySelector('[data-craft-info]')
  if (!info) return
  if (!type || !level || !quality) { info.innerHTML = `<div class="craft-result-placeholder">Chọn loại trang bị, cấp độ và phẩm cấp để xem thông tin và nguyên liệu.<br><br><strong>Luyện Khí Training:</strong> ${getCraftingTrainingText('forging')} • EXP chỉ tăng khi luyện thành công.</div>`; return }
  const data = FORGING_TYPES[type]
  const recipe = getForgingRecipe(level)
  const materialLevel = Math.min(10, Math.ceil(level / 12))
  const learned = isRecipeLearned('forging', { type, level, quality })
  const qualityKey = QUALITY_KEYS[quality]
  const previewIcon = getVltkIcon({ type: data.type, category: data.category, level, quality: qualityKey })
  const tierName = FORGING_TIER_NAMES[level] || 'Hoàng cấp'
  const iconHtml = previewIcon ? `<img class="craft-selected-icon" src="${previewIcon}" alt="" />` : '<div class="craft-selected-icon craft-selected-icon-empty"></div>'
  info.innerHTML = `<div class="craft-selected-head">${iconHtml}<div><div class="craft-selected-name" style="color:${qualityColor(quality)}">${data.name} • ${tierName}</div><div class="craft-subtitle" style="color:${qualityColor(quality)}">${quality}</div></div></div><div class="craft-effect">${data.effect} • Nguyên liệu cấp ${materialLevel}</div><div class="craft-training">Luyện Khí Training: <strong>${getCraftingTrainingText('forging')}</strong></div><div class="craft-recipe-box"><div class="craft-material-title">Bản vẽ</div>${renderLearnButton('forging', { type, level, quality })}</div><div class="craft-material-title">Nguyên liệu cần:</div><div class="craft-material-list">${renderMaterials(recipe, 'forging')}</div><button class="craft-button" type="button" data-craft-action="forging" ${learned ? '' : 'disabled'}>${learned ? 'LUYỆN KHÍ' : 'CẦN HỌC BẢN VẼ'}</button>`
}

function getSelectedData(root) { return { type: root.querySelector('[data-craft-type]')?.value, level: Number(root.querySelector('[data-craft-level]')?.value || 0), quality: root.querySelector('[data-craft-quality]')?.value || '' } }

function bindCraftActions(root, kind, render) {
  root.querySelectorAll('[data-learn-recipe]').forEach((button) => button.addEventListener('click', () => {
    const data = getSelectedData(root)
    const itemId = kind === 'alchemy' ? 'dan_phuong' : 'ban_ve'
    const itemName = kind === 'alchemy' ? 'Đan phương' : 'Bản vẽ'
    if (getOwnedCount(itemId, itemName) < 1) { window.dispatchEvent(new CustomEvent('game:log', { detail: { message: `Không có ${itemName}.`, type: 'warning' } })); return }
    if (!learnCraftRecipe(kind, data)) return
    if (!removeInventoryItem(itemId, 1)) return
    window.dispatchEvent(new CustomEvent('game:inventory-changed'))
    window.dispatchEvent(new CustomEvent('game:log', { detail: { message: `Đã học công thức ${kind === 'alchemy' ? 'Luyện Đan' : 'Luyện Khí'} vĩnh viễn.`, type: 'item' } }))
    render()
  }))

  root.querySelectorAll('[data-craft-action]').forEach((button) => button.addEventListener('click', () => {
    const data = getSelectedData(root)
    if (!isRecipeLearned(kind, data)) return
    const recipe = kind === 'alchemy' ? getAlchemyRecipe(data.level) : getForgingRecipe(data.level)
    const missing = recipe.find((material) => getOwnedCount(material.id, material.name) < material.amount)
    if (missing) { window.dispatchEvent(new CustomEvent('game:log', { detail: { message: `Thiếu ${missing.name}.`, type: 'warning' } })); return }
    recipe.forEach((material) => removeInventoryItem(material.id, material.amount))
    const expGain = Math.max(10, data.level * 10)
    const training = getCraftingTraining(kind)
    if (training.level < training.maxLevel) gainCraftingExp(kind, expGain)
    window.dispatchEvent(new CustomEvent('game:inventory-changed'))
    window.dispatchEvent(new CustomEvent('game:log', { detail: { message: `${kind === 'alchemy' ? 'Luyện Đan' : 'Luyện Khí'} thành công. +${expGain} EXP nghề.`, type: 'item' } }))
    render()
  }))
}

export function mountLuyenDan(root) {
  const update = () => { renderAlchemy(root); bindCraftActions(root, 'alchemy', update) }
  root.querySelectorAll('[data-craft-type],[data-craft-level],[data-craft-quality]').forEach((el) => el.addEventListener('change', update))
  update()
}

export function mountLuyenKhi(root) {
  const update = () => { renderForging(root); bindCraftActions(root, 'forging', update) }
  root.querySelectorAll('[data-craft-type],[data-craft-level],[data-craft-quality]').forEach((el) => el.addEventListener('change', update))
  update()
}
