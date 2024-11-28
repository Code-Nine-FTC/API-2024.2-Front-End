import NavigationItemInterface from "./navItens.interface"

export const getAdminNavigationItems = (): NavigationItemInterface[] => {
    return [
        {label: "Dashboard", path: "/dashboard"},
        {label: "Auditoria", path: "/auditorias"},
        // {label: "Sumário do Projeto", path: "/sumarioProjeto"},
        // {label: "Prestação de Contas", path: "/prestacaoContas"},
    ]
};