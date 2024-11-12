import NavigationItemInterface from "./navItens.interface"

export const getAdminNavigationItems = (): NavigationItemInterface[] => {
    return [
        {label: "Dashboard", path: "/dashboard"},
        {label: "Adicionar projeto", path: "/adicionarProjeto"},
        {label: "Auditoria", path: "/auditorias"},
        {label: "Bolsistas", path: "/bolsistas"},
    ]
};