import { getSkillById } from '../../data/skills/index.js'

export function mountSkillsScreen() {
  const grid = document.getElementById('skills-grid')
  const title = document.getElementById('skill-info-title')
  const meta = document.getElementById('skill-info-meta')
  const desc = document.getElementById('skill-info-desc')
  if (!grid || !title || !meta || !desc) return

  const slots = Array.from(grid.querySelectorAll('.skill-node'))
  const select = (slot) => {
    slots.forEach((item) => item.classList.remove('is-selected'))
    slot.classList.add('is-selected')
    const skill = getSkillById(slot.dataset.skillId)
    if (!skill) return
    const level = Number(slot.dataset.skillLevel || 0)
    const max = Number(slot.dataset.skillMax || 10)
    const effects = Object.entries(skill.effects ?? {}).map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`).join(' • ')
    title.textContent = `${skill.name} — Lv ${level}/${max}`
    meta.textContent = `Môn phái: ${skill.sect} | Loại: Chủ động | Tiêu hao: ${skill.manaCost} MP`
    desc.innerHTML = `<div>${skill.description || 'Chưa có mô tả.'}</div><div class="skill-detail-extra"><b>Yêu cầu:</b> Lv ${skill.requirements?.characterLevel ?? 1}${skill.requirements?.rebirth ? ` • Trùng sinh ${skill.requirements.rebirth}` : ''}<br><b>Hiệu quả:</b> ${effects || 'Đang cập nhật dữ liệu.'}</div><div class="skill-detail-actions"><button type="button" class="skill-detail-btn">Tăng 1 cấp</button><button type="button" class="skill-detail-btn primary">Tăng tối đa</button></div>`
  }

  slots.forEach((slot) => slot.addEventListener('click', () => select(slot)))
  grid.querySelectorAll('[data-skill-up]').forEach((button) => button.addEventListener('click', (event) => {
    event.stopPropagation()
    const slot = grid.querySelector(`[data-skill-id="${button.dataset.skillUp}"]`)
    if (slot) select(slot)
  }))
  document.querySelectorAll('.skill-nav-item').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('.skill-nav-item').forEach(item => item.classList.remove('active'))
    button.classList.add('active')
  }))
  document.querySelectorAll('.skill-class-tab').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('.skill-class-tab').forEach(item => item.classList.remove('active'))
    button.classList.add('active')
  }))
  if (slots[0]) select(slots[0])
}
