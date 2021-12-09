import { resolveSoa } from "dns";

export class Usuario {

    constructor(
        
        nombre: string,
        email: string,
        password : string,
        img: string,
        google: boolean,
        role: string,        
        public uid? : string,
    ){}

}