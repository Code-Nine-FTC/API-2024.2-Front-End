import { useState, useEffect } from 'react';
import { VisualizarMaterial } from '../../interface/cadastros/material.interface';
import styles from './cadastrarGastos.module.css'
import { Form, InputGroup, FloatingLabel, Button } from 'react-bootstrap';
import Calendario from '../date/calendarioComponent';
import { NumberFormatValues, NumericFormat } from 'react-number-format';
import attach from '../../assets/criarProjeto/attach.svg';
import arquivoIcon from '../../assets/criarProjeto/arquivo.svg';
import ValidadorDeArquivos from '../../functions/validadorDeArquivos';
import separarMensagens from '../../functions/separarMensagens';
import SweetAlert2 from 'sweetalert2';

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
    const [dataGasto, setDataGasto] = useState("");
    const [valor, setValor] = useState("");
    const [materiais, setMateriais] = useState<VisualizarMaterial[]>([]);
    const [materialSelecionado, setMaterialSelecionado] = useState<VisualizarMaterial | null>(null);
    const [notaFiscal, setNotaFiscal] = useState<File | null>(null);
    const [camposValidados, setCamposValidados] = useState(false);
    const [valorValid, setValorValid] = useState<boolean | null>(null);
    const [mensagemValidacao, setMensagemValidacao] = useState<MensagemValidacao>({ titulo: "", texto: "" });
    
    const valorFloat = parseFloat(valor);
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    }

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
            <Form noValidate validated={camposValidados} onSubmit={handleSubmit}>
            <InputGroup className="mb-3">
                    <FloatingLabel
                    controlId="floatingSelectGrid"
                    label="Material"
                    className="flex-grow-1"
                    style={{ color: "#9C9C9C", zIndex: 0 }}
                    >
                    <Form.Select
                        aria-label="Floating label select example"
                        value={materialSelecionado?.id}
                        onChange={(e) => setTipoDocumento(e.target.value)}
                        style={{ fontSize: 14, color: "#9C9C9C", zIndex: 1 }}
                    >
                        <option disabled selected>
                        Selecionar uma Situação
                        </option>
                        <option value="CPF">CPF</option>
                        <option value="CNPJ">CNPJ</option>
                    </Form.Select>
                    </FloatingLabel>
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
                    controlId="floatingSelectGrid"
                    label="Tipo do documento"
                    className="flex-grow-1"
                    style={{ color: "#9C9C9C", zIndex: 0 }}
                    >
                    <Form.Select
                        aria-label="Floating label select example"
                        value={tipoDocumento}
                        onChange={(e) => setTipoDocumento(e.target.value)}
                        style={{ fontSize: 14, color: "#9C9C9C", zIndex: 1 }}
                    >
                        <option disabled selected>
                        Selecionar uma Situação
                        </option>
                        <option value="CPF">CPF</option>
                        <option value="CNPJ">CNPJ</option>
                    </Form.Select>
                    </FloatingLabel>
                </InputGroup>

                <InputGroup className="mb-3">
                    <FloatingLabel
                    label="Fornecedor"
                    controlId="validationCustom06"
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
                        value={dataGasto}
                        required
                        onChange={(e) => setDataGasto(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                        Por favor, insira a data.
                    </Form.Control.Feedback>
                    </FloatingLabel>
                </InputGroup>

                <InputGroup className="mb-3">
                    <FloatingLabel
                    label="Valor do projeto"
                    controlId="validationCustom07"
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
                    <Button type="submit">Enviar</Button>
                </div>
                </Form>
        </section>
    )
}
