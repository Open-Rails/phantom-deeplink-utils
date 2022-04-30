export interface PhantomErrorResponse {
  errorCode: string
  errorMessage: string
}

export const buildProviderMethodUrl = (method: string, version: string = 'v1') =>
  `https://phantom.app/ul/${version}/${method}`
