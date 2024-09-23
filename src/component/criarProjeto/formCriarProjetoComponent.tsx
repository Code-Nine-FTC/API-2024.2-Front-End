import { Button, FloatingLabel, Form, FormControl, InputGroup} from "react-bootstrap";
import React, { useState, useEffect, SetStateAction, Dispatch } from 'react'
import styles from './criarProjeto.module.css';
import attach from '../../assets/criarProjeto/attach.svg';
import arquivoIcon from '../../assets/criarProjeto/arquivo.svg';
import ValidadorDeArquivos from "../../functions/validadorDeArquivos";
import SweetAlert2 from 'sweetalert2';
import { CadastrarProjeto } from "../../interface/projeto.interface";
import CadastrarProjetoFunction from "../../services/projeto/cadastarProjetoService";
import MontarFormDataCadastro from "../../services/projeto/montarFormDataProjetoService";
import Calendario from "../date/calendarioComponent";
import { useNavigate } from 'react-router-dom';
import separarMensagens from "../../functions/separarMensagens";

interface MensagemValidacao {
    titulo: string
    texto: string
}
interface CalendarioProps {
    startDate: Date | null;
    endDate: Date | null;
    setStartDate: Dispatch<SetStateAction<Date | null>>;
    setEndDate: Dispatch<SetStateAction<Date | null>>;
}

const CriarProjetoComponent = () => {
    const navigate = useNavigate()

    const [mensagemValidacao, setMensagemValidacao] = useState<MensagemValidacao>({titulo: '', texto: ''});
    const [camposValidados, setValidado] = useState(false);
    const [tituloProjeto, setTituloProjeto] = useState('');	
    const [referenciaProjeto, setReferenciaProjeto] = useState('');
    const [contratante, setContratante] = useState('');
    const [objeto, setObjeto] = useState('');
    const [descricao, setDescricao] = useState('');
    const [coordenador, setCoordenador] = useState('');
    const [valor, setValor] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [resumoPdf, setResumoPdf] = useState<File | undefined>(undefined);
    const [resumoExcel, setResumoExcel] = useState<File | undefined>(undefined);
    const [propostas, setPropostas] = useState<File | undefined>(undefined);
    const [contrato, setContrato] = useState<File | undefined>(undefined);
    const [isValorInvalido, setIsValorInvalido] = useState(false);
    const [startDateValid, setStartDateValid] = useState<boolean | null>(null);
    const [endDateValid, setEndDateValid] = useState<boolean | null>(null);
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            setValidado(true);
            return
          }
      
        const valorFloat = parseFloat(valor);
        setValidado(true);

        const projeto = MontarFormDataCadastro({
            titulo: tituloProjeto,
            referenciaProjeto: referenciaProjeto,
            contratante: contratante,
            objeto: objeto,
            descricao: descricao,
            nomeCoordenador: coordenador,
            valor: valorFloat,
            dataInicio: startDate?.toISOString() || '',
            dataTermino: endDate?.toISOString() || '',
        }, 'cadastro', resumoExcel, resumoPdf, propostas, contrato);

        console.log(projeto);
        
        try {
            const resposta = await CadastrarProjetoFunction(projeto);
            if (resposta.status === 201) {
                console.log("Projeto cadastrado com sucesso");
                SweetAlert2.fire({
                    icon: 'success',
                    title: resposta.data,
                });
            } 
            } catch (error:any) {
                let errorMessage = error.message || 'Erro ao cadastrar o projeto. Por favor, tente novamente mais tarde.';
                console.error('Erro ao cadastrar projeto', error);
                SweetAlert2.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: errorMessage,
                });
            }
        }

    const validarDatas = () => {
        setStartDateValid(startDate !== null);
        setEndDateValid(endDate !== null && (!startDate || endDate >= startDate));
    };

    const atualizarMensagem = (mensagens: string) => {
        const [tituloErro, ...textoErro] = mensagens.split('. ');
            const text = textoErro.join('. ');
            setMensagemValidacao({titulo: tituloErro, texto: text});
            return;
    }

    useEffect(() => {
        if (mensagemValidacao.titulo && mensagemValidacao.texto) {
            SweetAlert2.fire({
                icon: 'error',
                title: mensagemValidacao.titulo,
                text: mensagemValidacao.texto,
            });
        }
    },[mensagemValidacao]);
            
    return (
        <>
            <div className="tituloSetaVoltar">
                <span className="setaVoltar" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}> &#x2190;</span>
                <h1 className="titulo"> Adicionar projeto </h1>
            </div>
            <section className={styles.formMain}>
                <Form noValidate validated={camposValidados} onSubmit={handleSubmit}>
                    <FloatingLabel
                        controlId="validationCustom01"
                        label="Titulo"
                        className="mb-3"
                        style={{width: '48vw',
                            color: '#9C9C9C',
                            zIndex: 1,
                        }}
                    >
                        <Form.Control 
                            type="text" 
                            placeholder="Titulo do projetor"
                            required
                            value={tituloProjeto}
                            onChange={(e) => setTituloProjeto(e.target.value)}
                         />
                         <Form.Control.Feedback type="invalid">
                            Por favor, insira o título do projeto.
                        </Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel 
                        label="Referência de projeto" 
                        controlId="validationCustom02"
                        className="mb-3"
                        style={{width: '48vw',
                            color: '#9C9C9C',
                            zIndex: 1,
                        }}
                    >
                        <Form.Control 
                            type="text" 
                            placeholder="Referência de projeto"
                            required 
                            value={referenciaProjeto}
                            onChange={(e) => setReferenciaProjeto(e.target.value)}
                         />
                         <Form.Control.Feedback type="invalid">
                            Por favor, insira a referência de projeto.
                        </Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel 
                        label="Empresa" 
                        controlId="validationCustom03"
                        className="mb-3"
                        style={{width: '48vw',
                            color: '#9C9C9C',
                            zIndex: 1,
                        }}
                    >
                        <Form.Control 
                            type="text" 
                            placeholder="Contratante"
                            required 
                            value={contratante}
                            onChange={(e) => setContratante(e.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Por favor, insira o contratante.
                            </Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel 
                        label="Coordenador" 
                        controlId="validationCustom06"
                        className="mb-3"
                        style={{width: '48vw',
                            color: '#9C9C9C',
                            zIndex: 1,
                        }}
                    >
                        <Form.Control 
                            type="text" 
                            placeholder="Coordenador"
                            value={coordenador}
                            required
                            onChange={(e) => setCoordenador(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">
                                Por favor, insira o coordenador.
                            </Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel 
                        label="Valor do projeto" 
                        controlId="validationCustom07"
                        className="mb-3"
                        style={{width: '48vw',
                            color: '#9C9C9C',
                            zIndex: 1,
                        }}
                    >
                        <Form.Control 
                            type="number" 
                            placeholder="Valor do projeto"
                            value={valor}
                            min="0"
                            onChange={(e) => setValor(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">
                                Por favor, insira o valor do projeto.
                            </Form.Control.Feedback>
                    </FloatingLabel>
                    <Calendario 
                        startDate={startDate}
                        endDate={endDate}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        startDateValid={startDateValid}
                        endDateValid={endDateValid}
                        validarDatas={validarDatas}
                        cadastro={true}
                    />
                    <div className={styles.botaoEnviar}>
                        <Button type="submit">
                            Enviar
                        </Button>
                    </div>
                </Form>
            </section>
        </>
        )
    }

export default CriarProjetoComponent;