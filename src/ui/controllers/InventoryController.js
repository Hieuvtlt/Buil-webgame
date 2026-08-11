import { getItemById } from '../../data/items/index.js'

const STAT_LABELS = {
  attackMin: 'Ngoại công thấp',
  attackMax: 'Ngoại công cao',
  defense: 'Ngoại phòng',
  strength: 'Sức mạnh',
  dexterity: 'Thân pháp',
  vitality: 'Sinh khí',
  energy: 'Nội lực',
  accuracy: 'Chính xác',
  dodge: 'Né tránh',
  hp: 'HP',
  mp: 'MP',
  externalAttack: 'Ngoại công %',
}

function getItemStatsText(item) {
  const lines = []
  if (item.tierMeta) lines.push(`${item.tierMeta.label} • ${item.quality ?? 'phẩm chất chưa xác định'}`)
  if (item.stackable) lines.push(`Xếp chồng: tối đa ${item.maxStack}`)
  Object.entries(item.stats ?? {}).forEach(([key, value]) => {
    if (value) lines.push(`${STAT_LABELS[key] ?? key}: ${value}`)
  })
  if (item.effect) {
    Object.entries(item.effect).forEach(([key, value]) => lines.push(`Hiệu quả ${key}: +${value}`))
  }
  return lines.length ? lines.join(' • ') : '-'
}

export function mountInventoryScreen() {
  const grid = document.getElementById('inventory-screen-grid')
  const title = document.getElementById('inv-info-title')
  const meta = document.getElementById('inv-info-meta')
  const stats = document.getElementById('inv-info-stats')
  const desc = document.getElementById('inv-info-desc')
  if (!grid || !title || !meta || !stats || !desc) return

  const slots = Array.from(grid.querySelectorAll('.inv-slot2'))
  const select = (slot) => {
    slots.forEach((item) => item.classList.remove('is-selected'))
    slot.classList.add('is-selected')
    const item = getItemById(slot.dataset.itemId)
    if (!item) return

    const color = item.tierMeta?.color ?? '#00ff66'
    title.textContent = item.name
    title.style.color = color

    if (item.tierMeta) {
      meta.textContent = `${item.tierMeta.label} | Lv ${item.level} | Trang bị • Không xếp chồng`
    } else if (item.potionLevel) {
      const range = item.usableLevelRange
      meta.textContent = `Đan dược Lv${item.potionLevel} | Dùng cho Lv${range.min}-${range.max} | Xếp chồng ${item.maxStack}`
    } else {
      meta.textContent = `Loại: ${item.type} | Cấp: ${item.level ?? '-'}`
    }

    stats.textContent = getItemStatsText(item)
    desc.textContent = item.description || '-'
  }

  slots.forEach((slot) => slot.addEventListener('click', () => select(slot)))
  const firstItem = slots.find((slot) => slot.dataset.itemId)
  if (firstItem) select(firstItem)
}
