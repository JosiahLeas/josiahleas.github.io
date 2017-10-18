var assert = require('assert');
var URI = require('urijs');
var Browser = require("zombie")
var Embed = require('../dist/main.js');

describe('Embed', function () {
  it('generates the default URL when given no opts', function() {
    assert.equal(
      (new Embed('bitfinex', 'btcusd').src),
      'https://embed.cryptowat.ch/bitfinex/btcusd'
    );
  });

  it('handles the timePeriod opt', function() {
    assert.equal(
      (new Embed('bitfinex', 'btcusd', { timePeriod: '6H' }).src),
      'https://embed.cryptowat.ch/bitfinex/btcusd/6h'
    );

    // Input should be case insensitive
    assert.equal(
      (new Embed('okcoin', 'btccny', { timePeriod: '1w' }).src),
      'https://embed.cryptowat.ch/okcoin/btccny/1w'
    );
  });

  it('handles the presetColorScheme opt', function() {
    assert.equal(
      (new Embed('bitfinex', 'btcusd', { presetColorScheme: 'albuquerque' }).src),
      'https://embed.cryptowat.ch/bitfinex/btcusd?presetColorScheme=albuquerque'
    );
  });

  it('handles the presetColorScheme opt', function() {
    assert.equal(
      (new Embed('bitfinex', 'btcusd', { presetColorScheme: 'albuquerque' }).src),
      'https://embed.cryptowat.ch/bitfinex/btcusd?presetColorScheme=albuquerque'
    );
  });

  it('handles the locale opt', function() {
    assert.equal(
      (new Embed('quoine', 'btcjpy', { locale: 'ja-JP' }).src),
      'https://embed.cryptowat.ch/quoine/btcjpy?locale=ja-JP'
    );
  });

  it('handles the host and protocol opts', function() {
    assert.equal(
      (new Embed('bitbank', 'btcusd', { locale: 'ja-JP', host: 'chart.bitbanktrade.jp', protocol: 'http' }).src),
      'http://chart.bitbanktrade.jp/bitbank/btcusd?locale=ja-JP'
    );
  });

  it('handles extra query opts', function() {
    assert.equal(
      (new Embed('bitbank', 'btcusd', { locale: 'ja-JP', host: 'chart.bitbanktrade.jp', protocol: 'http', query: { branding: 'special' } }).src),
      'http://chart.bitbanktrade.jp/bitbank/btcusd?locale=ja-JP&branding=special'
    );
  });

  it('handles the customColorScheme opt', function() {
    var colors = {
      bg:           "000000",
      text:         "b2b2b2",
      textStrong:   "e5e5e5",
      textWeak:     "7f7f7f",
      short:        "C60606",
      shortFill:    "C60606",
      long:         "00B909",
      longFill:     "000000",
      cta:          "363D52",
      ctaHighlight: "414A67",
      alert:        "FFD506"
    };

    var encodedColors = encodeURIComponent(JSON.stringify(colors));
    var embed = new Embed('bitfinex', 'btcusd', { customColorScheme: colors });
    var uri = new URI(embed.src);
    var encodedColors = uri.query(true)['customColorScheme'];
    var decodedColors = JSON.parse(URI.decodeQuery(encodedColors));

    // Verify that the colors were encoded correctly (order does not matter)
    for (var key in colors) {
      if (colors.hasOwnProperty(key)) {
        assert.equal(colors[key], decodedColors[key]);
      }
    }
  });

  it('handles the width & height opts', function() {
    var iframe;

    // Shim
    window = new Browser()
    window.visit('');
    document = window.document;

    var embed = new Embed('bitfinex', 'btcusd');
    iframe = embed.createIframe();

    assert.equal(iframe.getAttribute('width'), '100%');
    assert.equal(iframe.getAttribute('height'), '100%');

    var embed = new Embed('bitfinex', 'btcusd', { width: 500, height: 300 });
    iframe = embed.createIframe();

    assert.equal(iframe.getAttribute('width'), '500');
    assert.equal(iframe.getAttribute('height'), '300');
  });

});
