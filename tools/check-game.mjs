import { readdir, readFile } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { spawnSync } from 'node:child_process'

const root = process.cwd()
const failures = []

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...await walk(full))
    else files.push(full)
  }
  return files
}

function checkJavaScript(file) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' })
  if (result.status !== 0) {
    failures.push(`JavaScript syntax error: ${file}\n${result.stderr || result.stdout}`)
  }
}

async function checkJson(file) {
  try {
    JSON.parse(await readFile(file, 'utf8'))
  } catch (error) {
    failures.push(`Invalid JSON: ${file}\n${error.message}`)
  }
}

const files = await walk(root)
for (const file of files) {
  const ext = extname(file)
  if (['.js', '.mjs', '.cjs'].includes(ext)) checkJavaScript(file)
  if (ext === '.json') await checkJson(file)
}

// Verify the actual production bundle as the final pre-deploy gate.
const build = spawnSync('npm', ['run', 'build'], { stdio: 'inherit', shell: process.platform === 'win32' })
if (build.status !== 0) failures.push('Production build failed.')

if (failures.length) {
  console.error('\n=== GAME CHECK FAILED ===\n')
  console.error(failures.join('\n\n'))
  process.exit(1)
}

console.log('\n=== GAME CHECK PASSED ===')
console.log('JavaScript syntax, JSON data and production build are valid.')
