import React from 'react';

export const AuthContext = React.createContext({
  isAutenticado: false,
  token: '',
  nivelAcesso: '',
  setAutenticado: (status: boolean) => {},
  setToken: (token: string) => {},
  setNivelAcesso: (level: string) => {},
});