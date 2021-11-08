import { For } from "./lib/solid-js.js"
import { render } from "./lib/web.js"
import { html, css, useSignal, useResolver, add_style } from "./lib/reference-resolver-x.js"
import { Transition, TransitionGroup } from "./lib/transitions.js"
import { pingsToArray } from "./services/pings.service.js"

import { BackButton } from "./components/back-home.jsx"
import { HowTo } from "./components/how-to.jsx"
import { MccLink } from "./components/mcc-link.jsx"
import { PingedTicker } from "./components/pinged-ticker.jsx"

export function App() {
  const { useCallback, useMemo, useEffect } = useResolver(f => eval(f))

  const data = useSignal([])

  const get_new_data = () => pingsToArray().then(useCallback(tickers => data = tickers))
  get_new_data()
  setInterval(get_new_data, 60 * 1000)

  return <>
    <h1>
      Binance Scanner
    </h1>

    <BackButton />

    <HowTo />

    <MccLink tickers={() => data} />

    <div class="t-grid">
      <For each={data}>
        {ticker => (
          <PingedTicker ticker={ticker} />
        )}
      </For>
    </div>
    
  </>

}

f: {/* <div class="t-grid">
<For each={data}>
    {ticker => (
        <PingedTicker ticker={ticker} />
    )}
</For>
</div> */}
const style = css`
body {
  font-family: --apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
label {
  display: block;
}

html {
  background: #131722
}

.t-grid {
  height: 100%;
  margin: 50px 25px;
  padding: 5px 100px;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
`
add_style(style)
render(App, document.getElementById("main"))
