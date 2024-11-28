// import React, { useState } from 'react';
// import SweetAlert2 from "sweetalert2";
// import { Button, Form, FloatingLabel, InputGroup } from 'react-bootstrap';
// import styles from "../../criarProjeto/criarProjeto.module.css";
// import { useNavigate } from 'react-router-dom';
// import CadastrarMaterialFunction from '../../../services/cadastro/material/cadastrarMaterialService';

// const CadastroMaterialComponent: React.FC = () => {
//   const navigate = useNavigate();
//   const [nome, setNome] = useState("");
//   const [valor, setValor] = useState<number>(0);
//   const [fornecedor, setFornecedor] = useState("");
//   const [fornecedorEmail, setFornecedorEmail] = useState("");
//   const [fornecedorTelefone, setFornecedorTelefone] = useState("");
//   const [statusUtilizacao, setStatusUtilizacao] = useState("");
//   const [camposValidados, setValidado] = useState(false);


//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     event.stopPropagation()

//     const form = event.currentTarget

//     if (form.checkValidity() === false){
//       setValidado(true)
//       return
//     }

//     const material = {
//       nome: nome,
//       valor: valor,
//       fornecedor: fornecedor,
//       fornecedorEmail: fornecedorEmail,
//       fornecedorTelefone: fornecedorTelefone,
//       statusUtilizacao: statusUtilizacao
//     }

//     console.log(material)

//     try {
//       const resposta = await CadastrarMaterialFunction(material);
//       if (resposta.status === 201) {
//         console.log("Material cadastrado com sucesso");
//         navigate(`/`);
//         SweetAlert2.fire({
//           icon: "success",
//           title: resposta.data,
//         });
//       }
//     } catch (error: any) {
//       let errorMessage =
//         error.message ||
//         "Erro ao cadastrar o material. Por favor, tente novamente mais tarde.";
//       console.error("Erro ao cadastrar material", error);
//       SweetAlert2.fire({
//         icon: "error",
//         title: "Erro!",
//         text: errorMessage,
//       });
//     }
//   };

//   return (
//     <>
//       <div className="tituloSetaVoltar">
//         <span
//           className="setaVoltar"
//           style={{ cursor: "pointer" }}
//           onClick={() => navigate("/")}
//         >
//           {" "}
//           &#x2190;
//         </span>
//         <h1 className="titulo"> Cadastrar Material </h1>
//       </div>

//       <section className={styles.formMain}>
//         <Form noValidate validated={camposValidados} onSubmit={handleSubmit}>
//         <InputGroup className="mb-3">
//             <FloatingLabel
//               controlId="validationCustom01"
//               label="Nome"
//               className="flex-grow-1"
//               style={{ color: "#9C9C9C", zIndex: 1 }}
//             >
              
//               <Form.Control
//                 type="text"
//                 placeholder="Nome do Material"
//                 required
//                 value={nome}
//                 onChange={(e) => setNome(e.target.value)}
//               />
//               <Form.Control.Feedback type="invalid">
//                 Por favor, insira o nome do material.
//               </Form.Control.Feedback>
//             </FloatingLabel>
//             </InputGroup>
//             <InputGroup className="mb-3">
//             <FloatingLabel
//               label="Valor"
//               controlId="validationCustom03"
//               className="flex-grow-1"
//               style={{ color: "#9C9C9C", zIndex: 1 }}
//             >
//               <Form.Control
//                 type="number"
//                 placeholder="Valor"
//                 value={valor}
//                 onChange={(e) => setValor(Number(e.target.value) || 0)}
//               />
//               <Form.Control.Feedback type="invalid">
//                 Por favor, insira o valor do material.
//               </Form.Control.Feedback>
//             </FloatingLabel>
//             </InputGroup>

//             <InputGroup className="mb-3">
//             <FloatingLabel
//               label="Fornecedor"
//               controlId="validationCustom03"
//               className="flex-grow-1"
//               style={{ color: "#9C9C9C", zIndex: 1 }}
//             >
//               <Form.Control
//                 type="text"
//                 placeholder="Fornecedor"
//                 value={fornecedor}
//                 onChange={(e) => setFornecedor(e.target.value)}
//               />
//               <Form.Control.Feedback type="invalid">
//                 Por favor, insira o fornecedor do material.
//               </Form.Control.Feedback>
//             </FloatingLabel>
//             </InputGroup>

//             <InputGroup className="mb-3">
//             <FloatingLabel
//               label="E-Mail do Fornecedor"
//               controlId="validationCustom03"
//               className="flex-grow-1"
//               style={{ color: "#9C9C9C", zIndex: 1 }}
//             >
//               <Form.Control
//                 type="text"
//                 placeholder="E-Mail do Fornecedor"
//                 value={fornecedorEmail}
//                 onChange={(e) => setFornecedorEmail(e.target.value)}
//               />
//               <Form.Control.Feedback type="invalid">
//                 Por favor, insira o e-mail do fornecedor do material.
//               </Form.Control.Feedback>
//             </FloatingLabel>
//             </InputGroup>

//             <InputGroup className="mb-3">
//             <FloatingLabel
//               label="Telefone do Fornecedor"
//               controlId="validationCustom03"
//               className="flex-grow-1"
//               style={{ color: "#9C9C9C", zIndex: 1 }}
//             >
//               <Form.Control
//                 type="text"
//                 placeholder="Telefone do Fornecedor"
//                 value={fornecedorTelefone}
//                 onChange={(e) => setFornecedorTelefone(e.target.value)}
//               />
//               <Form.Control.Feedback type="invalid">
//                 Por favor, insira o telefone do fornecedor do material.
//               </Form.Control.Feedback>
//             </FloatingLabel>
//             </InputGroup>

//             <InputGroup className="mb-3">

//             <FloatingLabel
//               label="Status de Utilização"
//               controlId="validationCustom03"
//               className="flex-grow-1"
//               style={{ color: "#9C9C9C", zIndex: 1 }}
//             >
//               <Form.Control
//                 type="text"
//                 placeholder="Status de Utilização"
//                 value={statusUtilizacao}
//                 onChange={(e) => setStatusUtilizacao(e.target.value)}
//               />
//               <Form.Control.Feedback type="invalid">
//                 Por favor, insira a area de atuação.
//               </Form.Control.Feedback>
//             </FloatingLabel>
//             </InputGroup>

//           <div className={styles.botaoEnviar}>
//             <Button type="submit">Enviar</Button>
//           </div>
//         </Form>
//       </section>
//     </>
//   );
// };

// export default CadastroMaterialComponent;

export default function vazia () {
}
