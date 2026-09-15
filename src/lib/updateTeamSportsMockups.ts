import path from 'path'
import fs from 'fs'
import { getPayload } from 'payload'
import config from '@payload-config'

// Points the Team Sports store walkthrough at the Juanita Wrestling store:
// new desktop + mobile screenshots, and the preview button linking to it.
//
// Run with:  NODE_ENV=production npx tsx --env-file=.env.local src/lib/updateTeamSportsMockups.ts
//
// NODE_ENV=production matters: without it Payload's Postgres adapter starts in
// dev mode and offers to push schema, which on this shared database means
// offering to drop the devboard tables. Always run these scripts with it set.
//
// This creates NEW media records rather than overwriting 20 and 22. Those two
// are the Dog Training Elite screenshots, and the Brand Stores page still uses
// them — replacing them would put a wrestling store on the brand stores page.
//
// Safe to re-run: it looks for media it has already created by filename and
// reuses them instead of piling up duplicates.

const DIR = path.resolve(process.cwd(), 'scratchpad-team-sports')

const ASSETS = [
  { file: 'juanita-store-desktop.webp', alt: 'Juanita Wrestling team store on desktop' },
  { file: 'juanita-store-mobile.webp', alt: 'Juanita Wrestling team store on mobile' },
]

const PREVIEW_URL = 'https://kocreators.shop/juanitawrestling'

async function findOrCreateMedia(payload: any, file: string, alt: string) {
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: file } },
    limit: 1,
  })
  if (existing.docs.length) {
    const id = existing.docs[0].id
    await payload.update({
      collection: 'media',
      id,
      data: { alt },
      filePath: path.join(DIR, file),
    })
    console.log(`  reused media ${id}  ${file}`)
    return id
  }
  const created = await payload.create({
    collection: 'media',
    data: { alt },
    filePath: path.join(DIR, file),
  })
  console.log(`  created media ${created.id}  ${file}`)
  return created.id
}

async function run() {
  const missing = ASSETS.filter((a) => !fs.existsSync(path.join(DIR, a.file)))
  if (missing.length) {
    console.error(`Missing files in ${DIR}:`)
    missing.forEach((m) => console.error(`  - ${m.file}`))
    process.exit(1)
  }

  const payload = await getPayload({ config })

  console.log('Uploading mockups...')
  const desktopId = await findOrCreateMedia(payload, ASSETS[0].file, ASSETS[0].alt)
  const mobileId = await findOrCreateMedia(payload, ASSETS[1].file, ASSETS[1].alt)

  const page = (
    await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'team-sports' } },
      limit: 1,
      depth: 0,
    })
  ).docs[0]

  if (!page) {
    console.error('No page with slug "team-sports". Run createTeamSportsPage.ts first.')
    process.exit(1)
  }

  let touched = 0
  const layout = (page.layout as any[]).map((block) => {
    if (block.blockType !== 'companyStores') return block
    touched++
    return {
      ...block,
      storeMockupImage: desktopId,
      storeMockupMobileImage: mobileId,
      previewCta: {
        ...(block.previewCta || {}),
        type: 'custom',
        label: 'Preview a Live Team Store',
        url: PREVIEW_URL,
        newTab: true,
      },
    }
  })

  if (!touched) {
    console.error('No companyStores block found on the Team Sports page — nothing updated.')
    process.exit(1)
  }

  await payload.update({ collection: 'pages', id: page.id, data: { layout } as any })

  console.log(`\nUpdated page ${page.id} (/team-sports)`)
  console.log(`  desktop mockup -> media ${desktopId}`)
  console.log(`  mobile mockup  -> media ${mobileId}`)
  console.log(`  preview button -> ${PREVIEW_URL} (new tab)`)
  console.log('\nBrand Stores is untouched — it still uses media 20 and 22.')
  process.exit(0)
}

run().catch((err) => {
  console.error('Failed to update the Team Sports mockups:', err)
  process.exit(1)
})
