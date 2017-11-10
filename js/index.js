// Pinche Medicado - Josiah Leas :: PrettySights.com
// Stored Variables
    const STORAGE_WIDTH = "table_width";
    const STORAGE_HEIGHT = "table_height";
    let dark = null;
    // Currently we need to read this on startup to give the charts the right theme
    try {
        dark = JSON.parse(localStorage.getItem("theme-dark")); // Let booleans be booleans
        console.log(dark);
    } catch(e) {
        //document.body.appendChild(document.createTextNode("This browser doesn't allow localStorage execution, and will therefore not be a good experience for you"));
    }
    let boxWidth = '';
    let boxHeight = '';
    var charts = { pairs: [] };

// Startup
    function initialiseUI() {
        boxWidth = 3; // Default width if we don't have anything in local storage
        try {
            boxWidth = localStorage.getItem(STORAGE_WIDTH); // Safari doesn't allow localstorage
        } catch(e) {}
        let boxWidthRange = document.getElementById("box-width");
        if(boxWidth !== null) {
            setWidth(parseInt(boxWidth));
            boxWidthRange.value = boxWidth;
        } else {
            setWidth(parseInt(2));
            boxWidthRange.value = 2;
        }
        boxWidthRange.addEventListener("change", function() {
            setWidth(parseInt(boxWidthRange.value));
        }, true);

        boxHeight = 1; // Default height if we don't have anything in local storage
        try {
            boxHeight = localStorage.getItem(STORAGE_HEIGHT); // Safari doesn't allow localstorage
        } catch(e) {}
        let boxHeightRange = document.getElementById("box-height");
        if(boxHeight !== null) {
            setHeight(parseInt(boxHeight));
            boxHeightRange.value = boxHeight;
        } else {
            setHeight(parseInt(2));
            boxHeightRange.value = 2;
        }
        boxHeightRange.addEventListener("change", function() {
            setHeight(parseInt(boxHeightRange.value));
        }, true);

        if (dark === null || !dark) {
            lighten();
        } else {
            darken();
        }

        setTitle();
        setChartCount();
    }
// HTML called functions
    function setCharts() {
        charts = setChartsByParameters();
        //console.log("Charts ->",charts);
        if (charts.pairs.length > 0) {
            document.getElementById("nocharts").style.display = "none";
            document.getElementById("top-nav").style.display = "block";
        }
        return charts;
    }
    function getNrOfCharts() {
        return charts.pairs.length;
    }

// Functions

    // Change Theme Button
    function change_theme() {
        if (dark === true) {
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
            localStorage.setItem("theme-dark", "false");
        } catch(e) {}
        dark = false;
    }

    // Darken Theme Action
    function darken() {
        document.getElementById("theme-toggle").innerHTML = "Light theme";
        document.getElementById("open-modal").classList.add("dark");
        document.getElementById("box-height").classList.add("dark");
        document.getElementById("box-width").classList.add("dark");
        document.body.classList.add("dark");
        try {
            localStorage.setItem("theme-dark", "true");
        } catch(e) {}
        dark = true;
    }

    function setHeight(height) {
        try {
            height = JSON.parse(height);
        } catch(e) {}
        for(let i = 0; i < charts.pairs.length; i++) {
            let element = document.getElementById("box" + i);
            element.style.height = "calc((100% / " + (height) + ") - (" + (29/height) + "px)";
        }
        try {
            localStorage.setItem(STORAGE_HEIGHT, height);
        } catch(e) {}
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
            document.title = title;
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
        while(match = expression.exec(url)) {
            charts.pairs.push(match[2].replace(/\+/g, " "));
            i++;
        }
        return charts;
    }

    // On_Off Fullscreen Button
    function toggleFullscreenChart(elementId) {
        let box = document.getElementById(elementId);

        if(box.classList.contains("fullscreen")) {
            box.classList.remove("fullscreen");
        } else {
            box.classList.add("fullscreen");
        }

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