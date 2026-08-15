/* World exploration HUD patch.
   Keeps exploration as the main screen and reshapes the bottom combat bar. */
(() => {
  let lastMessage = ''

  const style = document.createElement('style')
  style.textContent = `
    #world-explorer-root .world-log{display:none!important}
    #world-explorer-root .world-combat-hud{display:none!important}
    #world-explorer-root .world-action-bar{left:12px;right:12px;bottom:10px;min-height:72px;justify-content:center;gap:9px;z-index:80}
    #world-explorer-root .world-action-bar .world-hud{display:flex;align-items:center;width:330px;max-width:none;padding:0 4px;gap:7px;color:#aeb6ae;font-size:10px}
    #world-explorer-root .world-action-bar .world-resource-label{display:flex;justify-content:space-between;gap:4px;min-width:72px;margin:0}
    #world-explorer-root .world-action-bar .world-resource-label strong{color:#ddd}
    #world-explorer-root .world-action-bar .world-player-hp,#world-explorer-root .world-action-bar .world-player-mp{width:92px;height:9px;margin:0;border:1px solid #28372b;background:#050805;overflow:hidden}
    #world-explorer-root .world-action-bar .world-player-hp span,#world-explorer-root .world-action-bar .world-player-mp span{display:block;height:100%;transition:width .18s linear}
    #world-explorer-root .world-action-bar .world-player-hp span{background:linear-gradient(90deg,#a92828,#e24a3c)}
    #world-explorer-root .world-action-bar .world-player-mp span{background:linear-gradient(90deg,#1f70a7,#2da9df)}
    #world-explorer-root .world-damage-float{position:absolute;z-index:70;transform:translate(-50%,-50%);font:900 27px Arial,sans-serif;color:#ff3e3e;text-shadow:2px 2px 0 #260000,0 0 8px rgba(0,0,0,.9);pointer-events:none;animation:world-damage-rise .9s ease-out forwards}
    #world-explorer-root .world-damage-float.player{color:#ffb34c;text-shadow:2px 2px 0 #321400,0 0 8px rgba(0,0,0,.9)}
    @keyframes world-damage-rise{0%{opacity:0;transform:translate(-50%,0) scale(.7)}12%{opacity:1;transform:translate(-50%,-8px) scale(1.12)}100%{opacity:0;transform:translate(-50%,-48px) scale(1)}}
    @media(max-width:1050px){#world-explorer-root .world-action-bar .world-hud{width:270px}.world-action-bar .world-player-hp,.world-action-bar .world-player-mp{width:65px}}
    @media(max-width:700px){#world-explorer-root .world-action-bar{justify-content:flex-start;overflow-x:auto}#world-explorer-root .world-action-bar .world-hud{width:230px;flex:0 0 230px}}
    @media(max-width:600px){#world-explorer-root .world-action-bar .world-hud{width:200px;flex:0 0 200px}.world-action-bar .world-resource-label{min-width:48px;display:block}.world-action-bar .world-player-hp,.world-action-bar .world-player-mp{width:48px}}
  `
  document.head.appendChild(style)

  const enhance = () => {
    const root = document.querySelector('#world-explorer-root')
    if (!root) return
    const actionBar = root.querySelector('#world-action-bar')
    const hud = root.querySelector('.world-hud')
    if (actionBar && hud && hud.parentElement !== actionBar) {
      const auto = root.querySelector('#world-auto-settings')
      actionBar.insertBefore(hud, auto || null)
    }

    const combatHud = root.querySelector('#world-combat-hud')
    const ground = root.querySelector('.world-ground')
    if (!combatHud || !ground) return
    const message = combatHud.querySelector('.world-combat-center span')?.textContent?.trim() || ''
    if (!message || message === lastMessage) return
    lastMessage = message
    const match = message.match(/gây\s+(\d+)\s+sát\s+thương/i)
    if (!match) return

    const amount = match[1]
    const playerHit = /\[Chiến đấu\]/i.test(message)
    const target = playerHit ? root.querySelector('#world-player') : root.querySelector('.world-monster-node.combat-target')
    if (!target) return

    const left = parseFloat(target.style.left || '0')
    const top = parseFloat(target.style.top || '0')
    const float = document.createElement('div')
    float.className = `world-damage-float${playerHit ? ' player' : ''}`
    float.textContent = `-${amount}`
    float.style.left = `${left}px`
    float.style.top = `${top - 30}px`
    ground.appendChild(float)
    setTimeout(() => float.remove(), 950)
  }

  const observer = new MutationObserver(() => requestAnimationFrame(enhance))
  const boot = () => {
    observer.observe(document.body, { childList: true, subtree: true, characterData: true })
    enhance()
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true })
  else boot()
})()
