import api from "../api";
import { AxiosError } from "axios";
import { saveAs } from "file-saver";

export default async function BaixarArquivo (id: number, nome: string): Promise<any> {
    try {
        const resposta = await api.get(`/documento/download/${id}`, {
            responseType: 'blob',
        });
        if (resposta.status === 200) {
            let nomeArquivo = 'documento.pdf';

            if (nome) {
                nomeArquivo = nome;
            }

            const blob = new Blob([resposta.data], { type: resposta.headers['content-type'] });
            saveAs(blob, nomeArquivo);
        } else {
            console.log('Erro ao baixar o arquivo', resposta.data);
            return { status: resposta.status, message: resposta.data };
        }
    } catch (error) {
        console.error(error)
        let errorMessage = (error as AxiosError).response?.data as any;
        throw new Error(errorMessage);
    }
    
}