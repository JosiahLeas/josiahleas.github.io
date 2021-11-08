import { isServer, template, createComponent as createComponent$1, mergeProps, delegateEvents, spread, insert, effect, setAttribute } from './web.js';
import { createSignal, onCleanup, runWithOwner, createMemo, getOwner, createContext, useContext, createComponent, useTransition, on, untrack, createRenderEffect, createRoot, Show, mergeProps as mergeProps$1, splitProps } from './solid-js.js';

function bindEvent(target, type, handler) {
  target.addEventListener(type, handler);
  return () => target.removeEventListener(type, handler);
}

function intercept([value, setValue], get, set) {
  return [get ? () => get(value()) : value, set ? v => setValue(set(v)) : setValue];
}

function createIntegration(get, set, init, utils) {
  let ignore = false;
  const signal = intercept(createSignal({
    value: get()
  }, {
    equals: (a, b) => a.value === b.value
  }), undefined, next => {
    !ignore && set(next);
    return next;
  });
  init && onCleanup(init((value = get()) => {
    ignore = true;
    signal[1]({
      value
    });
    ignore = false;
  }));
  return {
    signal,
    utils
  };
}
function normalizeIntegration(integration) {
  if (!integration) {
    return {
      signal: createSignal({
        value: ""
      })
    };
  } else if (Array.isArray(integration)) {
    return {
      signal: integration
    };
  }

  return integration;
}
function staticIntegration(obj) {
  return {
    signal: [() => obj, next => Object.assign(obj, next)]
  };
}
function pathIntegration() {
  return createIntegration(() => window.location.pathname + window.location.search + window.location.hash, ({
    value,
    replace
  }) => {
    if (replace) {
      window.history.replaceState(null, "", value);
    } else {
      window.history.pushState(null, "", value);
    }

    window.scrollTo(0, 0);
  }, notify => bindEvent(window, "popstate", () => notify()));
}
function hashIntegration() {
  return createIntegration(() => window.location.hash.slice(1), ({
    value
  }) => {
    window.location.hash = value;
    window.scrollTo(0, 0);
  }, notify => bindEvent(window, "hashchange", () => notify()), {
    renderPath: path => `#${path}`
  });
}

const hasSchemeRegex = /^(?:[a-z0-9]+:)?\/\//i;
const trimPathRegex = /^\/+|\/+$|\s+/;

function normalize(path) {
  const s = path.replace(trimPathRegex, "");
  return s ? "/" + s : "";
}

function resolvePath(base, path, from) {
  if (hasSchemeRegex.test(path)) {
    return undefined;
  }

  const basePath = normalize(base);
  const fromPath = from && normalize(from);
  let result = "";

  if (!fromPath || path.charAt(0) === "/") {
    result = basePath;
  } else if (fromPath.toLowerCase().indexOf(basePath.toLowerCase()) !== 0) {
    result = basePath + fromPath;
  } else {
    result = fromPath;
  }

  return result + normalize(path) || "/";
}
function invariant(value, message) {
  if (value == null) {
    throw new Error(message);
  }

  return value;
}
function joinPaths(from, to) {
  return `${from.replace(/[/*]+$/, "")}/${to.replace(/^\/+/, "")}`;
}
function extractQuery(url) {
  const query = {};
  url.searchParams.forEach((value, key) => {
    query[key] = value;
  });
  return query;
}
function createMatcher(path, partial) {
  const [pattern, splat] = path.split("/*", 2);
  const segments = pattern.split("/").filter(Boolean);
  const len = segments.length;
  return location => {
    const locSegments = location.split("/").filter(Boolean);
    const lenDiff = locSegments.length - len;

    if (lenDiff < 0 || lenDiff > 0 && splat === undefined && !partial) {
      return null;
    }

    const match = {
      path: len ? "" : "/",
      params: {}
    };

    for (let i = 0; i < len; i++) {
      const segment = segments[i];
      const locSegment = locSegments[i];

      if (segment[0] === ":") {
        match.params[segment.slice(1)] = locSegment;
      } else if (segment.localeCompare(locSegment, undefined, {
        sensitivity: 'base'
      }) !== 0) {
        return null;
      }

      match.path += `/${locSegment}`;
    }

    if (splat) {
      match.params[splat] = lenDiff ? locSegments.slice(-lenDiff).join("/") : "";
    }

    return match;
  };
}
function scoreRoute(route) {
  const [pattern, splat] = route.pattern.split("/*", 2);
  const segments = pattern.split("/").filter(Boolean);
  return segments.reduce((score, segment) => score + (segment.startsWith(":") ? 2 : 3), segments.length - (splat === undefined ? 0 : 1));
}
function createMemoObject(fn) {
  const map = new Map();
  const owner = getOwner();
  return new Proxy({}, {
    get(_, property) {
      const memo = map.get(property) || runWithOwner(owner, () => {
        const p = createMemo(() => fn()[property]);
        map.set(property, p);
        return p;
      });
      return memo();
    }

  });
}

