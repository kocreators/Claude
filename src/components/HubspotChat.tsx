'use client'

import Script from 'next/script'

// Loads the HubSpot tracking code, which also powers the live chat widget
// once Chat is turned on in HubSpot's Conversations settings.
export function HubspotChat() {
  const hubId = process.env.NEXT_PUBLIC_HUBSPOT_HUB_ID

  if (!hubId) return null

  return <Script id="hs-script-loader" src={`https://js.hs-scripts.com/${hubId}.js`} strategy="afterInteractive" />
}
