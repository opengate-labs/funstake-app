/**
 * Convert account balance value from internal indivisible units to a human-readable format.
 * Effectively this divides the given amount by 10^decimals.
 *
 * @param balance decimal string representing balance in smallest non-divisible units.
 * @param decimals number of decimal places for the token.
 * @param fracDigits number of fractional digits to preserve in formatted string. Balance is rounded to match the given number of digits.
 * @returns Value in a human-readable format.
 */
export const formatAmount = (balance, decimals, fracDigits = decimals) => {
  let balanceBN = global.BigInt(balance)
  if (fracDigits !== decimals) {
    // Adjust balance for rounding at the given number of digits
    const roundingExp = decimals - fracDigits - 1
    if (roundingExp > 0) {
      balanceBN += global.BigInt(5 * 10 ** roundingExp)
    }
  }

  balance = balanceBN.toString()
  const wholeStr = balance.substring(0, balance.length - decimals) || '0'
  const fractionStr = balance
    .substring(balance.length - decimals)
    .padStart(decimals, '0')
    .substring(0, fracDigits)

  return trimTrailingZeroes(`${formatWithCommas(wholeStr)}.${fractionStr}`)
}

/**
 * Trim trailing zeroes from a string.
 * @param value The string from which to remove trailing zeroes.
 * @returns The string with trailing zeroes removed.
 */
export const trimTrailingZeroes = (value) => {
  return value.replace(/\.?0*$/, '')
}

/**
 * Format a number string with commas as thousand separators.
 * @param value The string to format.
 * @returns The formatted string.
 */
export const formatWithCommas = (value) => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
