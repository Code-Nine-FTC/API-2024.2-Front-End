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


export default verificaCPFValido