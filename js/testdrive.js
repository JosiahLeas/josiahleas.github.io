// Pinche Medicado - Josiah Leas :: PrettySights.com
// stored variables
    const DEBUGMODE = true; //change to false outside testdrive
    const BOOL_ISSTORAGEUSABLE = true;
    const STORAGE_USEDARKTHEME = "useDarkTheme";
    const STORAGE_WIDTH = "table_width";
    const STORAGE_HEIGHT = "table_height";
    const DEFAULT_LAYOUT_WIDTH = 2;
    const DEFAULT_LAYOUT_HEIGHT = 2;
    const STORAGE_TIMEZONE = "timezone";
    const STORAGE_INTERVAL = "interval";
    const STORAGE_SHOWDETAILS = "showDetails";
    const STORAGE_SHOWBOTTOMTOOLBAR = "showBottomToolbar";
    const STORAGE_SHOWTOPTOOLBAR = "showTopToolbar";
    const STORAGE_ALLOWSYMBOLCHANGE = "allowSymbolChange";
    const STORAGE_USESMALLBUTTON = "useSmallButton";
    const STORAGE_CHARTSPAIRS = "charts.pairs";
    const BASEURL_COINIGY = "https://www.coinigy.com/main/markets";

    let gbl_dark = null;
    let gbl_boxWidth = '';
    let gbl_boxHeight = '';

    var charts = {
        pairs: []
    };
// setup the UI / charts layout
    function initPage() {
        bindInputKeyUp();
        setChartsByParameters();
        loadChartParameters();
        initCharts();
    }
    function prepareCharts() {
        var element, tmp;
        
        tmp = storeMAN(false, STORAGE_WIDTH);
        tmp = (tmp) ? tmp : DEFAULT_LAYOUT_WIDTH;
        let elementWidth = document.getElementById("box-width");

        setWidth(tmp);
        elementWidth.value = tmp;
        elementWidth.addEventListener("change", function () {
            setWidth(parseInt(elementWidth.value));
        }, true);

        tmp = storeMAN(false, STORAGE_HEIGHT);
        tmp = (tmp) ? tmp : DEFAULT_LAYOUT_HEIGHT;        
        let elementHeight = document.getElementById("box-height");

        setHeight(tmp);
        elementHeight.value = tmp;
        elementHeight.addEventListener("change", function () {
            setHeight(parseInt(elementHeight.value));
        }, true);

        if (gbl_dark === null || !gbl_dark) {
            lighten();
        } else {
            darken();
        }

        setChartCount();
    }
    function openSingleChartConfig() {
        document.getElementById("addMultiChart").style.display = "none";
        document.getElementById("divRefreshChart").style.display = "none";
        var configDiv = document.getElementById("addSingleChart");
        if (configDiv.style.display == "block") {
            configDiv.style.display = "none";
            return;
        }
        configDiv.style.display = "block";
        document.getElementById("SinglepairsInput").focus();
    }
    function initCharts() {
        if (!document.getElementById("nocharts").style.display == "none") {
            var listPairs = document.getElementById('listPairs');
            for (var i=0; i<getNrOfCharts(); i++) {
                listPairs.options[listPairs.options.length] = new Option(charts.pairs[i], charts.pairs[i]);
            }
        } else {
            //index.html?chart=....&chart=....
            //Parse the charts.pairs and create/display it 
            for(let i = 0; i < getNrOfCharts(); i++) {
                createChart((charts.pairs[i] !== null ? charts.pairs[i] : "COINBASE:BTCUSD"));
            }
            prepareCharts();
        }
    }
