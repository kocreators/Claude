import config from '@payload-config'
import '@payloadcms/next/css'
import { RootLayout } from '@payloadcms/next/layouts'
import React from 'react'
import { importMap } from './admin/importMap'

type Args = { children: React.ReactNode }

// Wraps every /admin route with Payload's own admin UI shell (nav, styles,
// auth). This is separate from the public (frontend) layout below.
const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap}>
    {children}
  </RootLayout>
)

export default Layout
