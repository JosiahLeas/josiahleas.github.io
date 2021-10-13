let pings = {}



async function start() {
    pings = {}
    const response = await fetch("https://smpr.online/Eventify?kind=binance_vol&$select=Registry,TextContent")
    const data = await response.json()
    for (const t of data) {
        parseTickerArray(t.TextContent, new Date(`${t.Registry}Z`))
    }
}
function parseTickerArray(tickers = "", date = new Date()) {
    const array = tickers.split(",")
    for (const s of array) {
        if (s in pings) {
            pings[s].count++
            pings[s].latest = date

        } else {
            pings[s] = {

                count: 1,
                latest: date

            }
        }
    }
}

export async function pingsToArray() {
    await start()
    const array = []
    for (const s in pings) {
        array.push({ symbol: s, count: pings[s].count, latest: pings[s].latest })
    }
    const smallArray = array.sort((a, b) => b.latest - a.latest).slice(0, 60)

    return smallArray
}

