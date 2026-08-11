import { alchemyMaterials } from '../../data/items/alchemy.js'
import { consumables } from '../../data/items/consumables.js'

export function LuyenDanScreen() {
  const herbs = alchemyMaterials.slice(0, 10)
  const pills = consumables.filter((item) => ['hp_pill', 'mp_pill', 'exp_pill', 'skillExp_pill'].includes(item.category)).slice(0, 20)

  return `
    <div class="profession-screen game-screen">
      <h3 class="panel-title-sm">Luyện Đan</h3>
      <div class="profession-layout">
        <section class="profession-panel">
          <h4>Linh dược</h4>
          ${herbs.map((item) => `<div class="profession-item">${item.name} <small>Lv${item.level}</small></div>`).join('')}
        </section>
        <section class="profession-panel">
          <h4>Đan phương</h4>
          ${pills.map((item) => `<div class="profession-item">${item.name}</div>`).join('')}
        </section>
        <section class="profession-panel">
          <h4>Thông tin</h4>
          <div class="product-line">Nguyên liệu: <b>Linh dược</b></div>
          <div class="product-line">Đan dược: <b>10 cấp</b></div>
          <div class="product-line">Nhân vật tối đa: <b>Lv200</b></div>
          <div class="product-line">Ghi chú: <b>Đan Lv10 dùng cho Lv91–200</b></div>
        </section>
      </div>
    </div>`
}
