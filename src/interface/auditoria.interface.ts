import { MudancaProjeto } from "./projeto.interface";

export interface Mudanca{
    id: string,
    evento: string,
    usuario?: string
    data: Date,
    projeto: MudancaProjeto
}