import { getPayload } from 'payload'
import config from '@payload-config'

// getPayload() memoizes internally per config, but this small wrapper keeps
// every server component's import line identical and easy to grep for.
export const getCachedPayload = () => getPayload({ config })
