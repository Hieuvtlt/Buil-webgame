export function mountInventoryScreen() {
  const pagination = document.getElementById('inventory-pagination-2')
  const grid = document.getElementById('inventory-screen-grid')
  const title = document.getElementById('inv-info-title')
  const meta = document.getElementById('inv-info-meta')
  const desc = document.getElementById('inv-info-desc')
  if (!pagination || !grid || !title || !meta || !desc) return

  const slots = Array.from(grid.querySelectorAll('.inv-slot2'))
  const select = (slot) => {
    slots.forEach((item) => item.classList.remove('is-selected'))
    slot.classList.add('is-selected')
    title.textContent = slot.dataset.itemName || '-'
    meta.textContent = `Loại: ${slot.dataset.itemType || '-'} | Cấp: ${slot.dataset.itemLevel || '-'}`
    desc.textContent = `Mô tả: ${slot.dataset.itemDesc || '-'}`
  }

  slots.forEach((slot) => slot.addEventListener('click', () => select(slot)))
  pagination.querySelectorAll('.inv-page-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      pagination.querySelectorAll('.inv-page-btn').forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')
      if (slots[0]) select(slots[0])
    })
  })

  if (slots[0]) select(slots[0])
}
