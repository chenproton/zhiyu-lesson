"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import { resolvePlatformIcon } from "../lib/icons.mjs";
import { cn, matchesPath } from "../lib/utils.mjs";
function isTopItemActive(pathname, item) {
    return matchesPath(pathname, item.href, item.matchers);
}
function isSideItemActive(pathname, item) {
    if (item.children?.length) {
        return item.children.some((child) => matchesPath(pathname, child.href, child.matchers));
    }
    return matchesPath(pathname, item.href, item.matchers);
}
const fallbackUserMenuItems = [
    { id: "profile", label: "个人中心", icon: "user" },
    { id: "account", label: "账号设置", icon: "settings" },
    { id: "logout", label: "退出登录", tone: "danger" },
];
export function PlatformTopNav({ config }) {
    const pathname = usePathname();
    const [currentTime, setCurrentTime] = useState("");
    const [mounted, setMounted] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const BrandIcon = resolvePlatformIcon(config.brandIcon || "settings");
    const userMenuItems = config.userMenuItems ?? fallbackUserMenuItems;
    const [selectedCollege, setSelectedCollege] = useState("all");
    useEffect(() => {
        const readCollege = () => {
            const params = new URLSearchParams(window.location.search);
            setSelectedCollege(params.get("college") || "all");
        };
        readCollege();
        window.addEventListener("popstate", readCollege);
        return () => window.removeEventListener("popstate", readCollege);
    }, []);
    const handleCollegeChange = (value) => {
        const params = new URLSearchParams(window.location.search);
        if (value === "all") {
            params.delete("college");
        }
        else {
            params.set("college", value);
        }
        const newUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ""}`;
        window.history.pushState(null, "", newUrl);
        window.dispatchEvent(new Event("popstate"));
    };
    useEffect(() => {
        setMounted(true);
        const updateTime = () => {
            const now = new Date();
            const weekDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const day = String(now.getDate()).padStart(2, "0");
            const weekDay = weekDays[now.getDay()];
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            setCurrentTime(`${year}年${month}月${day}日 ${weekDay} ${hours}:${minutes}`);
        };
        updateTime();
        const timer = setInterval(updateTime, 60000);
        return () => clearInterval(timer);
    }, []);
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);
    useEffect(() => {
        const handlePointerDown = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    return (_jsxs("header", { className: "fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-gray-100 bg-white px-6 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-8", children: [_jsxs(Link, { href: config.brandHref || "/", className: "flex items-center gap-2", children: [_jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary", children: _jsx(BrandIcon, { className: "h-4 w-4 text-primary-foreground" }) }), _jsx("span", { className: "text-base font-semibold text-gray-800", children: config.brandTitle })] }), _jsx("nav", { className: "flex items-center gap-1", children: config.topNavItems.map((item) => {
                            const Icon = resolvePlatformIcon(item.icon);
                            const active = isTopItemActive(pathname, item);
                            const itemClassName = cn("relative flex items-center gap-1.5 rounded-md px-4 py-2 text-sm transition-colors", item.disabled
                                ? "cursor-default text-gray-400"
                                : active
                                    ? "font-medium text-primary"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800");
                            return item.disabled ? (_jsxs("span", { className: itemClassName, children: [_jsx(Icon, { className: "h-4 w-4" }), item.label] }, item.id)) : (_jsxs(Link, { href: item.href, className: itemClassName, children: [_jsx(Icon, { className: "h-4 w-4" }), item.label, active ? _jsx("span", { className: "absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-primary" }) : null] }, item.id));
                        }) })] }), _jsxs("div", { className: "flex items-center gap-4", children: [config.showCollegeFilter && config.collegeOptions && config.collegeOptions.length > 0 && !pathname.startsWith("/landingpage") && (_jsxs("select", { value: selectedCollege, onChange: (e) => handleCollegeChange(e.target.value), className: "h-8 rounded-md border border-gray-200 bg-white px-2 pr-6 text-sm text-gray-600 outline-none hover:border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer", children: [_jsx("option", { value: "all", children: "\u5168\u6821" }), config.collegeOptions.map((college) => (_jsx("option", { value: college, children: college }, college)))] })), config.enterpriseLoginHref && !pathname.startsWith("/landingpage") && (_jsxs(Link, { href: config.enterpriseLoginHref, className: "flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300", children: [_jsx(Building2, { className: "h-4 w-4" }), "\u4F01\u4E1A\u767B\u5F55"] })), config.showCurrentTime !== false && mounted ? _jsx("div", { className: "text-sm text-gray-400 hidden lg:block", children: currentTime }) : null, config.showUserMenu !== false ? (_jsxs("div", { className: "relative", ref: menuRef, children: [_jsxs("button", { type: "button", onClick: () => setMenuOpen((value) => !value), className: "flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-gray-50", children: [_jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground", children: (config.currentUserName || "管理员").slice(0, 1) }), _jsxs("div", { className: "text-left", children: [_jsx("div", { className: "text-sm text-gray-700", children: config.currentUserName || "管理员" }), _jsx("div", { className: "text-xs text-gray-400", children: config.currentUserRoleLabel || config.currentPlatformLabel })] }), _jsx(ChevronDown, { className: "h-4 w-4 text-gray-400" })] }), menuOpen && userMenuItems.length > 0 ? (_jsx("div", { className: "absolute right-0 top-[calc(100%+0.5rem)] w-48 rounded-lg border border-gray-100 bg-white py-1 shadow-lg", children: userMenuItems.map((item, index) => {
                                    const Icon = item.icon ? resolvePlatformIcon(item.icon) : null;
                                    const itemClassName = item.tone === "danger"
                                        ? "flex w-full items-center px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                                        : "flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50";
                                    return (_jsxs("div", { children: [index > 0 && item.tone === "danger" ? _jsx("div", { className: "my-1 h-px bg-gray-100" }) : null, item.href ? (_jsxs(Link, { href: item.href, className: itemClassName, children: [Icon ? _jsx(Icon, { className: "mr-2 h-4 w-4" }) : null, item.label] })) : (_jsxs("button", { type: "button", className: itemClassName, children: [Icon ? _jsx(Icon, { className: "mr-2 h-4 w-4" }) : null, item.label] }))] }, item.id));
                                }) })) : null] })) : null] })] }));
}
export function PlatformSideNav({ config }) {
    const pathname = usePathname();
    const defaultExpanded = useMemo(() => config.defaultExpandedSideNavIds?.length
        ? config.defaultExpandedSideNavIds
        : config.sideNavItems.filter((item) => item.children?.length).map((item) => item.id), [config.defaultExpandedSideNavIds, config.sideNavItems]);
    const [expandedItems, setExpandedItems] = useState(defaultExpanded);
    const PlatformIcon = resolvePlatformIcon(config.platformIcon || "settings");
    useEffect(() => {
        const activeParents = config.sideNavItems
            .filter((item) => item.children?.some((child) => matchesPath(pathname, child.href, child.matchers)))
            .map((item) => item.id);
        setExpandedItems((prev) => Array.from(new Set([...defaultExpanded, ...activeParents, ...prev])));
    }, [config.sideNavItems, defaultExpanded, pathname]);
    const toggleExpand = (itemId) => {
        setExpandedItems((prev) => prev.includes(itemId) ? prev.filter((entry) => entry !== itemId) : [...prev, itemId]);
    };
    return (_jsxs("aside", { className: "sticky top-14 flex h-[calc(100vh-3.5rem)] w-56 shrink-0 flex-col overflow-hidden border-r border-gray-100 bg-white", children: [_jsx("div", { className: "border-b border-gray-100 p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Link, { href: config.sideBackHref, className: "flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 transition-colors hover:bg-primary/10 hover:text-primary", children: _jsx(ChevronLeft, { className: "h-4 w-4" }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(PlatformIcon, { className: "h-4 w-4 text-primary" }), _jsx("h2", { className: "text-sm font-medium text-gray-800", children: config.currentPlatformLabel })] })] }) }), _jsx("nav", { className: "flex-1 p-3", children: config.sideNavItems.map((item) => {
                    const Icon = resolvePlatformIcon(item.icon);
                    const hasChildren = Boolean(item.children?.length);
                    const active = isSideItemActive(pathname, item);
                    const isExpanded = expandedItems.includes(item.id);
                    return (_jsxs("div", { className: "mb-1", children: [hasChildren ? (_jsxs("button", { type: "button", onClick: () => toggleExpand(item.id), className: cn("flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors", active ? "bg-primary/5 font-medium text-primary" : "text-gray-600 hover:bg-gray-50"), children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx(Icon, { className: "h-4 w-4" }), item.label] }), isExpanded ? (_jsx(ChevronDown, { className: "h-4 w-4 text-gray-400" })) : (_jsx(ChevronRight, { className: "h-4 w-4 text-gray-400" }))] })) : (_jsxs(Link, { href: item.href || "/", className: cn("flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors", active ? "bg-primary text-white font-medium" : "text-gray-600 hover:bg-gray-50"), children: [_jsx(Icon, { className: "h-4 w-4" }), item.label] })), hasChildren && isExpanded ? (_jsx("div", { className: "ml-4 mt-1 space-y-0.5 border-l-2 border-gray-100 pl-3", children: item.children?.map((child) => (_jsx(Link, { href: child.href, className: cn("block rounded-lg px-3 py-2 text-sm transition-colors", matchesPath(pathname, child.href, child.matchers)
                                        ? "bg-primary text-white font-medium"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"), children: child.label }, child.id))) })) : null] }, item.id));
                }) }), config.platformSwitchItems && config.platformSwitchItems.length > 0 && (_jsxs("div", { className: "border-t border-gray-100 p-3", children: [_jsx("p", { className: "mb-2 px-3 text-xs font-medium text-gray-400", children: "\u5E73\u53F0\u5207\u6362" }), _jsx("div", { className: "space-y-1", children: config.platformSwitchItems.map((item) => {
                            const Icon = resolvePlatformIcon(item.icon);
                            const active = matchesPath(pathname, item.href, item.matchers);
                            return (_jsxs(Link, { href: item.href, className: cn("flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors", active
                                    ? "bg-primary/5 font-medium text-primary"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"), children: [_jsx(Icon, { className: "h-4 w-4" }), item.label] }, item.id));
                        }) })] }))] }));
}
export function PlatformShell({ config, children, }) {
    return (_jsxs(_Fragment, { children: [_jsx(PlatformTopNav, { config: config }), _jsxs("div", { className: cn("flex min-h-screen bg-[#f5f7fa]", "pt-14", config.shellClassName), children: [config.hideSideNav ? null : _jsx(PlatformSideNav, { config: config }), _jsx("main", { className: cn("min-w-0 flex-1", config.mainClassName), children: _jsx("div", { className: cn("p-6", config.contentClassName), children: children }) })] })] }));
}
