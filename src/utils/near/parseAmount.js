/**
 * Removes leading zeroes from an input
 * @param value A value that may contain leading zeroes
 * @returns string The value without the leading zeroes
 */
const trimLeadingZeroes = (value) => {
  value = value.replace(/^0+/, '')
  if (value === '') {
    return '0'
  }
  return value
}

/**
 * Removes commas from the input
 * @param amount A value or amount that may contain commas
 * @returns string The cleaned value
 */
export const cleanupAmount = (amount) => {
  return amount.replace(/,/g, '').trim()
}

/**
 * Convert human readable amount to internal indivisible units.
 * Effectively this multiplies the given amount by 10^decimals.
 *
 * @param amt decimal string (potentially fractional) denominated in the token.
 * @param decimals number of decimal places for the token.
 * @returns The parsed amount in smallest units or null if no amount was passed in.
 */
export function parseAmount(amt, decimals) {
  if (!amt) {
    return null
  }
  if (decimals == null) {
    throw new Error('Decimals must be provided')
  }
  amt = cleanupAmount(amt)
  const split = amt.split('.')
  const wholePart = split[0]
  const fracPart = split[1] || ''
  if (split.length > 2 || fracPart.length > decimals) {
    throw new Error(`Cannot parse '${amt}' as amount with ${decimals} decimals`)
  }
  return trimLeadingZeroes(wholePart + fracPart.padEnd(decimals, '0'))
}
