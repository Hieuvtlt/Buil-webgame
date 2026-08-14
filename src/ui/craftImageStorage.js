const DB_NAME = 'vltk-game-storage'
const STORE_NAME = 'craft-images'
const DB_VERSION = 1

function openDb() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB is not supported'))
      return
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('Cannot open image database'))
  })
}

export async function saveCraftImage(key, file) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(file, key)
    tx.oncomplete = () => {
      db.close()
      resolve(true)
    }
    tx.onerror = () => {
      db.close()
      reject(tx.error || new Error('Cannot save craft image'))
    }
  })
}

export async function loadCraftImage(key) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const request = tx.objectStore(STORE_NAME).get(key)
    request.onsuccess = () => {
      const value = request.result
      db.close()
      resolve(value || null)
    }
    request.onerror = () => {
      db.close()
      reject(request.error || new Error('Cannot load craft image'))
    }
  })
}

export async function deleteCraftImage(key) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(key)
    tx.oncomplete = () => {
      db.close()
      resolve(true)
    }
    tx.onerror = () => {
      db.close()
      reject(tx.error || new Error('Cannot delete craft image'))
    }
  })
}

export async function setupPersistentCraftImage(root) {
  const slot = root?.querySelector('[data-image-slot]')
  if (!slot) return

  const key = slot.dataset.imageSlot
  if (!key) return

  const render = (blob) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.hidden = true
    input.className = 'craft-image-input'
    input.dataset.imageInput = ''

    if (blob) {
      const img = document.createElement('img')
      img.className = 'craft-machine-art'
      img.src = URL.createObjectURL(blob)
      img.alt = key
      slot.replaceChildren(input, img)
    } else {
      const placeholder = document.createElement('div')
      placeholder.className = 'craft-machine-placeholder'
      placeholder.textContent = 'THAY HÌNH'
      slot.replaceChildren(input, placeholder)
    }
  }

  slot.addEventListener('click', (event) => {
    if (event.target?.matches('[data-image-input]')) return
    slot.querySelector('[data-image-input]')?.click()
  })

  slot.addEventListener('change', async (event) => {
    const input = event.target
    if (!input?.matches('[data-image-input]')) return
    const file = input.files?.[0]
    if (!file) return
    try {
      await saveCraftImage(key, file)
      render(file)
    } catch (error) {
      console.error('[CraftImageStorage] Không thể lưu hình:', error)
    }
  })

  render(null)
  try {
    const saved = await loadCraftImage(key)
    if (saved) render(saved)
  } catch (error) {
    console.error('[CraftImageStorage] Không thể khôi phục hình:', error)
  }
}
