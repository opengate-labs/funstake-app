import { setupWalletSelector } from '@near-wallet-selector/core'
import { setupHereWallet } from '@near-wallet-selector/here-wallet'
import { setupModal } from '@near-wallet-selector/modal-ui'
import '@near-wallet-selector/modal-ui/styles.css'
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet'
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet'
import { createContext, useEffect, useMemo, useState } from 'react'
import { distinctUntilChanged, map } from 'rxjs'
import { NetworkId } from '@/config'
import { finalizeAuthWithHereWallet } from '@/utils/near/finalizeAuthWithHereWallet'
import { HereWallet } from '@here-wallet/core'
import initCustomHereWalletSelector from './initCustomHereWalletSelector'
import { Preloader } from '@/components/Preloader'

const initWalletSelector = async ({
  setAccounts,
  setSelector,
  setModal,
  setLoading,
}) => {
  try {
    const _selector = await setupWalletSelector({
      network: NetworkId,
      debug: true,
      modules: [setupHereWallet(), setupMeteorWallet(), setupMyNearWallet()],
    })
    const _modal = setupModal(_selector, {})
    const state = _selector.store.getState()

    setAccounts(state.accounts)
    setSelector(_selector)
    setModal(_modal)
    setLoading(false)

    // this is added for debugging purpose only (maybe remove later)
    // for more information (https://github.com/near/wallet-selector/pull/764#issuecomment-1498073367)
    window.selector = _selector
    window.modal = _modal
  } catch (error) {
    console.error('Error in init >>>', error.message)
  }
}

const initHereForTelegram = async ({
  setAccounts,
  setLoading,
  setSelector,
}) => {
  try {
    const _selector = initCustomHereWalletSelector()
    const hereWallet = await HereWallet.connect({
      botId: import.meta.env.VITE_APP_BOT_ID,
      walletId: 'herewalletbot/app',
    })

    _selector.setWallet(hereWallet)

    const isSignedIn = await hereWallet.isSignedIn()

    if (isSignedIn) {
      const accountId = await hereWallet.getAccountId()
      const publicKey = await hereWallet.signer.getPublicKey(
        accountId,
        NetworkId,
      )
      const accounts = [
        {
          active: true,
          accountId: accountId,
          publicKey: publicKey.toString(),
        },
      ]
      _selector.setState({
        accounts,
      })
    }

    setAccounts(_selector.getState().accounts)
    setSelector(_selector)
    // TODO: maybe use with timeout
    // setTimeout(() => {
    //   setLoading(false)
    // }, 800)
    setLoading(false)
  } catch (error) {
    console.error('Error in init Telegram >>>', error.message)
  }
}

export const WalletSelectorContext = createContext({
  isLoadingWallet: true,
  selector: null,
  modal: null,
  accounts: [],
  accountId: null,
  inTelegramApp: false,
})

export const WalletSelectorProvider = ({ children }) => {
  const [selector, setSelector] = useState(null)
  const [modal, setModal] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [inTelegramApp, setInTelegramApp] = useState(false)

  useEffect(() => {
    const isTelegram = !!window.Telegram?.WebApp.initData
    console.log('isTelegram:', isTelegram)

    setInTelegramApp(isTelegram)

    if (isTelegram) {
      initHereForTelegram({
        setAccounts,
        setLoading,
        setSelector,
      })
    } else {
      initWalletSelector({ setAccounts, setLoading, setModal, setSelector })
    }
  }, [])

  useEffect(() => {
    if (!selector) {
      return
    }

    const subscription = selector.store.observable
      .pipe(
        map((state) => state.accounts),
        distinctUntilChanged(),
      )
      .subscribe((nextAccounts) => {
        const activeAccount = nextAccounts.find((account) => account.active)
        if (activeAccount?.accountId && activeAccount?.publicKey) {
          selector.wallet().then((wallet) => {
            const isHereWallet = wallet.id === 'here-wallet'

            if (isHereWallet) {
              finalizeAuthWithHereWallet({ accountId: activeAccount.accountId })
            }
          })
        }
        setAccounts(nextAccounts)
      })

    const onHideSubscription = modal?.on('onHide', ({ hideReason }) => {
      console.log(`The reason for hiding the modal ${hideReason}`)
    })

    return () => {
      subscription?.unsubscribe()
      onHideSubscription?.remove()
    }
  }, [selector, modal])

  const walletSelectorContextValue = useMemo(
    () => ({
      isLoadingWallet: loading || !selector,
      selector,
      modal,
      accounts,
      accountId: accounts.find((account) => account.active)?.accountId || null,
      inTelegramApp,
    }),
    [selector, modal, accounts, loading],
  )

  return (
    <>
      {inTelegramApp && loading && <Preloader />}

      <WalletSelectorContext.Provider value={walletSelectorContextValue}>
        {children}
      </WalletSelectorContext.Provider>
    </>
  )
}
