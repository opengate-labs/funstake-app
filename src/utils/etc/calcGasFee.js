import { utils } from 'near-api-js'
import { parseAmount } from '../near/parseAmount'

export function calcFee({
  type = 'PROTOCOL',
  totalSupply,
  rewardPerClaim,
  feePerClaim,
  gasPricePerClaim,
  decimal,
}) {
  const totalSupplyInNear = parseAmount(totalSupply.toString(), decimal)
  const rewardPerClaimInNear = parseAmount(rewardPerClaim.toString(), decimal)

  // Calculate claims amount
  const claimsAmount =
    global.BigInt(totalSupplyInNear) / global.BigInt(rewardPerClaimInNear)

  // Calculate fees based on type
  let protocolFee = global.BigInt(0)
  let relayerFee = global.BigInt(0)

  if (type === 'PROTOCOL' || type === 'TOTAL') {
    protocolFee = claimsAmount * global.BigInt(feePerClaim)
  }
  if (type === 'TOTAL') {
    relayerFee = claimsAmount * global.BigInt(gasPricePerClaim)
  }

  // Calculate total fee
  const totalFee = protocolFee + relayerFee

  // Format and return the total fee
  return utils.format.formatNearAmount(totalFee.toString())
}
