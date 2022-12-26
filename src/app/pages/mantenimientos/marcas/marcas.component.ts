import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Marca } from 'src/app/models/marca.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MarcaService } from 'src/app/services/marca.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-marcas',
  templateUrl: './marcas.component.html',
  styles: [
  ]
})
export class MarcasComponent implements OnInit, OnDestroy {

  public totalMarcas:number =0;
  public marcas: Marca[] = [];  
  public marcasTemp: Marca[] = [];

  public cargando: boolean = true;
  private imgSubs: Subscription;  
  public desde: number=0;
  


  constructor(private marcaService : MarcaService,
              private modalImagenService  : ModalImagenService,
              private busquedasService : BusquedasService
      ) { }
      
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMarcas();    
    this.imgSubs =  this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe( img=> {
      this.cargarMarcas()
    });
  }

  buscar(termino: String){

    if(termino.length===0){
      return this.cargarMarcas();
    }
    
       this.busquedasService.buscar('marcas',termino)
       .subscribe( resultados => {
        console.log(resultados);
          this.marcas=resultados;
       }
        );
 }
  
  cargarMarcas(){
    this.cargando=true;
    this.marcaService.cargarMarcasdesde(this.desde)
      .subscribe( ({ total, marcas  }) =>{              
        this.totalMarcas = total;
        this.marcas= marcas;
        this.marcasTemp= marcas;
        this.cargando=false;
      })
  }

  guardarCambios (marca: Marca){
    this.marcaService.actualizarMarca(marca._id, marca.nombre)
      .subscribe(resp => {
        Swal.fire('Actualizado',marca.nombre,'success')   
      })
  }

  eliminarMarca (marca: Marca){
    Swal.fire({
      title: 'Borrar marca?',
      text: `Esta a punto de borrar a ${marca.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
          this.marcaService.borrarMarca(marca._id)
          .subscribe ( resp=> {
            this.cargarMarcas();
            Swal.fire(
              'Marca borrado',
              `${marca.nombre} fue eliminado correctamente`,
              'success'
              );
          });      
      }
    }) 



  }

  async abrirSweeAlert(){
    const {value = ''} = await Swal.fire<string>({
      title : 'Crear Marca',
      text: 'Ingrese el nombre de la nueva marca',
      input: 'text',      
      inputPlaceholder: 'Nombre de la marca',
      showCancelButton: true,
    })
    
    if (value.trim().length > 0) {
      this.marcaService.crearMarca(value)
        .subscribe( (resp: any) =>{
          this.marcas.push(resp.marca)
        })
    }
    
    
  }

  abrirModal(marca : Marca){
    //this.modalImagenService.abrirModal('marcas', marca._id, marca.img);

  }

  cambiarPagina( valor:number ){
    this.desde += valor;
    
    if(this.desde < 0  ) {
      this.desde=0;
    } else if (this.desde > this.totalMarcas){
      this.desde -= valor;
    }

    this.cargarMarcas();

 }

}
