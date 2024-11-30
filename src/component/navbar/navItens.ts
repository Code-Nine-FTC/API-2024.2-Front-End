import NavigationItemInterface from "./navItens.interface"

export const getAdminNavigationItems = (): NavigationItemInterface[] => {
    return [
        {label: "Dashboard", path: "/dashboard"},
        {label: "Auditoria", path: "/auditorias"},
    ]
};