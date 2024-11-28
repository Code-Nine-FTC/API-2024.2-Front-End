// import { AxiosError } from "axios";
// import { MaterialCadastro } from "../../../interface/cadastros/material.interface";
// import api from "../../api";
// import { getToken } from "../../auth";

// export default async function CadastrarMaterialFunction (material: MaterialCadastro): Promise<any> {
//     try {
//         const resposta = await api.post('/material/salvar', material, {
//             headers: {
//                 Authorization: `Bearer ${getToken()} `
//             }
//         });

//         if (resposta.status === 201) {
//             console.log('Material cadastrado com sucesso', resposta.data);
//             return { status: resposta.status, data: resposta.data };
//         } else {
//             return { status: resposta.status, message: resposta.data };
//         }
        
//     } catch (error) {
//         let errorMessage = (error as AxiosError).response?.data as any;
//         // errorMessage = errorMessage? || 'Erro ao realizar o cadastro. Por favor, tente novamente mais tarde.';
//         throw new Error(errorMessage);
//     }
// } 

export default function vazia () {
}
