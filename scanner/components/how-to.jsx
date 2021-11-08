import { add_style } from '../lib/reference-resolver-x.js'
import { useResolver, useSignal, css, html } from '../lib/reference-resolver-x.js'
import { Show } from '../lib/solid-js.js'
import { Transition } from '../lib/transitions.js'

export function HowTo() {
    const { useCallback } = useResolver(f => eval(f))

    const show_box = useSignal(false)


    return <>
        <div class="back-button" style="right: 1em; left: auto; top: .71em">
            <button onClick={useCallback(() => show_box = true)}>How To Use</button>
        </div>
        <Transition name="slide">
            <Show when={show_box}>
                <div class="how-to">
                    <div>
                        <h1>
                            How to Use the MCC Binance Scanner
                        </h1>
                        <p>
                            This scanner is designed to catch coins that are on the move or that are about to make a move. The higher the number displayed next to the coin, the more likely it is for that coin to be on the move. Use this scanner in tangent with your knowledge of TA.
                            <br />
                            <br />
                            <br />
                            Mainly to be used as a scalping/daytrading tool
                        </p>
                        <br />
                        <button onClick={useCallback(() => show_box = false)}>Close</button>
                    </div>

                </div>
            </Show>
        </Transition>
    </>
}

const style = css`
  .how-to {
    position: absolute;
    background: #0006;

    width: 100vw;
    height: 100vh;
    top: 0;
    right: 0;
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
  }
  .how-to button {
    color: white;
    text-decoration: none;
    padding: .25em 1em;
    border-radius: 5px;
    font-size: 1.5em;
  }

  .how-to > div {
    position: fixed;
    background-color: #1e222d;
    padding: 40px;
    width: 50%;
    height: 40%;
    top: 0; left: 0; right: 0; bottom: 0; 
    margin: auto;
    text-align: center;
    border-radius: .75em;
  }

  .how-to h1 {
    line-height: unset;
    font-size: 2.5em;
  }
  
  .how-to p {
    color: white;
  }
  
  .how-to button {
    color: white;
    text-decoration: none;
    padding: .1em .25em;
    border-radius: 5px;
    border: 1px solid #2962ff;
    font-size: 2em;
    background-color: #1e222d;
    transition: all .3s;
  }
  .how-to button:hover {
    background-color: #2962ff;
    cursor: pointer;
  }

  .slide-enter-active > div {
    animation: slide .4s forwards;
  }
  .slide-exit-active > div {
      animation: slide .4s reverse;
  }

  @keyframes slide {
    0% {
        transform: translateY(-100vh);
    }
    100% {
        transform: translateY(0vh);
    }
  }
`
add_style(style)