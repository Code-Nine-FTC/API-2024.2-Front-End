// import { useState } from "react";
// import { prestacaoContas } from "../../interface/prestacaoContas.interface";
// import PrestacaoContasFunction from "../../services/prestacaoContas/prestacaoContasService";

// interface PrestacaoContaProps {
//     titulo: string
// }

// const PrestacaoContaComponent: React.FC<PrestacaoContaProps> = ({titulo}) => {
//     const [dados, setDados] = useState<prestacaoContas[]>([]);
//     const [filteredDados, setFilteredDados] = useState<prestacaoContas[]>([]);
//     const [searchTerm, setSearchTerm] = useState(titulo)
//     const [error, setError] = useState<string | null>(null);
//     const [selectedDado, setSelectedDado] = useState<prestacaoContas | null>(null);
//     const [showModal, setShowModal] = useState(false);

//     const fetchPrestacaoContas = async() => {
//         try {
//             const resultado = await PrestacaoContasFunction()
//             if (resultado.data) {
//                 const dataArray = Array.isArray(resultado.data) ? resultado.data : [resultado.data];
//                 setDados(dataArray);
//                 setFilteredDados(dataArray);
//                 console.log(dataArray);
//             } else {
//                 throw new Error("Dados não encontrados.");
//             }
//         } catch (err) {
//             setError((err as Error).message);
//         }
//     }

//     return(
//         <div>
//             PrestacaoConta
//         </div>
//     )
// }

// export default PrestacaoContaComponent

export default function vazia () {
}
