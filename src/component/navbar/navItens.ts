import NavigationItemInterface from "./navItens.interface"

export const getAdminNavigationItems = (): NavigationItemInterface[] => {
    return [
        {label: "Dashboard", path: "/dashboard"},
        {label: "Auditoria", path: "/auditorias"},
<<<<<<< Updated upstream
        {label: "Sumário do Projeto", path: "/sumarioProjeto"}
=======
        {label: "Bolsistas", path: "/bolsistas"},
        {label: "Parceiros", path: "/parceiros"},
>>>>>>> Stashed changes
    ]
};