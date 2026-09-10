import Image from 'next/image'

// Where the banner sends people. This is the DC promo catalog, which is a
// separate storefront from Site Settings -> External Shop URL (the WooCommerce
// shop the header "Shop" link points at), so it is deliberately its own value
// rather than reading that setting.
const CATALOG_URL = 'https://kocreators.dcpromosite.com'

// Full-width "Shop the Full Catalog" banner that sits under the product-category
// grid in the PromoSpotlight block (homepage + the Promotional Products service
// page).
//
// Two crops of the same artwork rather than one scaled image: the wide rectangle
// letterboxes badly on a phone, so narrow screens get the square version. Both are
// lazy-loaded and the off-breakpoint one is inside a `display:none` container, so
// it never enters the viewport and the browser skips the download — a phone only
// pays for the square file.
export function CatalogBanner() {
  const alt = 'Shop the full catalog — apparel, drinkware, bags, gifts and more'

  return (
    <div className="mt-12 md:mt-16">
      <a
        href={CATALOG_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block transition-opacity duration-300 hover:opacity-95"
      >
        <Image
          src="/images/catalog-banner-desktop.webp"
          alt={alt}
          width={2022}
          height={778}
          sizes="(min-width: 1280px) 1200px, 100vw"
          className="hidden h-auto w-full md:block"
        />
        <Image
          src="/images/catalog-banner-mobile.webp"
          alt={alt}
          width={1254}
          height={1254}
          sizes="100vw"
          className="h-auto w-full md:hidden"
        />
      </a>
    </div>
  )
}
