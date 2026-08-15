/* World/combat continuity patch.
   WorldMapExplorer currently removes its DOM root just before dispatching game:start-combat.
   Keep the last explorer root alive so the combat battlefield can use the same map as its backdrop. */
(() => {
  let lastExplorerRoot = null
  let observer = null

  const remember = () => {
    const root = document.querySelector('#world-explorer-root')
    if (root) lastExplorerRoot = root
  }

  const restore = () => {
    if (!lastExplorerRoot) return
    if (!document.body.contains(lastExplorerRoot)) document.body.appendChild(lastExplorerRoot)
  }

  const boot = () => {
    remember()
    observer = new MutationObserver(remember)
    observer.observe(document.body, { childList: true, subtree: true })

    window.addEventListener('game:start-combat', () => {
      // SquareCombatController is already mounted and handles the combat itself.
      // We only restore the map backdrop after WorldMapExplorer has detached it.
      requestAnimationFrame(restore)
    })

    window.addEventListener('game:combat-closed', () => {
      // If combat ended normally, continue exploration from the same location.
      requestAnimationFrame(() => {
        if (lastExplorerRoot && document.body.contains(lastExplorerRoot)) {
          const field = lastExplorerRoot.querySelector('#world-field')
          if (field) field.classList.remove('world-combat-paused')
        }
      })
    })
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true })
  else boot()
})()
