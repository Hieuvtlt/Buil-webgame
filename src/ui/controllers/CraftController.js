const ALCHEMY_RECIPES = {
  hoimau: {
    name: 'Hồi Khí Đan',
    effect: 'Phục hồi 500 HP',
    materials: [{ name: 'Huyết Linh Chi', current: 2, required: 3 }],
  },
  hoimana: {
    name: 'Hồi Nguyên Đan',
    effect: 'Phục hồi 300 MP',
    materials: [{ name: 'Linh Chi', current: 5, required: 3 }],
  },
  exp: {
    name: 'Tụ Linh Đan',
    effect: 'Nhận thêm EXP',
    materials: [{ name: 'Tử Linh Chi', current: 4, required: 3 }],
  },
  expskill: {
    name: 'Ngộ Đạo Đan',
    effect: 'Nhận thêm EXP võ kỹ',
    materials: [{ name: 'Ngọc Linh Chi', current: 2, required: 2 }],
  },
}

const FORGING_RECIPES = {
  vu_khi: { name: 'Vũ khí', effect: 'Trang bị vũ khí', materials: [{ name: 'Quặng Sắt', current: 8, required: 5 }, { name: 'Quặng Đồng', current: 2, required: 3 }] },
  mu: { name: 'Mũ', effect: 'Trang bị mũ', materials: [{ name: 'Quặng Sắt', current: 4, required: 3 }] },
  ao: { name: 'Áo', effect: 'Trang bị áo', materials: [{ name: 'Quặng Bạc', current: 1, required: 2 }] },
  baotay: { name: 'Bao tay', effect: 'Trang bị bao tay', materials: [{ name: 'Quặng Sắt', current: 6, required: 4 }] },
  dailung: { name: 'Đai lưng', effect: 'Trang bị đai lưng', materials: [{ name: 'Quặng Đồng', current: 4, required: 4 }] },
  giay: { name: 'Giày', effect: 'Trang bị giày', materials: [{ name: 'Quặng Bạc', current: 3, required: 2 }] },
}

function renderRecipe(root, recipe, level, quality) {
  const info = root.querySelector('[data-craft-info]')
  if (!info) return
  if (!recipe) {
    info.innerHTML = '<div class="craft-result-placeholder">Chọn đầy đủ thông tin để xem thông tin luyện.</div>'
    return
  }
  const levelText = level ? `Lv${level}` : 'Chưa chọn level'
  const qualityText = quality || 'Chưa chọn phẩm cấp'
  info.innerHTML = `
    <div class="craft-selected-name">${recipe.name} ${levelText}</div>
    <div class="craft-effect">${recipe.effect}</div>
    <div class="craft-subtitle">${qualityText}</div>
    <div class="craft-material-title">Nguyên liệu cần:</div>
    ${recipe.materials.map((m) => {
      const enough = m.current >= m.required
      return `<div class="craft-material-row ${enough ? 'is-enough' : 'is-short'}"><span>${m.name}</span><b>${m.current}/${m.required}</b></div>`
    }).join('')}
  `
}

function mountCraft(root, recipes, kind) {
  const typeSelect = root.querySelector('[data-craft-type]')
  const levelSelect = root.querySelector('[data-craft-level]')
  const qualitySelect = root.querySelector('[data-craft-quality]')
  const update = () => renderRecipe(root, recipes[typeSelect?.value], levelSelect?.value, qualitySelect?.value)
  typeSelect?.addEventListener('change', update)
  levelSelect?.addEventListener('change', update)
  qualitySelect?.addEventListener('change', update)
}

export function mountLuyenDan(root) {
  mountCraft(root, ALCHEMY_RECIPES, 'alchemy')
}

export function mountLuyenKhi(root) {
  mountCraft(root, FORGING_RECIPES, 'forging')
}
