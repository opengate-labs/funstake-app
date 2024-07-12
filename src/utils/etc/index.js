export function safeJsonParse(str) {
  try {
    return JSON.parse(str)
  } catch (e) {
    return null
  }
}
