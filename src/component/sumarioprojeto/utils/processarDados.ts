export const processarDados = (dados: any, anoSelecionado?: string) => {
    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    if (anoSelecionado && anoSelecionado !== 'Todos') {
        dados.gastos.sort((a: any, b: any) => new Date(a.data).getTime() - new Date(b.data).getTime());
        dados.receitas.sort((a: any, b: any) => new Date(a.data).getTime() - new Date(b.data).getTime());

        // Inicializar valores com zero para todos os meses
        const valoresGastos = Array(12).fill(0);
        const valoresReceitas = Array(12).fill(0);

        dados.gastos.forEach((gasto: any) => {
            const mes = new Date(gasto.data).getMonth();
            valoresGastos[mes] += gasto.valor;
        });

        dados.receitas.forEach((receita: any) => {
            const mes = new Date(receita.data).getMonth();
            valoresReceitas[mes] += receita.valor;
        });

        return {
            labels: meses,
            datasets: [
                {
                    label: 'Gastos',
                    data: valoresGastos,
                    backgroundColor: 'rgba(255, 0, 0, 1)',
                    borderColor: 'rgba(255, 0, 0, 1)',
                    fill: false,
                },
                {
                    label: 'Receitas',
                    data: valoresReceitas,
                    backgroundColor: 'rgba(0, 255, 0, 1)',
                    borderColor: 'rgba(0, 255, 0, 1)',
                    fill: false,
                },
            ],
        };
    } else {
        // Ordenar dados por ano
        dados.gastos.sort((a: any, b: any) => new Date(a.data).getFullYear() - new Date(b.data).getFullYear());
        dados.receitas.sort((a: any, b: any) => new Date(a.data).getFullYear() - new Date(b.data).getFullYear());

        // Processar dados por ano
        const labels = dados.gastos.map((gasto: any) => new Date(gasto.data).getFullYear().toString());
        const valoresGastos = dados.gastos.map((gasto: any) => gasto.valor);
        const valoresReceitas = dados.receitas.map((receita: any) => receita.valor);

        return {
            labels,
            datasets: [
                {
                    label: 'Gastos',
                    data: valoresGastos,
                    backgroundColor: 'rgba(255, 0, 0, 1)',
                    borderColor: 'rgba(255, 0, 0, 1)',
                    fill: false,
                },
                {
                    label: 'Receitas',
                    data: valoresReceitas,
                    backgroundColor: 'rgba(0, 255, 0, 1)',
                    borderColor: 'rgba(0, 255, 0, 1)',
                    fill: false,
                },
            ],
        };
    }
};