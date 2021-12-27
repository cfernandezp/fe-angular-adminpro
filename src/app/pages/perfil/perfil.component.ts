import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

import {FileUploadService} from '../../services/file-upload.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  
  public perfilForm: FormGroup;
  public usuario : Usuario;
  public imagenSubir : File;
  public imgTemp : any;


  constructor( private fb: FormBuilder,
                private usuarioSevice : UsuarioService,
                private fileUpdateService : FileUploadService ) { 
                  this.usuario= usuarioSevice.usuario;

                }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre : [this.usuario.nombre, Validators.required],
      email : [this.usuario.email,[Validators.required, Validators.email] ]

    });
  }

  actualizarPerfil(){    
    this.usuarioSevice.actualizarPerfil(this.perfilForm.value)
      .subscribe(resp=> {
        const {nombre, email} = this.perfilForm.value;
          this.usuario.nombre = nombre;
          this.usuario.email = email;

        Swal.fire('Guardado','Cambios fueron guardados','success');  
      }, (err) => {
        Swal.fire('Error',err.error.msg,'error'); 
        //console.log(err.error.msg);
      });
  }

  cambiarImagen(file: File){
    this.imagenSubir = file;

    if(!file){ 
      return this.imgTemp=null;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () =>{
      this.imgTemp = reader.result;    

    }    

  }

  subirImagen(){
    this.fileUpdateService
      .actualizarFoto(this.imagenSubir,'usuarios',this.usuario.uid)
      .then( img =>{
        this.usuario.img= img;
        Swal.fire('Guardado','Imagen de usuario actualizada','success');          
      }).catch ( err=> {
        console.log(err);
        Swal.fire('Error','No se pudo subir la imagen','error'); 
        
      })

  }

}
