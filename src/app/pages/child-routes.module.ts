import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';


import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';

//Mantenimientos
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { AdminGuard } from '../guards/admin.guard';
import { MarcasComponent } from './mantenimientos/marcas/marcas.component';
import { TitulosComponent } from './mantenimientos/titulos/titulos.component';
import { ColoresComponent } from './mantenimientos/colores/colores.component';
import { GruposComponent } from './mantenimientos/grupos/grupos.component';
import { FamiliasComponent } from './mantenimientos/familias/familias.component';
import { FamiliaComponent } from './mantenimientos/familias/familia.component';
import { HiladosComponent } from './mantenimientos/hilados/hilados.component';



const childRouters: Routes = [
  { path: '', component: DashboardComponent , data:{titulo: 'Dashboard'} },
  { path: 'account-settings', component: AccountSettingsComponent, data:{titulo: 'Ajustes de Cuenta'} },
  { path: 'buscar/:termino', component: BusquedaComponent, data:{titulo: 'Busquedas'} },
  { path: 'progress', component: ProgressComponent , data:{titulo: 'ProgressBar'}},
  { path: 'grafica1', component: Grafica1Component , data:{titulo: 'Grafica #1'}},            
  { path: 'promesas', component: PromesasComponent , data:{titulo: 'Promesas'}},
  { path: 'rxjs', component: RxjsComponent , data:{titulo: 'RxJS'}},
  { path: 'perfil', component: PerfilComponent , data:{titulo: 'Perfil de Usuario'}},

  //Mantenimientos
  
  { path: 'hilados', component: HiladosComponent , data:{titulo: 'Mantenimiento de Hilados'}},  
  { path: 'familias', component: FamiliasComponent , data:{titulo: 'Mantenimiento de Familias'}},  
  { path: 'marcas', component: MarcasComponent , data:{titulo: 'Mantenimiento de Marcas'}},
  { path: 'colores', component: ColoresComponent , data:{titulo: 'Mantenimiento de Colores'}},
  { path: 'titulos', component: TitulosComponent , data:{titulo: 'Mantenimiento de Titulos'}},
  { path: 'grupos', component: GruposComponent , data:{titulo: 'Mantenimiento de Grupos'}},  
  { path: 'familia/:id', component: FamiliaComponent , data:{titulo: 'Mantenimiento de Familia'}},

  //Rutas de Addmin AdminGuard
  { path: 'usuarios',canActivate: [AdminGuard],  component: UsuariosComponent , data:{titulo: 'Usuarios de Aplicación'}},
]



@NgModule({
  imports: [ RouterModule.forChild(childRouters) ],
    exports: [ RouterModule ]
})
export class ChildRoutesModule { }
