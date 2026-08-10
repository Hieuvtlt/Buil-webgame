export function mountCharacterScreen() {
  const equipGrid = document.getElementById('equip-grid')
  const inventoryGrid = document.getElementById('inventory-grid')
  const btnEquip = document.getElementById('btn-equip')
  const btnUnequip = document.getElementById('btn-unequip')

  if (!equipGrid || !inventoryGrid) return

  let selectedEquipIndex = null
  let selectedInvIndex = null

  const refresh = () => {
    equipGrid.querySelectorAll('.equip-slot').forEach((btn) => {
      const hasItem = btn.dataset.hasItem === 'true'
      btn.textContent = `Slot ${Number(btn.dataset.slotIndex) + 1}: ${hasItem ? 'Có item' : 'Trống'}`
    })
    inventoryGrid.querySelectorAll('.inv-slot').forEach((btn) => {
      const hasItem = btn.dataset.hasItem === 'true'
      btn.textContent = `Slot ${Number(btn.dataset.invIndex) + 1}: ${hasItem ? 'Có item' : 'Trống'}`
    })
  }

  equipGrid.querySelectorAll('.equip-slot').forEach((btn) => {
    btn.addEventListener('click', () => {
      equipGrid.querySelectorAll('.equip-slot').forEach((b) => b.classList.remove('is-selected'))
      btn.classList.add('is-selected')
      selectedEquipIndex = Number(btn.dataset.slotIndex)
    })
  })

  inventoryGrid.querySelectorAll('.inv-slot').forEach((btn) => {
    btn.addEventListener('click', () => {
      inventoryGrid.querySelectorAll('.inv-slot').forEach((b) => b.classList.remove('is-selected'))
      btn.classList.add('is-selected')
      selectedInvIndex = Number(btn.dataset.invIndex)
    })
  })

  btnEquip?.addEventListener('click', () => {
    if (selectedEquipIndex === null || selectedInvIndex === null) return
    const equip = equipGrid.querySelector(`[data-slot-index="${selectedEquipIndex}"]`)
    const inv = inventoryGrid.querySelector(`[data-inv-index="${selectedInvIndex}"]`)
    if (!equip || !inv || inv.dataset.hasItem !== 'true') return
    equip.dataset.hasItem = 'true'
    inv.dataset.hasItem = 'false'
    refresh()
  })

  btnUnequip?.addEventListener('click', () => {
    if (selectedEquipIndex === null) return
    const equip = equipGrid.querySelector(`[data-slot-index="${selectedEquipIndex}"]`)
    if (!equip || equip.dataset.hasItem !== 'true') return
    equip.dataset.hasItem = 'false'
    refresh()
  })

  const firstEquip = equipGrid.querySelector('.equip-slot')
  const firstInv = inventoryGrid.querySelector('.inv-slot')
  if (firstEquip) firstEquip.click()
  if (firstInv) firstInv.click()
  refresh()
}
