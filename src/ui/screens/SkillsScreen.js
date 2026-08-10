export function SkillsScreen() {
  const slotsPerPage = 8
  const totalPages = 3

  return `
    <div class="skills-screen">
      <h3 class="panel-title-sm">Kỹ năng</h3>

      <div class="skills-pagination" id="skills-pagination">
        <button class="skill-page-btn active" type="button" data-skill-page="1">Trang 1</button>
        <button class="skill-page-btn" type="button" data-skill-page="2">2</button>
        <button class="skill-page-btn" type="button" data-skill-page="3">3</button>
      </div>

      <div class="skills-layout">
        <div class="skills-left">
          <div class="skills-grid" id="skills-grid">
            ${Array.from({ length: slotsPerPage }, (_, i) => `
              <div class="skill-slot"
                   data-skill-index="${i}"
                   data-skill-name="Kỹ năng ${i + 1}"
                   data-skill-type="Nội công"
                   data-skill-level="${Math.floor((i % 5) + 1)}"
                   data-skill-desc="Mô tả placeholder kỹ năng ${i + 1}">
                Kỹ năng ${i + 1}
              </div>
            `).join('')}
          </div>
        </div>

        <div class="skills-right">
          <div class="skill-info-box">
            <div class="skill-info-title" id="skill-info-title">Tên kỹ năng (chọn)</div>
            <div class="skill-info-meta" id="skill-info-meta">Loại: - | Cấp: -</div>
            <div class="skill-info-desc" id="skill-info-desc">
              Mô tả: (placeholder)
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}