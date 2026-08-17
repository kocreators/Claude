import { getPayload } from 'payload'
import config from '@payload-config'

// Run with: npm run seed
// Populates enough starter content (nav, footer, site settings, a handful of
// services, testimonials, and every top-level page) that the site isn't
// blank on first run. Re-run is roughly idempotent for the singletons; it
// will create duplicate Pages/Services if run twice, so guard as needed.
async function seed() {
  const payload = await getPayload({ config })

  console.log('Seeding site settings...')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'Kocreators',
      phone: '(888) 488-5388',
      hours: 'Monday – Friday, 8am – 6pm PST',
      email: 'info@kocreators.com',
      externalShopUrl: 'https://kocreators.com/shop/',
      quoteRequestUrl: 'https://kocreators.com/quoterequest/',
    },
  })

  console.log('Seeding services...')
  const serviceDefs = [
    { title: 'Custom Design', slug: 'custom-design', summary: 'In-house art team turns your logo into a full, printable catalog.' },
    { title: 'Screen Printing', slug: 'screen-printing', summary: 'High-volume, high-quality prints for teams, schools, and events.' },
    { title: 'Headwear', slug: 'headwear', summary: 'Embroidered hats, beanies, and caps built to hold up to game day.' },
    { title: 'Cut & Sew', slug: 'cut-and-sew', summary: 'Fully custom garments built from your spec sheet, not a blank.' },
    { title: 'Accessories', slug: 'accessories', summary: 'Bags, towels, and small goods that round out a team store.' },
    { title: 'Ecomm + Warehousing', slug: 'ecommerce-and-warehousing', summary: 'We store and ship your team store orders so you don\u2019t have to.' },
  ]
  const services = []
  for (const [i, def] of serviceDefs.entries()) {
    const doc = await payload.create({ collection: 'services', data: { ...def, order: i } })
    services.push(doc)
  }

  console.log('Seeding testimonials...')
  const testimonials = []
  const testimonialDefs = [
    { quote: 'Kocreators made outfitting our whole travel league painless \u2014 one point of contact, one deadline, done right.', authorName: 'Dana Ruiz', authorTitle: 'Board Member, Peoria Youth Soccer' },
    { quote: 'We\u2019ve reordered every season for six years. The reorders are as easy as the first order was.', authorName: 'Marcus Webb', authorTitle: 'Owner, Webb & Co.' },
  ]
  for (const def of testimonialDefs) {
    const doc = await payload.create({ collection: 'testimonials', data: def })
    testimonials.push(doc)
  }

  console.log('Seeding header & footer...')
  await payload.updateGlobal({
    slug: 'header',
    data: {
      navItems: [
        { link: { type: 'custom', label: 'About Us', url: '/about' } },
        {
          link: { type: 'custom', label: 'Styles & Brands', url: '/services' },
          subItems: services.map((s) => ({
            link: { type: 'internal', label: s.title, internal: { relationTo: 'services', value: s.id } },
          })),
        },
        { link: { type: 'custom', label: 'Blog', url: '/blog' } },
        { link: { type: 'custom', label: 'Contact Us', url: '/contact' } },
      ],
      quoteCta: { link: { type: 'custom', label: 'Get a Quote', url: 'https://kocreators.com/quoterequest/', newTab: false } },
    },
  })

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      tagline: 'Ordering custom team apparel & merchandise has never been easier.',
      columns: [
        {
          heading: 'Company',
          links: [
            { link: { type: 'custom', label: 'About Us', url: '/about' } },
            { link: { type: 'custom', label: 'Blog', url: '/blog' } },
            { link: { type: 'custom', label: 'Contact Us', url: '/contact' } },
          ],
        },
        {
          heading: 'Services',
          links: services.slice(0, 4).map((s) => ({ link: { type: 'custom', label: s.title, url: `/services/${s.slug}` } })),
        },
      ],
      social: [
        { platform: 'facebook', url: 'https://facebook.com/kocreators' },
        { platform: 'instagram', url: 'https://instagram.com/kocreators' },
      ],
      newsletterEnabled: true,
    },
  })

  console.log('Seeding pages...')

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Home',
      slug: 'home',
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'Custom Team Apparel & Merch',
          headline: 'Ordering Custom Team Apparel Has Never Been Easier.',
          subhead: 'From roster to reorder, we design, print, and ship gear your team actually wants to wear.',
          cta: { link: { type: 'custom', label: 'Get a Quote', url: 'https://kocreators.com/quoterequest/' } },
        },
        {
          blockType: 'servicesGrid',
          heading: 'Customize Your Favorite Brands',
          source: 'collection',
        },
        {
          blockType: 'processSteps',
          heading: 'We Keep It Simple',
          steps: [
            { title: 'Share Your Logo & Brand Assets', description: 'Send your logo, colors, and any brand guidelines you\u2019re working with.' },
            { title: 'We Build Your Custom Catalog', description: 'Our design team mocks up a full lineup across styles, brands, and price points.' },
            { title: 'Order & Receive Damn Good Apparel', description: 'We print, pack, and ship \u2014 as fast as your season needs.' },
          ],
          cta: { link: { type: 'custom', label: 'Get Started', url: 'https://kocreators.com/quoterequest/' } },
        },
        { blockType: 'testimonials', heading: 'What Teams Are Saying', items: testimonials.map((t) => t.id) },
        {
          blockType: 'ctaBanner',
          heading: 'Ready to outfit your team?',
          subhead: 'Get a free quote back within one business day.',
          style: 'dark',
          cta: { link: { type: 'custom', label: 'Get a Quote', url: 'https://kocreators.com/quoterequest/' } },
        },
      ],
    },
  })

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Services',
      slug: 'services',
      layout: [
        { blockType: 'hero', headline: 'Styles & Brands', subhead: 'Every product line we print, embroider, and ship.' },
        { blockType: 'servicesGrid', heading: 'Shop By Style', source: 'collection' },
      ],
    },
  })

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Our Work',
      slug: 'work',
      layout: [
        { blockType: 'hero', headline: 'Our Work', subhead: 'A look at what we\u2019ve printed, stitched, and shipped for teams like yours.' },
        { blockType: 'trustedBrands', heading: 'Brands We Print For', logos: [] },
      ],
    },
  })

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Our Process',
      slug: 'process',
      layout: [
        { blockType: 'hero', headline: 'Our Process', subhead: 'From first sketch to season-ready gear.' },
        {
          blockType: 'processSteps',
          heading: 'How It Works',
          steps: [
            { title: 'Share Your Logo & Brand Assets', description: 'Our design team elevates your brand using your logo, assets, and color palette.' },
            { title: 'We\u2019ll Design a Custom Catalog', description: 'Collaborate with our design and merchandising team on a lineup built for your group.' },
            { title: 'Order & Receive Damn Good Apparel', description: 'We produce and ship your collection with top-quality printing and garments.' },
          ],
        },
      ],
    },
  })

  await payload.create({
    collection: 'pages',
    data: {
      title: 'About Us',
      slug: 'about',
      layout: [
        { blockType: 'hero', headline: 'About Kocreators', subhead: 'A design and production team obsessed with getting team gear right.' },
        {
          blockType: 'storyStatement',
          kicker: 'The Story',
          heading: 'Our Vision',
          body: 'From first sketch to final shipment, our promise is to help your team, school, or business look as good as it plays.',
        },
      ],
    },
  })

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Trusted Brands',
      slug: 'trusted-brands',
      layout: [
        { blockType: 'hero', headline: 'Trusted Brands', subhead: 'The brands behind every garment we print.' },
        { blockType: 'trustedBrands', heading: 'Nike, Champion, Gildan & More', logos: [] },
      ],
    },
  })

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Support',
      slug: 'support',
      layout: [
        { blockType: 'hero', headline: 'Support', subhead: 'Questions about an order, reorder, or artwork proof? We\u2019re here.' },
        { blockType: 'contactForm', heading: 'Get Support', formType: 'contact' },
      ],
    },
  })

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Contact Us',
      slug: 'contact',
      layout: [
        { blockType: 'hero', headline: 'Request a Quote', subhead: 'Tell us about your team and we\u2019ll follow up within one business day.' },
        { blockType: 'contactForm', heading: 'Request a Quote', formType: 'quote' },
      ],
    },
  })

  console.log('Seed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
