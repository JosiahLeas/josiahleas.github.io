import { createSignal, children, mergeProps, createComputed, untrack, batch, createEffect } from './solid-js.js';

const Transition = props => {
  let el;
  let first = true;
  const [s1, set1] = createSignal();
  const [s2, set2] = createSignal();
  const resolved = children(() => props.children);
  const name = props.name || "s";
  props = mergeProps({
    name,
    enterActiveClass: name + "-enter-active",
    enterClass: name + "-enter",
    enterToClass: name + "-enter-to",
    exitActiveClass: name + "-exit-active",
    exitClass: name + "-exit",
    exitToClass: name + "-exit-to"
  }, props);
  const {
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onBeforeExit,
    onExit,
    onAfterExit
  } = props;

  function enterTransition(el, prev) {
    // console.log("enter", el, prev)
    if("length" in el) el = el[0] // THIS FIX
    if(!el) return
    if(prev && "length" in prev) prev = prev[0] // THIS FIX
    if (!first || props.appear) {
      const enterClasses = props.enterClass.split(" ");
      const enterActiveClasses = props.enterActiveClass.split(" ");
      const enterToClasses = props.enterToClass.split(" ");
      onBeforeEnter && onBeforeEnter(el);
      
      el.classList.add(...enterClasses);
      el.classList.add(...enterActiveClasses);
      
      requestAnimationFrame(() => {
        el.classList.remove(...enterClasses);
        el.classList.add(...enterToClasses);
        onEnter && onEnter(el, endTransition);

        if (!onEnter || onEnter.length < 2) {
          el.addEventListener("transitionend", endTransition, {
            once: true
          });
          el.addEventListener("animationend", endTransition, {
            once: true
          });
        }
      });

      function endTransition() {
        if (el) {
          el.classList.remove(...enterActiveClasses);
          el.classList.remove(...enterToClasses);
          batch(() => {
            s1() !== el && set1(el);
            s2() === el && set2(undefined);
          });
          onAfterEnter && onAfterEnter(el);
          if (props.mode === "inout") exitTransition(el, prev);
        }
      }
    }

    prev && !props.mode ? set2(el) : set1(el);
  }

  function exitTransition(el, prev) {
    // console.log("exit", el, prev)
    if("length" in prev) prev = prev[0] // THIS FIX
    if(!prev) return
    if("length" in el) el = el[0] // THIS FIX
    const exitClasses = props.exitClass.split(" ");
    const exitActiveClasses = props.exitActiveClass.split(" ");
    const exitToClasses = props.exitToClass.split(" ");
    if (!prev.parentNode) return endTransition();
    onBeforeExit && onBeforeExit(prev);
    prev.classList.add(...exitClasses);
    prev.classList.add(...exitActiveClasses);
    requestAnimationFrame(() => {
      prev.classList.remove(...exitClasses);
      prev.classList.add(...exitToClasses);
    });
    onExit && onExit(prev, endTransition);

    if (!onExit || onExit.length < 2) {
      prev.addEventListener("transitionend", endTransition, {
        once: true
      });
      prev.addEventListener("animationend", endTransition, {
        once: true
      });
    }

    function endTransition() {
      prev.classList.remove(...exitActiveClasses);
      prev.classList.remove(...exitToClasses);
      s1() === prev && set1(undefined);
      onAfterExit && onAfterExit(prev);
      if (props.mode === "outin") enterTransition(el, prev);
    }
  }

  createComputed(prev => {
    el = resolved();

    while (typeof el === "function") el = el();

    return untrack(() => {
      if (el && el !== prev) {
        if (props.mode !== "outin") enterTransition(el, prev);else if (first) set1(el);
      }

      if (prev && prev !== el && props.mode !== "inout") exitTransition(el, prev);
      first = false;
      return el;
    });
  });
  return [s1, s2];
};

function getRect(element) {
  const {
    top,
    bottom,
    left,
    right,
    width,
    height
  } = element.getBoundingClientRect();
  const parentRect = element.parentNode.getBoundingClientRect();
  return {
    top: top - parentRect.top,
    bottom,
    left: left - parentRect.left,
    right,
    width,
    height
  };
}

