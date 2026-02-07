import { router } from "expo-router";
import { useAuthUser } from "./useAuthUser";
import { useCallback } from "react";

const useProtectedRoute = (options?: { protectedRoutePrefixes?: string[] }) => {

    const protectedRoutePrefixes = options?.protectedRoutePrefixes || [];

    const { user } = useAuthUser({})

    const isProtectedRoute = useCallback((route: string) => {
        return protectedRoutePrefixes.some((prefix) => route.startsWith(prefix));
    }, [protectedRoutePrefixes]);

    const checkAuth = useCallback((href: any) => {
        let pathname: string = "";

        if (typeof href === "string") {
            pathname = href;
        } else if (typeof href === "object" && href !== null && "pathname" in href) {
            pathname = href.pathname;
        }

        if (pathname && isProtectedRoute(pathname)) {
            if (!user) {
                console.log("Access denied to", pathname, "- redirecting to login");
                router.push("/login");
                return false;
            }
        }
        return true;
    }, [isProtectedRoute, user]);

    const push = useCallback((href: any, options?: any) => {
        if (checkAuth(href)) {
            router.push(href, options);
        }
    }, [checkAuth]);

    const replace = useCallback((href: any, options?: any) => {
        if (checkAuth(href)) {
            router.replace(href, options);
        }
    }, [checkAuth]);

    const navigate = useCallback((href: any, options?: any) => {
        if (checkAuth(href)) {
            router.navigate(href, options);
        }
    }, [checkAuth]);

    const routeTo = (route: string) => {
        navigate(route);
    };

    return {
        ...router,
        push,
        replace,
        navigate,
        routeTo,
        back: router.back,
        setParams: router.setParams,
        canGoBack: router.canGoBack,
        canDismiss: router.canDismiss,
    };
}

export default useProtectedRoute;