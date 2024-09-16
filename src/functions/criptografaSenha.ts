const encryptPassword = (plainPassword: string) => {
    const hash = CryptoJS.SHA256(plainPassword).toString(CryptoJS.enc.Hex);
    return hash
  };

export default encryptPassword