export default function humanizeDuration(timestamp) {
  const duration = timestamp / 1000000
  const seconds = Math.floor(duration % 60)
  const minutes = Math.floor((duration / 60) % 60)
  const hours = Math.floor((duration / 3600) % 24)
  const days = Math.floor(duration / 86400)

  return `${days}d ${hours}h ${minutes}m ${seconds}s`
}