// NOcharts view js callable functions
    function pairsInput(element) {
        // console.log(event,element);
        event.preventDefault();
        if (event.keyCode === 13) {
            chartTicker = element.value.toUpperCase();
            if (charts.pairs.indexOf(chartTicker)>=0) {
                alert("You have already added " + chartTicker + "\n\nPlease add a different pairs");
            } else {
                listPairs = document.getElementById('listPairs');
                listPairs.options[listPairs.options.length] = new Option(chartTicker, chartTicker);
            }
            element.value = "";
            document.getElementById("pairsInput").focus();
        }
    }
    function letsGo() {
        var listPairs = document.getElementById('listPairs');
        var options = listPairs.options;
        var optl = options.length;
        if (optl == 0) {
            alert("At least one exchange & chart pair are needed to get started.");
            return;
        }
        var urlStr = "https://www.multicoincharts.com/testdrive.html?"
        for (var i=0; i<optl; i++) {
            if (i!=0) urlStr += "&";
            urlStr += "chart=" + options[i].value;
        }
        window.top.location.href = urlStr;
    }
// charts view js callable functions
    // chart right side bar
        function toggleFullscreenChart(elementId) {
            let box = document.getElementById(elementId);
            
            if (box.classList.contains("fullscreen")) {
                box.classList.remove("fullscreen");
            } else {
                box.classList.add("fullscreen");
            }
        }
        function removeChart(boxElement, chartPairs) {
            boxElement.parentNode.removeChild(boxElement);
            if (DEBUGMODE) console.log("removeChart(): " + boxElement.id + " " + chartPairs);
            
            //find the ticker index and remove it from the array
            charts.pairs.splice(charts.pairs.findIndex(x=>x==chartPairs), 1);
            
            //reset url
            var urlStr = window.top.location.href.substr(0, top.location.href.lastIndexOf("?") + 1);
            for(let i = 0; i < getNrOfCharts(); i++) {
                if (i!=0) urlStr += "&";
                urlStr += "chart=" + charts.pairs[i];
            }
            history.replaceState(null, document.title, urlStr);
        
            if (DEBUGMODE) console.log("\t"+STORAGE_CHARTSPAIRS+": " + charts.pairs);
            setChartCount();
        }
        function openCoinigy(chartTicker) {
            if (DEBUGMODE) console.log("openCoinigy(): " + chartTicker);
            var pairsArr = chartTicker.split(":");
            var exchange = coinigyexchanges[pairsArr[0]];
            var ticker1 = "";
            var ticker2 = "";
        
            var coinsFound = false;
            var pairs = pairsArr[1];
            //Look in the list of coins, starting from 2 digits to 8 digits
            for (var i=2; i<=8; i++) {
                if (cryptocurrencies[pairs.substr(0,i)]) {
                    ticker1 = pairs.substr(0,i);
                    ticker2 = pairs.substr(i, pairs.length);
                    coinsFound = true;
                }
            }
        
            if (!coinsFound) {
                alert("Sorry it seems that we are not able to find the " + pairs + " pairs in Coinigy");
            } else {
                var coinigyURL = BASEURL_COINIGY;
                coinigyURL += "/" + exchange;
                coinigyURL += "/" + ticker1;
                coinigyURL += "/" + ticker2;
                if (DEBUGMODE) console.log("\tCoinigy URL: " + coinigyURL);
                window.open(coinigyURL);
            }
        }
    // topbar funcs
        function createChart(chartTicker) {
            let boxElement = document.createElement("div");
            //use unique id based on milliseconds
            var i = (new Date).getTime();
            boxElement.setAttribute("id", "box" + i);
            boxElement.setAttribute("class", "box");
            document.body.appendChild(boxElement);
            var theme = (gbl_dark === true ? "Dark" : "Light");
            var toolbarbg = (gbl_dark === true ? "rgb(27, 32, 48)" : "rgb(227, 232, 248)");

            var timezoneSelect = document.getElementById("timezone");
            var timezoneValue = timezoneSelect.options[timezoneSelect.selectedIndex].value;
            var intervalSelect = document.getElementById("interval");
            var intervalValue = intervalSelect.options[intervalSelect.selectedIndex].value;
            var detailsChk = document.getElementById('details');
            var details = (detailsChk.checked ? true : false);
            var withdaterangesChk = document.getElementById('withdateranges');
            var withdateranges = (withdaterangesChk.checked ? true : false);
            var allowsymbolchangeChk = document.getElementById('allow_symbol_change');
            var allowsymbolchange = (allowsymbolchangeChk.checked ? true : false);
            var usesmallbuttonChk = document.getElementById('usesmallbutton');
            var usesmallbutton = (usesmallbuttonChk.checked ? "button-fullscreen-small" : "button-fullscreen");
            var usesmallbutton2 = (usesmallbuttonChk.checked ? "button-coinigy-small" : "button-coinigy");

            new TradingView.widget({
                "container_id": "box" + i,
                "autosize": true,
                "symbol": chartTicker,
                "interval": intervalValue,
                "timezone": timezoneValue,
                "theme": theme,
                "style": "1",
                "locale": "en",
                "toolbar_bg": toolbarbg,
                "enable_publishing": false,
                "hide_top_toolbar": false,
                "hide_side_toolbar": false,
                "allow_symbol_change": allowsymbolchange,
                "show_popup_button": false,
                "withdateranges": withdateranges,
                "details": details,
                "hideideas": true
            });

            let topButtonContainerElement = document.createElement("div");
            topButtonContainerElement.setAttribute("class", "box-button-container");

            //Open in Coinigy button
            let btnEl = document.createElement("a");
            btnEl.innerHTML = "<img src='images/coinigy.png' class='"+ usesmallbutton2 + "'/>";
            btnEl.setAttribute("href", "javascript:void(0)");
            btnEl.setAttribute("title", "Open in Coinigy");
            btnEl.setAttribute("data-balloon-length", "small");
            btnEl.setAttribute("data-balloon", "Open in Coinigy");
            btnEl.setAttribute("data-balloon-pos", "left");
            btnEl.addEventListener("click", openCoinigy.bind(null,chartTicker));

            topButtonContainerElement.appendChild(btnEl);

            //Show in Fullscreen button
            btnEl = document.createElement("a");
            btnEl.setAttribute("class", usesmallbutton);
            btnEl.setAttribute("href", "javascript:void(0)");
            btnEl.setAttribute("title", "Show in Fullscreen");
            btnEl.setAttribute("data-balloon-length", "small");
            btnEl.setAttribute("data-balloon", "Show in Fullscreen");
            btnEl.setAttribute("data-balloon-pos", "left");
            btnEl.addEventListener("click", toggleFullscreenChart.bind(null, "box"+i));
            let italicsElement = document.createElement("i");
            italicsElement.setAttribute("class", "fa fa-expand");
            btnEl.appendChild(italicsElement);

            topButtonContainerElement.appendChild(btnEl);

            //Remove this Chart button
            btnEl = document.createElement("a");
            btnEl.setAttribute("class", usesmallbutton);
            btnEl.setAttribute("href", "javascript:void(0)");
            btnEl.setAttribute("title", "Remove this Chart");
            btnEl.setAttribute("data-balloon-length", "small");
            btnEl.setAttribute("data-balloon", "Remove this Chart");
            btnEl.setAttribute("data-balloon-pos", "left");
            btnEl.addEventListener("click", removeChart.bind(null, boxElement, chartTicker));
            italicsElement = document.createElement("i");
            italicsElement.setAttribute("class", "fa fa-times");
            btnEl.appendChild(italicsElement);

            topButtonContainerElement.appendChild(btnEl);

            boxElement.appendChild(topButtonContainerElement);
        }
        function openMultiChartConfig() {
            document.getElementById("addSingleChart").style.display = "none";
            var configDiv = document.getElementById("addMultiChart");
            if (configDiv.style.display == "block") {
                configDiv.style.display = "none";
                document.getElementById("divRefreshChart").style.display = "none";
                return;
            }
            configDiv.style.display = "block";
            document.getElementById("divRefreshChart").style.display = "block";
            document.getElementById("pairsInput").focus();			

            //clear all the options
            removeOptions(document.getElementById('listPairs').options, false);

            //add all the charts to the listbox
            var	select = document.getElementById('listPairs');
            for(var i = 0; i < getNrOfCharts(); i++) {
                var opt = document.createElement('option');
                opt.value = charts.pairs[i];
                opt.innerHTML = charts.pairs[i];
                select.appendChild(opt);
            }
        }
        function change_theme() {
            if (gbl_dark === true) {
                    lighten();
            } else {
                    darken();
            }
            
            //https://stackoverflow.com/a/10842519
            //remove all box
            var elements = document.getElementsByClassName("box");
            while(elements.length > 0){
                elements[0].parentNode.removeChild(elements[0]);
            }

            //recreate the charts
            for(let i = 0; i < getNrOfCharts(); i++) {
                createChart((charts.pairs[i] !== null ? charts.pairs[i] : "COINBASE:BTCUSD"));
            }
            prepareCharts();
        }
        function btnRemovePairsClick() {
            removeOptions(document.getElementById('listPairs').options, true);
        }
        function btnMultiRefreshChartsClick() {
            //https://stackoverflow.com/a/10842519
            //remove all box
            var elements = document.getElementsByClassName("box");
            while(elements.length > 0) {
                elements[0].parentNode.removeChild(elements[0]);
            }

            rebuildChartsPairsArray();

            //recreate the charts
            var urlStr = window.top.location.href.substr(0, top.location.href.lastIndexOf("?") + 1);
            for(let i = 0; i < getNrOfCharts(); i++) {
                createChart((charts.pairs[i] !== null ? charts.pairs[i] : "COINBASE:BTCUSD"));
                if (i!=0) urlStr += "&";
                urlStr += "chart=" + charts.pairs[i];
            }
            prepareCharts();
            history.replaceState(null, document.title, urlStr);
            document.getElementById("pairsInput").focus();
        }
        function useSmallButtonClick(el) {
            try {
                localStorage.setItem(STORAGE_USESMALLBUTTON, el.checked);
            } catch(e) {}
            if (document.getElementById("nocharts").style.display == "block" || document.getElementById("nocharts").style.display == "") return;

            var fromClass, toClass, fromClass2, toClass2;
            if (el.checked) {
                fromClass = "button-fullscreen";
                toClass = "button-fullscreen-small";
                fromClass2 = "button-coinigy";
                toClass2 = "button-coinigy-small";
            } else {
                fromClass = "button-fullscreen-small";
                toClass = "button-fullscreen";
                fromClass2 = "button-coinigy-small";
                toClass2 = "button-coinigy";
            }
            elementArray = document.getElementsByClassName(fromClass);
            while (elementArray.length) {
                elementArray[0].className = toClass;
            }
            elementArray = document.getElementsByClassName(fromClass2);
            while (elementArray.length) {
                elementArray[0].className = toClass2;
            }
        }
        function removeOptions(elOption, removeSelectedOptions) {
            var i = elOption.length;
            while (i--) {
                var current = elOption[i];
                if (removeSelectedOptions) {
                    if (current.selected) current.parentNode.removeChild(current);
                    rebuildChartsPairsArray();
                } else {
                    current.parentNode.removeChild(current);
                }
            }
        }
