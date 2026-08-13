const PAGE_SIZE = 10
const PAGE_COUNT = 5
let currentPage = 1
let wiredGrid = null

function wireInventoryPagination() {
  const grid = document.getElementById('inventory-screen-grid')
  if (!grid || grid === wiredGrid) return

  wiredGrid = grid
  currentPage = 1

  const renderPage = (page) => {
    currentPage = Math.max(1, Math.min(PAGE_COUNT, page))
    const slots = Array.from(grid.querySelectorAll('.inv-slot2'))
    const start = (currentPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE

    slots.forEach((slot, index) => {
      slot.style.display = index >= start && index < end ? '' : 'none'
    })

    const pageButtons = Array.from(document.querySelectorAll('.inventory-page-number')).slice(0, PAGE_COUNT)
    pageButtons.forEach((button, index) => {
      const active = index + 1 === currentPage
      button.classList.toggle('active', active)
      button.setAttribute('aria-current', active ? 'page' : 'false')
    })

    const prev = document.querySelector('[data-page-action="prev"]')
    const next = document.querySelector('[data-page-action="next"]')
    if (prev) prev.disabled = currentPage === 1
    if (next) next.disabled = currentPage === PAGE_COUNT
  }

  const pageButtons = Array.from(document.querySelectorAll('.inventory-page-number')).slice(0, PAGE_COUNT)
  pageButtons.forEach((button, index) => {
    button.addEventListener('click', () => renderPage(index + 1))
  })

  document.querySelector('[data-page-action="prev"]')?.addEventListener('click', () => renderPage(currentPage - 1))
  document.querySelector('[data-page-action="next"]')?.addEventListener('click', () => renderPage(currentPage + 1))

  document.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => requestAnimationFrame(() => renderPage(1)))
  })

  document.querySelectorAll('[data-inventory-action="sort"]').forEach((button) => {
    button.addEventListener('click', () => requestAnimationFrame(() => renderPage(currentPage)))
  })

  renderPage(1)
}

const observer = new MutationObserver(() => wireInventoryPagination())
observer.observe(document.body, { childList: true, subtree: true })
wireInventoryPagination()
