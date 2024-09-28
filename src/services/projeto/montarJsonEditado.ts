const MontarJsonEditado = (projeto: any, editado: any) => {
    const camposEditados: any = {};

    for (const key in editado) {
        console.log(`Checking field: ${key}, Original: ${projeto[key]}, Edited: ${editado[key]}`);
        if (editado[key] !== projeto[key] && editado[key] !== "") {
            camposEditados[key] = editado[key];
        }
    }

    return camposEditados;
};

export default MontarJsonEditado;