// charts internal js functions
    //set height
        function setHeight(height) {
            try {
                height = JSON.parse(height);
            } catch (e) {}
            var elements = document.getElementsByClassName("box");
            for (var i = 0, len = elements.length; i < len; i++) {
                elements[i].style.height = "calc((100% / " + (height) + ") - (" + (29 / height) + "px)";
            }
            try {
                localStorage.setItem(STORAGE_HEIGHT, height);
            } catch (e) {}
            gbl_boxHeight = height;
        }
    // set width
        function setWidth(width) {
            try {
                width = JSON.parse(width);
            } catch (e) {}
            var elements = document.getElementsByClassName("box");
            for (var i = 0, len = elements.length; i < len; i++) {
                elements[i].style.width = "calc(100% / " + (width) + ")";
            }
            try {
                localStorage.setItem(STORAGE_WIDTH, width);
            } catch (e) {}
            gbl_boxWidth = width;
        }
    // set chart count
        function setChartCount() {
            document.getElementById("chart-count").innerHTML = charts.pairs.length + " charts";
        }
    // get num of charts active
        function getNrOfCharts() {
            return charts.pairs.length;
        }
    // lighten theme action
        function lighten() {
            document.getElementById("theme-toggle").innerHTML = "Light";
            document.getElementById("box-height").classList.remove("dark");
            document.getElementById("box-width").classList.remove("dark");
            document.body.classList.remove("dark");
            try {
                localStorage.setItem(STORAGE_USEDARKTHEME, "false");
            } catch(e) {}
            gbl_dark = false;
        }

    // darken theme Action
        function darken() {
            document.getElementById("theme-toggle").innerHTML = "Dark";
            document.getElementById("box-height").classList.add("dark");
            document.getElementById("box-width").classList.add("dark");
            document.body.classList.add("dark");
            try {
                localStorage.setItem(STORAGE_USEDARKTHEME, "true");
            } catch(e) {}
            gbl_dark = true;
        }
    // get query variables
        function getQueryVariable(variable) {
            let query = window.location.search.substring(1);
            let vars = query.split("&");
            for (let i = 0; i < vars.length; i++) {
                let pair = vars[i].split("=");
                if (pair[0] === variable) {
                    return pair[1];
                }
            }
            return (false);
        }
    // set charts by parameters TODO :: REMOVE FUNC
        function setChartsByParameters(url) {
            url = window.location.href;
            let expression = /[?&]chart(=([^&#]*)|&|#|$)/g;
            let match;
            let i = 0;
            while (match = expression.exec(url)) {
                charts.pairs.push(match[2].replace(/\+/g, " "));
                i++;
            }
            if (charts.pairs.length == 0) {
                //if there are no chart= parameter in URL, attempt to read from previous session via localstorage
                try {
                    chartsPairsCSV = localStorage.getItem(STORAGE_CHARTSPAIRS); // iOS 10 Safari Private doesn't allow localstorage
                } catch (e) {
                    //https://stackoverflow.com/questions/11214404/how-to-detect-if-browser-supports-html5-local-storage
                    //https://stackoverflow.com/a/11214467
                    document.body.appendChild(document.createTextNode("This browser doesn't is compatible (if you're in iPhone/iPad try non-private browsing). <3"));
                }
                var listPairs = document.getElementById('listPairs');
                if (chartsPairsCSV != null && chartsPairsCSV != "") {
                    //if there are any charts in previous localstorage, restore them
                    var chartsPairsArr = chartsPairsCSV.split(",");
                    for (i=0; i<chartsPairsArr.length; i++) {
                        charts.pairs.push(chartsPairsArr[i]);
                    }
                } else {
                    //if there are nothing in the localstorage, use some default value
                    charts.pairs.push("COINBASE:BTCUSD");
                    charts.pairs.push("COINBASE:ETHUSD");
                    charts.pairs.push("BITTREX:OMGBTC");
                }
            }

            if (url.indexOf("chart")>0) {
                //if there are chart= parameters, hide the intro display
                var elements = document.getElementsByClassName("divIntro");
                for (i = 0; i < elements.length; i++) {
                    elements[i].style.display = "none";
                }
                viewDIV("nocharts", false);
                viewDIV("topnav", true);
            }
        }
    // load chart parameters 
        function loadChartParameters() {
            storeMAN(true, STORAGE_CHARTSPAIRS, charts.pairs)
            gbl_dark = JSON.parse(storeMAN(false, STORAGE_USEDARKTHEME));
            usrSelct = storeMAN(false, STORAGE_TIMEZONE);
            document.getElementById("timezone").value = (usrSelct) ? usrSelct : "Etc/UTC";
            // TODO :: REDUCE FUNC
            // selectClickStoreToLocalStorage(document.getElementById("timezone"), STORAGE_TIMEZONE);
            usrSelct = storeMAN(false, STORAGE_INTERVAL);
            document.getElementById("interval").value = (usrSelct) ? usrSelct : "60";
            usrSelct = storeMAN(false, STORAGE_SHOWDETAILS);
            document.getElementById("details").checked = (usrSelct === 'true');
            // TODO :: ELIM
            // checkboxClickStoreToLocalStorage(document.getElementById("details"), STORAGE_SHOWDETAILS);
            usrSelct = storeMAN(false, STORAGE_SHOWBOTTOMTOOLBAR);
            document.getElementById("withdateranges").checked = (usrSelct === 'true');
            // TODO :: ELIM
            // checkboxClickStoreToLocalStorage(document.getElementById("withdateranges"), STORAGE_SHOWBOTTOMTOOLBAR);
            usrSelct = storeMAN(false, STORAGE_ALLOWSYMBOLCHANGE);
            document.getElementById("allow_symbol_change").checked = (usrSelct === 'true');
            // TODO :: ELIM
            // checkboxClickStoreToLocalStorage(document.getElementById("allow_symbol_change"), STORAGE_ALLOWSYMBOLCHANGE);
            usrSelct = storeMAN(false, STORAGE_USESMALLBUTTON);
            document.getElementById("usesmallbutton").checked = (usrSelct === 'true');
            // TODO :: ELIM
            // checkboxClickStoreToLocalStorage(document.getElementById("usesmallbutton"), STORAGE_USESMALLBUTTON);
            if(DEBUGMODE) {
                doLOG(STORAGE_CHARTSPAIRS, charts.pairs);
                doLOG(STORAGE_USEDARKTHEME, gbl_dark);
                // // TODO :: REDUCE FUNC
                // selectClickStoreToLocalStorage(document.getElementById("interval"), STORAGE_INTERVAL);
                //     doLOG(STORAGE_TIMEZONE, storeMAN(true, STORAGE_INTERVAL, 
                //             document.getElementById("interval")
                //                 .options[document.getElementById("interval")].value));
                doLOG(STORAGE_INTERVAL, );
                doLOG(STORAGE_SHOWDETAILS, );
                // if (DEBUGMODE) console.log("\t"+STORAGE_SHOWBOTTOMTOOLBAR+": ", checkboxState);
                // if (DEBUGMODE) console.log("\t"+STORAGE_ALLOWSYMBOLCHANGE+": ", checkboxState);
                // if (DEBUGMODE) console.log("\t"+STORAGE_USESMALLBUTTON+": ", checkboxState);
            }
    
        }
// MISC
    // bind button inputs
        function bindInputKeyUp() {
            document.getElementById("pairsInput")
            .addEventListener("keyup", function(event) {
                event.preventDefault();
                if (event.keyCode === 13) {
                    chartTicker = this.value.toUpperCase();
                    if (charts.pairs.indexOf(chartTicker)>=0) {
                        alert("You have already added " + chartTicker + "\n\nPlease add a different pairs");
                    } else {
                        listPairs = document.getElementById('listPairs');
                        listPairs.options[listPairs.options.length] = new Option(chartTicker, chartTicker);
                    }
                    this.value = "";
                    document.getElementById("pairsInput").focus();
                }
            });
        
            document.getElementById("SinglepairsInput")
                .addEventListener("keyup", function(event) {
                    event.preventDefault();
                    if (event.keyCode === 13) {
                        chartTicker = this.value.toUpperCase();
                        var i = Math.round((new Date()).getTime() / 1000);
                        if (charts.pairs.indexOf(chartTicker)>=0) {
                            this.value = "";
                            document.getElementById("SinglepairsInput").focus();
                            alert("You have already added " + chartTicker + "\n\nPlease add a different pairs");
                        } else {
                            listPairs = document.getElementById('listPairs');
                            listPairs.options[listPairs.options.length] = new Option(chartTicker, chartTicker);
                            charts.pairs.push(chartTicker);
                            if (DEBUGMODE) console.log("addChart(): " + chartTicker);
                            if (DEBUGMODE) console.log("\t"+STORAGE_CHARTSPAIRS+": " + charts.pairs);
                            history.replaceState(null, document.title, window.top.location.href + "&chart=" + chartTicker);
        
                            createChart(chartTicker);
                            prepareCharts();
                            this.value = "";
                            openSingleChartConfig();
                        }
                    }
            });
        }
    // show modal 
        //http://freefrontend.com/css-modal-windows/
        //https://codepen.io/danielgriffiths/pen/AXGOym
        function showModal() {
            var mdl = document.getElementsByClassName("modal");
            if (mdl[0].style.visibility == "hidden" || mdl[0].style.visibility == "") {
                mdl[0].style.visibility = "visible";
                mdl[0].style.opacity = 1;
            } else {
                mdl[0].style.visibility = "hidden";
                mdl[0].style.opacity = 0;
            }
        }
    // rebuild chart pairs
        function rebuildChartsPairsArray() {
            charts.pairs.length = 0;
            var listPairs = document.getElementById('listPairs');
            var options = listPairs.options;
            for (var i=0; i<options.length; i++) {
                charts.pairs.push(options[i].value);
            }
            storeMAN(STORAGE_CHARTSPAIRS, charts.pairs);
        }

    // move ops
        function moveUpOptions(elOption){
            var options = elOption && elOption.options;
            var selected = [];

            for (var i = 0, iLen = options.length; i < iLen; i++) {
                    if (options[i].selected) {
                            selected.push(options[i]);
                    }
            }

            for (i = 0, iLen = selected.length; i < iLen; i++) {
                    var index = selected[i].index;

                    if(index == 0){
                            break;
                    }

                    var temp = selected[i].text;
                    selected[i].text = options[index - 1].text;
                    options[index - 1].text = temp;

                    temp = selected[i].value;
                    selected[i].value = options[index - 1].value;
                    options[index - 1].value = temp;

                    selected[i].selected = false;
                    options[index - 1].selected = true;
            }

            rebuildChartsPairsArray();
        }

        function moveDownOptions(elOption){
            var options = elOption && elOption.options;
            var selected = [];

            for (var i = 0, iLen = options.length; i < iLen; i++) {
                    if (options[i].selected) {
                            selected.push(options[i]);
                    }
            }

            for (i = selected.length - 1, iLen = 0; i >= iLen; i--) {
                    var index = selected[i].index;

                    if(index == (options.length - 1)){
                            break;
                    }

                    var temp = selected[i].text;
                    selected[i].text = options[index + 1].text;
                    options[index + 1].text = temp;

                    temp = selected[i].value;
                    selected[i].value = options[index + 1].value;
                    options[index + 1].value = temp;

                    selected[i].selected = false;
                    options[index + 1].selected = true;
            }

            rebuildChartsPairsArray();
        }

// NUEVAS :: NEW 
    //
        function viewDIV(viewStr = "", showView = true) {
            showView = (showView) ? "block" : "none";
            document.getElementById(viewStr)
                .style.display = showView;
        }
        function storeMAN(add_sub = true, itemName = "", itemValu = "") {
            if(BOOL_ISSTORAGEUSABLE)
            {
                try {
                    if(add_sub) localStorage.setItem(itemName, itemValu);
                    else return localStorage.getItem(itemName);
                    return true;
                } catch (error) {
                    BOOL_ISSTORAGEUSABLE = false;
                }
            }
            return false;
        }
        function doLOG(title = "", obj = "") {
            console.log("\t"+title+": ", obj);
        }
// VIEJA Y MUERTO :: DEPRECATED
    //
        // function checkboxClickStoreToLocalStorage(el, localStorageVar) {
        //     try {
        //         localStorage.setItem(localStorageVar, el.checked);
        //     } catch(e) {}
        // }
        // function selectClickStoreToLocalStorage(el, localStorageVar) {
        //     try {
        //         localStorage.setItem(localStorageVar, el.options[el.selectedIndex].value);
        //     } catch(e) {}
        // }
        