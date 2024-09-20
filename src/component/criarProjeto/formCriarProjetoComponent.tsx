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
import { set } from "date-fns";
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
    // const [arquivosEscolhidos, setArquivosEscolhidos] = useState<File[]>([]);
    const navigate = useNavigate()

    const [mensagemValidacao, setMensagemValidacao] = useState<MensagemValidacao>({titulo: '', texto: ''});
    const [camposValidados, setValidado] = useState(false);
    const [tituloProjeto, setTituloProjeto] = useState('');	
    const [referenciaProjeto, setReferenciaProjeto] = useState('');
    const [empresa, setEmpresa] = useState('');
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

        // arquivosEscolhidos.forEach(arquivo => {
        //     if (arquivo.type === 'application/pdf') {
        //         setResumoPdf(arquivo);
        //         console.log(resumoPdf)
        //     } else {
        //         setResumoExcel(arquivo);
        //         console.log(resumoExcel)
        //     }
        // });

        const projeto = MontarFormDataCadastro({
            titulo: tituloProjeto,
            referenciaProjeto: referenciaProjeto,
            empresa: empresa,
            objeto: objeto,
            descricao: descricao,
            nomeCoordenador: coordenador,
            valor: valorFloat,
            dataInicio: startDate?.toISOString() || '',
            dataTermino: endDate?.toISOString() || '',
        }, 'cadastro', resumoExcel, resumoPdf, propostas, contrato);

        console.log(projeto);

        // const projeto = new FormData();
        // projeto.append('titulo', tituloProjeto);
        // projeto.append('referenciaProjeto', referenciaProjeto);
        // projeto.append('empresa', empresa);
        // projeto.append('objeto', objeto);
        // projeto.append('descricao', descricao);
        // projeto.append('nomeCoordenador', coordenador);
        // projeto.append('valor', valorFloat.toString());
        // projeto.append('dataInicio', startDate?.toISOString() || '');
        // projeto.append('dataTermino', endDate?.toISOString() || '');
        // if (resumoPdf) projeto.append('resumoPdf', resumoPdf);
        // if (resumoExcel) projeto.append('resumoExcel', resumoExcel);
        
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

    const handleArquivo = (event: React.ChangeEvent<HTMLInputElement>, setState?: Dispatch<SetStateAction<File | undefined>>) => {
        const arquivo = event.target.files ? event.target.files[0] : null;

        if (!arquivo) {
            setMensagemValidacao({titulo: 'Nenhum arquivo selecionado.', texto: 'Por favor, selecione um arquivo.'});
            return;
        }

        switch (setState) {

            case setPropostas:
                if (propostas) {
                    setMensagemValidacao({titulo: 'Apenas um arquivo pode ser adicionado.', texto: 'Por favor, remova o arquivo atual para adicionar outro.'});
                    return;
                }
                const arquivosValidadosProposta = ValidadorDeArquivos([arquivo]);
                const mensagem = separarMensagens(arquivosValidadosProposta);
                if (mensagem) {
                    atualizarMensagem(mensagem);
                    return;
                } else {
                    setState(arquivo);
                    SweetAlert2.fire({
                        icon: 'success',
                        title: 'Arquivo adicionado com sucesso',
                        })
                    return;
                }
                
            case setContrato:
                if (contrato) {
                    setMensagemValidacao({titulo: 'Apenas um arquivo pode ser adicionado.', texto: 'Por favor, remova o arquivo atual para adicionar outro.'});
                    return;
                }
                const arquivosValidadosContrato = ValidadorDeArquivos([arquivo]);
                const mensagemContrato = separarMensagens(arquivosValidadosContrato);
                if (mensagemContrato) {
                    atualizarMensagem(mensagemContrato);
                    return;
                } else {
                    setState(arquivo);
                    SweetAlert2.fire({
                        icon: 'success',
                        title: 'Arquivo adicionado com sucesso',
                        })
                    return;
                }

            default:
                if (resumoPdf && resumoExcel) {
                    setMensagemValidacao({titulo: 'Apenas 2 arquivos podem ser adicionados nessa categoria.', texto: 'Por favor, remova um arquivo para adicionar outro.'});
                    return;
                }
                const arquivosValidados = ValidadorDeArquivos([arquivo]);
                const mensagens = separarMensagens(arquivosValidados);
                if (mensagens) {
                    atualizarMensagem(mensagens);
                    return;
                } else {
                    if (arquivo.type === 'application/pdf') {
                        if (resumoPdf != undefined) {
                            setMensagemValidacao({titulo: 'Apenas um arquivo PDF pode ser adicionado.', texto: 'Por favor, remova o arquivo atual para adicionar outro.'});
                            return;
                        }
                        else {
                            setResumoPdf(arquivo);
                            SweetAlert2.fire({
                                icon: 'success',
                                title: 'Arquivo adicionado com sucesso',
                                })
                            }
                        }
                    if (arquivo.type === 'application/vnd.ms-excel' || arquivo.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                        if (resumoExcel != undefined) {
                            setMensagemValidacao({titulo: 'Apenas um arquivo Excel pode ser adicionado.', texto: 'Por favor, remova o arquivo atual para adicionar outro.'});
                            return;
                        }
                        else {
                            setResumoExcel(arquivo);
                            SweetAlert2.fire({
                                icon: 'success',
                                title: 'Arquivo adicionado com sucesso',
                                })
                            }
                        }
                }
            } 

            event.target.value = '';
            
        }

    const excluirArquivo = (arquivoExcluir: File, setState?: Dispatch<SetStateAction<File | undefined>>) => {
        if (setState) {
            setState(undefined);
        }
        else {
            if (arquivoExcluir.type === 'application/pdf') {
                setResumoPdf(undefined);
            }
            if (arquivoExcluir.type === 'application/vnd.ms-excel' || arquivoExcluir.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                setResumoExcel(undefined);
            }
        }
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
                            placeholder="Empresa"
                            required 
                            value={empresa}
                            onChange={(e) => setEmpresa(e.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Por favor, insira a empresa.
                            </Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel 
                        label="Objeto" 
                        controlId="validationCustom04"
                        className="mb-3"
                        style={{width: '48vw',
                            color: '#9C9C9C',
                            zIndex: 1,
                        }}
                    >
                        <Form.Control 
                            type="text" 
                            placeholder="Objeto"
                            required
                            value={objeto}
                            onChange={(e) => setObjeto(e.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Por favor, insira o objeto.
                            </Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel 
                        label="Descrição" 
                        controlId="validationCustom05"
                        className="mb-3"
                        style={{width: '48vw',
                            color: '#9C9C9C',
                            zIndex: 1,
                        }}
                    >
                        <Form.Control 
                            as="textarea"
                            rows={6} 
                            placeholder="Descrição"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)} />
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
                            required
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
                    <div className={styles.adicionarArquivo}>
                        <label htmlFor="enviararquivo">
                            <img src={attach} alt="Adicionar arquivo" />
                            <span>Adicionar arquivo</span>
                        </label>
                        <input 
                            type="file"
                            id="enviararquivo"
                            accept=".pdf,.xls,.xlsx"
                            onChange={(e) => handleArquivo(e)}
                            style={{display: 'none'}}
                        />
                        {resumoPdf && (
                            <div className={styles.arquivosEscolhidos}> 
                                <img src={arquivoIcon} alt="Arquivo" />
                                <span className={styles.arquivoSpan}>
                                    {resumoPdf.name}
                                </span>
                                <span className={styles.arquivoSpanExcluir}
                                    onClick={(e) => excluirArquivo(resumoPdf)}>&#10006;
                                </span>
                            </div>
                            )}
                        {resumoExcel && (
                            <div className={styles.arquivosEscolhidos}> 
                                <img src={arquivoIcon} alt="Arquivo" />
                                <span className={styles.arquivoSpan}>
                                    {resumoExcel.name}
                                </span>
                                <span className={styles.arquivoSpanExcluir}
                                    onClick={(e) => excluirArquivo(resumoExcel)}>&#10006;
                                </span>
                            </div>
                            )}
                        {/*{arquivosEscolhidos.length > 0 && (
                        //     arquivosEscolhidos.map(arquivo => (
                        //         <div className={styles.arquivosEscolhidos}> 
                        //             <img src={arquivoIcon} alt="Arquivo" />
                        //             <span className={styles.arquivoSpan}>
                        //                 {arquivo.name}
                        //             </span>
                        //             <span className={styles.arquivoSpanExcluir}
                        //                 onClick={(e) => excluirArquivo(arquivo, setArquivosEscolhidos)}>&#10006;
                        //             </span>
                        //         </div>
                        //     ))
                        // */}
                    </div>
                    <div className={styles.adicionarArquivos}>
                        <label htmlFor="enviarProposta">
                            <span>Proposta</span>
                            <img src={attach} alt="Adicionar arquivo" />
                        </label>
                        <input 
                            type="file"
                            id="enviarProposta"
                            accept=".pdf"
                            onChange={(e) => handleArquivo(e, setPropostas)}
                            style={{display: 'none'}}
                        />
                        {propostas  && (
                            <div className={styles.anexosEscolhidos}> 
                                <img src={arquivoIcon} alt="Arquivo" />
                                <span className={styles.arquivoSpan}>
                                    {propostas.name}
                                </span>
                                <span className={styles.arquivoSpanExcluir}
                                    onClick={(e) => excluirArquivo(propostas, setPropostas)}>&#10006;
                                </span>
                            </div>
                        )}
                    </div>
                    <div className={styles.adicionarArquivos}>
                        <label htmlFor="enviarContrato">
                            <span>Contrato</span>
                            <img src={attach} alt="Adicionar arquivo" />
                        </label>
                        <input 
                            type="file"
                            id="enviarContrato"
                            accept=".pdf"
                            onChange={(e) => handleArquivo(e, setContrato)}
                            style={{display: 'none'}}
                        />
                        {contrato  && (
                            <div className={styles.anexosEscolhidos}> 
                                <img src={arquivoIcon} alt="Arquivo" />
                                <span className={styles.arquivoSpan}>
                                    {contrato.name}
                                </span>
                                <span className={styles.arquivoSpanExcluir}
                                    onClick={(e) => excluirArquivo(contrato, setContrato)}>&#10006;
                                </span>
                            </div>
                        )}
                    </div>
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