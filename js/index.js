// Pinche Medicado - Josiah Leas :: PrettySights.com
// Stored Variables
    const STORAGE_WIDTH = "table_width";
    const STORAGE_HALF_HEIGHT = "table_half_height";
    let dark = localStorage.getItem('theme-bool');
    let boxWidth = '';
    let boxHeight = '';
    let charts = { pairs: [] };

    // Resume their theme
    document.onreadystatechange = theme;

// Theme
    // Test and Set Theme from Storage
    function theme() {
        if (dark === "true" || dark === null) {
            lighten();
        } else if (dark === "false") {
            darken();
        } else {
            lighten();
        }
    }

    // Change Theme Button
    function change_theme() {
        if (dark === "true") {
            localStorage.setItem('theme-bool', "false");
            dark = "false";
        } else {
            localStorage.setItem('theme-bool', "true");
            dark = "true";
        }
        theme();
        window.location.reload();
    }

    // Lighten Theme Action
    function lighten() {
        document.getElementById("theme-toggle").innerHTML = "Dark theme";
        document.getElementById("open-modal").classList.remove("dark");
        document.getElementById("theme-toggle").classList.remove("dark");
        document.getElementById("box-height-toggle").classList.remove("dark");
        document.body.classList.remove("dark");
    }

    // Darken Theme Action
    function darken() {
        document.getElementById("theme-toggle").innerHTML = "Light theme";
        document.getElementById("open-modal").classList.add("dark");
        document.getElementById("theme-toggle").classList.add("dark");
        document.getElementById("box-height-toggle").classList.add("dark");
        document.body.classList.add("dark");
    }

    function setHeight(halfHeight) {
        // I avoid having to work with strings that are booleans, so....
        halfHeight = JSON.parse(halfHeight);
        for(let i = 0; i < charts.pairs.length; i++) {
            let element = document.getElementById("box" + i);
            if(halfHeight) {
                element.classList.add("box-height-half");
            } else {
                element.classList.remove("box-height-half");
            }
        }
        if(halfHeight) {
            document.getElementById("box-height-toggle").innerHTML = "Full height";
        } else {
            document.getElementById("box-height-toggle").innerHTML = "Half height";
        }
        localStorage.setItem(STORAGE_HALF_HEIGHT, halfHeight);
        boxHeight = halfHeight;
    }

    function setWidth(size) {
        for(let i = 0; i < charts.pairs.length; i++) {
            let element = document.getElementById("box" + i);
            switch(size) {
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
        localStorage.setItem(STORAGE_WIDTH, size);
        boxWidth = size;
    }

    function setTitle() {
        let title = getQueryVariable("title");
        if(title != false) {
            document.title = title;
        }
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

    function setCharts() {
        charts = setChartsByParameters();
    }

    function getNrOfCharts() {
        return charts.pairs.length;
    }

    function initialiseUI() {
        boxWidth = localStorage.getItem(STORAGE_WIDTH);
        boxHeight = localStorage.getItem(STORAGE_HALF_HEIGHT);
        setWidth(parseInt(boxWidth));
        setHeight(boxHeight);
        let boxWidthRange = document.getElementById("box-width-range");
        if(boxWidth !== null) {
            boxWidthRange.value = boxWidth;
        } else {
            boxWidthRange.value = 1;
        }
        boxWidthRange.addEventListener("change", function() {
            setWidth(parseInt(boxWidthRange.value));
        }, true);
        setTitle();
    }

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){
                return pair[1];
            }
        }
        return(false);
    }