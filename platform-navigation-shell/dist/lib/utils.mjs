import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export function matchesPath(pathname, href, matchers) {
    const targets = matchers && matchers.length > 0 ? matchers : href ? [href] : [];
    return targets.some((target) => {
        if (target === "/") {
            return pathname === "/";
        }
        if (target.endsWith("$")) {
            return pathname === target.slice(0, -1);
        }
        return pathname === target || pathname.startsWith(`${target}/`);
    });
}
