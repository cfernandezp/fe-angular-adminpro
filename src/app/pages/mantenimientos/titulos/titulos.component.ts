import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Titulo } from 'src/app/models/titulo.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { TituloService } from 'src/app/services/titulo.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-titulos',
  templateUrl: './titulos.component.html',
  styles: [
  ]
})
export class TitulosComponent implements OnInit {
  
  public totalTitulos:number =0;
  public titulos: Titulo[] = [];  
  public titulosTemp: Titulo[] = [];

  public cargando: boolean = true;
  private imgSubs: Subscription;  
  public desde: number=0;

  constructor(private tituloService : TituloService,
    private modalImagenService  : ModalImagenService,
    private busquedasService : BusquedasService


  ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarTitulos();    
    this.imgSubs =  this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe( img=> {
      this.cargarTitulos()
    });
  }

  buscar(termino: String){

    if(termino.length===0){
      return this.cargarTitulos();
    }
    
       this.busquedasService.buscar('titulos',termino)
       .subscribe( resultados => {
          this.titulos=resultados;
       }
        );
 }
  
  cargarTitulos(){
    this.cargando=true;
    this.tituloService.cargarTitulosdesde(this.desde)
      .subscribe( ({ total, titulos  }) =>{              
        this.totalTitulos = total;
        this.titulos= titulos;
        this.titulosTemp= titulos;
        this.cargando=false;
      })
  }

  guardarCambios (titulo: Titulo){
    this.tituloService.actualizarTitulo(titulo._id, titulo.nombre)
      .subscribe(resp => {
        Swal.fire('Actualizado',titulo.nombre,'success')   
      })
  }

  eliminarTitulo (titulo: Titulo){
    Swal.fire({
      title: 'Borrar titulo?',
      text: `Esta a punto de borrar a ${titulo.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
          this.tituloService.borrarTitulo(titulo._id)
          .subscribe ( resp=> {
            this.cargarTitulos();
            Swal.fire(
              'Titulo borrado',
              `${titulo.nombre} fue eliminado correctamente`,
              'success'
              );
          });      
      }
    }) 
  }

  async abrirSweeAlert(){
    const {value = ''} = await Swal.fire<string>({
      title : 'Crear Titulo',
      text: 'Ingrese el nombre del nuevo titulo',
      input: 'text',      
      inputPlaceholder: 'Nombre del titulo',
      showCancelButton: true,
    })
    
    if (value.trim().length > 0) {
      this.tituloService.crearTitulo(value)
        .subscribe( (resp: any) =>{
          this.titulos.push(resp.titulo)
        })
    }
  }

  abrirModal(titulo : Titulo){
    //this.modalImagenService.abrirModal('marcas', marca._id, marca.img);

  }

  cambiarPagina( valor:number ){
    this.desde += valor;
    
    if(this.desde < 0  ) {
      this.desde=0;
    } else if (this.desde > this.totalTitulos){
      this.desde -= valor;
    }

    this.cargarTitulos();

 }


}