'use client'

import { useAccount, useChains, useConnect, useConnection, useSendTransaction, useDisconnect, useSwitchChain, useConnectors } from 'wagmi'
import { Hooks } from 'wagmi/tempo'



function App() {
  const connection = useConnection()
  const { connect, status, error } = useConnect()
  const connectors = useConnectors()
  const { disconnect } = useDisconnect()

  const { sendTransaction } = useSendTransaction()

  const { isPending, mutate: approve } = Hooks.token.useApprove();


  return (
    <>
      {connection.isConnected && <>
        <div>
          <h2>Approve with fee token</h2>
          <button type="button"
            disabled={isPending}
            onClick={() => {
              approve({
                feeToken: '0x20C000000000000000000000b9537d11c60E8b50',
                amount: 0n,
                spender: '0x0000000000000000000000000000000000000000',
                token: '0x20C000000000000000000000b9537d11c60E8b50',
                throwOnReceiptRevert: true,
              })
            }}>
            {isPending ? 'Approving...' : 'Approve'}
          </button>
        </div>

        <div>
          <h2>Approve without fee token</h2>
          <button type="button"
            disabled={isPending}
            onClick={() => {
              approve({
                amount: 0n,
                spender: '0x0000000000000000000000000000000000000000',
                token: '0x20C000000000000000000000b9537d11c60E8b50',
                throwOnReceiptRevert: true,
              })
            }}>
            Approve
          </button>
        </div>
      </>}

      <div>
        <h2>Connection</h2>

        <div>
          status: {connection.status}
          <br />
          addresses: {JSON.stringify(connection.addresses)}
          <br />
          chainId: {connection.chainId}
        </div>

        {connection.status === 'connected' && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <Account />

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>


    </>
  )
}

export default App


function Account() {
  const account = useAccount()
  const chains = useChains()
  const disconnect = useDisconnect()
  const switchChain = useSwitchChain()

  const isSupportedChain = chains.some((chain) => chain.id === account.chainId)

  return (
    <div>
      <div>
        Address: {account.address?.slice(0, 6)}...{account.address?.slice(-4)}
      </div>
      {
        chains.map((chain) => (

          <div key={chain.id}>
            Chain ID: {account.chainId}{' '}
            {!isSupportedChain && (
              <button
                onClick={() =>
                  switchChain.switchChain({
                    chainId: chain.id,
                    addEthereumChainParameter: {
                      nativeCurrency: {
                        name: 'USD',
                        decimals: 18,
                        symbol: 'USD',
                      },
                    },
                  })
                }
                type="button"
              >
                Switch to {chain.name}
              </button>
            )}
          </div>
        ))}
    </div>
  )
}