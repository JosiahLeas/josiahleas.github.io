let leftPageTime = 0

window.onblur = onblur
window.onfocus = onfocus

function onblur() {
    leftPageTime = Date.now()
}

function onfocus() {
    if (leftPageTime < Date.now() - 2 * 60 * 1000){
        window.location.reload()
    }
}