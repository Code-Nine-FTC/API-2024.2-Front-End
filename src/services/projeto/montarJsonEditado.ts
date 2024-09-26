const MontarJsonEditado = (projeto: any, editado: any) => {
    const camposEditados: any = {};

    for (const key in editado) {
        if (editado[key] !== projeto[key] && editado[key] !== "") {
            camposEditados[key] = editado[key];
        }
    }

    return camposEditados;
};

export default MontarJsonEditado;