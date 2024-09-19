import { Form } from "react-router-dom"
import { CadastrarProjetoJson, EditarProjeto } from "../../interface/projeto.interface"

const MontarFormDataCadastro = (
    projeto: CadastrarProjetoJson | EditarProjeto, 
    operacao: string,
    resumoExcel?: File,
    resumoPdf?: File,
    proposta?: File,
    contrato?: File ): FormData => {
    const formData = new FormData();
    
    if (operacao == 'cadastro') {
        let json  = JSON.stringify(projeto as CadastrarProjetoJson);
        formData.append('projeto', json);
    }
    if (operacao == 'edicao') {
        let json = JSON.stringify(projeto as EditarProjeto);
        formData.append('projeto', json);
    }
    if (resumoExcel) {
        formData.append('resumoExcel', resumoExcel);
    }
    if (resumoPdf) {
        formData.append('resumoPdf', resumoPdf);
    }
    if (proposta) {
        formData.append('proposta', proposta);
    }
    if (contrato) {
        formData.append('contrato', contrato);
    }
    return formData
};

export default MontarFormDataCadastro;