import Big from 'big.js'

// Big.strict = true
// Separate instance for displaying ETH
const BigDecimal = Big()

Big.DP = 0
BigDecimal.DP = 18

Big.RM = 0
BigDecimal.RM = 1

Big.NE = -70000000
BigDecimal.NE = -70000000
Big.PE = 210000000
BigDecimal.PE = 210000000

export { Big, BigDecimal }
