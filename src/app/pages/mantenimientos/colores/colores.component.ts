

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Color } from 'src/app/models/color.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { ColorService } from 'src/app/services/color.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-colores', 
  templateUrl: './colores.component.html',
  styles: [
  ]
})
export class ColoresComponent implements OnInit, OnDestroy  {

  public totalColores:number =0;
  public colores: Color[] = [];  
  public coloresTemp: Color[] = [];

  public cargando: boolean = true;
  private imgSubs: Subscription;  
  public desde: number=0;

  constructor(private colorService : ColorService,
        private modalImagenService  : ModalImagenService,
        private busquedasService : BusquedasService

  ) { }
  
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarColores();    
    this.imgSubs =  this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe( img=> {
      this.cargarColores()
    });
  }

  buscar(termino: String){

    if(termino.length===0){
      return this.cargarColores();
    }
    
       this.busquedasService.buscar('colores',termino)
       .subscribe( resultados => {
          this.colores=resultados;
       }
        );
 }

  cargarColores(){
    this.cargando=true;
    this.colorService.cargarColores(this.desde)
      .subscribe( ({ total, colores  }) =>{              
        this.totalColores = total;
        this.colores= colores;
        this.coloresTemp= colores;
        this.cargando=false;
      })
  }

  guardarCambios (color: Color){
    this.colorService.actualizarColor(color._id, color.nombre)
      .subscribe(resp => {
        Swal.fire('Actualizado',color.nombre,'success')   
      })
  }

  eliminarColor (color: Color){
    Swal.fire({
      title: 'Borrar color?',
      text: `Esta a punto de borrar a ${color.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
          this.colorService.borrarColor(color._id)
          .subscribe ( resp=> {
            this.cargarColores();
            Swal.fire(
              'Color borrado',
              `${color.nombre} fue eliminado correctamente`,
              'success'
              );
          });      
      }
    }) 

}



async abrirSweeAlert(){
  const {value = ''} = await Swal.fire<string>({
    title : 'Crear Color',
    text: 'Ingrese el nombre del nuevo color',
    input: 'text',      
    inputPlaceholder: 'Nombre del color',
    showCancelButton: true,
  })
  
  if (value.trim().length > 0) {
    this.colorService.crearColor(value)
      .subscribe( (resp: any) =>{
        this.colores.push(resp.color)
      })
  }
  
  
}

abrirModal(color : Color){
  //this.modalImagenService.abrirModal('marcas', marca._id, marca.img);

}

cambiarPagina( valor:number ){
  this.desde += valor;
  
  if(this.desde < 0  ) {
    this.desde=0;
  } else if (this.desde > this.totalColores){
    this.desde -= valor;
  }

  this.cargarColores();

}

}
