
interface _HiladoFamilia{
    _id : string;
    nombre: string;    
}

interface _HiladoColor{
    _id : string;
    nombre: string;    
}

export class Hilado {

    constructor(
        public nombre: string,
        public siglas: string,
        public _id?: string,                
        public familia?: _HiladoFamilia,     
        public color?: _HiladoColor,        
    ){}


}

