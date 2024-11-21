export const obterOpcoesAno = () => {
    const anoAtual = new Date().getFullYear();
    const anos = ['Todos'];

    for (let Ano = 2000; Ano <= anoAtual; Ano++) {
        anos.push(Ano.toString());
    }
    return anos;
};