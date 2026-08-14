import { CATEGORIES, BUY_ITEMS, SELL_ITEMS, renderItems } from '../screens/ThuongHoiScreen.js'

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

  const showTooltip = (button, event) => {
    const data = button.dataset
    const action = mode === 'mua' ? 'MUA' : 'BÁN'
    tooltip.innerHTML = `<div class="merchant-tooltip-title">${data.name}</div><div class="merchant-tooltip-meta">${data.category} · Lv${data.level} · ${data.quality}</div><div class="merchant-tooltip-price">${mode === 'mua' ? 'Giá mua' : 'Giá bán'}: <b>${Number(data.price).toLocaleString('vi-VN')}</b></div><div class="merchant-tooltip-actions"><button type="button" class="merchant-tooltip-action" data-merchant-action="${action}">${action}</button></div>`
    tooltip.classList.add('is-open')
    tooltip.setAttribute('aria-hidden', 'false')
    const pad = 12
    const rect = tooltip.getBoundingClientRect()
    let left = event.clientX + 14
    let top = event.clientY + 14
    if (left + rect.width > window.innerWidth - pad) left = event.clientX - rect.width - 14
    if (top + rect.height > window.innerHeight - pad) top = event.clientY - rect.height - 14
    tooltip.style.left = `${Math.max(pad, left)}px`
    tooltip.style.top = `${Math.max(pad, top)}px`
    tooltip.querySelector('[data-merchant-action]')?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('game:log', { detail: { message: `${action} ${data.name} tại Thương Hội.`, type: 'item' } }))
      closeTooltip()
    })
  }

  const render = () => {
    grid.innerHTML = renderItems(mode, page, category)
    pageLabel.textContent = page
    modeLabel.textContent = mode === 'mua' ? 'Hàng của Thương Hội' : 'Vật phẩm của nhân vật'
    grid.querySelectorAll('.merchant-item-slot').forEach((button) => button.addEventListener('click', (event) => showTooltip(button, event)))
    pagination.querySelectorAll('.merchant-page-btn').forEach((button) => {
      button.classList.toggle('active', Number(button.dataset.page) === page)
    })
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
  document.addEventListener('click', (event) => { if (!event.target.closest('.merchant-item-slot, .merchant-tooltip')) closeTooltip() }, { once: true })
  render()
}
