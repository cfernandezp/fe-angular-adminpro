import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Grupo } from 'src/app/models/grupo.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { GrupoService } from 'src/app/services/grupo.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styles: [
  ]
})
export class GruposComponent implements OnInit, OnDestroy {

  public totalGrupos:number =0;
  public grupos: Grupo[] = [];  
  public gruposTemp: Grupo[] = [];

  public cargando: boolean = true;
  private imgSubs: Subscription;  
  public desde: number=0;

  constructor(
              private grupoService : GrupoService,
              private modalImagenService  : ModalImagenService,
              private busquedasService : BusquedasService
  ) { }
  
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarGrupos();    
    this.imgSubs =  this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe( img=> {
      this.cargarGrupos()
    });
  }

  buscar(termino: String){

    if(termino.length===0){
      return this.cargarGrupos();
    }
    
       this.busquedasService.buscar('grupos',termino)
       .subscribe( resultados => {
          this.grupos=resultados;
       }
        );
 }

 cargarGrupos(){
  this.cargando=true;
  this.grupoService.cargarGruposdesde(this.desde)
    .subscribe( ({ total, grupos  }) =>{              
      this.totalGrupos = total;
      this.grupos= grupos;
      this.gruposTemp= grupos;
      this.cargando=false;
    })
}

guardarCambios (grupo: Grupo){
  this.grupoService.actualizarGrupo(grupo._id, grupo.nombre)
    .subscribe(resp => {
      Swal.fire('Actualizado',grupo.nombre,'success')   
    })
}

eliminarGrupo (grupo: Grupo){
  Swal.fire({
    title: 'Borrar grupo?',
    text: `Esta a punto de borrar a ${grupo.nombre}`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Si, borrarlo'
  }).then((result) => {
    if (result.isConfirmed) {
        this.grupoService.borrarGrupo(grupo._id)
        .subscribe ( resp=> {
          this.cargarGrupos();
          Swal.fire(
            'Grupo borrado',
            `${grupo.nombre} fue eliminado correctamente`,
            'success'
            );
        });      
    }
  }) 
}

async abrirSweeAlert(){
  const {value = ''} = await Swal.fire<string>({
    title : 'Crear Grupo',
    text: 'Ingrese el nombre del nuevo grupo',
    input: 'text',      
    inputPlaceholder: 'Nombre del grupo',
    showCancelButton: true,
  })
  
  if (value.trim().length > 0) {
    this.grupoService.crearGrupo(value)
      .subscribe( (resp: any) =>{
        this.grupos.push(resp.grupo)
      })
  }
  
}

abrirModal(grupo : Grupo){
  //this.modalImagenService.abrirModal('marcas', marca._id, marca.img);

}

cambiarPagina( valor:number ){
  this.desde += valor;
  
  if(this.desde < 0  ) {
    this.desde=0;
  } else if (this.desde > this.totalGrupos){
    this.desde -= valor;
  }

  this.cargarGrupos();

}


}
