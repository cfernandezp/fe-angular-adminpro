import { Component, OnDestroy, OnInit } from '@angular/core';
import { Familia } from 'src/app/models/familia.model';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { FamiliaService } from 'src/app/services/familia.service';

@Component({
  selector: 'app-familias',
  templateUrl: './familias.component.html',
  styles: [
  ]
})
export class FamiliasComponent implements OnInit, OnDestroy {

  public cargando : boolean= true;
  public familias : Familia[] = [];
  private imgSubs: Subscription;

  public desde: number=0;
  public totalFamilias:number =0;  
  public FamiliasTemp: Familia[] = [];

  constructor(
    private familiaService : FamiliaService,
    private modalImagenService  : ModalImagenService,
    private busquedasService : BusquedasService
  ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {

    this.cargarFamilias();
    this.imgSubs =  this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe( img=> {
      this.cargarFamilias()
    });
  }

  cargarFamilias(){
    this.cargando=true;
    this.familiaService.cargarFamiliasdesde(this.desde)
      .subscribe( ({ total, familias  }) =>{                    
        this.totalFamilias = total;
        this.familias= familias;        
        this.FamiliasTemp= familias;
        this.cargando=false;
      })
  }

  buscar( termino: string ){
    if(termino.length===0){
      return this.cargarFamilias();
    }    

       this.busquedasService.buscar('familias',termino)
       .subscribe( resultados => {                  
          this.familias=resultados;
       }
        );

  }

  abrirModal(familia: Familia){
    //this.modalImagenService.abrirModal('familias', familia._id, familia.nombre);
  }
  
  borrarFamilia(familia : Familia ){

    Swal.fire({
      title: 'Borrar familia?',
      text: `Esta a punto de borrar a ${familia.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
          this.familiaService.borrarFamilia(familia._id)
          .subscribe ( resp=> {
            this.cargarFamilias();
            Swal.fire(
              'Familia borrada',
              `${familia.nombre} fue eliminado correctamente`,
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
    } else if (this.desde > this.totalFamilias){
      this.desde -= valor;
    }
    this.cargarFamilias();
 }


}
