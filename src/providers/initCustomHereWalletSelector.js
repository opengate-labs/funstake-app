import { BehaviorSubject } from 'rxjs'

export default function initCustomHereWalletSelector() {
  const stateSubject = new BehaviorSubject({ accounts: [] })

  const selector = {
    store: {
      observable: stateSubject.asObservable(),
    },
    setState: (newState) => {
      stateSubject.next(newState)
    },
    getState: () => stateSubject.getValue(),
    setWallet: (wallet) => {
      wallet.id = 'here-wallet'
      wallet.nativeSignOut = wallet.signOut
      wallet.signOut = () => {
        return new global.Promise((resolve, reject) => {
          wallet
            .nativeSignOut()
            .then(() => {
              selector.setState({ accounts: [] })
              resolve()
            })
            .catch((error) => {
              console.error('Error in signOut >>>', error.message)
              reject(error)
            })
        })
      }

      selector.wallet = () => global.Promise.resolve(wallet)
    },
  }

  return selector
}
