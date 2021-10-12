import { render } from '//unpkg.com/uhtml?module'
import { useState } from '//unpkg.com/hooked-elements?module'
import { css, define, reactive, html } from './lib/main.js'
import { timeSince } from './time.service.js'

export function MccLink({ $tickers = [] }) {
    const tickers = $tickers.slice(0,8)
    const symbols = []
    for (const t of tickers) {
        symbols.push(`BINANCE:${t.symbol}`)
    }
    const url = `https://www.multicoincharts.com/?c=${symbols.join(",")}`
    
    render(arguments[0], <>

      <a target="_blank" href$={url}>Top 8 Tickers</a>

    </>)
}

const style = css`
  mcc-link {
    width: 100%;
    display: block;
    text-align: center;
  }
  mcc-link a {
    color: white;
    text-decoration: none;
    padding: .25em 1em;
    border-radius: 5px;
    border: 1px solid #2962ff;
    font-size: 3em;
  }
`

define(MccLink, "mcc-link", style)