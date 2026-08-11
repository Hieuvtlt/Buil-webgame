import { player, addFreeAttributePoints, getPlayerStats, getMaxSkillLevel } from '../../data/character.js'

export function mountCharacterScreen() {
  const equipGrid = document.getElementById('equip-grid')
  const inventoryGrid = document.getElementById('inventory-grid')

  document.querySelectorAll('.attr-add-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const attribute = button.dataset.attribute
      if (!addFreeAttributePoints(attribute, 1)) return
      const stats = getPlayerStats()
      const row = button.closest('.attr-item')
      if (row) row.querySelector('b').textContent = player.attributes[attribute]
      const points = document.getElementById('free-points-value')
      if (points) points.textContent = player.freePoints
      const values = document.querySelectorAll('.char-stat-list b')
      if (values[0]) values[0].textContent = stats.maxHp
      if (values[1]) values[1].textContent = stats.maxMp
      if (values[2]) values[2].textContent = `${stats.attackMin} - ${stats.attackMax}`
      if (values[3]) values[3].textContent = stats.defense
      if (values[4]) values[4].textContent = stats.accuracy
      if (values[5]) values[5].textContent = stats.dodge
      if (values[6]) values[6].textContent = getMaxSkillLevel()
    })
  })

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

  document.getElementById('btn-equip')?.addEventListener('click', () => {
    if (selectedEquipIndex === null || selectedInvIndex === null) return
    const equip = equipGrid.querySelector(`[data-slot-index="${selectedEquipIndex}"]`)
    const inv = inventoryGrid.querySelector(`[data-inv-index="${selectedInvIndex}"]`)
    if (!equip || !inv || inv.dataset.hasItem !== 'true') return
    equip.dataset.hasItem = 'true'
    inv.dataset.hasItem = 'false'
    refresh()
  })

  document.getElementById('btn-unequip')?.addEventListener('click', () => {
    if (selectedEquipIndex === null) return
    const equip = equipGrid.querySelector(`[data-slot-index="${selectedEquipIndex}"]`)
    if (!equip || equip.dataset.hasItem !== 'true') return
    equip.dataset.hasItem = 'false'
    refresh()
  })

  refresh()
}
