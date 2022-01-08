interface _hospitalUser

const base_url=environment.base_url;

export class Hospital {

    constructor(
        
        public _id?: string,
        public nombre: string,
        public img? : string,
        public usuario?: any,     
    ){}


    }

}