import type { CollectionConfig } from 'payload'
import { Hero } from '@/blocks/Hero/config'
import { ServicesGrid } from '@/blocks/ServicesGrid/config'
import { ProcessSteps } from '@/blocks/ProcessSteps/config'
import { TestimonialsBlock } from '@/blocks/Testimonials/config'
import { StoryStatement } from '@/blocks/StoryStatement/config'
import { TrustedBrands } from '@/blocks/TrustedBrands/config'
import { CTABanner } from '@/blocks/CTABanner/config'
import { RichTextBlock } from '@/blocks/RichTextBlock/config'
import { ContactFormBlock } from '@/blocks/ContactForm/config'
import { PortfolioGrid } from '@/blocks/PortfolioGrid/config'
import { CompanyStores } from '@/blocks/CompanyStores/config'
import { PromoSpotlight } from '@/blocks/PromoSpotlight/config'
import { IconFeaturesBlock } from '@/blocks/IconFeatures/config'
import { PricingTiersBlock } from '@/blocks/PricingTiers/config'
import { ImageBlock } from '@/blocks/ImageBlock/config'

// One flexible collection powers every marketing page (Home, Work, Process,
// About, Trusted Brands, Support, Contact...) via a drag-and-drop block
// layout, mirroring how andersonsupply.com stacks distinct page "modules."
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', '_status'] },
  access: { read: () => true },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar', description: 'Use "home" for the homepage' },
    },
    {
      name: 'meta',
      type: 'group',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'layout',
      type: 'blocks',
      minRows: 1,
      blocks: [
        Hero,
        TrustedBrands,
        PortfolioGrid,
        ServicesGrid,
        ProcessSteps,
        CompanyStores,
        PromoSpotlight,
        TestimonialsBlock,
        StoryStatement,
        CTABanner,
        RichTextBlock,
        ContactFormBlock,
        IconFeaturesBlock,
        PricingTiersBlock,
        ImageBlock,
      ],
    },
  ],
}
