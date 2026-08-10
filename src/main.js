import './style.css'
import { CharacterScreen } from './ui/screens/CharacterScreen.js'
import { InventoryScreen } from './ui/screens/InventoryScreen.js'
import { SkillsScreen } from './ui/screens/SkillsScreen.js'
import { LuyenDanScreen } from './ui/screens/LuyenDanScreen.js'
import { LuyenKhiScreen } from './ui/screens/LuyenKhiScreen.js'
import { ThuongHoiScreen } from './ui/screens/thuonghoi.js'




document.querySelector('#app').innerHTML = `
  <div id="game-grid">
    <aside id="col-left">
      <h2 class="panel-title">Menu</h2>
      <nav id="left-menu">
        <button class="menu-item active" type="button">Nhân vật</button>
        <button class="menu-item" type="button">Túi đồ</button>
        <button class="menu-item" type="button">Kỹ năng</button>
        <button class="menu-item" type="button">Luyện đan</button>
        <button class="menu-item" type="button">Luyện khí</button>
        <button class="menu-item" type="button">Thương hội</button>
        <button class="menu-item" type="button">Nhiệm vụ</button>
        <button class="menu-item" type="button">Ngoại cảnh</button>
        <button class="menu-item" type="button">GM</button>
        <button class="menu-item" type="button">Cài đặt</button>
      </nav>
    </aside>

    <main id="col-center">
      <h2 class="panel-title">Màn hình</h2>
      <div id="content-root"></div>
    </main>

    <aside id="col-right">
      <section>
        <h2 class="panel-title">UI Túi đồ</h2>
        <div>Placeholder: lưới slot túi đồ</div>
      </section>

      <section>
        <h2 class="panel-title">UI Thông tin/Chọn item</h2>
        <div>Placeholder: vùng dưới (gợi ý)</div>
      </section>
    </aside>
  </div>
`

const contentRoot = document.querySelector('#content-root')
const menuButtons = Array.from(document.querySelectorAll('#left-menu .menu-item'))

function setActiveMenu(targetBtn) {
  menuButtons.forEach(btn => btn.classList.remove('active'))
  targetBtn?.classList.add('active')
}

const characterBtn = menuButtons.find(b => b.textContent.trim() === 'Nhân vật')
const inventoryBtn = menuButtons.find(b => b.textContent.trim() === 'Túi đồ')
const skillsBtn = menuButtons.find(b => b.textContent.trim() === 'Kỹ năng')
const danMenuBtn = menuButtons.find(b => b.textContent.trim() === 'Luyện đan')
const khiMenuBtn = menuButtons.find(b => b.textContent.trim() === 'Luyện khí')
const guildBtn = menuButtons.find(b => b.textContent.trim() === 'Thương hội')


// render mặc định
contentRoot.innerHTML = CharacterScreen()
wireCharacterInventoryPagination()

function wireCharacterInventoryPagination() {
  const pagination = document.getElementById('inventory-pagination')
  if (!pagination) return

  pagination.querySelectorAll('.page-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      pagination.querySelectorAll('.page-btn').forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')
    })
  })
}

// ===== wire pagination Skills (chỉ khi đang ở SkillsScreen) =====
function wireSkillsPagination() {
  const pagination = document.getElementById('skills-pagination')
  if (!pagination) return

  pagination.querySelectorAll('.skill-page-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      pagination.querySelectorAll('.skill-page-btn').forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')
    })
  })
}

