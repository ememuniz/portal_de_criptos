async function getCriptos() {
  const res = await fetch("https://coinlib.io/api/v1/coin?key=b67ea9fdf7c59b76&pref=EUR&symbol=BTC,ETH,XMR,USDT,BNB,USDC,XRP,LUNA,ADA,DOGE")
  const data = await res.json()
  console.log(data)
  return data ['coins']
}

module.exports = { getCriptos }

