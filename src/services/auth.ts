// Trata da autenticação do usuário

// string usada como chave para armazenar e recuperar o token
export const TOKEN_KEY = "@api-token";
export const AUTENTICADO_KEY = "@api-Autenticado";

// Verifica se tem um token armazenado no localStorage
export function isAuthenticated() {
    // const token = localStorage.getItem(TOKEN_KEY);
    // return token !== null;
    const authStatus = localStorage.getItem(AUTENTICADO_KEY);
    return authStatus === 'true';
}

// Armazena o token e o nível de acesso no localStorage
export function login(token: string, setAuthStatus: (status: boolean) => void, setToken: (token: string) => void) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(AUTENTICADO_KEY, 'true');
    setAuthStatus(true);
    setToken(token);
}

// Recupera o token armazenado no localStorage
export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// Remove o token e o nível de acesso do localStorage
export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(AUTENTICADO_KEY, 'false');
}