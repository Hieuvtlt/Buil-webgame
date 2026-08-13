import { mountInventoryScreen as mountInventoryBase } from './InventoryController.js'

const PAGE_SIZE = 10
const PAGE_COUNT = 5

function setupInventoryPagination() {
  const grid = document.getElementById('inventory-screen-grid')
  if (!grid) return

  const slots = Array.from(grid.querySelectorAll('.inv-slot2'))
  const pageButtons = Array.from(document.querySelectorAll('.inventory-page-number'))
  const prevButton = document.querySelector('[data-page-action="prev"]')
  const nextButton = document.querySelector('[data-page-action="next"]')

  if (!slots.length || pageButtons.length === 0) return

  let currentPage = 1

  const renderPage = (page) => {
    currentPage = Math.max(1, Math.min(PAGE_COUNT, page))
    const start = (currentPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE

    slots.forEach((slot, index) => {
      slot.style.display = index >= start && index < end ? '' : 'none'
    })

    pageButtons.forEach((button, index) => {
      button.classList.toggle('active', index + 1 === currentPage)
      button.setAttribute('aria-current', index + 1 === currentPage ? 'page' : 'false')
    })

    if (prevButton) prevButton.disabled = currentPage === 1
    if (nextButton) nextButton.disabled = currentPage === PAGE_COUNT
  }

  pageButtons.slice(0, PAGE_COUNT).forEach((button, index) => {
    button.addEventListener('click', () => renderPage(index + 1))
  })
  prevButton?.addEventListener('click', () => renderPage(currentPage - 1))
  nextButton?.addEventListener('click', () => renderPage(currentPage + 1))

  document.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      requestAnimationFrame(() => renderPage(1))
    })
  })

  document.querySelectorAll('[data-inventory-action="sort"]').forEach((button) => {
    button.addEventListener('click', () => {
      requestAnimationFrame(() => renderPage(currentPage))
    })
  })

  window.addEventListener('game:inventory-changed', () => {
    requestAnimationFrame(() => renderPage(Math.min(currentPage, PAGE_COUNT)))
  })

  renderPage(1)
}

export function mountInventoryScreen() {
  mountInventoryBase()
  setupInventoryPagination()
}
