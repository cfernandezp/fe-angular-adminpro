import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay } from 'rxjs/operators';

import { ActivatedRoute, Router } from '@angular/router';
import { FamiliaService } from '../../../services/familia.service';
import { HiladoService } from '../../../services/hilado.service';
import { ColorService } from '../../../services/color.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Familia } from '../../../models/familia.model';
import { Color } from '../../../models/color.model';
import { Hilado } from '../../../models/hilado.model';


@Component({
  selector: 'app-hilado',
  templateUrl: './hilado.component.html',
  styles: [
  ]
})
export class HiladoComponent implements OnInit , OnDestroy{

  public hiladoForm: FormGroup;
  public hilados : Hilado[]=[];
  public familias : Familia []=[];
  public colores : Color[]=[];
  
  public hiladoSeleccionado : Hilado;  
  public familiaSeleccionado: Familia;
  public colorSeleccionado: Color; 

  constructor(

    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private hiladoService : HiladoService,
    private familiaService : FamiliaService,
    private colorService : ColorService,    
    private router : Router,
  ) { }

  ngOnDestroy(): void {
    //this.imgSubs.unsubscribe();
  }


  ngOnInit(): void {
    this.activatedRoute.params
    .subscribe( ({id}) => {
      this.cagarHilado(id);      
    });

    this.hiladoForm = this.fb.group({
      nombre : ['',Validators.required],
      familia : ['',Validators.required],
      color : ['',Validators.required], 
      
           
    });

    this.cargarFamilias();
    this.cargarColores();    

    this.hiladoForm.get('familia').valueChanges
      .subscribe(familiaId=>{
        this.familiaSeleccionado = this.familias.find( f=> f._id === familiaId );
        //console.log('Grupo ID'+grupoId);
    })

    this.hiladoForm.get('color').valueChanges
      .subscribe(colorId=>{
        this.colorSeleccionado = this.colores.find( c=> c._id === colorId );
        //console.log('Marca ID'+marcalId);
    })
  }

  cargarFamilias(){
    this.familiaService.cargarFamiliasTodos()
      .subscribe((familias : Familia []) => {
        //console.log(grupos);
        this.familias= this.familias;
      })

  }


  cargarColores(){
    this.colorService.cargarColoresTodos()
      .subscribe((colores : Color []) => {
        //console.log(grupos);
        this.colores= colores;
      })

  }


  cagarHilado (id : string){

    if (id==='nuevo'){
      return;
    }

   this.hiladoService.obtenerHiladoPorId(id)
     .pipe( 
        delay(100)        
     )
     .subscribe (hilado =>{      

      if (!hilado)  {
        return  this.router.navigateByUrl(`/dashboard/hilados`);
        
      }     
        const {nombre, familia:{_id : familia }, color:{_id : color }} = hilado;                       
        this.hiladoSeleccionado = hilado;
        
        this.hiladoForm.setValue({nombre, familia, color});        
     });
  }

}
