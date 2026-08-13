import { CharacterScreen } from '../screens/CharacterScreen.js'
import {
  player,
  addFreeAttributePoints,
  unequipItem,
} from '../../data/character.js'

const CHARACTER_IMAGE_KEY = 'game-character-image'

function rerenderCharacter() {
  const root = document.getElementById('content-root')
  if (!root) return
  root.innerHTML = CharacterScreen()
  mountCharacterScreen()
}

function saveCharacterImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Không thể đọc ảnh.'))
    reader.onload = () => {
      const image = new Image()
      image.onload = () => {
        try {
          const maxSize = 800
          const scale = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight))
          const width = Math.max(1, Math.round(image.naturalWidth * scale))
          const height = Math.max(1, Math.round(image.naturalHeight * scale))
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const context = canvas.getContext('2d')
          context.clearRect(0, 0, width, height)
          context.drawImage(image, 0, 0, width, height)
          const dataUrl = canvas.toDataURL('image/webp', 0.9)
          localStorage.setItem(CHARACTER_IMAGE_KEY, dataUrl)
          resolve(dataUrl)
        } catch (error) {
          reject(error)
        }
      }
      image.onerror = () => reject(new Error('File không phải ảnh hợp lệ.'))
      image.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export function mountCharacterScreen() {
  document.querySelectorAll('.attr-add-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const attribute = button.dataset.attribute
      if (!addFreeAttributePoints(attribute, 1)) return
      rerenderCharacter()
    })
  })

  let selectedEquipSlot = null
  const equipSlots = document.querySelectorAll('.character-equip-slot-v2')

  equipSlots.forEach((btn) => {
    btn.addEventListener('click', () => {
      equipSlots.forEach((b) => b.classList.remove('is-selected'))
      btn.classList.add('is-selected')
      selectedEquipSlot = btn.dataset.slotId
    })
  })

  document.getElementById('btn-unequip')?.addEventListener('click', () => {
    if (selectedEquipSlot === null) return
    if (!unequipItem(selectedEquipSlot)) return
    rerenderCharacter()
    window.dispatchEvent(new CustomEvent('game:inventory-changed'))
  })

  const imageInput = document.getElementById('character-image-input')
  const changeButton = document.getElementById('btn-change-character-image')
  const resetButton = document.getElementById('btn-reset-character-image')

  changeButton?.addEventListener('click', () => {
    imageInput?.click()
  })

  imageInput?.addEventListener('change', async () => {
    const file = imageInput.files?.[0]
    imageInput.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      window.dispatchEvent(new CustomEvent('game:log', { detail: { message: 'Vui lòng chọn một file hình ảnh.', type: 'warning' } }))
      return
    }

    try {
      const dataUrl = await saveCharacterImage(file)
      const mainImage = document.getElementById('character-main-image')
      if (mainImage) mainImage.src = dataUrl
      window.dispatchEvent(new CustomEvent('game:character-image-changed', { detail: { src: dataUrl } }))
      window.dispatchEvent(new CustomEvent('game:log', { detail: { message: 'Đã thay hình nhân vật.', type: 'item' } }))
    } catch {
      window.dispatchEvent(new CustomEvent('game:log', { detail: { message: 'Không thể lưu hình. Hãy thử ảnh khác.', type: 'warning' } }))
    }
  })

  resetButton?.addEventListener('click', () => {
    localStorage.removeItem(CHARACTER_IMAGE_KEY)
    rerenderCharacter()
    window.dispatchEvent(new CustomEvent('game:character-image-changed', { detail: { reset: true } }))
    window.dispatchEvent(new CustomEvent('game:log', { detail: { message: 'Đã khôi phục hình nhân vật mặc định.', type: 'system' } }))
  })
}
