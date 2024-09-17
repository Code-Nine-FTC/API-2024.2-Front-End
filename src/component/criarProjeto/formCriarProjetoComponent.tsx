import { Button, FloatingLabel, Form} from "react-bootstrap";
import React, { useState, useEffect, SetStateAction, Dispatch } from 'react'
import styles from './criarProjeto.module.css';
import attach from '../../assets/criarProjeto/attach.svg';
import arquivoIcon from '../../assets/criarProjeto/arquivo.svg';
import ValidadorDeArquivos from "../../functions/validadorDeArquivos";
import SweetAlert2 from 'sweetalert2';
import { CadastrarProjeto } from "../../interface/projeto.interface";
import CadastrarProjetoFunction from "../../services/projeto/cadastarProjetoService";
import Calendario from "../date/calendarioComponent";

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
    const [isValorInvalido, setIsValorInvalido] = useState(false);

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

        const projeto = new FormData();
        projeto.append('titulo', tituloProjeto);
        projeto.append('referenciaProjeto', referenciaProjeto);
        projeto.append('empresa', empresa);
        projeto.append('objeto', objeto);
        projeto.append('descricao', descricao);
        projeto.append('coordenador', coordenador);
        projeto.append('valor', valorFloat.toString());
        projeto.append('dataInicio', startDate?.toISOString() || '');
        projeto.append('dataFim', endDate?.toISOString() || '');
        if (resumoPdf) projeto.append('resumoPdf', resumoPdf);
        if (resumoExcel) projeto.append('resumoExcel', resumoExcel);
        
        try {
            const resposta = await CadastrarProjetoFunction(projeto);
            if (resposta.status === 200) {
                console.log("Projeto cadastrado com sucesso");
                SweetAlert2.fire({
                    icon: 'success',
                    title: 'Projeto cadastrado com sucesso!',
                });
            } else {
                console.error('Erro ao cadastrar projeto', resposta);
                SweetAlert2.fire({
                    icon: 'error',
                    title: 'Erro ao cadastrar projeto!',
                    })
                }   
            } catch (error) {
                console.error('Erro ao cadastrar projeto', error);
                SweetAlert2.fire({
                    icon: 'error',
                    title: 'Erro ao cadastrar projeto!',
                });
            }
        }

    const handleArquivo = (event: React.ChangeEvent<HTMLInputElement>, setState?: Dispatch<SetStateAction<File[]>>) => {
        const arquivo = event.target.files ? event.target.files[0] : null;

        if (!arquivo) {
            setMensagemValidacao({titulo: 'Nenhum arquivo selecionado.', texto: 'Por favor, selecione um arquivo.'});
            return;
        }

        if (resumoExcel && resumoPdf) {
            setMensagemValidacao({titulo: 'Apenas 2 arquivos podem ser adicionados nessa categoria.', texto: 'Por favor, remova um arquivo para adicionar outro.'});
            return;
        }

        const arquivosValidados = ValidadorDeArquivos([arquivo]);

        const mensagens = arquivosValidados.filter(resultadoFiltro => !resultadoFiltro.resultado)
            .map(resultadoFiltro => resultadoFiltro.mensagem)
            .join('\n');

        if(mensagens) {
            const [tituloErro, ...textoErro] = mensagens.split('. ');
            const text = textoErro.join('. ');
            setMensagemValidacao({titulo: tituloErro, texto: text});
            return;
        } else {
            if (setState) {
                 // setMensagemValidacao({titulo: '', texto: ''});
                // if (arquivo) {
                //     setState(prevArquivos => [...prevArquivos, arquivo]);
                //     console.log(arquivosEscolhidos);
                //     SweetAlert2.fire({
                //         icon: 'success',
                //         title: 'Arquivo adicionado com sucesso',
                //         })
                //     }
            }
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

    const excluirArquivo = (arquivoExcluir: File, setState?: Dispatch<SetStateAction<File[]>>) => {
        if (setState) {
            setState(prevArquivos => prevArquivos.filter(arquivo => arquivo != arquivoExcluir));
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
                <span className="setaVoltar"> &#x2190;</span>
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
                        {/* // {arquivosEscolhidos.length > 0 && (
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
                        // )} */}
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