const MAX_REDIRECTS = 100;
const RouterContextObj = createContext();
const RouteContextObj = createContext();
const useRouter = () => invariant(useContext(RouterContextObj), "Make sure your app is wrapped in a <Router />");
const useRoute = () => useContext(RouteContextObj) || useRouter().base;
const useResolvedPath = path => {
  const route = useRoute();
  return createMemo(() => route.resolvePath(path()));
};
const useHref = to => {
  const router = useRouter();
  return createMemo(() => {
    const to_ = to();
    return to_ !== undefined ? router.renderPath(to_) : to_;
  });
};
const useNavigate = () => useRouter().navigatorFactory();
const useLocation = () => useRouter().location;
const useIsRouting = () => useRouter().isRouting;
const useMatch = path => {
  const location = useLocation();
  const matcher = createMemo(() => createMatcher(path()));
  return createMemo(() => matcher()(location.pathname));
};
const useParams = () => useRoute().params;
const useData = (delta = 0) => {
  let current = useRoute();
  let n = delta;

  while (n-- > 0) {
    if (!current.parent) {
      throw new RangeError(`Route ancestor ${delta} is out of bounds`);
    }

    current = current.parent;
  }

  return current.data;
};
function createRoute(routeDef, base = "", fallback) {
  const {
    path: originalPath,
    component,
    data,
    children
  } = routeDef;
  const isLeaf = !children || Array.isArray(children) && !children.length;
  const path = joinPaths(base, originalPath);
  const pattern = isLeaf ? path : path.split("/*", 1)[0];
  return {
    originalPath,
    pattern,
    element: component ? () => createComponent(component, {}) : () => {
      const {
        element
      } = routeDef;
      return element === undefined && fallback ? createComponent(fallback, {}) : element;
    },
    preload: routeDef.component ? component.preload : routeDef.preload,
    data,
    matcher: createMatcher(pattern, !isLeaf)
  };
}
function createBranch(routes, index = 0) {
  return {
    routes,
    score: scoreRoute(routes[routes.length - 1]) * 10000 - index,

    matcher(location) {
      const matches = [];

      for (let i = routes.length - 1; i >= 0; i--) {
        const route = routes[i];
        const match = route.matcher(location);

        if (!match) {
          return null;
        }

        matches.unshift({ ...match,
          route
        });
      }

      return matches;
    }

  };
}
function createBranches(routeDef, base = "", fallback, stack = [], branches = []) {
  const routeDefs = Array.isArray(routeDef) ? routeDef : [routeDef];

  for (let i = 0, len = routeDefs.length; i < len; i++) {
    const def = routeDefs[i];
    const route = createRoute(def, base, fallback);
    stack.push(route);

    if (def.children) {
      createBranches(def.children, route.pattern, fallback, stack, branches);
    } else {
      const branch = createBranch([...stack], branches.length);
      branches.push(branch);
    }

    stack.pop();
  } // Stack will be empty on final return


  return stack.length ? branches : branches.sort((a, b) => b.score - a.score);
}
function getRouteMatches(branches, location) {
  for (let i = 0, len = branches.length; i < len; i++) {
    const match = branches[i].matcher(location);

    if (match) {
      return match;
    }
  }

  return [];
}
function createLocation(path) {
  const origin = new URL("http://sar");
  const url = createMemo(prev => {
    const path_ = path();

    try {
      return new URL(path_, origin);
    } catch (err) {
      console.error(`Invalid path ${path_}`);
      return prev;
    }
  }, origin, {
    equals: (a, b) => a.href === b.href
  });
  const pathname = createMemo(() => url().pathname);
  const search = createMemo(() => url().search.slice(1));
  const hash = createMemo(() => url().hash.slice(1));
  const state = createMemo(() => null);
  const key = createMemo(() => "");
  return {
    get pathname() {
      return pathname();
    },

    get search() {
      return search();
    },

    get hash() {
      return hash();
    },

    get state() {
      return state();
    },

    get key() {
      return key();
    },

    query: createMemoObject(on(search, () => extractQuery(url())))
  };
}
function createRouterContext(integration, base = "", data, out) {
  const {
    signal: [source, setSource],
    utils
  } = normalizeIntegration(integration);
  const basePath = resolvePath("", base);
  const output = isServer && out ? Object.assign(out, {
    matches: [],
    url: undefined
  }) : undefined;

  if (basePath === undefined) {
    throw new Error(`${basePath} is not a valid base path`);
  } else if (basePath && !source().value) {
    setSource({
      value: basePath,
      replace: true
    });
  }

  const [isRouting, start] = useTransition();
  const [reference, setReference] = createSignal(source().value);
  const location = createLocation(reference);
  const referrers = [];
  const baseRoute = {
    pattern: basePath,
    params: {},
    path: () => basePath,
    outlet: () => null,

    resolvePath(to) {
      return resolvePath(basePath, to);
    }

  };

  if (data) {
    baseRoute.data = data({
      params: {},
      location,
      navigate: navigatorFactory(baseRoute)
    });
  }

  function navigateFromRoute(route, to, options) {
    // Untrack in case someone navigates in an effect - don't want to track `reference` or route paths
    untrack(() => {
      if (typeof to === "number") {
        console.warn("Relative navigation is not implemented - doing nothing :)");
        return;
      }

      const {
        replace,
        resolve
      } = {
        replace: false,
        resolve: true,
        ...options
      };
      const resolvedTo = resolve ? route.resolvePath(to) : resolvePath("", to);

      if (resolvedTo === undefined) {
        throw new Error(`Path '${to}' is not a routable path`);
      } else if (referrers.length >= MAX_REDIRECTS) {
        throw new Error("Too many redirects");
      }

      const current = reference();

      if (resolvedTo !== current) {
        if (isServer) {
          if (output) {
            output.url = resolvedTo;
          }

          setSource({
            value: resolvedTo,
            replace
          });
        } else {
          const len = referrers.push({
            value: current,
            replace
          });
          start(() => setReference(resolvedTo), () => {
            if (referrers.length === len) {
              navigateEnd(resolvedTo);
            }
          });
        }
      }
    });
  }

  function navigatorFactory(route) {
    // Workaround for vite issue (https://github.com/vitejs/vite/issues/3803)
    route = route || useContext(RouteContextObj) || baseRoute;
    return (to, options) => navigateFromRoute(route, to, options);
  }

  function navigateEnd(next) {
    const first = referrers[0];

    if (first) {
      if (next !== first.value) {
        setSource({
          value: next,
          replace: first.replace
        });
      }

      referrers.length = 0;
    }
  }

  createRenderEffect(() => {
    const next = source().value;

    if (next !== untrack(reference)) {
      start(() => setReference(next));
    }
  });
  return {
    base: baseRoute,
    out: output,
    location,
    isRouting,
    renderPath: utils && utils.renderPath || (path => path),
    navigatorFactory
  };
}
function createRouteContext(router, parent, child, match) {
  const {
    base,
    location,
    navigatorFactory
  } = router;
  const {
    pattern,
    element: outlet,
    preload,
    data
  } = match().route;
  const path = createMemo(() => match().path);
  const params = createMemoObject(() => match().params);
  preload && preload();
  const route = {
    parent,
    pattern,

    get child() {
      return child();
    },

    path,
    params,
    outlet,

    resolvePath(to) {
      return resolvePath(base.path(), to, path());
    }

  };

  if (data) {
    route.data = data({
      params,
      location,
      navigate: navigatorFactory(route)
    });
  }

  return route;
}

