// Pinche Medicado - Josiah Leas :: PrettySights.com
// Stored Variables
const DEBUGMODE = false; //change to false when deploying

const STORAGE_USEDARKTHEME = "useDarkTheme";
const STORAGE_WIDTH = "table_width";
const STORAGE_HEIGHT = "table_height";
const DEFAULT_LAYOUT_WIDTH = 2;
const DEFAULT_LAYOUT_HEIGHT = 2;
const STORAGE_TIMEZONE = "timezone";
const STORAGE_INTERVAL = "interval";
const STORAGE_SHOWDETAILS = "showDetails";
const STORAGE_SHOWBOTTOMTOOLBAR = "showBottomToolbar";
const STORAGE_ALLOWSYMBOLCHANGE = "allowSymbolChange";
const STORAGE_USESMALLBUTTON = "useSmallButton";
const STORAGE_CHARTSPAIRS = "charts.pairs";
const BASEURL_COINIGY = "https://www.coinigy.com/main/markets";

let dark = null;
let boxWidth = '';
let boxHeight = '';
var charts = {
	pairs: []
};

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
					setupUI();
					this.value = "";
					openSingleChartConfig();
				}
			}
	});
}

function initializePage() {
	bindInputKeyUp();

	if (DEBUGMODE) console.log("initializePage()");
	
	//get charts pairs in the url if any
	setChartsByParameters();
	try {
		localStorage.setItem(STORAGE_CHARTSPAIRS, charts.pairs);
	} catch(e) {}
	if (DEBUGMODE) console.log("\t"+STORAGE_CHARTSPAIRS+": ", charts.pairs);
	
	// Currently we need to read this on startup to give the charts the right theme
	try {
		dark = JSON.parse(localStorage.getItem(STORAGE_USEDARKTHEME)); // Let booleans be booleans
	} catch (e) {
		//https://stackoverflow.com/a/11214467
		//document.body.appendChild(document.createTextNode("This browser doesn't allow localStorage execution, and will therefore not be a good experience for you"));
	}
	if (DEBUGMODE) console.log("\t"+STORAGE_USEDARKTHEME+": " + dark);

	//get additional chart parameters value from localstorage
	var selectOptionValue = "";
	try {
		selectOptionValue = localStorage.getItem(STORAGE_TIMEZONE);
	} catch(e) {}
	document.getElementById("timezone").value = selectOptionValue;
	if (DEBUGMODE) console.log("\t"+STORAGE_TIMEZONE+": ", selectOptionValue);
	selectClickStoreToLocalStorage(document.getElementById("timezone"), STORAGE_TIMEZONE);

	selectOptionValue = "";
	try {
		selectOptionValue = localStorage.getItem(STORAGE_INTERVAL);
	} catch(e) {}
	document.getElementById("interval").value = selectOptionValue;
	if (DEBUGMODE) console.log("\t"+STORAGE_INTERVAL+": ", selectOptionValue);
	selectClickStoreToLocalStorage(document.getElementById("interval"), STORAGE_INTERVAL);

	var checkboxState = false;
	try {
		checkboxState = localStorage.getItem(STORAGE_SHOWDETAILS);
	} catch(e) {}
	document.getElementById("details").checked = (checkboxState === 'true');
	if (DEBUGMODE) console.log("\t"+STORAGE_SHOWDETAILS+": ", checkboxState);
	checkboxClickStoreToLocalStorage(document.getElementById("details"), STORAGE_SHOWDETAILS);

	checkboxState = false;
	try {
		checkboxState = localStorage.getItem(STORAGE_SHOWBOTTOMTOOLBAR);
	} catch(e) {}
	document.getElementById("withdateranges").checked = (checkboxState === 'true');
	if (DEBUGMODE) console.log("\t"+STORAGE_SHOWBOTTOMTOOLBAR+": ", checkboxState);
	checkboxClickStoreToLocalStorage(document.getElementById("withdateranges"), STORAGE_SHOWBOTTOMTOOLBAR);
	
	checkboxState = false;
	try {
		checkboxState = localStorage.getItem(STORAGE_ALLOWSYMBOLCHANGE);
	} catch(e) {}
	document.getElementById("allow_symbol_change").checked = (checkboxState === 'true');
	if (DEBUGMODE) console.log("\t"+STORAGE_ALLOWSYMBOLCHANGE+": ", checkboxState);
	checkboxClickStoreToLocalStorage(document.getElementById("allow_symbol_change"), STORAGE_ALLOWSYMBOLCHANGE);
	
	checkboxState = false;
	try {
		checkboxState = localStorage.getItem(STORAGE_USESMALLBUTTON);
	} catch(e) {}
	document.getElementById("usesmallbutton").checked = (checkboxState === 'true');
	if (DEBUGMODE) console.log("\t"+STORAGE_USESMALLBUTTON+": ", checkboxState);
	checkboxClickStoreToLocalStorage(document.getElementById("usesmallbutton"), STORAGE_USESMALLBUTTON);
}

