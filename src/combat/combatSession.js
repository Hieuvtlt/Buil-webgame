let activeMap = null
let activeEngine = null

export function setActiveCombatMap(map) { activeMap = map }
export function getActiveCombatMap() { return activeMap }
export function setActiveCombatEngine(engine) { activeEngine = engine }
export function getActiveCombatEngine() { return activeEngine }
export function clearCombatSession() { activeEngine?.stop?.(); activeEngine = null; activeMap = null }