const _tmpl$ = template(`<a></a>`, 2);
const Router = props => {
  const {
    source,
    url,
    base,
    data,
    out
  } = props;
  const integration = source || (isServer ? staticIntegration({
    value: url || ""
  }) : pathIntegration());
  const routerState = createRouterContext(integration, base, data, out);
  return createComponent$1(RouterContextObj.Provider, {
    value: routerState,

    get children() {
      return props.children;
    }

  });
};
const Routes = props => {
  const router = useRouter();
  const parentRoute = useRoute();
  const basePath = useResolvedPath(() => props.base || "");
  const branches = createMemo(() => createBranches(props.children, basePath() || "", Outlet));
  const matches = createMemo(() => getRouteMatches(branches(), router.location.pathname));

  if (router.out) {
    router.out.matches.push(matches().map(({
      route,
      path,
      params
    }) => ({
      originalPath: route.originalPath,
      pattern: route.pattern,
      path,
      params
    })));
  }

  const disposers = [];
  let root;
  const routeStates = createMemo(on(matches, (nextMatches, prevMatches, prev) => {
    let equal = prevMatches && nextMatches.length === prevMatches.length;
    const next = [];

    for (let i = 0, len = nextMatches.length; i < len; i++) {
      const prevMatch = prevMatches && prevMatches[i];
      const nextMatch = nextMatches[i];

      if (prev && prevMatch && nextMatch.route.pattern === prevMatch.route.pattern) {
        next[i] = prev[i];
      } else {
        equal = false;

        if (disposers[i]) {
          disposers[i]();
        }

        createRoot(dispose => {
          disposers[i] = dispose;
          next[i] = createRouteContext(router, next[i - 1] || parentRoute, () => routeStates()[i + 1], () => matches()[i]);
        });
      }
    }

    disposers.splice(nextMatches.length).forEach(dispose => dispose());

    if (prev && equal) {
      return prev;
    }

    root = next[0];
    return next;
  }));
  return createComponent$1(Show, {
    get when() {
      return routeStates() && root;
    },

    children: route => createComponent$1(RouteContextObj.Provider, {
      value: route,

      get children() {
        return route.outlet();
      }

    })
  });
};
const useRoutes = (routes, base) => {
  return () => createComponent$1(Routes, {
    base: base,
    children: routes
  });
};
const Route = props => props;
const Outlet = () => {
  const route = useRoute();
  return createComponent$1(Show, {
    get when() {
      return route.child;
    },

    children: child => createComponent$1(RouteContextObj.Provider, {
      value: child,

      get children() {
        return child.outlet();
      }

    })
  });
};

