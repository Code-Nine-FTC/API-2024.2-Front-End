// import { FormDataGastoCadastro } from "../../interface/cadastros/gasto.interface";
// import api from "../api";
// import { getToken } from "../auth";
// import { AxiosError } from 'axios';

// export default async function CadastrarGastosService (gasto: FormData): Promise<any> {
//     try {
//         const resposta = await api.post("/gasto/cadastrar", gasto, {
//             headers: {
//                 Authorization: `Bearer ${getToken()} `,
//                 'Content-Type': 'multipart/form-data',
//             }
//         });
//         if (resposta.status === 200) {
//             console.log('Gasto cadastrado com sucesso', resposta.data);
//             return { status: resposta.status, data: resposta.data };
//         } else {
//             return { status: resposta.status, message: resposta.data };
//         }
//     } catch (error) {
//         let errorMessage = (error as AxiosError).response?.data as any;
//         throw new Error(errorMessage);
//     }
// }
    
export default function vazia () {
}
