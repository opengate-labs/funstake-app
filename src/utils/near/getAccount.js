const { InMemoryKeyStore } = require('@near-js/keystores')
const { KeyPair, connect } = require('near-api-js')

const { parseSeedPhrase } = require('near-seed-phrase')

export async function getAccount(network, accountId, seedPhrase) {
  const { publicKey, secretKey } = parseSeedPhrase(seedPhrase)

  console.log(`Relayer account with public key ${publicKey}`)

  const keyStore = new InMemoryKeyStore()
  await keyStore.setKey(network, accountId, KeyPair.fromString(secretKey))
  const config = {
    networkId: network,
    keyStore,
    nodeUrl: `https://rpc.${network}.near.org`,
  }
  const near = await connect(config)

  return near.account(accountId)
}