// ===== wire pagination InventoryScreen (nếu cần) =====
function wireInventoryScreen() {
  const root = document.getElementById('content-root')
  if (!root) return

  const pagination = document.getElementById('inventory-pagination-2')
  const grid = document.getElementById('inventory-screen-grid')
  const titleEl = document.getElementById('inv-info-title')
  const metaEl = document.getElementById('inv-info-meta')
  const descEl = document.getElementById('inv-info-desc')

  if (!pagination || !grid) return
  if (!titleEl || !metaEl || !descEl) return

  // ===== active nút trang =====
  const pageBtns = pagination.querySelectorAll('.inv-page-btn')
  pageBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      pageBtns.forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')

      // placeholder: khi đổi trang thì reset chọn slot hiện tại
      // (sau này khi có dữ liệu thật, bạn render item theo page)
      const selected = grid.querySelector('.inv-slot2.is-selected')
      if (selected) selected.classList.remove('is-selected')
      const first = grid.querySelector('.inv-slot2')
      if (first) first.click()
    })
  })

  // ===== click slot -> active + cập nhật cột phải =====
  const slots = grid.querySelectorAll('.inv-slot2')

  function selectSlot(slot) {
    slots.forEach((s) => s.classList.remove('is-selected'))
    slot.classList.add('is-selected')

    const name = slot.dataset.itemName || '-'
    const type = slot.dataset.itemType || '-'
    const level = slot.dataset.itemLevel || '-'
    const desc = slot.dataset.itemDesc || '-'

    titleEl.textContent = name
    metaEl.textContent = `Loại: ${type} | Cấp: ${level}`
    descEl.textContent = `Mô tả: ${desc}`
  }

  slots.forEach((slot) => {
    slot.addEventListener('click', () => selectSlot(slot))
  })

  // chọn mặc định slot 1
  if (slots[0]) selectSlot(slots[0])
}

// ===== Menu click switch =====
if (characterBtn) {
  characterBtn.addEventListener('click', () => {
    setActiveMenu(characterBtn)
    contentRoot.innerHTML = CharacterScreen()
    wireCharacterUI() // đảm bảo wire lại cho CharacterScreen
    wireCharacterInventoryPagination()
  })
}

if (inventoryBtn) {
  inventoryBtn.addEventListener('click', () => {
    setActiveMenu(inventoryBtn)
    contentRoot.innerHTML = InventoryScreen()
    wireInventoryScreen()
  })
}

if (skillsBtn) {
  skillsBtn.addEventListener('click', () => {
    setActiveMenu(skillsBtn)
    contentRoot.innerHTML = SkillsScreen()
    wireSkillsPagination()
    wireSkillsSelect()
  })
}

if (danMenuBtn) {
  danMenuBtn.addEventListener('click', () => {
    setActiveMenu(danMenuBtn)
    contentRoot.innerHTML = LuyenDanScreen()
    })
}

if (khiMenuBtn) {
  khiMenuBtn.addEventListener('click', () => {
    setActiveMenu(khiMenuBtn)
    contentRoot.innerHTML = LuyenKhiScreen()
  })
}

if (guildBtn) {
  guildBtn.addEventListener('click', () => {
    setActiveMenu(guildBtn)
    contentRoot.innerHTML = ThuongHoiScreen()
    wireMerchantActive()
    wireMerchantPagination()
    // (chưa wire mua/bán, sau này làm logic)
    // Nếu bạn muốn đổi tab active mua/bán thì mình sẽ hướng dẫn tiếp.
  })
}

// ===== Character UI (equip/unequip) =====
function wireCharacterUI() {
  const equipGrid = document.getElementById('equip-grid')
  const inventoryGrid = document.getElementById('inventory-grid')
  const btnEquip = document.getElementById('btn-equip')
  const btnUnequip = document.getElementById('btn-unequip')

  if (!equipGrid || !inventoryGrid) return

  let selectedEquipIndex = null
  let selectedInvIndex = null

  function refreshSlotText() {
    equipGrid.querySelectorAll('.equip-slot').forEach((btn) => {
      const hasItem = btn.dataset.hasItem === 'true'
      const slotIndex = Number(btn.dataset.slotIndex)
      btn.textContent = `Slot ${slotIndex + 1}: ${hasItem ? 'Có item' : 'Trống'}`
    })

    inventoryGrid.querySelectorAll('.inv-slot').forEach((btn) => {
      const hasItem = btn.dataset.hasItem === 'true'
      const invIndex = Number(btn.dataset.invIndex)
      btn.textContent = `Slot ${invIndex + 1}: ${hasItem ? 'Có item' : 'Trống'}`
    })
  }

  function setSelectedEquip(btn) {
    equipGrid.querySelectorAll('.equip-slot').forEach((b) => b.classList.remove('is-selected'))
    btn.classList.add('is-selected')
    selectedEquipIndex = Number(btn.dataset.slotIndex)
  }

  function setSelectedInv(btn) {
    inventoryGrid.querySelectorAll('.inv-slot').forEach((b) => b.classList.remove('is-selected'))
    btn.classList.add('is-selected')
    selectedInvIndex = Number(btn.dataset.invIndex)
  }

  equipGrid.querySelectorAll('.equip-slot').forEach((btn) => {
    btn.addEventListener('click', () => setSelectedEquip(btn))
  })

  inventoryGrid.querySelectorAll('.inv-slot').forEach((btn) => {
    btn.addEventListener('click', () => setSelectedInv(btn))
  })

  function doEquip() {
    if (selectedEquipIndex === null || selectedInvIndex === null) return
    if (!btnEquip) return

    const equipBtn = equipGrid.querySelector(`.equip-slot[data-slot-index="${selectedEquipIndex}"]`)
    const invBtn = inventoryGrid.querySelector(`.inv-slot[data-inv-index="${selectedInvIndex}"]`)
    if (!equipBtn || !invBtn) return

    if (invBtn.dataset.hasItem !== 'true') return

    equipBtn.dataset.hasItem = 'true'
    invBtn.dataset.hasItem = 'false'
    refreshSlotText()
  }

  function doUnequip() {
    if (selectedEquipIndex === null) return
    if (!btnUnequip) return

    const equipBtn = equipGrid.querySelector(`.equip-slot[data-slot-index="${selectedEquipIndex}"]`)
    if (!equipBtn) return
    if (equipBtn.dataset.hasItem !== 'true') return

    equipBtn.dataset.hasItem = 'false'
    refreshSlotText()
  }

  btnEquip?.addEventListener('click', doEquip)
  btnUnequip?.addEventListener('click', doUnequip)

  refreshSlotText()

  const firstEquip = equipGrid.querySelector('.equip-slot')
  if (firstEquip) setSelectedEquip(firstEquip)

  const firstInv = inventoryGrid.querySelector('.inv-slot')
  if (firstInv) setSelectedInv(firstInv)
}

