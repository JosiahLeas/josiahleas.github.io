import { add_style } from '../lib/reference-resolver-x.js'
import { useResolver, useSignal, css, html } from '../lib/reference-resolver-x.js'
import { Show } from '../lib/solid-js.js'


export function MccLink({ tickers = [] }) {
  const { useCallback, useMemo, useEffect } = useResolver(f => eval(f))

  const top8 = useMemo(() => tickers.slice(0, 8))

  const symbols = useMemo(() => top8.map(t => t.symbol))

  const url = useMemo(() => `https://www.multicoincharts.com/?c=${symbols.join(",")}&p=1`)

  // get coins that have been pinged > 5 times
  // put in to array
  // create url

  const tickersPinged = useMemo(() => tickers.filter(t => t.count > 5))

  // let tickersPinged = [];

  const symbolsPinged = useMemo(() => tickersPinged.map(t => t.symbol))

  const url2 = useMemo(() => `https://www.multicoincharts.com/?c=${symbolsPinged.join(",")}&p=1`)
  return <>
    <div class="mcc-link">
      <a target="_blank" href={url}>Open 8 latest tickers</a>
    </div>
    <Show when={useMemo(() => tickersPinged.length)}>
      <br />
      <div class="mcc-link">
        <a style="border:2px solid #f44336" target="_blank" href={url2}>Open Pinged Tickers</a>
      </div></Show>
  </>
}

const style = css`
  .mcc-link {
    width: 100%;
    display: block;
    text-align: center;
    padding-top: 1.5em;
  }
  .mcc-link a {
    color: white;
    text-decoration: none;
    padding: .25em 1em;
    border-radius: .25em;
    font-size: 2.5em;
    text-transform: capitalize;
    background-color: #fff1;

    transition: all .3s;
  }
  .mcc-link a:hover {
    background-color: #0002;
  }

  @media screen and (max-width: 885px) {
    .mcc-link a {
      font-size: 1.5em;
    }
`
add_style(style)