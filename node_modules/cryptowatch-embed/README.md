# Cryptowatch Embed

[![npm version](https://badge.fury.io/js/cryptowatch-embed.svg)](https://badge.fury.io/js/cryptowatch-embed)

Small library for embedding [Cryptowatch](https://cryptowat.ch) charts on a website.

## Live Demo

[https://jsfiddle.net/s2k0ahf1/1/](https://jsfiddle.net/s2k0ahf1/1/)

## Usage

### Vanilla ES5

Include the ES5 build in your page:

```html
<script type="text/javascript" src="https://static.cryptowat.ch/assets/scripts/embed.bundle.js"></script>
```

Use the library in the global `cryptowatch` namespace:

```js
var chart = new cryptowatch.Embed('bitfinex', 'btcusd');

chart.mount('#chart-container');
```

### ES6/webpack

Install package:

```
npm install cryptowatch-embed --save
```

Import package:

```js
import CryptowatchEmbed from 'cryptowatch-embed';

let chart = new CryptowatchEmbed('bitfinex', 'btcusd');

chart.mount('#chart-container');
```

## API

At minimum, the library requires an exchange and currency pair.

```js
var chart = new cryptowatch.Embed('bitfinex', 'btcusd');
```

A few options can be provided to configure the chart.

### `width` and `height`

Fixed dimensions may be defined for the iframe. The default values for both are `100%`.

```js
var chart = new cryptowatch.Embed('bitfinex', 'btcusd', {
  width: 800,
  height: 500
});
```

### `timePeriod`

Any of the supported time periods may be forcefully loaded on every page load:

`1m`, `3m`, `5m`, `15m`, `30m`, `1h`, `2h`, `4h`, `6h`, `12h`, `1d`, `3d`, `1w`

We recommend omitting this option, which will cause the application to use whatever time period the client
last chose, or `1h` for new visitors.

```js
var chart = new cryptowatch.Embed('bitfinex', 'btcusd', {
  timePeriod: '4H'
});
```

### `presetColorScheme`

Any of the preset color schemes may be chosen:

`standard`, `candycane`, `albuquerque`, `delek`, `blueprint`, `ballmer`, `bushido`

The default value is `standard`.

```js
var chart = new cryptowatch.Embed('bitfinex', 'btcusd', {
  presetColorScheme: 'delek'
});
```

### `customColorScheme`

Alternatively, a custom color scheme may be defined. `rgba(...)` values are currently *not* supported. Please use hex values.

```js
var chart = new cryptowatch.Embed('bitfinex', 'btcusd', {
  customColorScheme: {
    bg:           "000000",
    text:         "b2b2b2",
    textStrong:   "e5e5e5", // Emphasized text
    textWeak:     "7f7f7f", // De-emphasized text
    short:        "C60606", // Stroke color of decreasing candlesticks, ask orders, and other "short" related UI
    shortFill:    "C60606", // Fill color of decreasing candlesticks
    long:         "00B909", // Color of increasing candlesticks, bid orders, and other "long" related UI
    longFill:     "000000", // Fill color of increasing candlesticks
    cta:          "363D52", // Color of buttons and other prominent UI elements
    ctaHighlight: "414A67", // Color of buttons and other prominent UI elements when hovered over
    alert:        "FFD506", // Color associated with price & volume alerts

    // Optionally also provide an object defining colors for various TA
    ta: {
      lines:       ["2BC400", "E01500", "22A9CB", "C31B64", "E3C22D"], // EMA, MA, and other lies
      channel:     "68C01C", // Keltner channel, bollinger bands
      // Ichimoku lines
      tenkanSen:   "5BA6B3",
      kijunSen:    "CD66A9",
      chikouSpan:  "626174",
      senkouSpanA: "6CB57E",
      senkouSpanB: "C86C64"
    }
  }
});
```

Future versions of this library will also enable you to add indicators/overlays.
The current version renders only the candlestick chart with volume underneath.
