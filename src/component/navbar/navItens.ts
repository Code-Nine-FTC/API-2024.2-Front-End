import NavigationItemInterface from "./navItens.interface"

export const getAdminNavigationItems = (): NavigationItemInterface[] => {
    return [
        {label: "Adicionar projeto", path: "/adicionarProjeto"},
        {label: "Gerenciar contas", path: "/gerenciarContas"},
    ]
};