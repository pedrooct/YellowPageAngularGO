import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminAreaComponent } from './admin-area/admin-area.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthGuard } from './_guard/auth.guard';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

const appRoutes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'adminArea', component: AdminAreaComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [
    BrowserModule,
    NgxPaginationModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1IjoicHJvamVjdG93ZWIiLCJhIjoiY2pudDFoZW1pMGk1dDNrczUwYWxla25lcCJ9.wTA7QmPIFViyp2Lz1pGYdw', // Optionnal, can also be set per map (accessToken input of mgl-map)
      geocoderAccessToken: 'TOKEN' // Optionnal, specify if different from the map access token, can also be set per mgl-geocoder (accessToken input of mgl-geocoder)
    })],
  declarations: [
    AppComponent,
    LoginComponent,
    AdminAreaComponent,
    DashboardComponent,
    DashboardComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
