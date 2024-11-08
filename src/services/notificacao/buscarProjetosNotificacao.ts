import api from "../api";
import { AxiosError } from 'axios';
import { format, addDays, subDays } from 'date-fns';

const BuscarProjetosEmAndamentoService = async () => {
    try {
        const params = {
            status: 'Em Andamento',
            dataTerminoMin: format(subDays(new Date(), 30), 'yyyy-MM-dd'), // Data de 30 dias atrás até hoje
            dataTerminoMax: format(addDays(new Date(), 7), 'yyyy-MM-dd') // Data daqui a 7 dias
        };

        const resposta = await api.get('/projeto/listar', { params });
        if (resposta.status === 200) {
            return { status: resposta.status, data: resposta.data };
        } else {
            return { status: resposta.status, message: resposta.data };
        }
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const errorMessage = axiosError.response?.data?.message || 'Erro ao carregar os dados dos projetos. Por favor, tente novamente mais tarde.';
        throw new Error(errorMessage);
    }
};

export default BuscarProjetosEmAndamentoService;