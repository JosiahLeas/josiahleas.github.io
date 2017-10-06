// Pinche Medicado - Josiah Leas :: PrettySights.com
// Stored Variables
    var dark = localStorage.getItem('theme_bool');
    var table = localStorage.getItem('table_bool');
    var params = localStorage.getItem('param_string');
    var a, b, c, d;
    var expanded = false;

// Resume their theme
    document.onreadystatechange = theme;

// Theme
    // Test and Set Theme from Storage
    function theme() {
        if (dark === "true" || dark === null) {
            document.getElementById("theme_toggle")
                .innerHTML = "Dark";
            lighten();
        }
        else if (dark === "false") {
            document.getElementById("theme_toggle")
                .innerText = "Light";
            darken();
        }
        else {
            document.getElementById("theme_toggle")
                .innerText = "Dark";
            lighten();
        }
    }

    // Change Theme Button
    function change_theme() {
        if (dark === "true") {
            localStorage.setItem('theme_bool', "false");
            dark = "false";
        }
        else {
            localStorage.setItem('theme_bool', "true");
            dark = "true";
        }
        theme();
        window.location.reload();
    }

    // Lighten Theme Action
    function lighten() {
        console.log("lightening...");
        document.getElementById("open-modal")
            .style.background = "#ddd";
        document.getElementById("myTopnav")
            .style.background = "#ddd";
        document.getElementById("theme_toggle")
            .style.color = "#333";
        document.getElementById("theme_toggle")
            .style.background = "#eee";
        document.getElementById("table_toggle")
            .style.color = "#333";
        document.getElementById("table_toggle")
            .style.background = "#eee";

    }

    // Darken Theme Action
    function darken() {
        console.log("darkening...");
        document.getElementById("open-modal")
            .style.background = "#333";
        document.getElementById("myTopnav")
            .style.background = "#333";
        document.getElementById("theme_toggle")
            .style.color = "#ddd";
        document.getElementById("theme_toggle")
            .style.background = "#444";
        document.getElementById("table_toggle")
            .style.color = "#ddd";
        document.getElementById("table_toggle")
            .style.background = "#444";

    }

// Grid Change
    // Change Table Dimensions Button and Action Expanding and Resetting
    function change_table(id = null) {
        if(id === null) {
            if (table === "true" || table === null) {
                document.getElementById("b3")
                    .style.visibility = "collapse";
                document.getElementById("b4")
                    .style.visibility = "collapse";
                document.getElementById("b3")
                    .style.height = "0";
                document.getElementById("b4")
                    .style.height = "0";
                document.getElementById("b1")
                    .style.height = "calc(100% - 35px)";
                document.getElementById("b2")
                    .style.height = "calc(100% - 35px)";

                document.getElementById("table_toggle")
                    .innerHTML = "2x2";
                table = "false";
            }
            else if (table === "false") {
                document.getElementById("b3")
                    .style.visibility = "visible";
                document.getElementById("b4")
                    .style.visibility = "visible";
                document.getElementById("b3")
                    .style.height = "calc(50% - 18px)";
                document.getElementById("b4")
                    .style.height = "calc(50% - 18px)";
                document.getElementById("b1")
                    .style.height = "calc(50% - 18px)";
                document.getElementById("b2")
                    .style.height = "calc(50% - 18px)";

                document.getElementById("table_toggle")
                    .innerHTML = "1x2";
                table = "true";
            }
            else {
                document.getElementById("b3")
                    .style.visibility = "collapse";
                document.getElementById("b4")
                    .style.visibility = "collapse";
                document.getElementById("b3")
                    .style.height = "0";
                document.getElementById("b4")
                    .style.height = "0";
                document.getElementById("b1")
                    .style.height = "calc(100% - 72px)";
                document.getElementById("b2")
                    .style.height = "calc(100% - 72px)";

                table = "false";
            }
        }
        else if (expanded) {
            document.getElementById("b1")
                .style.visibility = "visible";
            document.getElementById("b2")
                .style.visibility = "visible";
            document.getElementById("b3")
                .style.visibility = "visible";
            document.getElementById("b4")
                .style.visibility = "visible";

            document.getElementById("b1")
                .style.height = "calc(50% - 18px)"; 
            document.getElementById("b2")
                .style.height = "calc(50% - 18px)"; 
            document.getElementById("b3")
                .style.height = "calc(50% - 18px)"; 
            document.getElementById("b4")
                .style.height = "calc(50% - 18px)"; 

            document.getElementById("b1")
                .style.width = "50%";
            document.getElementById("b2")
                .style.width = "50%";
            document.getElementById("b3")
                .style.width = "50%";
            document.getElementById("b4")
                .style.width = "50%"; 
                
            expanded = false;
        }
        else if(id === 1 && !expanded) {
            document.getElementById("b2")
                .style.visibility = "collapse";
            document.getElementById("b3")
                .style.visibility = "collapse";
            document.getElementById("b4")
                .style.visibility = "collapse";
            document.getElementById("b2")
                .style.height = "0";        
            document.getElementById("b3")
                .style.height = "0";
            document.getElementById("b4")
                .style.height = "0";

            document.getElementById("b1")
                .style.height = "calc(100% - 35px)";
            document.getElementById("b1")
                .style.width = "100%";

            expanded = true;
        }
        else if(id === 2 && !expanded) {
            document.getElementById("b1")
                .style.visibility = "collapse";
            document.getElementById("b3")
                .style.visibility = "collapse";
            document.getElementById("b4")
                .style.visibility = "collapse";
            document.getElementById("b1")
                .style.height = "0";        
            document.getElementById("b3")
                .style.height = "0";
            document.getElementById("b4")
                .style.height = "0";

            document.getElementById("b2")
                .style.height = "calc(100% - 35px)";
            document.getElementById("b2")
                .style.width = "100%";

            expanded = true;
        }
        else if(id === 3 && !expanded) {
            document.getElementById("b1")
                .style.visibility = "collapse";
            document.getElementById("b2")
                .style.visibility = "collapse";
            document.getElementById("b4")
                .style.visibility = "collapse";
            document.getElementById("b1")
                .style.height = "0";        
            document.getElementById("b2")
                .style.height = "0";
            document.getElementById("b4")
                .style.height = "0";

            document.getElementById("b3")
                .style.height = "calc(100% - 35px)";
            document.getElementById("b3")
                .style.width = "100%";

            expanded = true;
        }
        else if(id === 4 && !expanded) {
            document.getElementById("b1")
                .style.visibility = "collapse";
            document.getElementById("b2")
                .style.visibility = "collapse";
            document.getElementById("b3")
                .style.visibility = "collapse";
            document.getElementById("b1")
                .style.height = "0";
            document.getElementById("b2")
                .style.height = "0";        
            document.getElementById("b3")
                .style.height = "0";

            document.getElementById("b4")
                .style.height = "calc(100% - 35px)";
            document.getElementById("b4")
                .style.width = "100%";

            expanded = true;
        }
    }
// URL Params
    // Get url parameters 1, 2, 3, 4 via call
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function read(letter) {
        switch(letter) {
            case "a":
                a = getParameterByName("a");
                if(!a && params) params.split('_')[0];
                return a;

            case "b":
                b = getParameterByName("b");
                if(!b && params) params.split('_')[1];
                return b;

            case "c":
                c = getParameterByName("c");
                if(!c && params) params.split('_')[2];
                return c;

            case "d":
                d = getParameterByName("d");
                if(!d && params) params.split('_')[3];
                return d;
        }
    }

