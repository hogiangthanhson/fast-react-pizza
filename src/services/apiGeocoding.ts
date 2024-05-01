interface Address {
  latitude: number
  longitude: number
}

export async function getAddress({ latitude, longitude }: Address) {
  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`
  )
  if (!res.ok) throw Error('Failed getting address')

  const data = await res.json()
  return data
}
