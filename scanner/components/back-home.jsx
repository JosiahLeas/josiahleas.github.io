import { add_style } from '../lib/reference-resolver-x.js'
import { useResolver, useSignal, css, html } from '../lib/reference-resolver-x.js'


export function BackButton(){
  const url = "https://www.multicoincharts.com"
    
    return <>
      <div class="back-button">
        <a href={url}>← Return to MCC</a>
      </div>

    </>
}

const style = css`
  .back-button {
    position: absolute;
    left: 1em;
    top: 1em;
  }
  .back-button a:hover, .back-button button:hover {
    color: #2962ff;
  }
  .back-button a, .back-button button {
    color: white;
    text-decoration: none;
    padding: .25em 1em;
    border-radius: 5px;
    font-size: 1.5em;
    background-color: transparent;
    border: none;
    transition: all .2s;
  }
`
add_style(style)