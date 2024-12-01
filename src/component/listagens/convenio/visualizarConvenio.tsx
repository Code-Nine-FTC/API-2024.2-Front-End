import { useNavigate } from "react-router";
import React, { useEffect, useState, SetStateAction, Dispatch } from "react";
import { Button, Form, Alert, Spinner, FloatingLabel, InputGroup, Modal, Card } from "react-bootstrap";
import SweetAlert2 from "sweetalert2";
import { ConvenioVisualizacao } from "../../../interface/cadastros/convenio.interface";
import ConvenioVisualizacaoService from "../../../services/convenios/ConvenioVisualizacaoService";
import EditarConvenioService from "../../../services/convenios/editarConvenioService";
import ExcluirConvenio from "../../../services/convenios/excluirConvenioService";
import styles from "./visualizarConvenio.module.css";
interface ConvenioVisualizacaoprops {
    idConvenio: number;
}

const VisualizarConvenioComponent: React.FC <ConvenioVisualizacaoprops> = ({idConvenio}) => {
    const [convenioOriginal, setConvenioOriginal] = useState<ConvenioVisualizacao | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [nomeInstituicao, setNomeInstituicao] = useState(convenioOriginal?.nomeInstituicao || '');
    const [dataInicial, setDataInicial] = useState(convenioOriginal?.dataInicial || '');
    const [dataFinal, setDataFinal] = useState(convenioOriginal?.dataFinal || '');
    const [documentoClausulas, setDocumentoClausulas] = useState(convenioOriginal?.documentoClausulas || '');
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchconvenio = async () => {
            try {
                const response = await ConvenioVisualizacaoService(idConvenio);
                if (response.status === 200) {
                    setConvenioOriginal(response.data);
                } else {
                    setError(response.message);
                }
            } catch (error) {
                setError('Erro ao carregar os dados do convenio');
            } finally {
                setLoading(false);
            }
        }
        fetchconvenio();

    }, [idConvenio]);

    useEffect(() => {
    if (convenioOriginal) {
        setNomeInstituicao(convenioOriginal.nomeInstituicao);
        setDataInicial(convenioOriginal.dataInicial);
        setDataFinal(convenioOriginal.dataFinal);
        setDocumentoClausulas(convenioOriginal.documentoClausulas);
    } 
}, [convenioOriginal]);

const handleBack = (id: number) => {
    setIsEditing(false);
    navigate(`/convenio/visualizar/${id}`);
  };

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const camposEditados = {
        nomeInstituicao: nomeInstituicao,
        dataInicial: dataInicial,
        dataFinal: dataFinal,
        documentoClausulas: documentoClausulas,
    }

    console.log("camposEditados:", camposEditados);

    const FormData = {
    nomeInstituicao: camposEditados.nomeInstituicao,
    dataInicial: camposEditados.dataInicial,
    dataFinal: camposEditados.dataFinal,
    documentoClausulas: camposEditados.documentoClausulas,
};
    try {
        const response = await EditarConvenioService(FormData,idConvenio);
        console.log(response)
        if (response.status === 201) {
          SweetAlert2.fire({
            title: "Sucesso!",
            text: "convenio atualizado com sucesso.",
            icon: "success",
        }).then(() => {
            navigate(`/listagemconvenios`);
            setIsEditing(false);
        });
      }
      else {
        setError(response.message);
      }
    } catch (error) {
        setError('Erro ao atualizar os dados do convenio');
    }
}

const handleDelete = async (id: number) => {
    SweetAlert2.fire({
      title: "Tem certeza que deseja excluir o convenio?",
      text: "Essa ação não pode ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const exclusaoConvenio = await ExcluirConvenio(id);
          if (exclusaoConvenio.status === 200) {
            navigate("/");
            SweetAlert2.fire({
              icon: "success",
              title: exclusaoConvenio.data,
            });
          }
        } catch (error: any) {
          let errorMessage =
            error.message ||
            "Erro ao excluir o convenio. Por favor, tente novamente mais tarde.";
          console.error("Erro ao excluir convenio", error);
          SweetAlert2.fire({
            icon: "error",
            title: "Erro!",
            text: errorMessage,
          });
        }
      }
    });
  };

  const handleEditar = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsEditing(true);
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!convenioOriginal) {
    return <Alert variant="warning">convenio não encontrado</Alert>;
  }

return (
    <>
     <div className={styles.topoPagina}>
        <span
          className="setaVoltar"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          {" "}
          &#x2190;
        </span>
        <h1 className="titulo">{convenioOriginal.nomeInstituicao}</h1>
        {!isEditing && (<div className={styles.editarExcluir}>
            <Button variant="primary" onClick={handleEditar} className="mt-3">
              Editar
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(idConvenio)}
              className="mt-3"
            >
              Deletar
            </Button>
          </div>
        )}
        </div>
        <br />
      <section className={styles.formMain}>
      <Form onSubmit={handleSubmit}>
      <FloatingLabel controlId="validationCustom01" label="nomeInstituicao" className="flex-grow-1" style={{ color: "#9C9C9C", zIndex: 1, width: '60%', marginBottom: '1%' }}>
            <Form.Control
              type="text"
              placeholder="nomeInstituicao do convenio"
              required
              value={nomeInstituicao}
              onChange={(e) => setNomeInstituicao(e.target.value)}
              readOnly={!isEditing}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, insira o nomeInstituicao do convenio.
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel controlId="validationCustom01" label="dataInicial" className="flex-grow-1" style={{ color: "#9C9C9C", zIndex: 1, width: '60%', marginBottom: '1%' }}>
            <Form.Control
              type="text"
              placeholder="CPF ou CNPJ"
              required
              value={dataInicial}
              onChange={(e) => setDataInicial(e.target.value)}
              readOnly={!isEditing}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, insira o cpf ou cnpj do convenio.
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel controlId="validationCustom01" label="Tipo" className="flex-grow-1" style={{ color: "#9C9C9C", zIndex: 1, width: '60%', marginBottom: '1%' }}>
            <Form.Control
              type="text"
              placeholder="Tipo Bolsa"
              required
              value={dataFinal}
              onChange={(e) => setDataFinal(e.target.value)}
              readOnly={!isEditing}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, insira o tipo da bolsa.
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel controlId="validationCustom01" label="Duração" className="flex-grow-1" style={{ color: "#9C9C9C", zIndex: 1, width: '60%', marginBottom: '1%' }}>
            <Form.Control
              type="text"
              placeholder="Durçao da Bolsa"
              required
              value={documentoClausulas}
              onChange={(e) => setDocumentoClausulas(e.target.value)}
              readOnly={!isEditing}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, insira a duração da bolsa.
            </Form.Control.Feedback>
          </FloatingLabel>

       {isEditing && (
          <div className={styles.botoesSalvarVoltar}>
            <Button type="submit" variant="primary">
              Salvar Alterações
            </Button>

            <Button variant="secondary" onClick={() => handleBack(idConvenio)}>
              Descartar Alterações
            </Button>
          </div>
        )}
      </Form>
      </section>
    </>
)

}
export default VisualizarConvenioComponent;