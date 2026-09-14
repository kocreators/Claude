import { getPayload } from 'payload'
import config from '@payload-config'

// Creates the /team-sports page.
//
// Run with:  npx tsx src/lib/createTeamSportsPage.ts
//
// Mirrors the Brand Stores page block-for-block (hero, trusted brands, the
// store walkthrough, feature list, pricing, testimonial, contact form) with
// the copy rewritten for teams, clubs, schools and leagues.
//
// Safe to re-run: it checks for an existing `team-sports` page first and
// stops rather than creating a duplicate. Pass --force to replace the layout
// of the existing page instead.
//
// Media is reused by ID from the Brand Stores page — the store mockups (20,
// 22) and the client logos. Swap those in the admin for sports-specific
// artwork when you have it.

const CLIENT_LOGOS: Array<{ name: string; logo: number }> = [
  { name: 'Apple', logo: 104 },
  { name: 'Marriott', logo: 105 },
  { name: 'Hilton', logo: 106 },
  { name: 'Holiday Inn', logo: 107 },
  { name: 'Grant Cardone Enterprises', logo: 92 },
  { name: 'Dr Pepper Keurig', logo: 93 },
  { name: 'Avantor', logo: 94 },
  { name: "Pickleman's Gourmet Cafe", logo: 102 },
  { name: "Groucho's Deli", logo: 110 },
  { name: 'Dog Training Elite', logo: 96 },
  { name: 'LIVE Hydration Spa', logo: 97 },
  { name: 'Stretch-n-Grow', logo: 98 },
  { name: 'CCV', logo: 109 },
  { name: 'Streamline Brands', logo: 100 },
  { name: 'Snip-its', logo: 101 },
  { name: 'CRU', logo: 103 },
]

const layout: any[] = [
  {
    blockType: 'hero',
    headline: 'Your Team Store.\nWithout the Headaches.',
    subhead:
      'A custom online store for your players, parents, and fans — built and run by us.',
  },
  {
    blockType: 'trustedBrands',
    heading: 'Clients Served',
    logoScale: 1.75,
    logos: CLIENT_LOGOS,
  },
  {
    blockType: 'companyStores',
    kicker: 'How It Works',
    heading: 'One Store.\nEvery Order Handled.',
    body:
      'From storefront design to individual fulfillment, we run the parts of a team store that usually fall on a coach or a team parent.',
    storeMockupImage: 20,
    storeMockupMobileImage: 22,
    capabilities: [
      { label: 'Custom team storefront' },
      { label: 'Player & parent ordering' },
      { label: 'Fan & spirit wear' },
      { label: 'Fundraising stores' },
      { label: 'Name & number personalization' },
      { label: 'Inventory management' },
      { label: 'Made-to-order products' },
      { label: 'Bulk inventory & warehousing' },
      { label: 'Individual fulfillment' },
      { label: 'Nationwide shipping' },
    ],
    cta: { type: 'custom', label: 'Start a Project', url: '/start', newTab: false },
    previewCta: {
      type: 'custom',
      label: 'Preview a Live Team Store',
      url: 'https://kocreators.shop/dogtrainingelite',
      newTab: true,
    },
  },
  {
    blockType: 'iconFeatures',
    items: [
      {
        label: 'No Minimums',
        description:
          'New player joins mid-season? We can print and ship a single jersey. No problemo.',
      },
      {
        label: 'Quick Turnaround Times',
        description:
          "Season starts when it starts. We'll produce your custom gear in about 7-10 days. Need it before the opener? Ask about our inventory & fulfillment services.",
      },
      {
        label: 'Buy The Brands You Love',
        description:
          "Why settle for brands nobody wants to wear? We've got wholesale relationships with the top athletic brands, so your team looks and feels the part.",
      },
      {
        label: 'Legendary Customer Service',
        description:
          "We're obsessed with customer satisfaction. We've been caught texting back at midnight with updates about your order. That's our guarantee!",
      },
    ],
  },
  {
    blockType: 'pricingTiers',
    heading: 'Plans',
    tiers: [
      {
        name: 'Basic Version',
        description: 'Limited to 10 Products',
        priceLabel: 'Free',
        cta: { type: 'custom', label: 'Sign Up Now', url: '/store-signup?plan=basic', newTab: false },
      },
      {
        name: 'Pro Version',
        description: 'Unlimited Categories & SKUs',
        priceLabel: '$249',
        cta: { type: 'custom', label: 'Buy The Pro Version', url: '/store-signup?plan=pro', newTab: false },
      },
    ],
  },
  {
    blockType: 'testimonials',
    heading: '',
    items: [16],
  },
  {
    blockType: 'contactForm',
    heading: "Let's Get In Touch!",
    subhead: 'Our team is ready to answer your questions.',
    formType: 'contact',
  },
]

const data = {
  title: 'Team Sports',
  slug: 'team-sports',
  meta: {
    title: 'Team Sports Stores',
    description:
      'Custom online team stores for clubs, schools, and leagues — uniforms, spirit wear, and fan gear, designed, produced, and shipped by Kocreators.',
  },
  layout,
  _status: 'published',
}

async function run() {
  const force = process.argv.includes('--force')
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'team-sports' } },
    limit: 1,
  })

  if (existing.docs.length && !force) {
    console.log(
      `A "team-sports" page already exists (id ${existing.docs[0].id}). ` +
        'Nothing changed. Re-run with --force to overwrite its layout.',
    )
    process.exit(0)
  }

  if (existing.docs.length) {
    const id = existing.docs[0].id
    await payload.update({ collection: 'pages', id, data: data as any })
    console.log(`Updated existing page id ${id} → /team-sports`)
  } else {
    const created = await payload.create({ collection: 'pages', data: data as any })
    console.log(`Created page id ${created.id} → /team-sports`)
  }

  console.log('Visit /team-sports to see it. Add it to the header nav in Globals → Header.')
  process.exit(0)
}

run().catch((err) => {
  console.error('Failed to create the Team Sports page:', err)
  process.exit(1)
})
