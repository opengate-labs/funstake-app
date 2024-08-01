import { useQuery, useMutation } from '@tanstack/react-query'
import { getPlayerChance, getPlayer } from '@/actions/common'
import { stake, claim, cashout } from '@/actions'
import { useNear } from '@/hooks'
import { useModal } from '@/providers/ModalProvider'

export function usePlayerData({ session, refetch, coin }) {
  const {
    viewMethod,
    accountId,
    callMethod,
    signIn,
    sendMultipleTransactions,
  } = useNear()
  const { openModal, closeModal } = useModal()

  const { data: chance, refetch: refetchChance } = useQuery({
    queryKey: ['chance', session.contractId, session.id, coin, accountId],
    queryFn: () =>
      getPlayerChance({
        viewMethod,
        sessionId: session.id,
        accountId,
        contractId: session.contractId,
      }),
    enabled: !!session.id && !!accountId,
  })

  const { data: player, refetch: refetchPlayer } = useQuery({
    queryKey: ['player', session.contractId, session.id, coin, accountId],
    queryFn: () =>
      getPlayer({
        viewMethod,
        sessionId: session.id,
        address: accountId,
        contractId: session.contractId,
      }),
    enabled: !!session.id && !!accountId,
  })

  const stakeMutation = useMutation({
    mutationFn: ({ amount }) =>
      stake({
        callMethod,
        amount,
        viewMethod,
        contractId: session.contractId,
        sessionId: session.id,
        address: accountId,
        coin,
        sendMultipleTransactions,
      }),
    onSuccess: (data, { toggleLoading }) => {
      refetch()
      refetchPlayer()
      refetchChance()
      toggleLoading(false)
      closeModal()
    },
  })

  const claimMutation = useMutation({
    mutationFn: () =>
      claim({
        callMethod,
        sessionId: session.id,
        contractId: session.contractId,
      }),
    onSuccess: () => {
      refetchPlayer()
      refetch()
    },
  })

  const cashoutMutation = useMutation({
    mutationFn: () =>
      cashout({
        callMethod,
        sessionId: session.id,
        contractId: session.contractId,
      }),
    onSuccess: (data, toggleLoading) => {
      refetchPlayer()
      refetch()
      refetchChance()
      toggleLoading(false)
      closeModal()
    },
  })

  const onStake = () => {
    if (!accountId) {
      signIn()
      return
    }

    openModal('StakeModal', {
      sessionId: session.id,
      coin,
      contractId: session.contractId,
      onSubmit: async ({ toggleLoading, amount }) => {
        stakeMutation.mutate({ amount, toggleLoading })
      },
    })
  }

  const onClaim = () => {
    if (player?.isClaimed) return
    claimMutation.mutate()
  }

  const onCashout = () => {
    openModal('ConfirmationModal', {
      title: 'Are you sure you want to cashout?',
      message: "After cashout you don't participate in the game anymore.",
      onConfirm: async (toggleLoading) => {
        cashoutMutation.mutate(toggleLoading)
      },
    })
  }

  return {
    player,
    chance,
    refetchPlayer,
    refetchChance,
    onStake,
    onClaim,
    onCashout,
  }
}
