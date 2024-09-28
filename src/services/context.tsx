import React from 'react';

export const AuthContext = React.createContext({
  isAutenticado: false,
  token: '',
  setAutenticado: (status: boolean) => {},
  setToken: (token: string) => {},
});