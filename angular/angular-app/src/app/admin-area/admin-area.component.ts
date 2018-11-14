import { Component, OnInit, Injectable, HostListener, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { NgForm } from '@angular/forms';

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

@Component({
  selector: 'app-admin-area',
  templateUrl: './admin-area.component.html',
  styleUrls: ['./admin-area.component.css']
})
@Injectable()
export class AdminAreaComponent implements OnInit {
  servicos: any[] = [];
  p: number = 1;
  pageOffset: number = 0;
  total: number;
  file: any;
  fileEdit: any[] = [];
  formData: FormData;
  public messageError: string = "";
  public messageSucess: string = "";
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getServicos();
    this.getTotal();
    this.messageError = "";
    this.messageSucess = "";
  }
  getTotal() {
    this.apiService.getTotal().subscribe((data: number) => {
      this.total = data;
    });
  }
  /*ngOnDestroy() {
    localStorage.removeItem('currentUser');
    localStorage.clear();
  }*/

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
    this.getServicos();
  }
  printTable(data: Array<Object>) {
    this.servicos = [];
    for (let i = 0; i < data.length; i++) {
      let servico = new Servico(data[i]["id"], data[i]["nome"], data[i]["morada"], data[i]["cidade"], data[i]["descricao"], data[i]["telefone"], data[i]["info"], data[i]["email"], data[i]["website"], data[i]["imagem"], data[i]["countpesquisa"]);
      this.servicos.push(servico);
    }
  }
  getServicos() {
    let page = this.pageOffset;
    this.apiService.getAllServicos(page).subscribe((data: Array<Object>) => {
      this.printTable(data);

    });
  }
  saveImage(file: FileReader) {
    this.file = file.result;
  }
  onFileChanged(event) {
    this.file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsDataURL(this.file);
    // handler para obter o resultado !!!
    fileReader.onload = () => this.saveImage(fileReader);
  }
  saveImageEdit(file: FileReader, id: number) {
    this.fileEdit[id] = file.result;
  }
  onFileChangedEdit(event, id: number) {
    console.log(id);
    this.fileEdit[id] = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsDataURL(this.fileEdit[id]);
    // handler para obter o resultado !!!
    fileReader.onload = () => this.saveImageEdit(fileReader, id);
  }
  verifyData(data: any[]) {
    if (data["nome"] == "" || data["morada"] == "" || data["cidade"] == "" || data["telefone"] == "") {
      return false;
    }
    return true;
  }
  insertData(ng: NgForm) {
    var arr: any[] = ng.value;
    arr["imagem"] = this.file;
    if (this.verifyData(arr)) {
      this.apiService.sendServico(arr).subscribe((data: boolean) => {
        if (this.checkResult(data)) {
          this.ngOnInit();
        }
      });
    }
    else {
      this.messageError = "Ooops ! algum dos campos obrigatórios não foram preenchidos!";
      this.messageSucess = "";
    }
  }
  deleteEntry(id: number) {
    this.apiService.deleteServico(id).subscribe((data: boolean) => {
      if (this.checkResult(data)) {
        this.ngOnInit();
      }
    });

  }
  prepareData(data: Array<Object>) {
    var servico;
    for (let i = 0; i < data.length; i++) {
      servico = new Servico(data[i]["id"], data[i]["nome"], data[i]["morada"], data[i]["cidade"], data[i]["descricao"], data[i]["telefone"], data[i]["info"], data[i]["email"], data[i]["website"], data[i]["imagem"], data[i]["countpesquisa"]);
    }
    return servico;
  }
  makeArray(NForm: any, arrtemp: any) {
    if (NForm["ID"] == "") {
      NForm["ID"] = arrtemp["ID"];
    }
    if (NForm["nome"] == "") {
      NForm["nome"] = arrtemp["Nome"];
    }
    if (NForm["morada"] == "") {
      NForm["morada"] = arrtemp["Morada"];
    }
    if (NForm["cidade"] == "") {
      NForm["cidade"] = arrtemp["Cidade"];
    }
    if (NForm["descricao"] == "") {
      NForm["descricao"] = arrtemp["Descricao"];
    }
    if (NForm["info"] == "") {
      NForm["info"] = arrtemp["Info"];
    }
    if (NForm["email"] == "") {
      NForm["email"] = arrtemp["Email"];
    }
    if (NForm["website"] == "") {
      NForm["website"] = arrtemp["Website"];
    }
    if (NForm["telefone"] == "") {
      NForm["telefone"] = arrtemp["Telefone"];
    }
    if (NForm["imagem"] == "") {
      NForm["imagem"] = arrtemp["Imagem"];
    }
    if (NForm["countpesquisa"] == "") {
      NForm["countpesquisa"] = arrtemp["Countpesquisa"];
    }
    return NForm;
  }
  sendEdit(arr: any) {
    this.apiService.editServico(arr).subscribe((data: boolean) => {
      if (this.checkResult(data)) {
        this.ngOnInit();
      }
    });
  }
  editEntry(form: NgForm, id: number) {
    var arr: any[] = form.value;
    if (this.fileEdit[id] != undefined) {
      console.log(this.fileEdit[id]);
      arr["imagem"] = this.fileEdit[id];
    }
    this.apiService.getbyID(id).subscribe((data: Array<Object>) => {
      let arrtemp: any[];
      arrtemp = this.prepareData(data);
      arrtemp = this.makeArray(arr, arrtemp);
      if (this.verifyData(arr)) {
        this.sendEdit(arrtemp);
      }
    });

  }
  checkResult(data: boolean) {
    if (data) {
      this.messageSucess = "Acção executada com sucesso !";
      this.messageError = "";
      return true;
    }
    else {
      this.messageError = "Ooops ! algo correu mal !";
      this.messageSucess = "";
      return false;
    }
  }
}
