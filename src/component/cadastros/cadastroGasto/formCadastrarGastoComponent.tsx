import { useState, useEffect } from 'react';
import { VisualizarMaterial } from '../../../interface/cadastros/material.interface';
import styles from './cadastrarGastos.module.css'
import { Form, InputGroup, FloatingLabel, Button } from 'react-bootstrap';
import Calendario from '../../date/calendarioComponent';
import { NumberFormatValues, NumericFormat } from 'react-number-format';
import attach from '../../../assets/criarProjeto/attach.svg';
import arquivoIcon from '../../../assets/criarProjeto/arquivo.svg';
import ValidadorDeArquivos from '../../../functions/validadorDeArquivos';
import separarMensagens from '../../../functions/separarMensagens';
import SweetAlert2 from 'sweetalert2';
import buscarMateriaisService from '../../../services/materiais/buscarMateriaisService';
import CadastrarGastosService from '../../../services/gastos/cadastrarGastosService';
import { FormDataGastoCadastro } from '../../../interface/cadastros/gasto.interface';

interface MensagemValidacao {
    titulo: string;
    texto: string;
  }

interface props {
    projetoId: string
}
export default function FormCadastrarGasto (props: props) {
    const [documento, setDocumento] = useState("");
    const [tipoDocumento, setTipoDocumento] = useState("");
    const [fornecedor, setFornecedor] = useState("");
    const [data, setData] = useState("");
    const [valor, setValor] = useState("");
    const [materiais, setMateriais] = useState<VisualizarMaterial[]>([]);
    const [materialSelecionado, setMaterialSelecionado] = useState<VisualizarMaterial | undefined>(undefined);
    const [notaFiscal, setNotaFiscal] = useState<File | null>(null);
    const [camposValidados, setCamposValidados] = useState(false);
    const [valorValid, setValorValid] = useState<boolean | null>(null);
    const [mensagemValidacao, setMensagemValidacao] = useState<MensagemValidacao>({ titulo: "", texto: "" });
    const [erro, setErro] = useState("");
    const [erroMateriais, setErroMateriais] = useState("");
    const [validado, setValidado] = useState(false);
    
    const valorFloat = parseFloat(valor);
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            setValidado(true);
            return;
        }

        // if (materialSelecionado == "") {
        //     setValidado(true);
        // }

        const valorFloat = parseFloat(valor);
        setValidado(true);

        const gasto = {
            documento,
            tipoDocumento,
            fornecedor,
            data,
            valor: valorFloat,
            material: materialSelecionado
        }
        console.log("Gasto", gasto);
        const formData = new FormData();
        formData.append('gasto', JSON.stringify(gasto));
        formData.append('idProjeto', props.projetoId);
        if (notaFiscal) {
            formData.append('notaFiscal', notaFiscal);
        }
        console.log(formData);

        try {
            const resposta = await CadastrarGastosService(formData);
            if (resposta.status === 200) {
                setErro("");
                SweetAlert2.fire({
                    title: "Sucesso!",
                    text: "Gasto cadastrado com sucesso!",
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Ok",
                    }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            } else {
                console.error(resposta.message);
                setErro(resposta.message);
            }
        } catch (error: any) {
            console.error(error);
            setErro(error.message);
        }
    }

    useEffect(() => {
        if (erro !== "") {
        SweetAlert2.fire({
          icon: "error",
          title: "Erro ao cadastrar gasto",
          text: erro,
        });
    }
    }, [erro]);

    useEffect(() => {
        if (mensagemValidacao.titulo && mensagemValidacao.texto) {
          SweetAlert2.fire({
            icon: "error",
            title: mensagemValidacao.titulo,
            text: mensagemValidacao.texto,
          });
        }
      }, [mensagemValidacao]);
    
    useEffect(() => {
        const fetchMateriais = async () => {
            const respostaMateriais = await buscarMateriaisService();
            if (respostaMateriais.status === 200) {
                setErroMateriais("");
                setMateriais(respostaMateriais.data);
            } else {
                console.error(respostaMateriais.message);
                setErroMateriais(respostaMateriais.message);
            }
        }
        fetchMateriais();
    }, [])

    const atualizarMensagem = (mensagens: string) => {
        const [tituloErro, ...textoErro] = mensagens.split(". ");
        const text = textoErro.join(". ");
        setMensagemValidacao({ titulo: tituloErro, texto: text });
        return;
      };
    
    const handleArquivo = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (notaFiscal) {
            setMensagemValidacao({
                titulo: "Apenas um arquivo pode ser adicionado.",
                texto: "Por favor, remova o arquivo atual para adicionar outro.",
              });
              return;
        }
        const arquivo = event.target.files ? event.target.files[0] : null;
        if (!arquivo) {
            return;
        }
        const arquivoValidado = ValidadorDeArquivos([arquivo]);
        const mensagem = separarMensagens(arquivoValidado);
        if (mensagem) {
            atualizarMensagem(mensagem);
            return;
          } else {
            setNotaFiscal(arquivo);
            SweetAlert2.fire({
              icon: "success",
              title: "Arquivo adicionado com sucesso",
            });
            return;
          }
    }

    const excluirArquivo = (notaFiscal: File | null) => {
        if (!notaFiscal) {
            return;
        }
        setNotaFiscal(null);
    }

    return (
        <section className={styles.mainModal}>
            <Form noValidate validated={validado} onSubmit={handleSubmit}>
            <InputGroup className="mb-3">
                    <FloatingLabel
                    controlId="validationCustom01"
                    label="Material"
                    className="flex-grow-1"
                    style={{ color: "#9C9C9C", zIndex: 0 }}
                    >
                    <Form.Select
                        aria-label="Floating label select example"
                        value={materialSelecionado?.id || ""}
                        onChange={(e) => {
                            const selectedId = Number(e.target.value);
                            const selectedMaterial = materiais.find(material => material.id === selectedId);
                            setMaterialSelecionado(selectedMaterial);
                          }}
                        style={{ fontSize: 14, color: "#9C9C9C", zIndex: 1 }}
                        required
                    >
                        <option disabled selected value="">
                        Selecionar um material
                        </option>
                        {materiais.length > 0 ? materiais.map(material => (
                            <option key={material.id} value={material.id}>
                            {material.nome}
                        </option>
                        )): 
                        <option disabled>Nenhum material cadastrado</option>
                        }
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Por favor, selecione um material.
                    </Form.Control.Feedback>
                    </FloatingLabel>
                    {erroMateriais && (
                        <p style={{color: "red"}}>{erroMateriais}</p>
                    )}
                </InputGroup>
                
                <InputGroup className="mb-3">
                    <FloatingLabel
                    label="Documento"
                    controlId="validationCustom02"
                    className="flex-grow-1"
                    style={{ color: "#9C9C9C", zIndex: 1 }}
                    >
                    <Form.Control
                        type="text"
                        placeholder="CPF ou CNPJ"
                        required
                        value={documento}
                        onChange={(e) => setDocumento(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                        Por favor, insira o documento.
                    </Form.Control.Feedback>
                    </FloatingLabel>
                </InputGroup>

                <InputGroup className="mb-3">
                    <FloatingLabel
                    controlId="validationCustom03"
                    label="Tipo do documento"
                    className="flex-grow-1"
                    style={{ color: "#9C9C9C", zIndex: 0 }}
                    >
                    <Form.Select
                        aria-label="Floating label select example"
                        value={tipoDocumento}
                        onChange={(e) => setTipoDocumento(e.target.value)}
                        style={{ fontSize: 14, color: "#9C9C9C", zIndex: 1 }}
                        required
                    >
                        <option disabled selected value="">
                        Selecionar um tipo de documento
                        </option>
                        <option value="CPF">CPF</option>
                        <option value="CNPJ">CNPJ</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Por favor, insira o tipo do documento.
                    </Form.Control.Feedback>
                    </FloatingLabel>
                </InputGroup>

                <InputGroup className="mb-3">
                    <FloatingLabel
                    label="Fornecedor"
                    controlId="validationCustom04"
                    className="flex-grow-1"
                    style={{ color: "#9C9C9C", zIndex: 1 }}
                    >
                    <Form.Control
                        type="text"
                        placeholder="Fornecedor"
                        value={fornecedor}
                        required
                        onChange={(e) => setFornecedor(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                        Por favor, insira o fornecedor.
                    </Form.Control.Feedback>
                    </FloatingLabel>
                </InputGroup>

                <InputGroup className="mb-3">
                    <FloatingLabel
                    label="Data"
                    controlId="validationCustom05"
                    className="flex-grow-1"
                    style={{ color: "#9C9C9C", zIndex: 1 }}
                    >
                    <Form.Control
                        type="date"
                        placeholder="Data"
                        value={data}
                        required
                        onChange={(e) => setData(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                        Por favor, insira a data.
                    </Form.Control.Feedback>
                    </FloatingLabel>
                </InputGroup>

                <InputGroup className="mb-3">
                    <FloatingLabel
                    label="Valor do projeto"
                    controlId="validationCustom06"
                    className="flex-grow-1"
                    style={{ color: "#9C9C9C", zIndex: 1 }}
                    >
                    <Form.Control
                        as={NumericFormat}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        decimalScale={2}
                        fixedDecimalScale
                        allowNegative={false}
                        placeholder="Valor"
                        value={valor}
                        isInvalid={valorValid === false}
                        isValid={valorValid === true}
                        onValueChange={(values: NumberFormatValues) => setValor(values.value)}
                        required
                        name="valor"
                        id="valor"
                    />
                    <Form.Control.Feedback type="invalid">
                        Por favor, insira o valor do projeto.
                    </Form.Control.Feedback>
                    </FloatingLabel>
                </InputGroup>
                <div className={styles.adicionarArquivo}>
                    <label htmlFor="enviararquivo">
                    <img src={attach} alt="Adicionar arquivo" />
                    <span>Adicionar nota fiscal</span>
                    </label>
                    <input
                    type="file"
                    id="enviararquivo"
                    accept=".pdf,.xls,.xlsx"
                    onChange={(e) => handleArquivo(e)}
                    style={{ display: "none" }}
                    />
                </div>
                {notaFiscal && (
              <div className={styles.arquivosEscolhidos}>
                <img src={arquivoIcon} alt="Arquivo" />
                <span className={styles.arquivoSpan}>
                    {notaFiscal.name}
                </span>
                <span
                  className={styles.arquivoSpanExcluir}
                  onClick={() => excluirArquivo(notaFiscal)}
                >
                  &#10006;
                </span>
              </div>
            )}
                <div className={styles.botaoEnviar}>
                    <Button size='lg' type="submit">Enviar</Button>
                </div>
                </Form>
        </section>
    )
}
