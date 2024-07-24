// TODO: move to other actions file
export const getSessionWinners = async ({
  viewMethod,
  sessionId,
  contractId,
}) => {
  const result = await viewMethod({
    contractId,
    method: 'get_session_winners',
    args: { sessionId },
  })

  return result
}

export const getPlayerChance = async ({
  viewMethod,
  sessionId,
  accountId,
  contractId,
}) => {
  const result = await viewMethod({
    contractId,
    method: 'get_player_chance',
    args: { sessionId, address: accountId },
  })

  return result
}
