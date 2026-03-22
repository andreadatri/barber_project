import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type RouteDefinition = {
  path: string;
  Component: React.ComponentType;
};

type RouterValue = {
  pathname: string;
  navigate: (to: string) => void;
};

const RouterContext = createContext<RouterValue | null>(null);

export function createBrowserRouter(routes: RouteDefinition[]) {
  return routes;
}

function matchRoute(
  routes: RouteDefinition[],
  pathname: string
): RouteDefinition | undefined {
  return (
    routes.find((route) => route.path === pathname) ??
    routes.find(
      (route) => route.path.endsWith("/*") && pathname.startsWith(route.path)
    ) ??
    routes.find((route) => route.path === "*")
  );
}

export function RouterProvider({ router }: { router: RouteDefinition[] }) {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);

    window.addEventListener("popstate", onPopState);

    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const value = useMemo<RouterValue>(
    () => ({
      pathname,
      navigate: (to: string) => {
        if (to === window.location.pathname) {
          return;
        }

        window.history.pushState({}, "", to);
        setPathname(to);
      },
    }),
    [pathname]
  );

  const matched = matchRoute(router, pathname);

  if (!matched) {
    return null;
  }

  const Component = matched.Component;

  return (
    <RouterContext.Provider value={value}>
      <Component />
    </RouterContext.Provider>
  );
}

export function Link({
  to,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  const router = useContext(RouterContext);

  return (
    <a
      href={to}
      {...props}
      onClick={(event) => {
        props.onClick?.(event);

        if (
          event.defaultPrevented ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          props.target === "_blank"
        ) {
          return;
        }

        event.preventDefault();
        router?.navigate(to);
      }}
    >
      {children}
    </a>
  );
}

export function useNavigate() {
  const router = useContext(RouterContext);

  return (to: string) => router?.navigate(to);
}

export function useLocation() {
  const router = useContext(RouterContext);

  return {
    pathname: router?.pathname ?? window.location.pathname,
  };
}
