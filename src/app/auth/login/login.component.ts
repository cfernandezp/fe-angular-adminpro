import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';


declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit   {  

  public formSubmitted = false;
  public auth2: any;
  

  public loginForm = this.fb.group({    
    
    //email : [ localStorage.getItem('email') || '' ,[Validators.required,Validators.email  ]],
    user : [ localStorage.getItem('user') || '',[Validators.required ]],
    password : ['',[Validators.required ]],    
    recordar : [false]      
    });
  
  constructor( private router: Router,
               private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private ngzone : NgZone
               ) { }

  ngOnInit(): void {
    this.renderButton();
  }

  login() {
    //console.log(this.loginForm.value);
    console.log('Error');
    this.usuarioService.login(this.loginForm.value)
      .subscribe(resp=> {
        if ( this.loginForm.get('recordar').value  ){
          localStorage.setItem('user',this.loginForm.get('user').value )
        }
        else{
          localStorage.removeItem('user')
        }

      //Navegar al dashboard
      this.router.navigateByUrl('/');

      },(err) => {
        // Si sucede un error
        Swal.fire('Error',err.error.msg,'error');
      }  );


  //this.router.navigateByUrl('/');
  }
  
  // var id_token = googleUser.getAuthResponse().id_token;



  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });
    
    //this.startApp();




  }

  async startApp() {
    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;
      this.attachSignin(document.getElementById('my-signin2')); // Id del boton de google.
    

  };

  attachSignin(element) {    
    this.auth2.attachClickHandler(element, {},
        (googleUser)=> {
        const id_token = googleUser.getAuthResponse().id_token;
        this.usuarioService.loginGoogle(id_token)
        .subscribe( resp=> {
          //Navegar al dashboard
          this.ngzone.run(( ) => {
            this.router.navigateByUrl('/');
          } )          
        });

        


        }, (error)=> {
          alert(JSON.stringify(error, undefined, 2));
        });
  }


}