// Setup the UI / Charts Layout
function setupUI() {
	boxWidth = DEFAULT_LAYOUT_WIDTH; // Default width if we don't have anything in local storage
	try {
		boxWidth = localStorage.getItem(STORAGE_WIDTH); // Safari doesn't allow localstorage
	} catch (e) {}
	let boxWidthRange = document.getElementById("box-width");
	if (boxWidth !== null) {
		setWidth(parseInt(boxWidth));
		boxWidthRange.value = boxWidth;
	} else {
		setWidth(parseInt(DEFAULT_LAYOUT_WIDTH));
		boxWidthRange.value = DEFAULT_LAYOUT_WIDTH;
	}
	boxWidthRange.addEventListener("change", function () {
		setWidth(parseInt(boxWidthRange.value));
	}, true);

	boxHeight = DEFAULT_LAYOUT_HEIGHT; // Default height if we don't have anything in local storage
	try {
		boxHeight = localStorage.getItem(STORAGE_HEIGHT); // Safari doesn't allow localstorage
	} catch (e) {}
	let boxHeightRange = document.getElementById("box-height");
	if (boxHeight !== null) {
		setHeight(parseInt(boxHeight));
		boxHeightRange.value = boxHeight;
	} else {
		setHeight(parseInt(DEFAULT_LAYOUT_HEIGHT));
		boxHeightRange.value = DEFAULT_LAYOUT_HEIGHT;
	}
	boxHeightRange.addEventListener("change", function () {
		setHeight(parseInt(boxHeightRange.value));
	}, true);

	if (dark === null || !dark) {
		lighten();
	} else {
		darken();
	}

	setChartCount();
}

function startPage() {
	if (document.getElementById("nocharts").style.display == "block" || document.getElementById("nocharts").style.display == "") {
		//main index.html -> no chart parameters, read the charts.pairs, already setup during initializePage()
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
		setupUI();
	}
}

function letsGo() {
	var listPairs = document.getElementById('listPairs');
	var options = listPairs.options;
	var optl = options.length;
	if (optl == 0) {
		alert("Please input at least 1 pairs to get started");
		return;
	}
	var urlStr = "?"
	for (var i=0; i<optl; i++) {
		if (i!=0) urlStr += "&";
		urlStr += "chart=" + options[i].value;
	}
	window.top.location.href = urlStr;
}

