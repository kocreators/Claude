import { HeroBlock } from '@/blocks/Hero/Component'
import { ServicesGridBlock } from '@/blocks/ServicesGrid/Component'
import { ProcessStepsBlock } from '@/blocks/ProcessSteps/Component'
import { TestimonialsBlockComponent } from '@/blocks/Testimonials/Component'
import { StoryStatementBlock } from '@/blocks/StoryStatement/Component'
import { TrustedBrandsBlock } from '@/blocks/TrustedBrands/Component'
import { CTABannerBlock } from '@/blocks/CTABanner/Component'
import { RichTextBlockComponent } from '@/blocks/RichTextBlock/Component'
import { ContactFormBlockComponent } from '@/blocks/ContactForm/Component'

// Maps each Payload block slug (see src/collections/Pages.ts) to the React
// component that renders it. Add new block types here as you add configs.
const blockComponents: Record<string, (props: { block: any }) => any> = {
  hero: HeroBlock,
  servicesGrid: ServicesGridBlock,
  processSteps: ProcessStepsBlock,
  testimonials: TestimonialsBlockComponent,
  storyStatement: StoryStatementBlock,
  trustedBrands: TrustedBrandsBlock,
  ctaBanner: CTABannerBlock,
  richText: RichTextBlockComponent,
  contactForm: ContactFormBlockComponent,
}

export function RenderBlocks({ blocks }: { blocks: any[] }) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, i) => {
        const Component = blockComponents[block.blockType]
        if (!Component) return null
        return <Component key={block.id || i} block={block} />
      })}
    </>
  )
}
