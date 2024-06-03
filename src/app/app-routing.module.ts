import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

const routes: Routes = [
  { path: '', component: PrincipalComponent }, // Ruta por defecto, carga el componente PrincipalComponent
  { path: 'principal', component: PrincipalComponent }, // Ruta para el componente PrincipalComponent
  { path: 'registro-user', component: RegistroUserComponent }, // Ruta para el componente RegistroUserComponent
  { path: 'login', component: LoginComponent }, // Ruta para el componente LoginComponent
  { path: 'encuesta', component: EncuestaComponent }, // Ruta para el componente EncuestaComponent
  { path: 'snake', component: MemoramaComponent }, // Nueva ruta para el componente MemoramaComponent
  { path: 'ranking', component: RankingComponent }, // Ruta para el componente RankingComponent
  { path: 'administracion', component: IntranetComponent }, // Nueva ruta para el componente IntranetComponent
  { path: 'admin-config', component: IntranetConfigComponent }, // Nueva ruta para el componente IntranetConfigComponent
  { path: 'admin', component: IntranetTableComponent }, // Nueva ruta para el componente IntranetTableComponent
  { path: 'admin-gen', component: GeneradorTicketsComponent }, // Nueva ruta para el componente GeneradorTicketsComponent
  { path: 'resultados', component: EncuestaConsultaComponent }, // Nueva ruta para el componente EncuestaConsultaComponent
  { path: 'intranet', redirectTo: 'administracion', pathMatch: 'full' }, // Redirección de intranet a administracion
  { path: 'intranet-conf', redirectTo: 'admin-config', pathMatch: 'full' }, // Redirección de intranet-conf a admin-config
  { path: 'tabla', redirectTo: 'admin', pathMatch: 'full' }, // Redirección de tabla a admin
  { path: 'generador', redirectTo: 'admin-gen', pathMatch: 'full' }, // Redirección de generador a admin-gen
  { path: 'memorama', redirectTo: 'snake', pathMatch: 'full' }, // Redirección de memorama a snake
  { path: 'consulta', redirectTo: 'resultados', pathMatch: 'full' }, // Redirección de consulta a resultados
  { path: 'cookie', component: PolitCookieComponent }, // Ruta para el componente PolitCookieComponent
  { path: 'privacidad', component: PolitPrivaComponent }, // Ruta para el componente PolitPrivaComponent
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Importa RouterModule y configura las rutas definidas
  exports: [RouterModule] // Exporta RouterModule para que esté disponible en toda la aplicación
})
export class AppRoutingModule { }
