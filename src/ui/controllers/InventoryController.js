import { getItemById } from '../../data/items/index.js'

export function mountInventoryScreen() {
  const grid = document.getElementById('inventory-screen-grid')
  const title = document.getElementById('inv-info-title')
  const meta = document.getElementById('inv-info-meta')
  const desc = document.getElementById('inv-info-desc')
  if (!grid || !title || !meta || !desc) return

  const slots = Array.from(grid.querySelectorAll('.inv-slot2'))
  const select = (slot) => {
    slots.forEach((item) => item.classList.remove('is-selected'))
    slot.classList.add('is-selected')
    const item = getItemById(slot.dataset.itemId)
    if (!item) return
    title.textContent = item.name
    meta.textContent = item.tierLabel
      ? `${item.tierLabel} | Lv ${item.level}`
      : `Loại: ${item.type} | Cấp đan dược: ${item.potionLevel ?? item.level}`
    desc.textContent = item.description || '-'
  }

  slots.forEach((slot) => slot.addEventListener('click', () => select(slot)))
  if (slots[0]) select(slots[0])
}
