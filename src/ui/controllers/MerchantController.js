import { CATEGORIES, CURRENCIES, BUY_ITEMS, SELL_ITEMS, renderItems } from '../screens/ThuongHoiScreen.js'

const currencyLabel = (id) => CURRENCIES.find((currency) => currency.id === id)?.label ?? 'Linh thạch'
const formatAmount = (value) => Number(value || 0).toLocaleString('vi-VN')

export function mountMerchantScreen() {
  const root = document.getElementById('content-root')
  if (!root) return
  const tabs = Array.from(root.querySelectorAll('[data-tab]'))
  const categoryButtons = Array.from(root.querySelectorAll('[data-category]'))
  const pagination = root.querySelector('#merchant-pagination')
  const grid = root.querySelector('#merchant-item-grid')
  const pageLabel = root.querySelector('#merchant-current-page')
  const modeLabel = root.querySelector('#merchant-mode-label')
  const tooltip = root.querySelector('#merchant-tooltip')
  let mode = 'mua'
  let page = 1
  let category = CATEGORIES[0]

  const closeTooltip = () => {
    tooltip.classList.remove('is-open')
    tooltip.setAttribute('aria-hidden', 'true')
  }

  const positionTooltip = (event) => {
    const pad = 12
    const rect = tooltip.getBoundingClientRect()
    let left = event.clientX + 14
    let top = event.clientY + 14
    if (left + rect.width > window.innerWidth - pad) left = event.clientX - rect.width - 14
    if (top + rect.height > window.innerHeight - pad) top = event.clientY - rect.height - 14
    tooltip.style.left = `${Math.max(pad, left)}px`
    tooltip.style.top = `${Math.max(pad, top)}px`
  }

  const showTooltip = (button, event) => {
    const data = button.dataset
    const action = mode === 'mua' ? 'MUA' : 'BÁN'
    const basePrice = Number(data.price) || 0
    if (mode === 'mua') {
      tooltip.innerHTML = `<div class="merchant-tooltip-title">${data.name}</div><div class="merchant-tooltip-meta">${data.category} · Lv${data.level} · ${data.quality}</div><div class="merchant-tooltip-price">Giá mua: <b>${formatAmount(basePrice)} Linh thạch</b></div><div class="merchant-tooltip-actions"><button type="button" class="merchant-tooltip-action" data-merchant-action="MUA">MUA</button></div>`
    } else {
      const minPrice = Math.max(1, Math.floor(basePrice * 0.9))
      const maxPrice = Math.ceil(basePrice * 1.1)
      tooltip.innerHTML = `<div class="merchant-tooltip-title">${data.name}</div><div class="merchant-tooltip-meta">${data.category} · Lv${data.level} · ${data.quality}</div><div class="merchant-tooltip-price"><div>Giá trị cơ sở: <b>${formatAmount(basePrice)} Linh thạch</b></div><div class="merchant-bot-range">BOT có thể mua: <b>${formatAmount(minPrice)}–${formatAmount(maxPrice)}</b> Linh thạch</div></div><div class="merchant-sell-form"><label for="merchant-currency">Loại tiền</label><select id="merchant-currency" class="merchant-currency-select">${CURRENCIES.map((currency) => `<option value="${currency.id}">${currency.label}</option>`).join('')}</select><label for="merchant-price-input">Giá muốn bán</label><input id="merchant-price-input" class="merchant-price-input" type="text" inputmode="numeric" autocomplete="off" maxlength="12" placeholder="Nhập số..."/><div class="merchant-price-hint">Chọn loại tiền rồi tự nhập số lượng. Giá không được vượt quá ±10% giá trị cơ sở.</div><div class="merchant-price-status" id="merchant-price-status">Chưa nhập giá.</div></div><div class="merchant-tooltip-actions"><button type="button" class="merchant-tooltip-action" data-merchant-action="BÁN" disabled>ĐĂNG BÁN</button></div>`
      const input = tooltip.querySelector('#merchant-price-input')
      const select = tooltip.querySelector('#merchant-currency')
      const status = tooltip.querySelector('#merchant-price-status')
      const sellButton = tooltip.querySelector('[data-merchant-action]')
      const validate = () => {
        input.value = input.value.replace(/[^0-9]/g, '').slice(0, 12)
        const value = Number(input.value)
        const valid = Number.isFinite(value) && value >= minPrice && value <= maxPrice
        sellButton.disabled = !valid
        if (!input.value) {
          status.textContent = 'Chưa nhập giá.'
          status.className = 'merchant-price-status'
        } else if (valid) {
          status.textContent = `Giá hợp lệ: ${formatAmount(value)} ${currencyLabel(select.value)}`
          status.className = 'merchant-price-status valid'
        } else {
          status.textContent = `Giá không hợp lệ. BOT chỉ mua trong khoảng ${formatAmount(minPrice)}–${formatAmount(maxPrice)} Linh thạch.`
          status.className = 'merchant-price-status invalid'
        }
      }
      input.addEventListener('input', validate)
      select.addEventListener('change', validate)
      sellButton.addEventListener('click', () => {
        const value = Number(input.value)
        if (value < minPrice || value > maxPrice) return
        window.dispatchEvent(new CustomEvent('game:log', { detail: { message: `Đăng bán ${data.name} với giá ${formatAmount(value)} ${currencyLabel(select.value)}.`, type: 'item' } }))
        closeTooltip()
      })
    }
    tooltip.classList.add('is-open')
    tooltip.setAttribute('aria-hidden', 'false')
    positionTooltip(event)
    tooltip.querySelector('[data-merchant-action]')?.addEventListener('click', () => {
      if (mode === 'mua') {
        window.dispatchEvent(new CustomEvent('game:log', { detail: { message: `MUA ${data.name} tại Thương Hội.`, type: 'item' } }))
        closeTooltip()
      }
    })
  }

  const render = () => {
    grid.innerHTML = renderItems(mode, page, category)
    pageLabel.textContent = page
    modeLabel.textContent = mode === 'mua' ? 'Hàng của Thương Hội' : 'Vật phẩm của nhân vật'
    grid.querySelectorAll('.merchant-item-slot').forEach((button) => button.addEventListener('click', (event) => showTooltip(button, event)))
    pagination.querySelectorAll('.merchant-page-btn').forEach((button) => button.classList.toggle('active', Number(button.dataset.page) === page))
  }

  const setMode = (nextMode) => {
    mode = nextMode
    page = 1
    tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === mode))
    closeTooltip()
    render()
  }

  const setCategory = (nextCategory) => {
    category = nextCategory
    page = 1
    categoryButtons.forEach((button) => button.classList.toggle('active', button.dataset.category === category))
    closeTooltip()
    render()
  }

  tabs.forEach((tab) => tab.addEventListener('click', () => setMode(tab.dataset.tab)))
  categoryButtons.forEach((button) => button.addEventListener('click', () => setCategory(button.dataset.category)))
  pagination.querySelectorAll('.merchant-page-btn').forEach((button) => button.addEventListener('click', () => { page = Number(button.dataset.page); closeTooltip(); render() }))
  document.addEventListener('click', (event) => { if (!event.target.closest('.merchant-item-slot, .merchant-tooltip')) closeTooltip() })
  render()
}
