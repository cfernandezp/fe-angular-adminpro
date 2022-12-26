import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { Familia } from 'src/app/models/familia.model';
import { Grupo } from 'src/app/models/grupo.model';
import { Marca } from 'src/app/models/marca.model';
import { Titulo } from 'src/app/models/titulo.model';
import { FamiliaService } from 'src/app/services/familia.service';
import { GrupoService } from 'src/app/services/grupo.service';
import { MarcaService } from 'src/app/services/marca.service';
import { TituloService } from 'src/app/services/titulo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-familia',
  templateUrl: './familia.component.html',
  styles: [
  ]
})
export class FamiliaComponent implements OnInit {

  displayColumns : string[] = ['nombre','familia','color','siglas'];
  

  public familiaForm: FormGroup;
  public familias : Familia[]=[];
  public grupos : Grupo[]=[];
  public marcas : Marca[]=[];
  public titulos : Titulo[]=[];
  
  public grupoSeleccionado: Grupo;
  public marcaSeleccionado: Marca;
  public tituloSeleccionado: Titulo;
  public familiaSeleccionado: Familia;

  constructor(
    private fb: FormBuilder,    
    private familiaService : FamiliaService,
    private grupoService : GrupoService,
    private marcaService : MarcaService,
    private tituloService : TituloService,
    private router : Router,
    private activatedRoute: ActivatedRoute

  ) { }



  ngOnInit(): void {
    this.activatedRoute.params
    .subscribe( ({id}) => {
      this.cagarFamilia(id);      
    });

    this.familiaForm = this.fb.group({
      nombre : ['',Validators.required],
      grupo : ['',Validators.required],
      marca : ['',Validators.required], 
      titulo : ['',Validators.required],
           
    });

    this.cargarGrupos();
    this.cargarMarcas();
    this.cargartitulos();

    this.familiaForm.get('grupo').valueChanges
      .subscribe(grupoId=>{
        this.grupoSeleccionado = this.grupos.find( g=> g._id === grupoId );
        //console.log('Grupo ID'+grupoId);
    })

    this.familiaForm.get('marca').valueChanges
      .subscribe(marcaId=>{
        this.marcaSeleccionado = this.marcas.find( m=> m._id === marcaId );
        //console.log('Marca ID'+marcalId);
    })

    this.familiaForm.get('titulo').valueChanges
      .subscribe(tituloId=>{
        this.tituloSeleccionado = this.titulos.find( g=> g._id === tituloId );
        //console.log('Titulo ID'+tituloId);
    })

    
  }

  cargarGrupos(){
    this.grupoService.cargarGruposTodos()
      .subscribe((grupos : Grupo []) => {
        //console.log(grupos);
        this.grupos= grupos;
      })

  }

  cargarMarcas(){
    this.marcaService.cargarMarcasTodos()
      .subscribe((marcas : Marca []) => {
        //console.log(hospitales);
        this.marcas= marcas;
      })

  }

  cargartitulos(){
    this.tituloService.cargarTitulosTodos()
      .subscribe((titulos : Titulo []) => {
        //console.log(hospitales);
        this.titulos= titulos;
      })

  }

  cagarFamilia (id : string){

    if (id==='nuevo'){
      return;
    }

   this.familiaService.obtenerFamiliaPorId(id)
     .pipe( 
        delay(100)        
     )
     .subscribe (familia =>{            
      

      if (!familia)  {
        return  this.router.navigateByUrl(`/dashboard/familias`);
        
      }     
        const {nombre, grupo:{_id : grupo }, marca:{_id : marca }, titulo:{_id : titulo }} = familia;                       
        this.familiaSeleccionado = familia;
        
        this.familiaForm.setValue({nombre, grupo, marca,titulo});        
     });
  }

  guardarFamilia(){
    const {nombre} = this.familiaForm.value;
    //console.log(this.familiaSeleccionado);
    
    if(this.familiaSeleccionado){
      //Actualizar
      const data = {
        ...this.familiaForm.value,
        _id: this.familiaSeleccionado._id
      }
      this.familiaService.actualizarFamilia( data)
        .subscribe(resp=>{
          
          Swal.fire('Actualizado',`${ nombre  } actualizado correctamente`,'success');
          this.router.navigateByUrl(`/dashboard/familia/`);
        })
    }
    else{
      //Crear
      
      this.familiaService.crearFamilia (this.familiaForm.value)
      .subscribe( (resp:any) =>{
        
        Swal.fire('Creado',`${nombre} creado correctamente`,'success');
        this.router.navigateByUrl(`/dashboard/familia/${resp.familia._id}`)
      })

    }   

  }

 

}
