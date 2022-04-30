const Index = '/'
const Home = '/home'

export const AppRouting = {
  Index,
  Home,
  ProviderInjection: '/provider',
  Chat: '/chat'
}

export const createAppUrl = (path: string) =>
  `http://${
    process.env.NODE_ENV === 'development' ? location.host : location.host // "openrails.io"
  }/${path}`

export const createAppDLUrl = (path: string) =>
  `${process.env.NODE_ENV === 'development' ? 'localhost:3000' : 'openrails.io'}/${path}`

export default AppRouting
