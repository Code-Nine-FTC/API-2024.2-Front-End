import { Button, FloatingLabel, Form} from "react-bootstrap";
import React, { useState, useEffect, SetStateAction, Dispatch } from 'react'
import styles from './criarProjeto.module.css';
import attach from '../../assets/criarProjeto/attach.svg';
import arquivoIcon from '../../assets/criarProjeto/arquivo.svg';
import ValidadorDeArquivos from "../../functions/validadorDeArquivos";
import SweetAlert2 from 'sweetalert2';
import Calendar from "../date/calendarioComponent";

interface MensagemValidacao {
    titulo: string
    texto: string
}

const CriarProjetoComponent = () => {
    const [arquivosEscolhidos, setArquivosEscolhidos] = useState<File[]>([]);
    const [mensagemValidacao, setMensagemValidacao] = useState<MensagemValidacao>({titulo: '', texto: ''});

    const handleArquivo = (event: React.ChangeEvent<HTMLInputElement>, setState: Dispatch<SetStateAction<File[]>>) => {
        const arquivo = event.target.files ? event.target.files[0] : null;

        if (!arquivo) {
            setMensagemValidacao({titulo: 'Nenhum arquivo selecionado.', texto: 'Por favor, selecione um arquivo.'});
            return;
        }

        if (setState == setArquivosEscolhidos && arquivosEscolhidos.length == 2) {
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
            setMensagemValidacao({titulo: '', texto: ''});
            if (arquivo) {
                setState(prevArquivos => [...prevArquivos, arquivo]);
                SweetAlert2.fire({
                    icon: 'success',
                    title: 'Arquivo adicionado com sucesso',
                    })
                }
            }
        }

    const excluirArquivo = (arquivoExcluir: File, setState: Dispatch<SetStateAction<File[]>>) => {
        setState(prevArquivos => prevArquivos.filter(arquivo => arquivo != arquivoExcluir));
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
                <Form>
                    <FloatingLabel
                        controlId="floatingTextarea"
                        label="Titulo"
                        className="mb-3"
                        style={{width: '48vw',
                            color: '#9C9C9C',
                            zIndex: 1,
                        }}
                    >
                        <Form.Control type="text" placeholder="Titulo do projetor" />
                    </FloatingLabel>
                    <FloatingLabel 
                        label="Referência de projeto" 
                        controlId="floatingTextarea"
                        className="mb-3"
                        style={{width: '48vw',
                            color: '#9C9C9C',
                            zIndex: 1,
                        }}
                    >
                        <Form.Control type="text" placeholder="Referência de projeto" />
                    </FloatingLabel>
                    <FloatingLabel 
                        label="Empresa" 
                        controlId="floatingTextarea"
                        className="mb-3"
                        style={{width: '48vw',
                            color: '#9C9C9C',
                            zIndex: 1,
                        }}
                    >
                        <Form.Control type="text" placeholder="Empresa" />
                    </FloatingLabel>
                    <FloatingLabel 
                        label="Objeto" 
                        controlId="floatingTextarea"
                        className="mb-3"
                        style={{width: '48vw',
                            color: '#9C9C9C',
                            zIndex: 1,
                        }}
                    >
                        <Form.Control type="text" placeholder="Objeto" />
                    </FloatingLabel>
                    <FloatingLabel 
                        label="Descrição" 
                        controlId="floatingTextarea"
                        className="mb-3"
                        style={{width: '48vw',
                            color: '#9C9C9C',
                            zIndex: 1,
                        }}
                    >
                        <Form.Control as="textarea" rows={6} placeholder="Descrição" />
                    </FloatingLabel>
                    <FloatingLabel 
                        label="Coordenador" 
                        controlId="floatingTextarea"
                        className="mb-3"
                        style={{width: '48vw',
                            color: '#9C9C9C',
                            zIndex: 1,
                        }}
                    >
                        <Form.Control type="text" placeholder="Coordenador" />
                    </FloatingLabel>
                    <FloatingLabel 
                        label="Valor do projeto" 
                        controlId="floatingTextarea"
                        className="mb-3"
                        style={{width: '48vw',
                            color: '#9C9C9C',
                            zIndex: 1,
                        }}
                    >
                        <Form.Control type="text" placeholder="Valor do projeto" />
                    </FloatingLabel>
                    <Calendar />
                    <div className={styles.adicionarArquivo}>
                        <label htmlFor="enviararquivo">
                            <img src={attach} alt="Adicionar arquivo" />
                            <span>Adicionar arquivo</span>
                        </label>
                        <input 
                            type="file"
                            id="enviararquivo"
                            accept=".pdf,.xls,.xlsx"
                            onChange={(e) => handleArquivo(e, setArquivosEscolhidos)}
                            style={{display: 'none'}}
                        />
                        {arquivosEscolhidos.length > 0 && (
                            arquivosEscolhidos.map(arquivo => (
                                <div className={styles.arquivosEscolhidos}> 
                                    <img src={arquivoIcon} alt="Arquivo" />
                                    <span className={styles.arquivoSpan}>
                                        {arquivo.name}
                                    </span>
                                    <span className={styles.arquivoSpanExcluir}
                                        onClick={(e) => excluirArquivo(arquivo, setArquivosEscolhidos)}>&#10006;
                                    </span>
                                </div>
                            ))
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