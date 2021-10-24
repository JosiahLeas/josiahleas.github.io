# MultiCoinCharts - Crypto/Stocks Graph Open Source
#### Josiah Leas & [PrettySights](https://prettysights.com)

### About 
Uses TradingView widgets to show many cryptocurrencies, stocks, and foreign exchange markets.  
  
[Example Using Stocks](https://www.multicoincharts.com/?chart=M&chart=F&chart=HMC&chart=INTC&chart=JBLU&chart=SNAP&chart=TSLA&chart=WDC)  
[Example Using Crypto](https://www.multicoincharts.com/?chart=BITFINEX:BTCUSD&chart=BITSTAMP:BTCUSD&chart=BITFLYER:BTCJPY&chart=BITFINEX:ETHUSD&chart=BITFINEX:XRPUSD&chart=BITFINEX:LTCUSD&chart=BITFINEX:EOSUSD&chart=BITFINEX:BTCUSDLONGS&chart=BITFINEX:BTCUSDSHORTS)

### Fixes 
#### Indicators
+ cannot-select-just-one: Aug 10, 2020

#### Width & Height
+ doesnot-save-to-storage-mobile: Jun 30, 2020

#### Settings
+ hidden-checkboxes: Apr 2, 2020

#### Url Params
+ doesnot-update-url-on-add: Apr 1, 2020

#### Storage
+ doesnot-save-chart-pairs: Aug 11, 2020

#### Remove Chart
+ misbehave-removes-all-after-id: Mar 26, 2019

#### Internal JS
+ non-sanitized-bool-to-string: Apr 10, 2020
+ misspell-sanitize-fn: Mar 19, 2020
  
### Key features
Q: Adding alert support with web notifications.  
A: Needs a live server to serve notifications.  
  
Q: Adding more url param types without breaking current syntax.  
A: Tests positive. But url shortening takes priority.  
  
Q: Chart tap on mobile to maximize.  
A: Mobile was poorly implimented, partly bc we don't have much control over the iframe widgets.  
  
Q: Chart enhance for mobile. (2/5)  
A: See previous.  
  
Q: Live reordering charts. (5/5)  
A: Tests positive. Due during next feature set.  
  
Q: Refresh without browser refresh. (5/5)  
A: Tests posible. Only in with the unreleased hats-pf model from vsadx.com   
  
### On Current Work
1. Reimplement glb.charts [done]
2. Convert glb.charts to a hats-pf class [done]
  
3. Implement DirectUI as binds to `all` props or action sets.
    + Failed: Binding was too difficult
    + Propose: Rearrange DirectUI calls as "actions" (OnLoad, OnChartAdd, etc)
    + Done: OnLoad
    + Done: OnChartChange
    + Missing: HTML DirectUI buttons
4. Remove DirectUI
    + Done: Comments non-JS accessed functions
    + Missing: HTML DirectUI buttons
  
5. Static wrap X_* functions.  
    + Propose: wrap action X_* as "actions"
    + Done: Comments duplicated X_* in "actions"


### Bugs / Issues
The readme is deeply out of date.  
There are many unsolved issues.  


### Respected Contibutors
[forever.scg](Github/P-Medicado)  
[shellstorm](Github/shellstrom)  
[WhiteRavenTechnology](Github/WhiteRavenTechnology)  
