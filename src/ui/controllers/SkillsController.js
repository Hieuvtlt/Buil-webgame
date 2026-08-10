export function mountSkillsScreen() {
  const grid = document.getElementById('skills-grid')
  const pagination = document.getElementById('skills-pagination')
  const title = document.getElementById('skill-info-title')
  const meta = document.getElementById('skill-info-meta')
  const desc = document.getElementById('skill-info-desc')
  if (!grid || !pagination || !title || !meta || !desc) return

  const slots = Array.from(grid.querySelectorAll('.skill-slot'))
  const select = (slot) => {
    slots.forEach((item) => item.classList.remove('is-selected'))
    slot.classList.add('is-selected')
    title.textContent = slot.dataset.skillName || '-'
    meta.textContent = `Loại: ${slot.dataset.skillType || '-'} | Cấp: ${slot.dataset.skillLevel || '-'}`
    desc.textContent = `Mô tả: ${slot.dataset.skillDesc || '-'}`
  }

  slots.forEach((slot) => slot.addEventListener('click', () => select(slot)))
  pagination.querySelectorAll('.skill-page-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      pagination.querySelectorAll('.skill-page-btn').forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')
      if (slots[0]) select(slots[0])
    })
  })
  if (slots[0]) select(slots[0])
}
