import { createEffect, createSignal, createComputed, createMemo } from "./solid-js.js"

// reference-resolver-x uses solid-js/html, however commenting this line allows it to, 
// for the most part, work on typical JSX as intended.
import parser from "./html.js"

// Simple HTML helpers
export const css = String.raw
export const html = parser
export const selector = (cssText = "", cssSelector = "") => cssText.replaceAll("\\&", cssSelector)
export const [globalStyle, setGlobalStyle] = createSignal([])
export const add_style = style => {
    const sty = document.createElement("style")
    sty.textContent = style
    document.head.append(sty)
    // document.head.append(html`<style textContent=${add_style}>&nbsp;</style>`)
}
export const all_styles = createMemo(() => globalStyle().join(""))


// JSDoc lies to the vscode of this function's return type
// it returns a Solid Accessor, but we claim an identity function.
/** @type {<T>(t: T) => T} */
export const useSignal = state => Helpers.create_representation(createSignal(state))

// On every Solid Accessor that passes through `create_representation` 
// we attach this key as a property name. The value is the Solid Setter 
const REACTOR = Symbol.for("STORED SETTER")

const Helpers = {
    create_representation(hooksArray = [x => x, x => {}]) {
        const wrapper = hooksArray[0]
        hooksArray[0][REACTOR] = hooksArray[1]
        wrapper[REACTOR] = hooksArray[1]
        return wrapper
    },
    // this is the default executor for useCallback, it does not track dependencies.
    inert_callback: callback => callback(),
    can_unwrap_reactor: maybe_reactor => 
        maybe_reactor && 
        typeof maybe_reactor == "function" && 
        REACTOR in maybe_reactor,
}

class Computed {
    // createScope is the internal name 
    // alongside definition of useResolver
    static createScope(callback_eval = x => y) {
        if(Computed.ACTIVE_REACTIVE) 
            callback_eval = Computed.createInnerScope(callback_eval)
        
        return { 
            /** @param {Function} callback */
            useEffect: (callback, initializer = undefined) =>
                new Computed(callback, callback_eval, createEffect)
                    .initialize([initializer]),
            /** @param {Function} callback */
            useMemo: (callback, initializer = undefined) =>
                new Computed(callback, callback_eval, createMemo)
                    .initialize([initializer]),
            // second parameter can optionally be createEffect or createMemo from Solid
            // or some other tracking function
            /** @type {<T extends (...args: any[]) => any>(callback: T): T} */
            useCallback: (callback, as = Helpers.inert_callback) => {
                const fn = new Computed(callback, callback_eval, as)
                return (...args) => fn.initialize(args)
            }
        }
    }
    static createInnerScope(inner_callback_eval = x => y) {
        const outer = Computed.ACTIVE_REACTIVE.scope
        return var_name => {
            try {
                Computed.ACTIVE_INNERSCOPE = true
                return inner_callback_eval(var_name)
            } catch (error) {
                return outer(var_name)
            }
            finally {
                Computed.ACTIVE_INNERSCOPE = false
            }
        }
    }
    constructor(callback = proxy => new Promise, scope = x => Symbol(), resolver = x => x) {
        // for now, the resolver children compile the function only once.
        // if real JS parsing were used, `with`, `Proxy` wouldn't be required
        // but then it would be no different than Svelte
        const compilation = Function(`with(arguments[0]) { return (${callback})(...arguments[1]) }`)
        
        this.callback = args => compilation(Computed.computationalProxy, args)
        this.resolver = resolver
        this.scope = scope
    }
    initialize(args = []) {
        const pointer = this.resolver(() => {
            const inactive = Computed.ACTIVE_REACTIVE
            Computed.ACTIVE_REACTIVE = this
            const result = this.callback(args)
            Computed.ACTIVE_REACTIVE = inactive

            return result
        })
        
        if(Helpers.can_unwrap_reactor(pointer))
            return pointer
        else if(pointer && typeof pointer == "function") 
            return Helpers.create_representation([pointer])
        else return pointer
    }
}
Computed.computationalProxy = new Proxy({}, {
    get: (x0, prop, x1) => {
        if(typeof prop == "symbol") return

        let id = Computed.ACTIVE_REACTIVE.scope(prop)
        
        // variable is RR signal
        if(Helpers.can_unwrap_reactor(id)) {
            id = id()
            return Helpers.can_unwrap_reactor(id) ? id() : id
        }
        // variable is not RR signal 
        else return id
    },
    set: (x0, prop, val, x1) => {
        let id = Computed.ACTIVE_REACTIVE.scope(prop)

        // variable is RR signal
        if(Helpers.can_unwrap_reactor(id))
            return id[REACTOR](val)
        
        // variable is not an RR signal
        Computed.ACTIVE_REACTIVE.scope(`${prop} = ${val}`)
    },
    has: (x0, prop) => {
        // try/catch: scope() throws to denote not found.
        try {
            return !Computed.ACTIVE_INNERSCOPE && 
                prop != "arguments" && 
                (!(prop in globalThis) || // if not in `window` then claim
                globalThis[prop] !== (Computed.ACTIVE_REACTIVE.scope(prop))) // if *is* in `window` possibly a simple name collision

                // if prop really is pointing to `window` property, reject! window functions can throw if claimed
        } 
        catch (error) { return false }
    }
        
})

export const useResolver = Computed.createScope
