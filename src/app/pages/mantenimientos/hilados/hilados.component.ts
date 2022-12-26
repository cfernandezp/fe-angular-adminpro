import { Component, OnDestroy, OnInit } from '@angular/core';
import { Hilado } from 'src/app/models/hilado.model';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HiladoService } from 'src/app/services/hilado.service';
import { Familia } from 'src/app/models/familia.model';
import { FamiliaService } from 'src/app/services/familia.service';


@Component({
  selector: 'app-hilados',
  templateUrl: './hilados.component.html',
  styles: [
  ]
})
export class HiladosComponent implements OnInit , OnDestroy  {

  public cargando : boolean= true;
  public familias : Familia[] = [];
  public hilados : Hilado[] = [];
  private imgSubs: Subscription;

  public desde: number=0;
  public totalFamilias:number =0;  
  public totalHilados:number =0;  
  public hiladosTemp: Hilado[] = [];
  public familiasTemp: Familia[] = [];

  constructor(
    private familiaService : FamiliaService,
    private hiladoService : HiladoService,
    private modalImagenService  : ModalImagenService,
    private busquedasService : BusquedasService
  ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHilados();
    this.cargarFamilias();
    this.imgSubs =  this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe( img=> {
      this.cargarHilados()
    });
  }

  cargarHilados(){
    this.cargando=true;
    this.hiladoService.cargarHiladosdesde(this.desde)
      .subscribe( ({ total, hilados  }) =>{      
        console.log(hilados);              
        this.totalHilados = total;
        this.hilados= hilados;        
        this.hiladosTemp= hilados;
        this.cargando=false;
      })
  }

  cargarFamilias(){
    this.cargando=true;
    this.familiaService.cargarFamiliasdesde(this.desde)
      .subscribe( ({ total, familias  }) =>{                    
        this.totalFamilias = total;
        this.familias= familias;        
        this.familiasTemp= familias;
        this.cargando=false;
      })
  }

  buscar( termino: string ){
    if(termino.length===0){
      return this.cargarHilados();
    }
    
       this.busquedasService.buscar('hilados',termino)
       .subscribe( resultados => {
          console.log(resultados);          
          //this.hilados=resultados;
       }
        );

  }

  abrirModal(hilado: Hilado){
    //this.modalImagenService.abrirModal('familias', familia._id, familia.nombre);
  }
  
  borrarHilado(hilado : Hilado ){

    Swal.fire({
      title: 'Borrar hilado?',
      text: `Esta a punto de borrar a ${hilado.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
          this.hiladoService.borrarFamilia(hilado._id)
          .subscribe ( resp=> {
            this.cargarHilados();
            Swal.fire(
              'Familia borrada',
              `${hilado.nombre} fue eliminado correctamente`,
              'success'
              );
          });      
      }
    })     
  }

  cambiarPagina( valor:number ){
    this.desde += valor;
    
    if(this.desde < 0  ) {
      this.desde=0;
    } else if (this.desde > this.totalHilados){
      this.desde -= valor;
    }
    this.cargarHilados();
 }



}
