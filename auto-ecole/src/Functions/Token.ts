export function getToken(router: any, jwt: Function) {
  let token = ''
  if (typeof window !== 'undefined') {
    if (!localStorage.getItem('token')) {
      console.log('no token')
      router.push('/login')
    } else {
      token = localStorage.getItem('token') as string
      if (token && jwt(token).exp > Date.now() / 1000) {
        return token
      } else {
        console.log('token expired')
        router.push('/login')
      }
    }
  }
}