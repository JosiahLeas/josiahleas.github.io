import { add_style } from '../lib/reference-resolver-x.js'
import { useResolver, useSignal, css, html } from '../lib/reference-resolver-x.js'


export function Advanced() {
    return <>
      <div class="a">
      <iframe data-aa="1836137" src="//ad.a-ads.com/1836137?size=728x90" style="width:728px; height:90px; border:0px; padding:0; overflow:hidden; background-color: transparent;" ></iframe>
      </div>
    </>
}


    


const style = css`
  .a{
   display: flex;
  } 
  .a iframe {
   margin: auto;
  }
`
add_style(style)