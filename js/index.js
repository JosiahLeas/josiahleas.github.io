// Pinche Medicado - Josiah Leas :: PrettySights.com
// Stored Variables
var dark = localStorage.getItem('theme_bool');
var table = localStorage.getItem('table_bool');

// Resume their theme
window.onload = theme;

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

// Change Table Dimensions Button and Action
function change_table() {
    if (table === "true" || table === null) {
        document.getElementById("b1")
            .style.display = "none";
        document.getElementById("b2")
            .style.display = "none";
        document.getElementById("b3")
            .style.height = "100%";
        document.getElementById("b4")
            .style.height = "100%";

        table = "false";
    }
    else if (table === "false") {
        document.getElementById("b1")
            .style.display = "flex";
        document.getElementById("b2")
            .style.display = "flex";

        table = "true";
    }
    else {
        document.getElementById("b1")
            .style.display = "none";
        document.getElementById("b2")
            .style.display = "none";
        document.getElementById("b3")
            .style.height = "100%";
        document.getElementById("b4")
            .style.height = "100%";

        table = "false";
    }
}

