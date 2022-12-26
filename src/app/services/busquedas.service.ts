import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map} from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario.model';
import { Marca } from '../models/marca.model';
import { Titulo } from '../models/titulo.model';
import { Color } from '../models/color.model';
import { Grupo } from '../models/grupo.model';
import { Familia } from '../models/familia.model';
import { Hilado } from '../models/hilado.model';


const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor( private http: HttpClient) { }

  get token():string {
    return localStorage.getItem('token') || '';
  }

  get headers (){
    return {
      headers:{
        'x-token' : this.token
      }
    }
  }

  private transformarUsuarios(resultados: any[]) : Usuario[] {
    return resultados.map(
      user => new Usuario(user.nombre,user.email,'',user.img,user.google, user.role, user.uid ) 
    );

  }
  
  private transformarMarcas(resultados: any[]) : Marca[] {
    return resultados;

  }

  private transformarTitulos(resultados: any[]) : Titulo[] {
    return resultados;

  }

  private transformarColores(resultados: any[]) : Color[] {
    return resultados;

  }

  private transformarGrupos(resultados: any[]) : Grupo[] {
    return resultados;

  }

  private transformarFamilias(resultados: any[]) : Familia[] {
    // return resultados.map(
    //   familia => new Usuario( familia._id, familia.nombre,familia.grupo,familia.marca,familia.titulo ) 
    // );
    return resultados;
  }

  private transformarHilados(resultados: any[]) : Hilado[] {
    // return resultados.map(
    //   hilado => new Hilado( hilado._id, hilado.nombre,hilado.siglas,hilado.familia,hilado.color) 
    // );
    return resultados;
  }

  busquedaGlobal(termino : string){
    const url = `${base_url}/todo/${termino}`;
    return this.http.get(url , this.headers );

  }

  buscar( tipo: 'usuarios'|'marcas' | 'titulos'| 'colores'| 'grupos'
                | 'familias'| 'hilados',
    termino:String 
   ){

    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;
    return this.http.get<any[]>(url , this.headers )
      .pipe(
        map( (resp:any) => {
          switch (tipo) {
            case 'usuarios':
                return this.transformarUsuarios(resp.resultados )                        
            case 'marcas':                  
                  return this.transformarMarcas(resp.resultados)
            case 'titulos':                  
                  return this.transformarTitulos(resp.resultados) 
            case 'colores':                  
                  return this.transformarColores(resp.resultados)  
            case 'grupos':                  
                  return this.transformarGrupos(resp.resultados)
            case 'familias':                  
                  return this.transformarFamilias(resp.resultados)           
            case 'hilados':                  
                  return this.transformarHilados(resp.resultados)                 
            default:
              return[];
          }
        })
      );

  }

}
