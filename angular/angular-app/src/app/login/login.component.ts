import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthGuard } from '../_guard/auth.guard';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public message : string;

  constructor(private api: ApiService, private router: Router, private auth: AuthGuard) {
    console.log("login");
    this.message="";
  }
  //escreve mensagem para o html
  checkResult(bool: boolean, email: string) {
    if (bool) {
      sessionStorage.setItem('currentUser', JSON.stringify(email));
      this.router.navigateByUrl('/adminArea');
    }
    else {
      this.message="Ooops ! Username ou palavra-passe errados !";
    }
  }

  tryLogin(form: NgForm) {
    let arr = form.value;
    this.api.login(arr["email"], arr["password"]).subscribe((bool: boolean) => {
      this.checkResult(bool, arr["email"]);
    });
  }

  ngOnInit(){
    sessionStorage.removeItem('currentUser');
  }

}
