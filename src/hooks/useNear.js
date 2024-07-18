import { useCallback } from 'react'
import { useWalletSelector } from './useWalletSelector'
import * as nearAPI from 'near-api-js'
import { actionCreators, encodeSignedDelegate } from '@near-js/transactions'

import { NetworkId, WALLETS_PREFIX } from '@/config'
import { EIGHTY_TGAS, THIRTY_TGAS } from '@/constants/nearAmounts'

export const NO_DEPOSIT = '0'
export const ONE_YOCTO_DEPOSIT = '1'

export const useNear = () => {
  const { isLoadingWallet, selector, modal, accountId } = useWalletSelector()

  const signIn = async () => {
    const isTelegram = !!window.Telegram?.WebApp.initData

    if (isTelegram) {
      const wallet = await selector.wallet()
      wallet.signIn({
        // contractId: Contract,
        callbackUrl: '#loginSuccess',
        // methodNames: ['claim', 'add_project'],
      })
    } else {
      modal.show()
    }
  }

  const signOut = async () => {
    const wallet = await selector.wallet()

    wallet
      .signOut()
      .then(() => {})
      .catch((err) => {
        console.log('Failed to sign out')
        console.error(err)
      })
  }

  const viewMethod = useCallback(
    async ({ contractId, method, args = {} }) => {
      const provider = new nearAPI.providers.JsonRpcProvider({
        url: `https://rpc.${NetworkId}.near.org`,
      })
      provider.q
      const res = await provider.query({
        request_type: 'call_function',
        account_id: contractId,
        method_name: method,
        args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
        finality: 'optimistic',
      })

      if (res.result) {
        const isEmptyArray =
          Array.isArray(res.result) && res.result.length === 0

        if (isEmptyArray) {
          return []
        }

        return JSON.parse(Buffer.from(res.result).toString())
      }

      return null
    },
    [selector],
  )

  const callMethod = useCallback(
    async ({
      contractId,
      method,
      args = {},
      gas = THIRTY_TGAS,
      deposit = NO_DEPOSIT,
    }) => {
      try {
        // TODO: useConfig to get commont data like account ID for example
        if (!selector) throw new Error('Wallet is not initialized')
        if (!accountId) throw new Error('User is not signed in')
        if (!contractId) throw new Error('ContractId is not provided')
        if (!method) throw new Error('Method is not provided')

        const wallet = await selector.wallet()
        const outcome = await wallet.signAndSendTransaction({
          signerId: accountId,
          receiverId: contractId,
          actions: [
            {
              type: 'FunctionCall',
              params: {
                methodName: method,
                args,
                gas: gas.toString(),
                deposit: deposit.toString(),
              },
            },
          ],
        })

        const transactionLastResult =
          nearAPI.providers.getTransactionLastResult(outcome)

        // TODO: Maybe return back
        // !transactionLastResult || transactionLastResult?.status?.Failure
        if (transactionLastResult?.status?.Failure) {
          throw new Error(`Failed to call ${method} on ${contractId}`)
        }

        return {
          result: transactionLastResult,
          success: true,
        }
      } catch (err) {
        console.error('Error on callMethod', err)
        return { result: null, success: false }
      }
    },
    [selector, accountId],
  )

  const signAndDelegate = useCallback(
    async ({
      receiverId,
      blockHeightTtl = 60,
      method,
      args = {},
      gas = EIGHTY_TGAS,
      deposit = NO_DEPOSIT, // ONE_YOCTO_DEPOSIT
    }) => {
      try {
        if (!selector) throw new Error('Wallet is not initialized')
        if (!accountId) throw new Error('User is not signed in')
        if (!receiverId) throw new Error('ReceiverId is not provided')
        if (!method) throw new Error('Method is not provided')

        const { id: projectId } = args

        if (!projectId) throw new Error('Project ID is not provided')

        window.BigInt.prototype.toJSON = function () {
          return this.toString()
        }

        const { id: selectedWalletId } = await selector.wallet()

        const prefix = WALLETS_PREFIX[selectedWalletId]
        const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore(
          localStorage,
          prefix, // TODO: attach this based on the current wallet
        )
        const nearConfig = {
          networkId: NetworkId,
          nodeUrl: `https://rpc.${NetworkId}.near.org`,
          keyStore,
        }

        const near = await nearAPI.connect(nearConfig)
        const account = await near.account(accountId)
        const delegate = await account.signedDelegate({
          actions: [actionCreators.functionCall(method, args, gas, deposit)],
          blockHeightTtl,
          receiverId,
        })
        const serializedTx = Array.from(encodeSignedDelegate(delegate))
        const response = await fetch('/api/relayer', {
          method: 'POST',
          body: JSON.stringify({ serializedTx, projectId }),
        })

        const { receipt, data } = await response.json()

        const lastResult =
          receipt?.final_execution_status === 'EXECUTED' ? receipt : null

        return {
          success: !!lastResult,
          result: lastResult,
          data,
        }
      } catch (err) {
        console.error('Error', err)
        return {
          success: false,
          result: err.message,
          data: null,
        }
      }
    },
    [accountId],
  )

  return {
    signIn,
    signOut,
    accountId,
    isLoadingWallet,
    viewMethod,
    callMethod,
    signAndDelegate,
  }
}
