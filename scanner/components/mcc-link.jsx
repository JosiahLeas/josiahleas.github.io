import { add_style } from '../lib/reference-resolver-x.js'
import { useResolver, useSignal, css, html } from '../lib/reference-resolver-x.js'


export function MccLink({ tickers = [] }) {
    const { useCallback, useMemo, useEffect } = useResolver(f=>eval(f))

    const top8 = useMemo(() => tickers.slice(0, 8))
    
    const symbols = useMemo(() => top8.map(t => t.symbol))
    
    const url = useMemo(() => `https://www.multicoincharts.com/?c=${symbols.join(",")}&p=1`)
    
    return <>
      <div class="mcc-link">
          <a target="_blank" href={url}>Open 8 latest tickers</a>
      </div>
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
`
add_style(style)