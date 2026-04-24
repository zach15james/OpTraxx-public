export function generateInviteCode() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const randomLetters = Array.from({ length: 3 }, () =>
    letters.charAt(Math.floor(Math.random() * letters.length))
  ).join('')

  const randomNumbers = String(Math.floor(Math.random() * 10000))
    .padStart(4, '0')

  return `${randomLetters}-${randomNumbers}`
}
