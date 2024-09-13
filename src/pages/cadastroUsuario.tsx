import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 
import CryptoJS from 'crypto-js';

const Cadastro: React.FC = () => {
  const [nome, setNome] = useState<string>('');
  const [cpf, setCpf] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [hashedSenha, setHashedSenha] = useState<string>(''); 
  const [tipo, setTipo] = useState<string>('');
  const navigate = useNavigate();

  const verificaCPFValido = (cpf: string): boolean => {
    cpf = cpf.replace(/[^\d]/g, "");

    if (cpf.length !== 11) {
      return false;
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    let digitoVerificador1 = resto === 10 || resto === 11 ? 0 : resto;

    if (parseInt(cpf.charAt(9)) !== digitoVerificador1) {
      return false;
    }

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    let digitoVerificador2 = resto === 10 || resto === 11 ? 0 : resto;

    if (parseInt(cpf.charAt(10)) !== digitoVerificador2) {
      return false;
    }

    return true;
  };

  const verificaEmailValido = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Função para criptografar a senha usando SHA-256
  const encryptPassword = (plainPassword: string) => {
    const hash = CryptoJS.SHA256(plainPassword).toString(CryptoJS.enc.Hex);
    setHashedSenha(hash); // Atualizando o estado com a senha criptografada
  };

  // Função para manipular o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificaCPFValido(cpf)) {
      toast.error('CPF inválido');
      return;
    }

    if (!verificaEmailValido(email)) {
      toast.error('Email inválido');
      return;
    }

    encryptPassword(senha); // Criptografar a senha

    const data = {
      cpf: cpf.replace(/[^\d]/g, ""),
      nome,
      email,
      senha: hashedSenha, // Usar a senha já criptografada
      tipo
    };

    try {
      const response = await fetch("URL_DO_BACK", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error);
        return;
      }

      // Se chegou aqui, significa que tudo ocorreu corretamente
      toast.success('Usuário cadastrado com sucesso');

      // Limpa os campos
      setNome("");
      setCpf("");
      setEmail("");
      setSenha("");
      setTipo("");

      navigate("/login");
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    }
  };

  return (
    <div>
      <h2>Cadastro de Usuário</h2>
      <form onSubmit={handleSubmit}>
        {/* Campo Nome */}
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome"
            required
          />
        </div>

        {/* Campo CPF com máscara */}
        <div>
          <label>CPF:</label>
          <InputMask
            mask="999.999.999-99"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="Digite seu CPF"
            required
          />
        </div>

        {/* Campo Email */}
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            required
          />
        </div>

        {/* Campo Senha */}
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
            required
          />
        </div>

        {/* Campo Tipo de usuário */}
        <div>
          <label>Tipo de Usuário:</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
            <option value="">Selecione o tipo</option>
            <option value="admin">Administrador</option>
            <option value="coordenador">Coordenador</option>
          </select>
        </div>

        {/* Botão de Enviar */}
        <button type="submit">Cadastrar</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Cadastro;
