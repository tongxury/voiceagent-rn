import { useRouter } from "expo-router";
import { useAuthUser } from "./useAuthUser";
import { useCallback, useMemo } from "react";

const useProtectedRoute = (options?: { protectedRoutePrefixes?: string[] }) => {
    const router = useRouter();
    const protectedRoutePrefixes = useMemo(() => options?.protectedRoutePrefixes || [], [options?.protectedRoutePrefixes]);

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
    }, [isProtectedRoute, user, router]);

    const push = useCallback((href: any, options?: any) => {
        if (checkAuth(href)) {
            router.push(href, options);
        }
    }, [checkAuth, router]);

    const replace = useCallback((href: any, options?: any) => {
        if (checkAuth(href)) {
            router.replace(href, options);
        }
    }, [checkAuth, router]);

    const navigate = useCallback((href: any, options?: any) => {
        if (checkAuth(href)) {
            router.navigate(href, options);
        }
    }, [checkAuth, router]);

    const routeTo = useCallback((route: string) => {
        navigate(route);
    }, [navigate]);

    return {
        push,
        replace,
        navigate,
        routeTo,
        back: router.back,
        setParams: router.setParams,
        canGoBack: router.canGoBack,
        canDismiss: router.canDismiss,
        dismiss: router.dismiss,
        dismissAll: router.dismissAll,
    };
}

export default useProtectedRoute;