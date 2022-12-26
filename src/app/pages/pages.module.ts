import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'





// Modulos
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';

import { PipesModule } from '../pipes/pipes.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { PagesComponent } from './pages.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { MarcasComponent } from './mantenimientos/marcas/marcas.component';
import { TitulosComponent } from './mantenimientos/titulos/titulos.component';
import { ColoresComponent } from './mantenimientos/colores/colores.component';
import { GruposComponent } from './mantenimientos/grupos/grupos.component';
import { FamiliasComponent } from './mantenimientos/familias/familias.component';
import { FamiliaComponent } from './mantenimientos/familias/familia.component';
import { HiladosComponent } from './mantenimientos/hilados/hilados.component';
import { HiladoComponent } from './mantenimientos/hilados/hilado.component';








@NgModule({
  declarations: [
    DashboardComponent,
    ProgressComponent,
    Grafica1Component,
    PagesComponent,
    AccountSettingsComponent,
    PromesasComponent,
    RxjsComponent,
    PerfilComponent,
    UsuariosComponent,
    BusquedaComponent,
    MarcasComponent,
    TitulosComponent,
    ColoresComponent,
    GruposComponent,
    FamiliasComponent,
    FamiliaComponent,
    HiladosComponent,
    HiladoComponent,

  ],
  exports: [
    DashboardComponent,
    ProgressComponent,
    Grafica1Component,
    PagesComponent,
    AccountSettingsComponent
  ],
  imports: [ 
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    ComponentsModule,
    PipesModule,
   
    

  ]
})
export class PagesModule { }
