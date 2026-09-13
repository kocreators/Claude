'use client'

import Script from 'next/script'

// The live Kocreators container. NEXT_PUBLIC_GTM_ID overrides it, so a staging
// environment can point at a different container without a code change.
const DEFAULT_GTM_ID = 'GTM-TWT9HXS'

// Google Tag Manager container. GTM itself fires nothing — tags (GA4, Ads
// conversions, Meta pixel, etc.) are configured inside the GTM workspace, so
// adding one later needs no code change here.
//
// Skipped during `next dev` so local clicking around doesn't land in the
// reports. To test tags locally, set NEXT_PUBLIC_GTM_ID in .env.local, which
// forces it on.
//
// Loaded only in the (frontend) layout — the Payload admin under (payload) has
// its own layout and is intentionally left untracked, so admin sessions don't
// pollute the numbers.
export function GoogleTagManager() {
  const override = process.env.NEXT_PUBLIC_GTM_ID
  const gtmId = override || (process.env.NODE_ENV === 'development' ? '' : DEFAULT_GTM_ID)

  if (!gtmId) return null

  return (
    <>
      <Script id="gtm-loader" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
      </Script>

      {/* Fallback for browsers with JavaScript disabled. Google's snippet puts
          this immediately after the opening <body> tag. */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  )
}
