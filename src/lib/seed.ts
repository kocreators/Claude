import { getPayload } from 'payload'
import config from '@payload-config'

// Run with: npm run seed
// Populates real Kocreators starter content: nav (with Services mega menu),
// footer, site settings, the full service catalog, a handful of sample
// portfolio projects, testimonials, and every top-level page — including a
// fully block-built homepage matching the approved design brief.
//
// Image fields are intentionally left empty (no placeholder stock photography
// — see project notes). Upload real photography in the admin, then attach it
// to the Hero, ServicesGrid (service heroImage), PortfolioGrid (project
// coverImage/gallery), CompanyStores, and PromoSpotlight blocks.
//
// Re-run is roughly idempotent for the singleton globals; it will create
// duplicate Pages/Services/Projects if run twice against the same DB.
async function seed() {
  const payload = await getPayload({ config })

  console.log('Seeding site settings...')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'Kocreators',
      phone: '(888) 488-5388',
      hours: 'Monday – Friday, 8am – 6pm PST',
      email: 'Sales@Kocreators.com',
      externalShopUrl: 'https://kocreators.com/shop/',
      quoteRequestUrl: 'https://kocreators.com/quoterequest/',
    },
  })

  console.log('Seeding services...')
  const serviceDefs = [
    { title: 'Custom Apparel', slug: 'custom-apparel', summary: 'Premium branded apparel produced at scale.' },
    { title: 'Promotional Products', slug: 'promotional-products', summary: 'Make your brand memorable with products people actually want.' },
    { title: 'Print & Signage', slug: 'print-signage', summary: 'Business cards, brochures, banners, signage, event materials, and marketing collateral.' },
    { title: 'Brand Stores', slug: 'company-stores', summary: 'Custom online stores for employees, customers, teams, and organizations.' },
    { title: 'Fulfillment & Warehousing', slug: 'fulfillment-warehousing', summary: 'Storage, pick-and-pack, distribution, and direct-to-recipient shipping.' },
    { title: 'Screen Printing', slug: 'screen-printing', summary: 'High-quality custom printing for teams, companies, events, and organizations.' },
    { title: 'Embroidery', slug: 'embroidery', summary: 'Professional embroidery for polos, jackets, hats, bags, and more.' },
    { title: 'Custom Headwear', slug: 'custom-headwear', summary: 'Custom hats built around your brand, style, and team.' },
    { title: 'Gifting & Kitting', slug: 'gifting-kitting', summary: 'Premium packaging solutions for an elevated unboxing experience.' },
  ]
  const services: Array<{ id: string | number; slug: string; title: string; summary: string }> = []
  for (const [i, def] of serviceDefs.entries()) {
    const doc = await payload.create({
      collection: 'services',
      data: { ...def, order: i },
    })
    services.push({
      id: Number(doc.id),
      slug: doc.slug,
      title: doc.title,
      summary: doc.summary ?? '',
    })
  }
  const findService = (slug: string) => services.find((s) => s.slug === slug)!

  console.log('Seeding testimonials...')
  const testimonialDefs = [
    { quote: 'Kocreators does a terrific job providing our work gear. Their customer service is top notch as well!', authorName: 'Holly Swisher', authorTitle: 'COO, Smooth Transitions' },
    { quote: 'We\u2019ve run our employee store through Kocreators for six years. Reordering is as easy as day one.', authorName: 'Marcus Webb', authorTitle: 'Director of Operations, Webb & Co.' },
    { quote: 'They turned a logo file and a deadline into a full product line in under two weeks.', authorName: 'Alicia Chen', authorTitle: 'Marketing Lead, Northline Events' },
  ]
  const testimonials = []
  for (const def of testimonialDefs) {
    const doc = await payload.create({ collection: 'testimonials', data: def })
    testimonials.push(doc)
  }

  console.log('Seeding sample projects...')
  const projectDefs = [
    { clientName: 'Dr Pepper Keurig', slug: 'dr-pepper-keurig', projectType: 'Promotional Products', featured: true, services: [] },
    { clientName: 'Grant Cardone Enterprises', slug: 'grant-cardone-enterprises', projectType: 'Custom Apparel + Promotional Products', featured: true, services: [] },
    { clientName: "Pickleman's Cafe", slug: 'picklemans-cafe', projectType: 'Brand Stores & Fulfillment', featured: true, services: [] },
    { clientName: 'Dog Training Elite', slug: 'dog-training-elite', projectType: 'Custom Apparel & Brand Stores', featured: true, services: [] },
    { clientName: 'Family Nest Franchising', slug: 'family-nest-franchising', projectType: 'Print & Signage', featured: true, services: [] },
    { clientName: 'East West Tournament', slug: 'east-west-tournament', projectType: 'Screen Printing', featured: true, services: [] },
    { clientName: 'Cru', slug: 'cru', projectType: 'Custom Apparel & Promotional Products', featured: true, services: [] },
  ]
  for (const [i, def] of projectDefs.entries()) {
    const { services: svcSlugs, ...rest } = def
    await payload.create({
      collection: 'projects',
      data: {
        ...rest,
        order: i,
        testimonial: Number(testimonials[i % testimonials.length].id),
        servicesProvided: svcSlugs.map((slug) => Number(findService(slug).id)),
      },
    })
  }

  console.log('Seeding header & footer...')
  await payload.updateGlobal({
    slug: 'header',
    data: {
      navItems: [
        {
          link: { type: 'custom', label: 'Services', url: '/services' },
          megaMenu: true,
          subItems: services.map((s) => ({
            link: { type: 'internal' as const, label: s.title, internal: { relationTo: 'services' as const, value: Number(s.id) } },
            description: s.summary,
          })),
        },
        { link: { type: 'custom', label: 'Our Work', url: '/our-work' } },
        { link: { type: 'custom', label: 'How It Works', url: '/how-it-works' } },
        { link: { type: 'custom', label: 'Brand Stores', url: '/brand-stores' } },
        { link: { type: 'custom', label: 'About', url: '/about' } },
        { link: { type: 'custom', label: 'Resources', url: '/blog' } },
      ],
      quoteCta: { type: 'custom', label: 'Start a Project', url: '/start' },
    },
  })

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      tagline: 'Custom apparel, promotional products, print, and branded stores — all handled by one team.',
      columns: [
        {
          heading: 'Services',
          links: [
            'custom-apparel', 'screen-printing', 'embroidery', 'promotional-products', 'print-signage', 'company-stores', 'fulfillment-warehousing',
          ].map((slug) => {
            const s = findService(slug)
            return { link: { type: 'internal' as const, label: s.title, internal: { relationTo: 'services' as const, value: Number(s.id) } } }
          }),
        },
        {
          heading: 'Company',
          links: [
            { link: { type: 'custom', label: 'About', url: '/about' } },
            { link: { type: 'custom', label: 'Our Work', url: '/our-work' } },
            { link: { type: 'custom', label: 'How It Works', url: '/how-it-works' } },
            { link: { type: 'custom', label: 'Contact', url: '/contact' } },
          ],
        },
        {
          heading: 'Support',
          links: [
            { link: { type: 'custom', label: 'FAQs', url: '/support' } },
            { link: { type: 'custom', label: 'Order Support', url: '/support' } },
            { link: { type: 'custom', label: 'Artwork Guidelines', url: '/support' } },
            { link: { type: 'custom', label: 'Shipping', url: '/support' } },
            { link: { type: 'custom', label: 'Terms', url: '/terms' } },
          ],
        },
      ],
      social: [
        { platform: 'instagram', url: 'https://instagram.com/kocreators' },
        { platform: 'facebook', url: 'https://facebook.com/kocreators' },
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
          eyebrow: 'Custom Apparel · Promo · Print · Brand Stores',
          headline: 'Your Brand.\nMade Better.',
          subhead: 'Your one-stop partner for branded merchandise.',
          cta: { type: 'custom', label: 'Start a Project', url: '/start' },
          secondaryCta: { type: 'custom', label: 'See Our Work', url: '/our-work' },
        },
        { blockType: 'trustedBrands', heading: 'Trusted by Teams That Care About Their Brand', logos: [] },
        { blockType: 'servicesGrid', heading: 'Our Services', source: 'collection' },
        {
          blockType: 'portfolioGrid',
          heading: 'We Make Good Brands Look Even Better.',
          source: 'featured',
          limit: 7,
        },
        {
          blockType: 'processSteps',
          heading: 'We Keep It Simple.',
          steps: [
            { title: 'Tell Us What You Need', description: 'Send your logo, project details, quantity, timeline, and ideas.' },
            { title: 'We Build the Plan', description: 'We help select products, decoration methods, pricing, and creative direction.' },
            { title: 'Approve Your Project', description: 'Review digital proofs and approve everything before production.' },
            { title: 'We Make It Happen', description: 'We produce, quality-check, pack, and ship your order.' },
          ],
          cta: { type: 'custom', label: 'Start Your Project', url: '/start' },
        },
        {
          blockType: 'companyStores',
          kicker: 'Brand Stores',
          heading: 'Your Brand Store.\nWithout the Headaches.',
          body: 'We build and operate custom online merchandise stores — for employees, customers, teams, and fundraisers — so you don\u2019t have to manage inventory or fulfillment yourself.',
          capabilities: [
            { label: 'Custom branded storefront' },
            { label: 'Employee ordering' },
            { label: 'Customer merchandise' },
            { label: 'Fundraising stores' },
            { label: 'Inventory management' },
            { label: 'Made-to-order products' },
            { label: 'Bulk inventory & warehousing' },
            { label: 'Individual fulfillment' },
            { label: 'Nationwide shipping' },
            { label: 'Reporting' },
          ],
          cta: { type: 'custom', label: 'Explore Brand Stores', url: '/brand-stores' },
        },
        {
          blockType: 'promoSpotlight',
          heading: 'If You Can Put a Logo on It,\nWe Can Make It.',
          body: 'Put your logo to work — on drinkware, bags, tech, awards, packaging, and much more.',
          items: [
            { label: 'Drinkware' },
            { label: 'Bags & Totes' },
            { label: 'Tech Accessories' },
            { label: 'Office & Writing' },
            { label: 'Outdoor & Recreation' },
            { label: 'Food & Gifts' },
            { label: 'Awards & Recognition' },
            { label: 'Events & Giveaways' },
          ],
          cta: { type: 'custom', label: 'Find a Product', url: '/services/promotional-products' },
        },
        { blockType: 'testimonials', heading: 'What Clients Are Saying', items: testimonials.map((t) => Number(t.id)) },
        {
          blockType: 'ctaBanner',
          heading: 'Ready to Make Something Great?',
          subhead: 'Tell us what you\u2019re working on. We\u2019ll help figure out the rest.',
          style: 'accent',
          cta: { type: 'custom', label: 'Start a Project', url: '/start' },
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
        { blockType: 'hero', headline: 'Everything Your Brand Needs.\nOne Partner.', subhead: 'Custom apparel, print, promo, and branded stores — under one roof.' },
        { blockType: 'servicesGrid', heading: 'Our Services', source: 'collection' },
      ],
    },
  })

  await payload.create({
    collection: 'pages',
    data: {
      title: 'How It Works',
      slug: 'how-it-works',
      layout: [
        { blockType: 'hero', headline: 'We Keep It Simple.', subhead: 'From first message to shipped order — here\u2019s exactly how it works.' },
        {
          blockType: 'processSteps',
          heading: 'Our Process',
          steps: [
            { title: 'Tell Us What You Need', description: 'Send your logo, project details, quantity, timeline, and ideas.' },
            { title: 'We Build the Plan', description: 'We help select products, decoration methods, pricing, and creative direction.' },
            { title: 'Approve Your Project', description: 'Review digital proofs and approve everything before production.' },
            { title: 'We Make It Happen', description: 'We produce, quality-check, pack, and ship your order.' },
          ],
          cta: { type: 'custom', label: 'Start Your Project', url: '/start' },
        },
      ],
    },
  })

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Brand Stores',
      slug: 'brand-stores',
      layout: [
        { blockType: 'hero', headline: 'Your Brand Store.\nWithout the Headaches.', subhead: 'A custom online store for your employees, customers, or team — built and run by us.' },
        {
          blockType: 'companyStores',
          kicker: 'How It Works',
          heading: 'One Store.\nEvery Order Handled.',
          body: 'From storefront design to individual fulfillment, we run the parts of a branded store that usually eat up your team\u2019s time.',
          capabilities: [
            { label: 'Custom branded storefront' },
            { label: 'Employee ordering' },
            { label: 'Customer merchandise' },
            { label: 'Fundraising stores' },
            { label: 'Inventory management' },
            { label: 'Made-to-order products' },
            { label: 'Bulk inventory & warehousing' },
            { label: 'Individual fulfillment' },
            { label: 'Nationwide shipping' },
            { label: 'Reporting' },
          ],
          cta: { type: 'custom', label: 'Start a Project', url: '/start' },
        },
      ],
    },
  })

  await payload.create({
    collection: 'pages',
    data: {
      title: 'About',
      slug: 'about',
      layout: [
        { blockType: 'hero', headline: 'About Kocreators', subhead: 'A production team obsessed with getting your brand right, every order.' },
        {
          blockType: 'storyStatement',
          kicker: 'The Story',
          heading: 'One Team, Every Step',
          body: 'From first sketch to final shipment, we handle design, production, and fulfillment under one roof — so your brand looks consistent everywhere it shows up.',
          cta: { type: 'custom', label: 'Start a Project', url: '/start' },
        },
        { blockType: 'trustedBrands', heading: 'Trusted by Teams That Care About Their Brand', logos: [] },
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
      title: 'Start a Project',
      slug: 'start',
      layout: [
        { blockType: 'hero', headline: 'Start a Project', subhead: 'Tell us what you\u2019re working on and we\u2019ll follow up within one business day.' },
        { blockType: 'contactForm', heading: 'Start a Project', formType: 'quote' },
      ],
    },
  })

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Contact',
      slug: 'contact',
      layout: [
        { blockType: 'hero', headline: 'Contact Us', subhead: 'Questions about an order, a quote, or anything else? We\u2019re here to help.' },
        { blockType: 'contactForm', heading: 'Get In Touch', subhead: 'Send us a message and a member of our team will follow up within one business day.', formType: 'contact' },
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
