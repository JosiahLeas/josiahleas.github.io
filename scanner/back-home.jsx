import { render } from '//unpkg.com/uhtml?module'
import { useState } from '//unpkg.com/hooked-elements?module'
import { css, define, reactive, html } from './lib/main.js'
import { timeSince } from './time.service.js'

export function BackButton(){
  const url = "https://www.multicoincharts.com"
    render(arguments[0], <>

      <a href$={url}>← Return to MCC</a>

    </>)
}

const style = css`
  back-button {
    position: absolute;
    left: 1em;
    top: 1em;
  }
  back-button a {
    color: white;
    text-decoration: none;
    padding: .25em 1em;
    border-radius: 5px;
    font-size: 1.5em;
  }
`

define(BackButton, "back-button", style)