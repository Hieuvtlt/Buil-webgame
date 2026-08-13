import { player, getMaxSkillLevel } from '../../data/character.js'
import { getSkillsForSect, SECT_NAMES } from '../../data/skills/index.js'

const CATEGORY = [
  ['active', '⚔', 'Kỹ năng chủ động'],
  ['passive', '🛡', 'Kỹ năng bị động'],
  ['talent', '✥', 'Thiên phú'],
  ['manual', '▤', 'Bí kíp'],
  ['soul', '♨', 'Võ hồn'],
]

export function SkillsScreen() {
  const skills = getSkillsForSect(player.sect, player.skills)
  const maxSkillLevel = getMaxSkillLevel()
  const isTanTu = player.sect === 'tanTu'
  const groups = [
    { label: 'Cấp 1 – 30', items: skills.slice(0, 5) },
    { label: 'Cấp 31 – 60', items: skills.slice(5, 10) },
    { label: 'Cấp 61 – 100', items: skills.slice(10, 15) },
  ]

  return `
    <div class="skills-screen skill-redesign">
      <div class="skills-topline">
        <div><b>Môn phái:</b> ${SECT_NAMES[player.sect]}</div>
        <div><b>Giới hạn luyện:</b> ${maxSkillLevel}</div>
        <div class="skill-training-rule"><b>Cơ chế:</b> Luyện kỹ năng, không cộng điểm</div>
      </div>
      <div class="skills-layout-v2">
        <aside class="skills-nav-v2">
          ${CATEGORY.map(([id, icon, label], i) => `<button class="skill-nav-item ${i === 0 ? 'active' : ''}" type="button" data-skill-category="${id}"><span>${icon}</span>${label}</button>`).join('')}
        </aside>
        <section class="skills-tree-v2">
          <div class="skill-tabs-v2">
            <button class="skill-class-tab active" type="button">${SECT_NAMES[player.sect]}</button>
            <button class="skill-class-tab" type="button">Đao khách</button><button class="skill-class-tab" type="button">Pháp sư</button><button class="skill-class-tab" type="button">Cung thủ</button><button class="skill-class-tab" type="button">Phật môn</button>
          </div>
          <div class="skill-tree-help">${isTanTu ? 'Tán Tu: không có võ công sẵn; cần học đúng bí kíp để mở võ kỹ.' : 'Môn phái đã có hệ võ công. Muốn học cần đủ cấp nhân vật và bí kíp; sau khi học bắt đầu luyện từ cấp 1.'}</div>
          <div class="skill-tree-scroll" id="skills-grid">
            ${skills.length ? groups.filter(group => group.items.length).map(group => `
              <div class="skill-tier"><div class="skill-tier-title"><i></i>${group.label}<i></i></div><div class="skill-chain">
                ${group.items.map((skill, index) => { const current = Number(player.skills[skill.id] ?? 0); const locked = Number(skill.requirements?.characterLevel ?? 1) > player.level; return `
                  <div class="skill-node-wrap ${locked ? 'locked' : ''}">
                    <button class="skill-node" type="button" data-skill-id="${skill.id}" data-skill-name="${skill.name}" data-skill-level="${current}" data-skill-max="${maxSkillLevel}" ${locked ? 'aria-disabled="true"' : ''}><span class="skill-node-ring"><img class="skill-icon" src="${skill.icon}" alt="" /></span><b>${skill.name}</b><small>${current}/${maxSkillLevel}</small></button>
                    ${index < group.items.length - 1 ? '<span class="skill-arrow">➜</span>' : ''}
                    <button class="skill-up-mini" type="button" data-skill-up="${skill.id}">${current >= maxSkillLevel ? 'Đã max' : 'Luyện'}</button>
                  </div>` }).join('')}
              </div></div>`).join('') : '<div class="skill-empty-v2">Chưa có võ kỹ. Hãy học bí kíp để mở kỹ năng.</div>'}
          </div>
          <div class="skill-hotbar-v2"><span>THANH KỸ NĂNG</span>${skills.slice(0, 6).map((skill, i) => `<button type="button" class="hot-skill" title="${skill.name}"><img src="${skill.icon}" alt=""/><small>${i + 1}</small></button>`).join('')}${Array.from({length: Math.max(0, 6 - Math.min(6, skills.length))}).map((_, i) => `<button type="button" class="hot-skill locked"><span>🔒</span><small>${Math.min(6, skills.length) + i + 1}</small></button>`).join('')}</div>
        </section>
        <aside class="skill-detail-v2" id="skill-info-box"><div id="skill-detail-content"><div class="skill-detail-title" id="skill-info-title">Chọn võ kỹ</div><div class="skill-detail-meta" id="skill-info-meta">Môn phái: ${SECT_NAMES[player.sect]} | Loại: Ngoại công</div><div class="skill-detail-desc" id="skill-info-desc">Chọn một võ kỹ để xem mô tả, hiệu quả, yêu cầu và thao tác luyện.</div></div></aside>
      </div>
    </div>
  `
}
