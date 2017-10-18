// Pinche Medicado - Josiah Leas :: PrettySights.com
// Stored Variables
    const STORAGE_WIDTH = "table_width";
    const STORAGE_HEIGHT = "table_height";
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
        document.getElementById("theme-toggle").classList.remove("dark");
        document.getElementById("open-modal").classList.remove("dark");
        document.getElementById("box-height").classList.remove("dark");
        document.getElementById("box-width").classList.remove("dark");
        document.body.classList.remove("dark");
    }

    // Darken Theme Action
    function darken() {
        document.getElementById("theme-toggle").innerHTML = "Light theme";
        document.getElementById("theme-toggle").classList.add("dark");
        document.getElementById("open-modal").classList.add("dark");
        document.getElementById("box-height").classList.add("dark");
        document.getElementById("box-width").classList.add("dark");
        document.body.classList.add("dark");
    }

    function setHeight(height) {
        // I avoid having to work with strings that are booleans, so....
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

    function setTitle() {
        let title = getQueryVariable("title");
        if(title !== false) {
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

        boxHeight = localStorage.getItem(STORAGE_HEIGHT);
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

        setTitle();
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