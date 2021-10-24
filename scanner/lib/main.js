import { render, html as renderer } from '//unpkg.com/uhtml?module'
import { useState, define as definer } from '//unpkg.com/hooked-elements?module'
import handler from '//unpkg.com/reactive-props?module'

const key = Symbol("defining-key")
const KEBAB_REGEX = /([A-Z\u00C0-\u00D6\u00D8-\u00DE])/g

export const css = String.raw
export const reactive = handler({useState})
export function html(strings = [""], ...props) {
    const raw = strings.raw.slice(0)
    const str = strings.slice(0)
    
    for (let i = str.length - 1; i >= 0; i--) {
        const p = props[i]
        if(!(p instanceof Function) || !(key in p)) 
            continue

        str[i] = `${str[i]}${p[key]}${str[i + 1]}`
        raw[i] = `${raw[i]}${p[key]}${raw[i + 1]}`
        props.splice(i, 1)
        str.splice(i + 1, 1)
        raw.splice(i + 1, 1)
    }
    str.raw = raw
    return renderer(str, ...props)
}
// export const html = (s, ...p) => renderer(s, ...p)
export function define(func, str, style) {
    func[key] = str ? str :
        `x${func.name.replace(KEBAB_REGEX, "-$1").toLowerCase()}`
    definer(func[key], func)
    if(style) {
        const el = document.createElement("style")
        el.innerText = style
        document.head.append(el)
    } 
}

export function create(func) {
    return document.createElement(func[key])
}