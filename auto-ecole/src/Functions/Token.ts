export function getToken(router: any, jwt:Function) {
    let token = ''
    if (typeof window !== 'undefined') {
        if (!localStorage.getItem('token')) {
          router.push('/login')
        } else {
          token = localStorage.getItem('token') as string
          console.log(jwt(token).exp)
          console.log(Date.now() / 1000)
          if(token && jwt(token).exp >= Date.now() / 1000) {
            // localStorage.removeItem('token')
            // router.push('/login')
          }else {
            return token
          }
        }
      }
}