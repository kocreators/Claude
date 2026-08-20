import config from '@payload-config'
import { NotFoundPage } from '@payloadcms/next/views'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{ segments?: string[] }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

const NotFound = async ({ params, searchParams }: Args) => {
  const resolvedParams = await params
  const resolvedSearchParams = searchParams ? await searchParams : {}

  const normalizedParams = {
    segments: resolvedParams?.segments ?? [],
  }

  const normalizedSearchParams = Object.fromEntries(
    Object.entries(resolvedSearchParams).filter(
      ([, value]) => value !== undefined,
    ),
  ) as { [key: string]: string | string[] }

  return NotFoundPage({
    config,
    params: Promise.resolve(normalizedParams),
    searchParams: Promise.resolve(normalizedSearchParams),
    importMap,
  })
}

export default NotFound
