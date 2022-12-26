import {Grupo} from '../models/grupo.model';

export interface CargarGrupo {
    total: number;
    grupos : Grupo[];
}