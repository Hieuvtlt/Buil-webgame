const CATEGORIES = ['Trang bị', 'Đan dược', 'Linh dược', 'Khoáng thạch', 'Đan phương', 'Bản vẽ']
const CURRENCIES = [
  { id: 'linhthach', label: 'Linh thạch' },
  { id: 'vang', label: 'Vàng' },
  { id: 'bac', label: 'Bạc' },
  { id: 'dong', label: 'Đồng' },
]

const QUALITY = ['Hạ phẩm', 'Trung phẩm', 'Thượng phẩm', 'Cực phẩm']
const EQUIPMENT_TYPES = ['Kiếm', 'Đao', 'Thương', 'Mũ', 'Áo', 'Hộ uyển', 'Đai', 'Giày', 'Nhẫn', 'Dây chuyền']

function buildItem(i, prefix, priceStep) {
  const type = EQUIPMENT_TYPES[i % EQUIPMENT_TYPES.length]
  const quality = QUALITY[i % QUALITY.length]
  const level = (i % 10) + 1
  const attackMin = 8 + level * 2 + (i % 5)
  const attackMax = attackMin + 6 + (i % 7)
  const defense = 4 + level + (i % 6)
  const hp = 10 + level * 5 + (i % 4) * 5
  const description = `${type} cấp ${level}, phù hợp với nhân vật đang phát triển.`
  const stats = `Ngoại công: ${attackMin}-${attackMax};Ngoại phòng: +${defense};HP: +${hp}`
  return { name: `${prefix} ${type} ${i + 1}`, level, quality, grade: 'Hoàng cấp', price: (i + 1) * priceStep, category: 'Trang bị', type, description, stats }
}

const BUY_ITEMS = Array.from({ length: 60 }, (_, i) => {
  if (i < 10) return buildItem(i, 'Trang bị Thương Hội', 1000)
  const category = CATEGORIES[i % CATEGORIES.length]
  return { name: `Hàng Thương Hội ${i + 1}`, level: (i % 10) + 1, quality: QUALITY[i % 4], grade: '', price: (i + 1) * 1000, category, type: category, description: `Vật phẩm ${category.toLowerCase()} của Thương Hội.`, stats: 'Không có thuộc tính chiến đấu.' }
})

const SELL_ITEMS = Array.from({ length: 60 }, (_, i) => {
  if (i < 10) return buildItem(i, 'Vật phẩm túi đồ', 500)
  const category = CATEGORIES[i % CATEGORIES.length]
  return { name: `Vật phẩm túi đồ ${i + 1}`, level: (i % 10) + 1, quality: QUALITY[i % 4], grade: '', price: (i + 1) * 500, category, type: category, description: `Vật phẩm ${category.toLowerCase()} trong túi đồ.`, stats: 'Không có thuộc tính chiến đấu.' }
})

function renderItems(mode, page = 1, category = CATEGORIES[0]) {
  const source = (mode === 'mua' ? BUY_ITEMS : SELL_ITEMS).filter((item) => item.category === category)
  const start = (page - 1) * 12
  return source.slice(start, start + 12).map((item, i) => `
    <button class="merchant-item-slot" type="button"
      data-merchant-index="${start + i}"
      data-name="${item.name}"
      data-level="${item.level}"
      data-quality="${item.quality}"
      data-grade="${item.grade || ''}"
      data-price="${item.price}"
      data-category="${item.category}"
      data-type="${item.type}"
      data-description="${item.description}"
      data-stats="${item.stats}">
      <span class="merchant-item-icon">${i + 1}</span>
      <span class="merchant-item-name">${item.name}</span>
    </button>`).join('')
}

export function ThuongHoiScreen() {
  return `
    <div class="merchant-screen game-screen">
      <div class="merchant-tabs">
        <button class="merchant-tab active" type="button" data-tab="mua">MUA</button>
        <button class="merchant-tab" type="button" data-tab="ban">BÁN</button>
      </div>
      <div class="merchant-layout">
        <aside class="merchant-category-panel">
          <div class="merchant-panel-title">DANH MỤC</div>
          ${CATEGORIES.map((name, i) => `<button class="merchant-side-category${i === 0 ? ' active' : ''}" type="button" data-category="${name}">${name}</button>`).join('')}
        </aside>
        <section class="merchant-items-panel">
          <div class="merchant-list-head"><span id="merchant-mode-label">Hàng của Thương Hội</span><span>Trang <b id="merchant-current-page">1</b>/5</span></div>
          <div class="merchant-item-grid" id="merchant-item-grid">${renderItems('mua')}</div>
          <div class="merchant-pagination" id="merchant-pagination">
            ${[1,2,3,4,5].map(p => `<button class="merchant-page-btn${p === 1 ? ' active' : ''}" type="button" data-page="${p}">${p}</button>`).join('')}
          </div>
        </section>
      </div>
      <div class="merchant-tooltip" id="merchant-tooltip" role="dialog" aria-hidden="true"></div>
    </div>`
}

export { CATEGORIES, CURRENCIES, BUY_ITEMS, SELL_ITEMS, renderItems }
