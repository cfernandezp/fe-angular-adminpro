import {Grupo} from './grupo.model'
import {Marca} from './marca.model'
import {Titulo} from './titulo.model'

interface _FamiliaGrupo{
    _id : string;
    nombre: string;    
}

interface _FamiliaMarca{
    _id : string;
    nombre: string;    
}

interface _FamiliaTitulo{
    _id : string;
    nombre: string;    
}




export class Familia {

    constructor(
        public nombre: string,
        public _id?: string,                
        public grupo?: _FamiliaGrupo,     
        public marca?: _FamiliaMarca,
        public titulo?: _FamiliaTitulo
    ){}


}

