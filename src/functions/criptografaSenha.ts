import CryptoJS from "crypto-js";

const EncriptarSenha = (senha: string) => {
    const hash = CryptoJS.SHA256(senha).toString(CryptoJS.enc.Hex);
    return hash
  };

export default EncriptarSenha