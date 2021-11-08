import { useResolver, useSignal, css, html } from '../lib/reference-resolver-x.js'
import { add_style } from '../lib/reference-resolver-x.js'
import { timeSince } from '../services/time.service.js'

export function PingedTicker({ ticker }) {

    const { useCallback } = useResolver(f => eval(f))
    
    
    const latest = useCallback(() => timeSince(ticker.latest))
    const time = useSignal(latest())

    setTimeout(useCallback(() => time = latest()), 2 * 1000)


    return <>

        <div class={ticker.count > 5 ? "ping tickers" : "tickers"}>
            <h1>{ticker.symbol}</h1>
            <p>{ticker.count}</p>

            <p class="x2">{time}</p>
        </div>

    </>
}

const style = css`
   h1 {
  color: white;
  font-size: 30px;
  font-weight: 400;
  letter-spacing: -.3px;
  line-height: 35px;
  text-align: center;
  font-size: 4.5em;
}

.tickers {
  justify-content: center;
  display: grid;
  grid-template-columns: auto auto;
  border: 1px solid #fff4;
  background-color: #ffffff06;
  padding-bottom: 10px;
  border-radius: 5px;
}

.tickers > h1 {
  color: #d1d4dc;
  font-size: 30px;
  font-weight: 400;
  letter-spacing: -.3px;
  line-height: 35px;
  margin: 0;
  font-size: 1.3em;
  align-self: center;
}

.tickers > p {
  color: #2962ff;
  cursor: pointer;
  display: inline-block;
  font-weight: 700;
  max-width: 100%;
  padding-right: 3px;
  margin: 0;
  align-self: center;
  margin-left: 10px;
}

.x2 {
  justify-self: center;
}

.ping {
  border-color: #f44336;
}
`
add_style(style)