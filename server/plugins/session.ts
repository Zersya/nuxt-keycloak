export default defineNitroPlugin(() => {
    // sessionHooks.hook('fetch', async (session) => {
    //   console.log('Injecting "status" claim as test on fetch')
    //   if (!(Object.keys(session).length === 0)) {
    //     const claimToAdd = { status: 'Fetch' }
    //     session.claims = { ...session.claims, ...claimToAdd }
    //   }
    // })
  
    // sessionHooks.hook('refresh', async (session) => {
    //   console.log('Injecting "status" claim as test on refresh')
    //   if (!(Object.keys(session).length === 0)) {
    //     const claimToAdd = { status: 'Refresh' }
    //     session.claims = { ...session.claims, ...claimToAdd }
    //   }
    // })
  
    // sessionHooks.hook('clear', async () => {
    //   console.log('User logged out')
    // })
  })