// wire initial character
wireCharacterUI()
function wireProfessionSlots() {
  const root = document.getElementById('content-root')
  if (!root) return

  const items = root.querySelectorAll('.profession-item')
  if (!items.length) return

  // click để active theo từng cột (dan/khi)
  items.forEach((el) => {
    el.addEventListener('click', () => {
      const col = el.dataset.col

      // bỏ active trong cùng cột
      items.forEach((x) => {
        if (x.dataset.col === col) x.classList.remove('is-selected')
      })

      // active ô được click
      el.classList.add('is-selected')
    })
  })

  // chọn mặc định: cột dan chọn rank=chon, cột khi chọn rank=chon
  const danDefault = root.querySelector('.profession-item[data-col="dan"][data-rank="chon"]')
  const khiDefault = root.querySelector('.profession-item[data-col="khi"][data-rank="chon"]')
  danDefault?.classList.add('is-selected')
  khiDefault?.classList.add('is-selected')
}
function wireProfessionRanks() {
  const root = document.getElementById('content-root')
  if (!root) return

  const ranks = root.querySelectorAll('.profession-rank')
  if (!ranks.length) return

  const nameB = root.querySelector('.product-line:nth-child(1) b')
  const rankB = root.querySelector('.product-line:nth-child(2) b')
  const reqB = root.querySelector('.product-line:nth-child(3) b')
  const descB = root.querySelector('.product-line:nth-child(4) b')

  const productTypeMap = {
    dan: 'Đan dược',
    khi: 'Khí',
  }

  const rankTextMap = {
    ha: 'Hạ phẩm',
    trung: 'Trung phẩm',
    thuong: 'Thượng phẩm',
    cuc: 'Cực phẩm',
  }

  ranks.forEach((el) => {
    el.addEventListener('click', () => {
      const col = el.dataset.col
      const rank = el.dataset.rank

      // active theo cột
      ranks.forEach((x) => {
        if (x.dataset.col === col) x.classList.remove('is-selected')
      })
      el.classList.add('is-selected')

      // update thông tin cột 3
      const typeText = productTypeMap[col] || '-'
      const rankText = rankTextMap[rank] || '-'

      if (nameB) nameB.textContent = `${typeText} (${rankText})`
      if (rankB) rankB.textContent = rankText
      if (reqB) reqB.textContent = 'Yêu cầu: -'
      if (descB) descB.textContent = `Mô tả: placeholder cho ${rankText}`
    })
  })
}
function wireSkillsSelect() {
  const root = document.getElementById('content-root')
  if (!root) return

  const grid = document.getElementById('skills-grid')
  if (!grid) return

  const titleEl = document.getElementById('skill-info-title')
  const metaEl = document.getElementById('skill-info-meta')
  const descEl = document.getElementById('skill-info-desc')

  const slots = grid.querySelectorAll('.skill-slot')
  if (!slots.length) return

  slots.forEach((slot) => {
    slot.addEventListener('click', () => {
      slots.forEach((s) => s.classList.remove('is-selected'))
      slot.classList.add('is-selected')

      const name = slot.dataset.skillName || '-'
      const type = slot.dataset.skillType || '-'
      const level = slot.dataset.skillLevel || '-'
      const desc = slot.dataset.skillDesc || '-'

      if (titleEl) titleEl.textContent = name
      if (metaEl) metaEl.textContent = `Loại: ${type} | Cấp: ${level}`
      if (descEl) descEl.textContent = `Mô tả: ${desc}`
    })
  })

  // mặc định chọn slot 1
  const first = slots[0]
  if (first) first.click()
}

