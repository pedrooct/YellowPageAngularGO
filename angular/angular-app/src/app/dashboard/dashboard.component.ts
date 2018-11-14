import { Component, Injectable, OnInit, Renderer2 } from '@angular/core';
import { ApiService } from '../api.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

export class Servico {
  constructor(
    public ID: string,
    public Nome: string,
    public Morada: string,
    public Cidade: string,
    public Descricao: string,
    public Telefone: number,
    public Info: string,
    public Email: string,
    public Website: string,
    public Imagem: string,
    public Countpesquisa: number) {
  }
}

var currdeg = 0;

export class MapCoord {
  constructor(public lat: number, public lng: number) {

  }
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
@Injectable()
export class DashboardComponent implements OnInit {
  p: number = 1;
  pageOffset: number = 0;
  total: number;
  title = 'Paginas Amarelas';
  arr: any[] = [];
  servicos: any[] = []; // variavel que vai ser usada para os servicos
  SlideShowservicos: any[] = []; // variavel que vai ser usada para o slideshow
  MapCoords: any[] = [];

  constructor(private apiService: ApiService, private router: Router, private renderer: Renderer2) {
  }
  ngOnInit() {
    this.getSlideShow();
  }

  clickButtons(angle: number){
    currdeg = currdeg + angle;
    const parent: HTMLElement = document.getElementById('mycarousel');
    this.renderer.setStyle(parent, "-webkit-transform" , "rotateY(" + currdeg + "deg)");
    this.renderer.setStyle(parent, "-moz-transform" , "rotateY(" + currdeg + "deg)");
    this.renderer.setStyle(parent, "-o-transform" , "rotateY(" + currdeg + "deg)");
    this.renderer.setStyle(parent, "transform" , "rotateY(" + currdeg + "deg)");
  }
  
  /* Paging Component metod */
  loginPage() {
    this.router.navigateByUrl("/login");
  }
  printSlideshow(data: Array<Object>) {
    this.SlideShowservicos = [];
    for (let i = 0; i < data.length; i++) {
      let servico = new Servico(data[i]["ID"], data[i]["nome"], data[i]["morada"], data[i]["cidade"], data[i]["descricao"], data[i]["telefone"], data[i]["info"], data[i]["email"], data[i]["website"], data[i]["imagem"], data[i]["countpesquisa"]);
      this.SlideShowservicos.push(servico);
    }

  }
  printTable(data: Array<Object>) {
    this.servicos = [];
    this.MapCoords = [];
    for (let i = 0; i < data.length; i++) {
      let servico = new Servico(data[i]["id"], data[i]["nome"], data[i]["morada"], data[i]["cidade"], data[i]["descricao"], data[i]["telefone"], data[i]["info"], data[i]["email"], data[i]["website"], data[i]["imagem"], data[i]["countpesquisa"]);
      this.servicos.push(servico);
      this.getMapCoord(data[i]["morada"]);
      this.sendIncrement(data[i]["id"]);
    }
  }
  sendIncrement(id: number) {
    this.apiService.incrementCount(id).subscribe((data: boolean) => {
      if (!data) {
        alert("Ooooops!Algo correu mal a incrementar o counter");
      }
    });
  }
  getTotal() {
    this.apiService.getTotal().subscribe((data: number) => {
      this.total = data;
    });
  }
  getTotalByName(nome: string) {
    this.apiService.getTotalByName(nome).subscribe((data: number) => {
      this.total = data;
    });
  }
  getTotalByZone(zona: string) {
    this.apiService.getTotalByZone(zona).subscribe((data: number) => {
      this.total = data;
    });
  }
  getTotalByNameZone(nome: string, zona: string) {
    this.apiService.getTotalByNameZone(nome, zona).subscribe((data: number) => {
      this.total = data;
    });
  }
  getSlideShow() {
    this.apiService.getSlideshow().subscribe((data: Array<Object>) => {
      this.printSlideshow(data);
    });
  }
  printMapPoint(data: Array<Object>) {
    this.MapCoords.push(new MapCoord(data["results"][0]["geometry"]["location"]["lat"], data["results"][0]["geometry"]["location"]["lng"]));
  }
  getMapCoord(rua: string) {
    this.apiService.getCoord(rua).subscribe((data: Array<Object>) => {
      this.printMapPoint(data);
    })
  }
  onPageChange(p: number) {
    let po=p-1;
    if (p == 1) {
      this.pageOffset = 0;
    }
    else if (this.p < p) { 
      this.pageOffset = po * 5;
    }
    else if (this.p > p) {
    
      this.pageOffset = po * 5;

    }
    this.p = p;
    this.onClickPageChange();
  }
  onClickPageChange() {
    let page = this.pageOffset;
    if (this.arr['nome'] != "" && this.arr["zona"] == "") {
      this.apiService.getNome(this.arr['nome'], page).subscribe((data: Array<Object>) => {
        this.getTotalByName(this.arr['nome']);
        this.printTable(data);

      });
    }
    else if (this.arr['nome'] == "" && this.arr["zona"] != "") {
      this.apiService.getZona(this.arr['zona'], page).subscribe((data: Array<Object>) => {
        this.getTotalByZone(this.arr['zona']);
        this.printTable(data);
      });
    }
    else if (this.arr['nome'] != "" && this.arr["zona"] != "") {
      this.apiService.getNomeWithZona(this.arr['nome'], this.arr["zona"], page).subscribe((data: Array<Object>) => {
        this.getTotalByNameZone(this.arr['nome'], this.arr["zona"]);
        this.printTable(data);
      });
    }
    else {
      this.apiService.getDefault(page).subscribe((data: Array<Object>) => {
        this.printTable(data);
      });
    }
  }
  onClick(form: NgForm) {
    let page = 0;
    console.log(page);
    this.arr = form.value;
    if (this.arr['nome'] != "" && this.arr["zona"] == "") {
      this.apiService.getNome(this.arr['nome'], page).subscribe((data: Array<Object>) => {
        this.getTotalByName(this.arr['nome']);
        this.printTable(data);

      });
    }
    else if (this.arr['nome'] == "" && this.arr["zona"] != "") {
      this.apiService.getZona(this.arr['zona'], page).subscribe((data: Array<Object>) => {
        this.getTotalByZone(this.arr['zona']);
        this.printTable(data);
      });
    }
    else if (this.arr['nome'] != "" && this.arr["zona"] != "") {
      this.apiService.getNomeWithZona(this.arr['nome'], this.arr["zona"], page).subscribe((data: Array<Object>) => {
        this.getTotalByNameZone(this.arr['nome'], this.arr["zona"]);
        this.printTable(data);
      });
    }
    else {
      this.apiService.getDefault(page).subscribe((data: Array<Object>) => {
        this.printTable(data);
      });
    }
  }
}
