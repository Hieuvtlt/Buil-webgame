/* World/combat continuity patch.
   WorldMapExplorer removes its DOM root just before dispatching game:start-combat.
   Keep the last explorer root alive so combat can use the same map as its backdrop. */
(() => {
  let lastExplorerRoot = null

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
    const observer = new MutationObserver(remember)
    observer.observe(document.body, { childList: true, subtree: true })

    window.addEventListener('game:start-combat', () => {
      requestAnimationFrame(restore)
    })

    window.addEventListener('game:combat-closed', () => {
      requestAnimationFrame(remember)
    })
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true })
  else boot()
})()