function createChart(chartTicker) {
	let boxElement = document.createElement("div");
	//use unique id based on milliseconds
	var i = (new Date).getTime();
	boxElement.setAttribute("id", "box" + i);
	boxElement.setAttribute("class", "box");
	document.body.appendChild(boxElement);
	var theme = (dark === true ? "Dark" : "Light");
	var toolbarbg = (dark === true ? "rgb(27, 32, 48)" : "rgb(227, 232, 248)");

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

	let coinigyButtonElement = document.createElement("a");
	coinigyButtonElement.innerHTML = "<img src='images/coinigy.png' alt='Open in Coinigy' class='"+ usesmallbutton2 + "'/>";
	coinigyButtonElement.setAttribute("href", "javascript:void(0)");
	coinigyButtonElement.setAttribute("title", "Open in Coinigy");
	coinigyButtonElement.addEventListener("click", openCoinigy.bind(null,chartTicker));

	topButtonContainerElement.appendChild(coinigyButtonElement);

	let fullScreenButtonElement = document.createElement("a");
	fullScreenButtonElement.setAttribute("class", usesmallbutton);
	fullScreenButtonElement.setAttribute("href", "javascript:void(0)");
	fullScreenButtonElement.setAttribute("title", "Show in Fullscreen");
	fullScreenButtonElement.addEventListener("click", toggleFullscreenChart.bind(null, "box"+i));
	let italicsElement = document.createElement("i");
	italicsElement.setAttribute("class", "fa fa-expand");
	fullScreenButtonElement.appendChild(italicsElement);

	topButtonContainerElement.appendChild(fullScreenButtonElement);

	let removeChartButtonElement = document.createElement("a");
	removeChartButtonElement.setAttribute("class", usesmallbutton);
	removeChartButtonElement.setAttribute("href", "javascript:void(0)");
	removeChartButtonElement.setAttribute("title", "Remove this Chart");
	removeChartButtonElement.addEventListener("click", removeChart.bind(null, boxElement, chartTicker));
	italicsElement = document.createElement("i");
	italicsElement.setAttribute("class", "fa fa-times");
	removeChartButtonElement.appendChild(italicsElement);

	topButtonContainerElement.appendChild(removeChartButtonElement);

	boxElement.appendChild(topButtonContainerElement);
}

function getNrOfCharts() {
	return charts.pairs.length;
}

//Multi-Chart Config
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

//Single Chart Config
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

// Functions

// Change Theme Button
function change_theme() {
	if (dark === true) {
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
	setupUI();
}

// Lighten Theme Action
function lighten() {
	document.getElementById("theme-toggle").innerHTML = "Dark theme";
	document.getElementById("box-height").classList.remove("dark");
	document.getElementById("box-width").classList.remove("dark");
	document.body.classList.remove("dark");
	try {
		localStorage.setItem(STORAGE_USEDARKTHEME, "false");
	} catch(e) {}
	dark = false;
}

// Darken Theme Action
function darken() {
	document.getElementById("theme-toggle").innerHTML = "Light theme";
	document.getElementById("box-height").classList.add("dark");
	document.getElementById("box-width").classList.add("dark");
	document.body.classList.add("dark");
	try {
		localStorage.setItem(STORAGE_USEDARKTHEME, "true");
	} catch(e) {}
	dark = true;
}

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
	boxHeight = height;
}

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
	boxWidth = width;
}

function setChartCount() {
	document.getElementById("chart-count").innerHTML = charts.pairs.length + " charts";
}

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
			chartsPairsCSV = localStorage.getItem(STORAGE_CHARTSPAIRS); // Safari doesn't allow localstorage
		} catch (e) {
			//https://stackoverflow.com/questions/11214404/how-to-detect-if-browser-supports-html5-local-storage
			//https://stackoverflow.com/a/11214467
			//document.body.appendChild(document.createTextNode("This browser doesn't allow localStorage execution, and will therefore not be a good experience for you"));
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
		document.getElementById("top-nav").style.display = "block";
	}
}

// On_Off Fullscreen Button
function toggleFullscreenChart(elementId) {
	let box = document.getElementById(elementId);
	
	if (box.classList.contains("fullscreen")) {
		box.classList.remove("fullscreen");
	} else {
		box.classList.add("fullscreen");
	}
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

function rebuildChartsPairsArray() {
	charts.pairs.length = 0;
	var listPairs = document.getElementById('listPairs');
	var options = listPairs.options;
	for (var i=0; i<options.length; i++) {
		charts.pairs.push(options[i].value);
	}

	try {
		localStorage.setItem(STORAGE_CHARTSPAIRS, charts.pairs);
	} catch(e) {}
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
	setupUI();
	history.replaceState(null, document.title, urlStr);
	document.getElementById("pairsInput").focus();
}

function checkboxClickStoreToLocalStorage(el, localStorageVar) {
	try {
		localStorage.setItem(localStorageVar, el.checked);
	} catch(e) {}
}
function selectClickStoreToLocalStorage(el, localStorageVar) {
	try {
		localStorage.setItem(localStorageVar, el.options[el.selectedIndex].value);
	} catch(e) {}
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