function wireMerchantPagination() {
  const pagination = document.getElementById('merchant-pagination')
  if (!pagination) return

  const buttons = pagination.querySelectorAll('.merchant-page-btn')
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')

      // hiện tại placeholder nên chưa đổi dữ liệu theo trang
    })
  })
}

function wireMerchantActive() {
  const root = document.getElementById('content-root')
  if (!root) return

  // ===== Tabs =====
  const tabs = root.querySelectorAll('[data-tab]')
  if (!tabs.length) return

  function setActiveTab(tab) {
    tabs.forEach((t) => {
      t.classList.remove('merchant-tab-active')
      t.classList.remove('active') // để loại xung đột nếu CSS dùng active
    })
    tab.classList.add('merchant-tab-active')
    tab.classList.add('active')
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      setActiveTab(tab)

      // placeholder: reset active hàng về hàng đầu
      const targetRows = getMerchantRows()
      targetRows.forEach((r) => r.classList.remove('is-selected'))
      targetRows[0]?.classList.add('is-selected')
    })
  })

  const defaultTab =
    root.querySelector('[data-tab].merchant-tab-active') ||
    root.querySelector('[data-tab].active') ||
    tabs[0]

  if (defaultTab) setActiveTab(defaultTab)

  // ===== Rows =====
  function getMerchantRows() {
    // Ưu tiên nếu bạn có data-row-index
    const byIndex = root.querySelectorAll('[data-row-index]')
    if (byIndex.length) return Array.from(byIndex)

    // Fallback: theo class như phiên bản trước
    const byClass = root.querySelectorAll('.m-row.m-data')
    if (byClass.length) return Array.from(byClass)

    // fallback khác: nếu chỉ có m-data
    const byData = root.querySelectorAll('.m-data')
    if (byData.length) return Array.from(byData)

    return []
  }

  const rows = getMerchantRows()
  if (!rows.length) return

  rows.forEach((row) => {
  row.addEventListener('click', () => {
    rows.forEach((r) => r.classList.remove('is-selected'))
    row.classList.add('is-selected')

    // Lấy 4 ô trong hàng: tên/cấp/phẩm/giá
    const cells = row.querySelectorAll('.m-cell')
    const name = cells[0]?.textContent?.trim() || '-'
    const level = cells[1]?.textContent?.trim() || '-'
    const rank = cells[2]?.textContent?.trim() || '-'
    const price = cells[3]?.textContent?.trim() || '-'

    // Cột thông tin bên phải
    const info = root.querySelector('.merchant-info')
    if (!info) return

    const lines = info.querySelectorAll('.merchant-info-line')
    // thứ tự: Tên, Loại, Phẩm cấp, Giá (theo UI bạn đang làm)
    const lineName = lines[0]
    const lineType = lines[1]
    const lineRank = lines[2]
    const linePrice = lines[3]

    // set text sau dấu ":"
    if (lineName) lineName.innerHTML = `<b>Tên:</b> ${name}`
    if (lineType) lineType.innerHTML = `<b>Loại:</b> ${level}`
    if (lineRank) lineRank.innerHTML = `<b>Phẩm cấp:</b> ${rank}`
    if (linePrice) linePrice.innerHTML = `<b>Giá:</b> ${price}`

    const desc = info.querySelector('.merchant-info-desc')
    if (desc) desc.textContent = 'Placeholder mô tả sản phẩm'
  })
})

  // mặc định chọn hàng đầu
  rows[0]?.classList.add('is-selected')
}