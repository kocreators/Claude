import { getPayload } from 'payload'
import config from '@payload-config'

// Creates the /team-sports page.
//
// Run with:  npx tsx src/lib/createTeamSportsPage.ts
//            npx tsx src/lib/createTeamSportsPage.ts --force   (replace an existing one)
//
// Mirrors the Brand Stores page block-for-block (hero, brand logos, the store
// walkthrough, feature list, pricing, testimonial, contact form) with the copy
// rewritten for teams, clubs, schools and leagues.
//
// Safe to re-run: it stops if a `team-sports` page already exists, unless
// --force is passed.

// The logo strip is the athletic slice of the brand wall on the Custom Apparel
// service page, reusing the same media records by ID — nothing to re-upload.
//
// This replaces the "Clients Served" block from Brand Stores on purpose: a
// coach or athletic director reading a page of corporate hospitality logos
// concludes this is a corporate shop. Showing the brands you can actually get
// answers the question they came with, and backs up the "Buy The Brands You
// Love" claim further down the page, which is otherwise unsupported.
const SPORTS_BRANDS: Array<{ name: string; logo: number }> = [
  { name: 'Nike', logo: 43 },
  { name: 'Champion', logo: 45 },
  { name: 'Richardson', logo: 53 },
  { name: 'The North Face', logo: 54 },
  { name: 'TravisMathew', logo: 55 },
  { name: 'Adidas', logo: 57 },
  { name: 'Badger Sport', logo: 58 },
  { name: 'Columbia', logo: 59 },
  { name: 'Under Armour', logo: 63 },
  { name: 'New Era', logo: 70 },
  { name: 'Russell Athletic', logo: 67 },
  { name: 'Holloway', logo: 61 },
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
    heading: 'Brands We Carry',
    // scale 1 matches how these same logos render on the Custom Apparel page;
    // the 1.75 used on Brand Stores was tuned for the bigger client wordmarks.
    logoScale: 1,
    logos: SPORTS_BRANDS,
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
