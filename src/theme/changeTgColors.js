export function changeTgColors(color) {
  window.Telegram.WebApp.backgroundColor = color
  window.Telegram.WebApp.headerColor = color
  window.Telegram.WebApp.setBackgroundColor(color)
  window.Telegram.WebApp.setHeaderColor(color)
}
