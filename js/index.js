// Pinche Medicado - Josiah Leas :: PrettySights.com
// Stored Variables
    const STORAGE_WIDTH = "table_width";
    const STORAGE_HEIGHT = "table_height";
    let dark = null;
    try {
        dark = localStorage.getItem('theme-dark');
    } catch(e) {
        //document.body.appendChild(document.createTextNode("This browser doesn't allow localStorage execution, and will therefore not work for you"));
    }
    let boxWidth = '';
    let boxHeight = '';
    let charts = { pairs: [] };

    if (dark === "false" || dark === null) {
        dark = "false";
    } else {
        dark = "true";
    }

    // Change Theme Button
    function change_theme() {
        if (dark === "true") {
            lighten();
        } else {
            darken();
        }
        window.location.reload();
    }

    // Lighten Theme Action
    function lighten() {
        document.getElementById("theme-toggle").innerHTML = "Dark theme";
        document.getElementById("open-modal").classList.remove("dark");
        document.getElementById("box-height").classList.remove("dark");
        document.getElementById("box-width").classList.remove("dark");
        document.body.classList.remove("dark");
        try {
            localStorage.setItem('theme-dark', "false");
        } catch(e) {
        }
        dark = "false";
    }

    // Darken Theme Action
    function darken() {
        document.getElementById("theme-toggle").innerHTML = "Light theme";
        document.getElementById("open-modal").classList.add("dark");
        document.getElementById("box-height").classList.add("dark");
        document.getElementById("box-width").classList.add("dark");
        document.body.classList.add("dark");
        try {
            localStorage.setItem('theme-dark', "true");
        } catch(e) {
        }
        dark = "true";
    }

    function setHeight(height) {
        // I avoid having to work with strings that are booleans, so....
        try {
            height = JSON.parse(height);
        } catch(e) {}
        for(let i = 0; i < charts.pairs.length; i++) {
            let element = document.getElementById("box" + i);
            element.style.height = "calc((100% / " + (height) + ") - (" + (29/height) + "px)";
        }
        try {
            localStorage.setItem(STORAGE_HEIGHT, height);
        } catch(e) {
        }
        boxHeight = height;
    }

    function setWidth(width) {
        try {
            width = JSON.parse(width);
        } catch(e) {}
        for(let i = 0; i < charts.pairs.length; i++) {
            let element = document.getElementById("box" + i);
            element.style.width = "calc(100% / " + (width) + ")";
        }
        try {
            localStorage.setItem(STORAGE_WIDTH, width);
        } catch(e) {}
        boxWidth = width;
    }

    function setTitle() {
        let title = getQueryVariable("title");
        if(title !== false) {
            document.title = decodeURI(title);
        }
    }

    function setChartCount() {
        document.getElementById("chart-count").innerHTML = charts.pairs.length + " charts";
    }

    function setChartsByParameters(url) {
        url = window.location.href;
        let expression = /[?&]chart(=([^&#]*)|&|#|$)/g;
        let match;
        let i = 0;

        while ((match = expression.exec(url)) !== null) {
            charts.pairs.push(match[2].replace(/\+/g, " "));
            i++;
        }
        // Since we do global matching on the url, we need to keep track of whether
        // anything was found manually (otherwise expression.test would've taken
        // care of it
        if (i === 0) {
            charts.pairs.push("bittrex:btcusdt");
            charts.pairs.push("kraken:btcusd");
            charts.pairs.push("okcoin:btcusd");
            let urlPath = location.href + "?chart=bittrex:btcusdt&chart=kraken:btcusd&chart=okcoin:btcusd&title=BTC USD exchanges";
            //Updates the URL location field in the browser
            history.replaceState("something", "something", urlPath);
        }

        return charts;
    }

    function setCharts() {
        charts = setChartsByParameters();
    }

    function getNrOfCharts() {
        return charts.pairs.length;
    }

    function toggleFullscreenChart(elementId) {
        let box = document.getElementById(elementId);

        if(box.classList.contains("fullscreen")) {
            box.classList.remove("fullscreen");
        } else {
            box.classList.add("fullscreen");
        }

    }

    function initialiseUI() {
        boxWidth = 1;
        try {
            boxWidth = localStorage.getItem(STORAGE_WIDTH);
        } catch(e) {
        }
        let boxWidthRange = document.getElementById("box-width");
        if(boxWidth !== null) {
            setWidth(parseInt(boxWidth));
            boxWidthRange.value = boxWidth;
        } else {
            setWidth(parseInt(1));
            boxWidthRange.value = 1;
        }
        boxWidthRange.addEventListener("change", function() {
            setWidth(parseInt(boxWidthRange.value));
        }, true);

        boxHeight = 1;
        try {
            boxHeight = localStorage.getItem(STORAGE_HEIGHT);
        } catch(e) {
        }
        let boxHeightRange = document.getElementById("box-height");
        if(boxHeight !== null) {
            setHeight(parseInt(boxHeight));
            boxHeightRange.value = boxHeight;
        } else {
            setHeight(parseInt(1));
            boxHeightRange.value = 1;
        }
        boxHeightRange.addEventListener("change", function() {
            setHeight(parseInt(boxHeightRange.value));
        }, true);

        if(dark === "true") {
            darken();
        } else {
            lighten();
        }
        setTitle();
        setChartCount();
    }

    function getQueryVariable(variable) {
        let query = window.location.search.substring(1);
        let vars = query.split("&");
        for (let i=0;i<vars.length;i++) {
            let pair = vars[i].split("=");
            if(pair[0] === variable){
                return pair[1];
            }
        }
        return(false);
    }