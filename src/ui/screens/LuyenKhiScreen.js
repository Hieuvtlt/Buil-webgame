import { forgingMaterials } from '../../data/items/forging.js'

export function LuyenKhiScreen() {
  const ores = forgingMaterials.filter((item) => item.category === 'forging_ore')
  const alloys = forgingMaterials.filter((item) => item.category === 'forging_alloy')

  return `
    <div class="profession-screen game-screen">
      <h3 class="panel-title-sm">Luyện Khí</h3>
      <div class="profession-layout">
        <section class="profession-panel">
          <h4>Quặng</h4>
          ${ores.map((item) => `<div class="profession-item">${item.name} <small>Lv${item.level}</small></div>`).join('')}
        </section>
        <section class="profession-panel">
          <h4>Kim loại & Hợp kim</h4>
          ${alloys.map((item) => `<div class="profession-item">${item.name} <small>Lv${item.level}</small></div>`).join('')}
        </section>
        <section class="profession-panel">
          <h4>Quy trình</h4>
          <div class="product-line">Quặng → <b>Tinh luyện</b></div>
          <div class="product-line">Kim loại → <b>Hợp kim</b></div>
          <div class="product-line">Hợp kim → <b>Luyện trang bị</b></div>
          <div class="product-line">Cấp trang bị tối đa: <b>120</b></div>
        </section>
      </div>
    </div>`
}
