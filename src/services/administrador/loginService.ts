import { LoginAdm } from "../../interface/adminstrador.interface";
import api from '../api';
import { AxiosError } from 'axios';

export default async function LoginAdminService (dados: LoginAdm) {
    try {
        const resposta = await api.post("/administrador/login", dados); 

        console.log(resposta)

        if (resposta.status === 200) {
            console.log("Login realizado com sucesso", resposta.data);
            return { status: resposta.status, data: resposta.data };
        } else {
            return { status: resposta.status, message: resposta.data };
        }

    } catch (error) {
        let errorMessage = (error as AxiosError).response?.data as any;
        throw new Error("Erro ao fazer login");
    }
}