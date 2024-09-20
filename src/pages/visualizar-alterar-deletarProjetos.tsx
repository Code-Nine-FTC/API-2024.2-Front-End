import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import EditaExcluiMostra from '../component/buscarProjeto/excluiEditaMostra';
import EncriptarSenha from '../functions/criptografaSenha';

const AlteraDeletaVisualiza: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar se o usuário é admin
  const [showLogin, setShowLogin] = useState(false); // Estado para mostrar ou esconder o formulário de login
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState<string | null>(null); // Estado para mostrar erros de login

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const hash = EncriptarSenha(senha); // Criptografar a senha usando a função

    try {
      // Enviar o email e o hash para o backend
      const response = await axios.post('/api/auth/admin', { email, hash });
      
      if (response.data.success) {
        setIsAdmin(true); // Define isAdmin como true se a autenticação for bem-sucedida
        setShowLogin(false); // Esconder o formulário de login após o sucesso
      } else {
        setError('Email ou senha incorretos');
      }
    } catch (err) {
      setError('Erro ao tentar fazer login');
    }
  };

  return (
    <div>
      {/* Botão para mostrar o formulário de login */}
      {!isAdmin && !showLogin && (
        <button onClick={() => setShowLogin(true)}>É admin?</button>
      )}

      {/* Formulário de login para o admin */}
      {showLogin && (
        <form onSubmit={handleLoginSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <button type="submit">Entrar</button>

          {error && <p>{error}</p>}
        </form>
      )}

      {/* Exibição do componente EditaExcluiMostra */}
      {id ? (
        <EditaExcluiMostra id={parseInt(id)} isAdmin={isAdmin} />
      ) : (
        <p>ID do projeto não fornecido</p>
      )}
    </div>
  );
};

export default AlteraDeletaVisualiza;

