// This defines the types and methods that will be publicly available in our library

export { default as PhantomRedirectAdapter } from './adapter'
export * from './adapter'

export { default as usePhantomRedirectAdapter } from './hooks/usePhantomRedirectAdapter'
export * from './hooks/usePhantomRedirectAdapter'

export { shouldPhantomRedirect } from './utils'
