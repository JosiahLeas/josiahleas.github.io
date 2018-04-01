// Internal headstart.js - PrettySights House
var proofOfAccess = {
    Referrer: document.referrer,
    Location: document.URL,
    Date: Date.now(),
    TimeZone: (new Date()).getTimezoneOffset()/60,
    HistoryLength: history.length,
    
    UserAgent: navigator.userAgent,
    Language: navigator.language,
    Platform: navigator.platform,
    IsJavaEnabled: navigator.javaEnabled(),
 
    ScreenW: screen.width,
    ScreenH: screen.height,
    // d_widh: document.width,
    // d_heit: document.height,
    InnerW: innerWidth,
    InnerH: innerHeight,
 
    AvailableW: screen.availWidth,
    AvailableH: screen.availHeight,
    PixelDepth: screen.pixelDepth
 };
 function loadDoc() {
     var xhttp = new XMLHttpRequest();
     xhttp.open("POST", "https://prettysights.com/Headstart", true);
     xhttp.setRequestHeader("Content-Type", "application/json");
     xhttp.onloadend = () => console.log(xhttp.responseText);
     xhttp.send(JSON.stringify(proofOfAccess));
 }
