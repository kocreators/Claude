import config from '@payload-config'
import { RootPage } from '@payloadcms/next/views'
import React from 'react'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const Page = async ({ params, searchParams }: Args) => {
  const resolvedSearchParams = await searchParams

  const normalizedSearchParams = Object.fromEntries(
    Object.entries(resolvedSearchParams).filter(([, value]) => value !== undefined),
  ) as { [key: string]: string | string[] }

  return RootPage({
    config,
    params,
    searchParams: Promise.resolve(normalizedSearchParams),
    importMap,
  })
}

export default Page
