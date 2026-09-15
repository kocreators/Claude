import path from 'path'
import fs from 'fs'
import { getPayload } from 'payload'
import config from '@payload-config'

// Replaces the image file on all 27 brand logo media records with normalized
// versions, so the brand walls read as one row instead of 27 different sizes.
//
// Run with:  npx tsx src/lib/replaceBrandLogos.ts --dry-run
//            npx tsx src/lib/replaceBrandLogos.ts
//
// What was wrong with the originals:
//  - every logo was a different resolution, several far too small to render
//    sharply (Champion 176x32, Columbia 160x29, Port & Company 142x18 — well
//    under the ~280x80 a retina screen needs for the 140x40 slot)
//  - the artwork inside each file carried inconsistent padding, so identical
//    boxes produced wildly different apparent sizes (Holloway's ink filled
//    28% of its canvas; Columbia's filled 100%)
//  - Badger shipped white-on-transparent, invisible on a light background
//
// Each replacement is rendered from the SVG master in scratchpad-brand-logos
// where one exists (17 of 27), trimmed to the ink, scaled to equal optical
// AREA — the standard way to balance a logo row — and centered on an identical
// 560x160 transparent canvas (4x the 140x40 display box).
//
// These records back both the Custom Apparel brand wall and the Team Sports
// logo strip, so both pick this up.
//
// The source artwork stays in scratchpad-brand-logos/, so this is reversible.

const DIR = path.resolve(process.cwd(), 'scratchpad-brand-logos/normalized')

// Still upscaled from small rasters with no vector master — better than
// before, but genuinely crisp versions need vector art from the brand.
const SOFT = new Set(['port-and-company', 'jerzees', 'holloway', 'j-america', 'russell-athletic'])

const REPLACEMENTS: Array<{ id: number; name: string; file: string }> = [
  { id: 43, name: 'Nike', file: 'nike.png' },
  { id: 44, name: 'Brooks Brothers', file: 'brooks-brothers.png' },
  { id: 45, name: 'Champion', file: 'champion.png' },
  { id: 46, name: 'Gildan', file: 'gildan.png' },
  { id: 47, name: 'BELLA+CANVAS', file: 'bella-canvas.png' },
  { id: 48, name: 'Carhartt', file: 'carhartt.png' },
  { id: 49, name: 'Comfort Colors', file: 'comfort-colors.png' },
  { id: 50, name: 'Next Level Apparel', file: 'next-level.png' },
  { id: 51, name: 'Ogio', file: 'ogio.png' },
  { id: 52, name: 'Jerzees', file: 'jerzees.png' },
  { id: 53, name: 'Richardson', file: 'richardson.png' },
  { id: 54, name: 'The North Face', file: 'north-face.png' },
  { id: 55, name: 'TravisMathew', file: 'travismathew.png' },
  { id: 56, name: 'Tommy Bahama', file: 'tommy-bahama.png' },
  { id: 57, name: 'Adidas', file: 'adidas.png' },
  { id: 58, name: 'Badger Sport', file: 'badger.png' },
  { id: 59, name: 'Columbia', file: 'columbia.png' },
  { id: 60, name: 'Hanes', file: 'hanes.png' },
  { id: 61, name: 'Holloway', file: 'holloway.png' },
  { id: 62, name: 'Independent Trading Co', file: 'independent-trading-co.png' },
  { id: 63, name: 'Under Armour', file: 'under-armour.png' },
  { id: 64, name: 'Eddie Bauer', file: 'eddie-bauer.png' },
  { id: 66, name: 'Port & Company', file: 'port-and-company.png' },
  { id: 67, name: 'Russell Athletic', file: 'russell-athletic.png' },
  { id: 68, name: 'American Apparel', file: 'american-apparel.png' },
  { id: 69, name: 'J. America', file: 'j-america.png' },
  { id: 70, name: 'New Era', file: 'new-era.png' },
]

async function run() {
  const dryRun = process.argv.includes('--dry-run')

  const missing = REPLACEMENTS.filter((r) => !fs.existsSync(path.join(DIR, r.file)))
  if (missing.length) {
    console.error(`Missing files in ${DIR}:`)
    missing.forEach((m) => console.error(`  - ${m.file}`))
    process.exit(1)
  }

  if (dryRun) {
    console.log(`Dry run — would replace ${REPLACEMENTS.length} logos from ${DIR}:\n`)
    REPLACEMENTS.forEach((r) => {
      const soft = SOFT.has(r.file.replace('.png', '')) ? '   (upscaled from a small raster)' : ''
      console.log(`  media ${String(r.id).padEnd(3)} ${r.name.padEnd(24)}<- ${r.file}${soft}`)
    })
    process.exit(0)
  }

  const payload = await getPayload({ config })
  let ok = 0
  const failed: string[] = []

  for (const r of REPLACEMENTS) {
    try {
      await payload.update({
        collection: 'media',
        id: r.id,
        data: { alt: r.name },
        filePath: path.join(DIR, r.file),
      } as any)
      console.log(`✓ media ${String(r.id).padEnd(3)} ${r.name}`)
      ok++
    } catch (err) {
      console.error(`✗ media ${String(r.id).padEnd(3)} ${r.name}:`, (err as Error).message)
      failed.push(r.name)
    }
  }

  console.log(`\n${ok}/${REPLACEMENTS.length} replaced.`)
  if (failed.length) console.log('Failed:', failed.join(', '))
  console.log('Next.js caches optimized images — hard-refresh, and give it a minute or redeploy.')
  process.exit(failed.length ? 1 : 0)
}

run().catch((err) => {
  console.error('Failed to replace brand logos:', err)
  process.exit(1)
})
