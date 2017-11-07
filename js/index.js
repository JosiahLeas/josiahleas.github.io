// Pinche Medicado - Josiah Leas :: PrettySights.com
// Stored Variables
    const STORAGE_WIDTH = "table_width";
    const STORAGE_HEIGHT = "table_height";
    let dark = localStorage.getItem('theme-dark');
    let boxWidth = '';
    let boxHeight = '';
    var charts = { pairs: [] };

    if (dark === "false" || dark === null) {
        dark = "false";
    } else {
        dark = "true";
    }

// Startup
    function initialiseUI() {
        boxWidth = localStorage.getItem(STORAGE_WIDTH);
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

        boxHeight = localStorage.getItem(STORAGE_HEIGHT);
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

        // if(dark === "true") {
        //     darken();
        // } else {
        //     lighten();
        // }
        // setTitle();
        setChartCount();
    }
// HTML called functions
    function setCharts() {
        charts = setChartsByParameters();
        console.log("Charts ->",charts);
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
        localStorage.setItem('theme-dark', "false");
        dark = "false";
    }

    // Darken Theme Action
    function darken() {
        document.getElementById("theme-toggle").innerHTML = "Light theme";
        document.getElementById("open-modal").classList.add("dark");
        document.getElementById("box-height").classList.add("dark");
        document.getElementById("box-width").classList.add("dark");
        document.body.classList.add("dark");
        localStorage.setItem('theme-dark', "true");
        dark = "true";
    }

    function setHeight(height) {
        // I avoid having to work with strings that are booleans, so....
        // Works for me great job btw # p.m.
        height = JSON.parse(height);
        for(let i = 0; i < charts.pairs.length; i++) {
            let element = document.getElementById("box" + i);
            switch(height) {
                case 2:
                    element.classList.remove("box-height-third");
                    element.classList.add("box-height-half");
                    break;
                case 3:
                    element.classList.add("box-height-third");
                    element.classList.remove("box-height-half");
                    break;
                default:
                    element.classList.remove("box-height-third");
                    element.classList.remove("box-height-half");
            }
        }
        localStorage.setItem(STORAGE_HEIGHT, height);
        boxHeight = height;
    }

    function setWidth(width) {
        if(charts.pairs.length > 0) {
            for(let i = 0; i < charts.pairs.length; i++) {
                let element = document.getElementById("box" + i);
                switch(width) {
                    case 2:
                        element.classList.remove("box-width-third");
                        element.classList.add("box-width-half");
                        break;
                    case 3:
                        element.classList.remove("box-width-half");
                        element.classList.add("box-width-third");
                        break;
                    default:
                        element.classList.remove("box-width-third");
                        element.classList.remove("box-width-half");
                }
            }
            localStorage.setItem(STORAGE_WIDTH, width);
            boxWidth = width;
            }
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