import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // Importamos ReactiveFormsModule y FormsModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrincipalComponent } from './principal/principal.component';
import { RegistroUserComponent } from './registro-user/registro-user.component';
import { LoginComponent } from './login/login.component';
import { MemoramaComponent } from './memorama/memorama.component';
import { EncuestaComponent } from './encuesta/encuesta.component';
import { RankingComponent } from './ranking/ranking.component';
import { IntranetComponent } from './intranet/intranet.component';
import { IntranetConfigComponent } from './intranet-config/intranet-config.component';
import { PolitCookieComponent } from './polit-cookie/polit-cookie.component';
import { PolitPrivaComponent } from './polit-priva/polit-priva.component';
import { GeneradorTicketsComponent } from './generador-tickets/generador-tickets.component';
import { EncuestaConsultaComponent } from './encuesta-consulta/encuesta-consulta.component';
import { IntranetTableComponent } from './intranet-table/intranet-table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Importamos BrowserAnimationsModule

// Importaciones de Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent, // Componente raíz
    PrincipalComponent, // Componente principal
    RegistroUserComponent, // Componente para registro de usuarios
    LoginComponent, // Componente para login
    MemoramaComponent, // Componente para el juego de memorama
    EncuestaComponent, // Componente para encuestas
    RankingComponent, // Componente para ranking
    IntranetComponent, // Componente para intranet
    IntranetConfigComponent, // Componente para configuración de intranet
    PolitCookieComponent, // Componente para política de cookies
    PolitPrivaComponent, // Componente para política de privacidad
    GeneradorTicketsComponent, // Componente para generar tickets
    EncuestaConsultaComponent, // Componente para consulta de encuestas
    IntranetTableComponent // Componente para tabla de intranet
  ],
  imports: [
    BrowserModule, // Módulo necesario para cualquier aplicación web
    AppRoutingModule, // Módulo para la configuración de rutas
    HttpClientModule, // Módulo para hacer peticiones HTTP
    ReactiveFormsModule, // Módulo para formularios reactivos
    FormsModule, // Módulo para formularios basados en plantillas
    BrowserAnimationsModule, // Módulo necesario para las animaciones de Angular Material

    // Angular Material modules
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent] // Componente raíz que se inicializa al arrancar la aplicación
})
export class AppModule { }
