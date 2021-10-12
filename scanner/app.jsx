import { render } from '//unpkg.com/uhtml?module'
import { useState, useEffect } from '//unpkg.com/hooked-elements?module'
import handler from '//unpkg.com/reactive-props?module'
import { css, define, reactive, html } from './lib/main.js'
import { pingsToArray } from './pings.service.js'
import { timeSince } from './time.service.js'
import { PingedTicker } from './pinged-ticker.jsx'
import { MccLink } from './mcc-link.jsx'
import { BackButton } from './back-home.jsx'
import {} from './page-sleep.service.js'


function MyComponent(self) {
  const state = reactive({ data: [] })
  
  useEffect(async () => {
    state.data = await pingsToArray()
    setInterval(async () => {
      state.data = await pingsToArray()
    }, 60 * 1000);
  }, [])

  render(self,
    <>
      <h1>Binance Volume Scanner</h1>

      <BackButton/>

      <MccLink $tickers={state.data} />

      <div class="t-grid">
        {state.data.map(ticker => (

          <PingedTicker $ticker={ticker}/>

        ))}
      </div>

    </>
  )
}

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

define(MyComponent, "my-component", style)

document.body.append(document.createElement("my-component"))