import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  API_URL = 'http://localhost:8000';
  constructor(private httpClient: HttpClient) { }
  getTest() {
    return this.httpClient.get(`${this.API_URL}/api`);
  }
  getSlideshow() {
    return this.httpClient.get(`${this.API_URL}/api/procurar/slideshow`);
  }
  getNome(name: string, p: number) {
    return this.httpClient.get(`${this.API_URL}/api/procurar/nome/${name}/page/${p}`);
  }
  getZona(zona: string, p: number) {
    return this.httpClient.get(`${this.API_URL}/api/procurar/zona/${zona}/page/${p}`);
  }
  getNomeWithZona(name: string, zona: string, p: number) {
    return this.httpClient.get(`${this.API_URL}/api/procurar/nome/zona/${name}/${zona}/page/${p}`);
  }
  getDefault(p: number) {
    return this.httpClient.get(`${this.API_URL}/api/procurar/page/${p}`);
  }
  getCoord(rua: string) {
    rua = rua.split(" ").join("+");
    return this.httpClient.get(`${this.API_URL}/api/procurar/coo/${rua}`);
  }
  login(emailv: string, passv: string) {
    return this.httpClient.post(`${this.API_URL}/api/login`, {
      Email: emailv,
      Pass: passv
    });
  }
  getTotal() {
    return this.httpClient.get(`${this.API_URL}/api/getTotal`);
  }
  getTotalByName(nome: string) {
    return this.httpClient.get(`${this.API_URL}/api/getTotal/nome/${nome}`);
  }
  getTotalByZone(zona: string) {
    return this.httpClient.get(`${this.API_URL}/api/getTotal/zona/${zona}`);
  }
  getTotalByNameZone(nome: string,zona: string) {
    return this.httpClient.get(`${this.API_URL}/api/getTotal/nome/${nome}/zona/${zona}`);
  }
  getAllServicos(p: number) {
    return this.httpClient.get(`${this.API_URL}/api/procurar/admin/page/${p}`);
  }
  sendServico(arr: any[]) {
    return this.httpClient.post(`${this.API_URL}/api/insert`, {
      Nome: arr["nome"],
      Morada: arr["morada"],
      Cidade: arr["cidade"],
      Descricao: arr["descricao"],
      Info: arr["info"],
      Telefone: arr["telefone"],
      Email: arr["email"],
      Website: arr["website"],
      Imagem: arr["imagem"],
      Countpesquisa: 0
    });
  }
  editServico(arr: any[]) {
    return this.httpClient.post(`${this.API_URL}/api/edit`, {
      ID: arr["ID"],
      Nome: arr["nome"],
      Morada: arr["morada"],
      Cidade: arr["cidade"],
      Descricao: arr["descricao"],
      Info: arr["info"],
      Telefone: arr["telefone"],
      Email: arr["email"],
      Website: arr["website"],
      Countpesquisa:arr["countpesquisa"],
      Imagem: arr["imagem"]
    });

  }
  getbyID(id: number){
    return this.httpClient.get(`${this.API_URL}/api/procurar/id/${id}`);
  }
  incrementCount(id: number) {
    return this.httpClient.get(`${this.API_URL}/api/incrementcount/${id}`);
  }
  deleteServico(p: number) {
    return this.httpClient.get(`${this.API_URL}/api/delete/${p}`);
  }
}