import { cookieStorage, createConfig, createStorage, http } from 'wagmi'
import { tempo } from 'wagmi/chains'

const TEMPO_RPC_URL = 'https://rpc.tempo.xyz';
const TEMPO_RPC_BASIC_AUTH = 'Basic ' + Buffer.from('username:password').toString('base64');

export function getConfig() {
  return createConfig({
    multiInjectedProviderDiscovery: true,
    chains: [tempo],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: false,
    transports: {
      [tempo.id]: http(TEMPO_RPC_URL, {
        fetchOptions: {
          headers: {
            'Authorization': TEMPO_RPC_BASIC_AUTH
          }
        }
      }),
    },
  })
}


declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}
``