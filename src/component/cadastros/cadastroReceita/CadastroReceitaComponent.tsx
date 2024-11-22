import { useState, useEffect } from 'react';
import styles from "../cadastroGasto/cadastrarGastos.module.css"
import { Form, InputGroup, FloatingLabel, Button } from 'react-bootstrap';
import { NumberFormatValues, NumericFormat } from 'react-number-format';
import attach from '../../../assets/criarProjeto/attach.svg';
import arquivoIcon from '../../../assets/criarProjeto/arquivo.svg';
import ValidadorDeArquivos from '../../../functions/validadorDeArquivos';
import separarMensagens from '../../../functions/separarMensagens';
import SweetAlert2 from 'sweetalert2';
import { CadastroParceiro } from '../../../interface/parceiro.interface';

interface props {
    projetoId: string;
}

interface MensagemValidacao {
    titulo: string;
    texto: string;
}

export default function CadastroReceita (props: props) {
    const [parceiroId, setParceiroId] = useState("");
    const [parceiro, setParceiro] = useState("");
    const [data, setData] = useState("");
    const [valor, setValor] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [erro, setErro] = useState("");
    const [validado, setValidado] = useState(false);
    const [rubrica, setRubrica] = useState<File | null>(null);
    const [mensagemValidacao, setMensagemValidacao] = useState<MensagemValidacao>({ titulo: "", texto: "" });
    const [parceiroSelecionado, setParceiroSelecionado] = useState<CadastroParceiro | undefined>(undefined);
    const [erroParceiro, setErroParceiro] = useState("");
    const [documento, setDocumento] = useState("");
    const [valorValid, setValorValid] = useState<boolean | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            setValidado(true);
            return;
        }

        const receita = {
            parceiroId: parceiroId,
            data: data,
            valor: valor,
            cnpj: cnpj,
            arquivo: rubrica
        };

        console.log("Receita", receita);
        const formData = new FormData();
        formData.append('receita', JSON.stringify(receita));
        formData.append('idProjeto', props.projetoId);
        if (rubrica) {
            formData.append('notaFiscal', rubrica);
        }
        console.log(formData);
    };

    const atualizarMensagem = (mensagens: string) => {
        const [tituloErro, ...textoErro] = mensagens.split(". ");
        const text = textoErro.join(". ");
        setMensagemValidacao({ titulo: tituloErro, texto: text });
        return;
    };

    const handleArquivo = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (rubrica) {
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
        const mensagem: string = separarMensagens(arquivoValidado);
        if (mensagem) {
            atualizarMensagem(mensagem);
            return;
          } else {
            setRubrica(arquivo);
            SweetAlert2.fire({
              icon: "success",
              title: "Arquivo adicionado com sucesso",
            });
            return;
          }
    };

    const excluirArquivo = (rubrica: File | null) => {
        if (!rubrica) {
            return;
        }
        setRubrica(null);
    };

    return (
        <section className={styles.mainModal}>
            <Form noValidate validated={validado} onSubmit={handleSubmit}>
                {/* <InputGroup className="mb-3">
                    <FloatingLabel
                    controlId="validationCustom01"
                    label="Material"
                    className="flex-grow-1"
                    style={{ color: "#9C9C9C", zIndex: 0 }}
                    >
                    <Form.Select
                        aria-label="Floating label select example"
                        value={parceiroSelecionado?.id || ""}
                        onChange={(e) => {
                            const selectedId = Number(e.target.value);
                            const selectedParceiro = parceiro.find(parceiro => parceiro.id === selectedId);
                            setParceiroSelecionado(selectedParceiro);
                          }}
                        style={{ fontSize: 14, color: "#9C9C9C", zIndex: 1 }}
                        required
                    >
                        <option disabled selected value="">
                        Selecionar um material
                        </option>
                        {parceiro.length > 0 ? parceiro.map(parceiro => (
                            <option key={parceiro.id} value={parceiro.id}>
                            {parceiro.nome}
                        </option>
                        )): 
                        <option disabled>Nenhum material cadastrado</option>
                        }
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Por favor, selecione um Parceiro.
                    </Form.Control.Feedback>
                    </FloatingLabel>
                    {erroParceiro && (
                        <p style={{color: "red"}}>{erroParceiro}</p>
                    )}
                </InputGroup> */}
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
                    label="Valor Receita"
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
                    <span>Adicionar Rubrica</span>
                    </label>
                    <input
                    type="file"
                    id="enviararquivo"
                    accept=".pdf,.xls,.xlsx"
                    onChange={(e) => handleArquivo(e)}
                    style={{ display: "none" }}
                    />
                </div>
                {rubrica && (
              <div className={styles.arquivosEscolhidos}>
                <img src={arquivoIcon} alt="Arquivo" />
                <span className={styles.arquivoSpan}>
                    {rubrica.name}
                </span>
                <span
                  className={styles.arquivoSpanExcluir}
                  onClick={() => excluirArquivo(rubrica)}
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
    );
}