const TransitionGroup = props => {
  const resolved = children(() => props.children);
  const name = props.name || "s";
  props = mergeProps({
    name,
    enterActiveClass: name + "-enter-active",
    enterClass: name + "-enter",
    enterToClass: name + "-enter-to",
    exitActiveClass: name + "-exit-active",
    exitClass: name + "-exit",
    exitToClass: name + "-exit-to",
    moveClass: name + "-move"
  }, props);
  const {
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onBeforeExit,
    onExit,
    onAfterExit
  } = props;
  const [combined, setCombined] = createSignal();
  let p = [];
  let first = true;
  createComputed(() => {
    const c = resolved();
    const comb = [...c];
    const next = new Set(c);
    const prev = new Set(p);
    const enterClasses = props.enterClass.split(" ");
    const enterActiveClasses = props.enterActiveClass.split(" ");
    const enterToClasses = props.enterToClass.split(" ");
    const exitClasses = props.exitClass.split(" ");
    const exitActiveClasses = props.exitActiveClass.split(" ");
    const exitToClasses = props.exitToClass.split(" ");

    for (let i = 0; i < c.length; i++) {
      const el = c[i];

      if (!first && !prev.has(el)) {
        onBeforeEnter && onBeforeEnter(el);
        el.classList.add(...enterClasses);
        el.classList.add(...enterActiveClasses);
        requestAnimationFrame(() => {
          el.classList.remove(...enterClasses);
          el.classList.add(...enterToClasses);
          onEnter && onEnter(el, endTransition);

          if (!onEnter || onEnter.length < 2) {
            el.addEventListener("transitionend", endTransition, {
              once: true
            });
            el.addEventListener("animationend", endTransition, {
              once: true
            });
          }
        });

        function endTransition() {
          if (el) {
            el.classList.remove(...enterActiveClasses);
            el.classList.remove(...enterToClasses);
            onAfterEnter && onAfterEnter(el);
          }
        }
      }
    }

    for (let i = 0; i < p.length; i++) {
      const old = p[i];

      if (!next.has(old) && old.parentNode) {
        comb.splice(i, 0, old);
        onBeforeExit && onBeforeExit(old);
        old.classList.add(...exitClasses);
        old.classList.add(...exitActiveClasses);
        requestAnimationFrame(() => {
          old.classList.remove(...exitClasses);
          old.classList.add(...exitToClasses);
        });
        onExit && onExit(old, endTransition);

        if (!onExit || onExit.length < 2) {
          old.addEventListener("transitionend", endTransition, {
            once: true
          });
          old.addEventListener("animationend", endTransition, {
            once: true
          });
        }

        function endTransition() {
          old.classList.remove(...exitActiveClasses);
          old.classList.remove(...exitToClasses);
          onAfterExit && onAfterExit(old);
          p = p.filter(i => i !== old);
          setCombined(p);
        }
      }
    }

    p = comb;
    setCombined(comb);
  });
  createEffect(nodes => {
    const c = combined();
    c.forEach(child => {
      let n;

      if (!(n = nodes.get(child))) {
        nodes.set(child, n = {
          pos: getRect(child),
          new: !first
        });
      } else if (n.new) {
        n.new = false;
        n.newPos = getRect(child);
      }

      if (n.new) {
        child.addEventListener("transitionend", () => {
          n.new = false;
          child.parentNode && (n.newPos = getRect(child));
        }, {
          once: true
        });
      }

      n.newPos && (n.pos = n.newPos);
      n.newPos = getRect(child);
    });

    if (first) {
      first = false;
      return nodes;
    }

    c.forEach(child => {
      const c = nodes.get(child);
      const oldPos = c.pos;
      const newPos = c.newPos;
      const dx = oldPos.left - newPos.left;
      const dy = oldPos.top - newPos.top;

      if (dx || dy) {
        c.moved = true;
        const s = child.style;
        s.transform = `translate(${dx}px,${dy}px)`;
        s.transitionDuration = "0s";
      }
    });
    document.body.offsetHeight;
    c.forEach(child => {
      const c = nodes.get(child);

      if (c.moved) {
        c.moved = false;
        const s = child.style;
        const moveClasses = props.moveClass.split(" ");
        child.classList.add(...moveClasses);
        s.transform = s.transitionDuration = "";

        function endTransition(e) {
          if (e && e.target !== child || !child.parentNode) return;

          if (!e || /transform$/.test(e.propertyName)) {
            child.removeEventListener("transitionend", endTransition);
            child.classList.remove(...moveClasses);
          }
        }

        child.addEventListener("transitionend", endTransition);
      }
    });
    return nodes;
  }, new Map());
  return combined;
};

export { Transition, TransitionGroup };