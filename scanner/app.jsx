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
      <h1>Binance Scanner</h1>

      <BackButton/>

      <MccLink $tickers={state.data} />

      <div class="wrapper">
      <iframe data-aa="1821621" src="//ad.a-ads.com/1821621?size=120x600" style="width:120px; height:600px; border:0px; padding:0; overflow:hidden; background-color: transparent; float: right; padding-top: 55px;" ></iframe>

      <div class="t-grid">
        {state.data.map(ticker => (

          <PingedTicker $ticker={ticker}/>

        ))}
        
      </div>
      
      <iframe data-aa="1821626" src="//ad.a-ads.com/1821626?size=120x600" style="width:120px; height:600px; border:0px; padding:0; overflow:hidden; background-color: transparent; padding-top: 55px; justify-self: right;" ></iframe> 
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

.wrapper {
  display: grid;
  grid-template-columns: 1fr 12fr 1fr;
  gap: 10px;
}
`

define(MyComponent, "my-component", style)

document.body.append(document.createElement("my-component"))