function LinkBase(props) {
  const [, rest] = splitProps(props, ["children", "to", "href", "onClick"]);
  const navigate = useNavigate();
  const href = useHref(() => props.to);

  const handleClick = evt => {
    const {
      onClick,
      to,
      target
    } = props;

    if (typeof onClick === "function") {
      onClick(evt);
    } else if (onClick) {
      onClick[0](onClick[1], evt);
    }

    if (to !== undefined && !evt.defaultPrevented && evt.button === 0 && (!target || target === "_self") && !(evt.metaKey || evt.altKey || evt.ctrlKey || evt.shiftKey)) {
      evt.preventDefault();
      navigate(to, {
        resolve: false,
        replace: props.replace || false
      });
    }
  };

  return (() => {
    const _el$ = _tmpl$.cloneNode(true);

    _el$.$$click = handleClick;

    spread(_el$, rest, false, true);

    insert(_el$, () => props.children);

    effect(() => setAttribute(_el$, "href", href() || props.href));

    return _el$;
  })();
}

function Link(props) {
  const to = useResolvedPath(() => props.href);
  return createComponent$1(LinkBase, mergeProps(props, {
    get to() {
      return to();
    }

  }));
}
function NavLink(props) {
  props = mergeProps$1({
    activeClass: "active"
  }, props);
  const [, rest] = splitProps(props, ["activeClass", "end"]);
  const location = useLocation();
  const to = useResolvedPath(() => props.href);
  const isActive = createMemo(() => {
    const to_ = to();

    if (to_ === undefined) {
      return false;
    }

    const path = to_.split(/[?#]/, 1)[0].toLowerCase();
    const loc = location.pathname.toLowerCase();
    return props.end ? path === loc : loc.startsWith(path);
  });
  return createComponent$1(LinkBase, mergeProps(rest, {
    get to() {
      return to();
    },

    get classList() {
      return {
        [props.activeClass]: isActive()
      };
    },

    get ["aria-current"]() {
      return isActive() ? "page" : undefined;
    }

  }));
}
function Navigate(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    href
  } = props;
  const path = typeof href === "function" ? href({
    navigate,
    location
  }) : href;
  navigate(path, {
    replace: true
  });
  return null;
}

delegateEvents(["click"]);

export { Link, NavLink, Navigate, Outlet, Route, Router, Routes, createIntegration, hashIntegration, normalizeIntegration, pathIntegration, staticIntegration, useData, useHref, useIsRouting, useLocation, useMatch, useNavigate, useParams, useResolvedPath, useRoutes };