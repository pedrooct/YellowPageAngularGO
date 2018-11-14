package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	"github.com/json-iterator/go"
	_ "github.com/lib/pq"
)

//Variaveis fixas de postgresBD
const (
	dbHost     = "postgres"
	dbUser     = "docker"
	dbPassword = "docker"
	dbName     = "paginasamarelas"
)

// Estrutura é uma replica da tabela servico no postgres
type Servico struct {
	ID            int    `json:"id"`
	Nome          string `json:"nome"`
	Morada        string `json:"morada"`
	Cidade        string `json:"cidade"`
	Descricao     string `json:"descricao"`
	Telefone      int    `json:"telefone"`
	Info          string `json:"info"`
	Email         string `json:"email"`
	Website       string `json:"website"`
	Imagem        string `json:"imagem"`
	Countpesquisa int    `json:"countpesquisa"`
}

// Estrutura Admin para o login
type Admin struct {
	//ID    int    `db:"id"`
	Email string `db:"email"`
	Pass  string `db:"pass"`
}

// função para abrir connexão com DB
func openConnDB() *sqlx.DB {
	dbinfo := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=5432 sslmode=disable", dbHost, dbUser, dbPassword, dbName)
	db, err := sqlx.Connect("postgres", dbinfo)
	if err != nil {
		log.Fatal(err)
	}
	return db
}

// Função para fechar porta aberta na DB
func closeConnDB(db *sqlx.DB) {
	db.Close()
}

//Função para inserir na tabela, este recebe uma estrutura completa e só junta à query
func InsertServico(servico Servico) bool {
	db := openConnDB()
	tx := db.MustBegin()
	tx.NamedExec("INSERT INTO servico (nome, morada, cidade,descricao,telefone,info,email,website,imagem,countpesquisa) VALUES (:nome,:morada,:cidade,:descricao,:telefone,:info,:email,:website,:imagem,:countpesquisa)", &servico)
	err := tx.Commit()
	if err != nil {
		return false
	}
	closeConnDB(db)
	return true
}

//Função para editar elemento, este recebe uma estrutura completa e só preenche campos em falta
func EditServico(servico Servico) bool {

	db := openConnDB()
	tx := db.MustBegin()
	tx.NamedExec("UPDATE servico SET nome=:nome ,morada=:morada, cidade=:cidade,descricao=:descricao,telefone=:telefone,info=:info,email=:email,website=:website,imagem=:imagem,countpesquisa=:countpesquisa WHERE id=:id", &servico)
	err := tx.Commit()
	if err != nil {
		return false
	}
	closeConnDB(db)
	return true
}

//Função para apagar elemento da tabela
func DeleteServico(id string) bool {
	db := openConnDB()
	tx := db.MustBegin()
	tx.MustExec("DELETE FROM servico WHERE id=" + id)
	err := tx.Commit()
	if err != nil {
		return false
	}
	closeConnDB(db)
	return true
}
func getCoord(w http.ResponseWriter, r *http.Request) {
	// chave API - AIzaSyD8p44CxQOPCayoDlayW9hpfoBa21P3R7U
	vars := mux.Vars(r)
	response, err := http.Get("https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + vars["rua"] + "&key=AIzaSyD8p44CxQOPCayoDlayW9hpfoBa21P3R7U")
	if err != nil {
		log.Fatal(err)
	} else {
		data, _ := ioutil.ReadAll(response.Body)
		w.WriteHeader(http.StatusOK)
		w.Write(data)
	}
}

// Funções de contagem para paginação
func getTotalDBNomeZona(nome string, zona string) []byte {
	var count int
	db := openConnDB()
	row := db.QueryRow("select count(*) from servico where nome like " + "'%" + nome + "%' AND cidade like " + "'%" + zona + "%'")
	err := row.Scan(&count)
	if err != nil {
		log.Fatal(err)
	}
	var json = jsoniter.ConfigCompatibleWithStandardLibrary
	j, _ := json.Marshal(count)
	closeConnDB(db)
	return j
}
func getTotalDBNome(nome string) []byte {
	var count int
	db := openConnDB()
	row := db.QueryRow("select count(*) from servico where nome like " + "'%" + nome + "%'")
	err := row.Scan(&count)
	if err != nil {
		log.Fatal(err)
	}
	var json = jsoniter.ConfigCompatibleWithStandardLibrary
	j, _ := json.Marshal(count)
	closeConnDB(db)
	return j
}
func getTotalDBZona(zona string) []byte {
	var count int
	db := openConnDB()
	row := db.QueryRow("select count(*) from servico where cidade like " + "'%" + zona + "%'")
	err := row.Scan(&count)
	if err != nil {
		log.Fatal(err)
	}
	var json = jsoniter.ConfigCompatibleWithStandardLibrary
	j, _ := json.Marshal(count)
	closeConnDB(db)
	return j
}
func getTotalDB() []byte {
	var count int
	db := openConnDB()
	row := db.QueryRow("select count(*) from servico")
	err := row.Scan(&count)
	if err != nil {
		log.Fatal(err)
	}
	var json = jsoniter.ConfigCompatibleWithStandardLibrary
	j, _ := json.Marshal(count)
	closeConnDB(db)
	return j
}
func getTotal(w http.ResponseWriter, r *http.Request) {
	total := getTotalDB()
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(total)
}
func getTotalNomeZona(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	total := getTotalDBNomeZona(vars["nome"], vars["zona"])
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(total)
}
func getTotalNome(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	total := getTotalDBNome(vars["nome"])
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(total)
}
func getTotalZona(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	total := getTotalDBZona(vars["zona"])
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(total)
}

// Até aqui
func searchBDbyID(id string) []byte {
	row := []Servico{}
	db := openConnDB()
	err := db.Select(&row, "SELECT * FROM servico WHERE id ="+id)
	if err != nil {
		log.Fatal(err)
	}
	var json = jsoniter.ConfigCompatibleWithStandardLibrary
	j, _ := json.Marshal(row)
	closeConnDB(db)
	return j
}

// Retorna os mais clicados por os utilizadores
func searchDBByCounter(page string) []byte {
	row := []Servico{}
	db := openConnDB()
	err := db.Select(&row, "SELECT * FROM servico ORDER BY countpesquisa DESC LIMIT 5 OFFSET "+page)
	if err != nil {
		log.Fatal(err)
	}
	var json = jsoniter.ConfigCompatibleWithStandardLibrary
	j, _ := json.Marshal(row)
	closeConnDB(db)
	return j
}

//Função permite procurar serviço por nome
func searchDBByName(nome string, page string) []byte {
	row := []Servico{}
	db := openConnDB()
	err := db.Select(&row, "SELECT * FROM servico WHERE nome like "+"'%"+nome+"%' LIMIT 5 OFFSET "+page)
	if err != nil {
		log.Fatal(err)
	}
	var json = jsoniter.ConfigCompatibleWithStandardLibrary
	j, _ := json.Marshal(row)
	closeConnDB(db)
	return j
}

// Função permite procurar por serviço numa cidade envia json pronto !
func searchDBByCidade(cidade string, page string) []byte {
	row := []Servico{}
	db := openConnDB()
	err := db.Select(&row, "SELECT * FROM servico WHERE cidade like "+"'%"+cidade+"%' LIMIT 5 OFFSET "+page)
	if err != nil {
		log.Fatal(err)
	}
	var json = jsoniter.ConfigCompatibleWithStandardLibrary
	j, _ := json.Marshal(row)
	closeConnDB(db)
	return j
}

//Função permite procurar serviço por nome e cidade
func searchDBByCidadeANDNome(cidade string, nome string, page string) []byte {
	row := []Servico{}
	db := openConnDB()
	err := db.Select(&row, "SELECT * FROM servico WHERE cidade like "+"'%"+cidade+"%'"+"AND nome like "+"'%"+nome+"%' LIMIT 5 OFFSET "+page)
	if err != nil {
		log.Fatal(err)
	}
	var json = jsoniter.ConfigCompatibleWithStandardLibrary
	j, _ := json.Marshal(row)
	closeConnDB(db)
	return j
}
func checkUser(emailv string, passv string) bool {
	var row Admin
	db := openConnDB()
	err := db.Get(&row, "SELECT email,pass FROM admin WHERE email like "+"'"+emailv+"'")
	if err != nil {
		return false
	}
	if row.Pass != passv {
		return false
	}
	closeConnDB(db)
	return true
}
func checkcoundata() string {
	var row string
	db := openConnDB()
	err := db.Get(&row, "SELECT count(*) FROM servico")
	if err != nil {
		log.Fatal(err)
	}
	closeConnDB(db)
	return row

}

//Função que retorna elemento por ID
func searchDBByID(id string) []byte {
	row := []Servico{}
	db := openConnDB()
	err := db.Select(&row, "SELECT * FROM servico WHERE id= "+id)
	if err != nil {
		log.Fatal(err)
	}
	var json = jsoniter.ConfigCompatibleWithStandardLibrary
	j, _ := json.Marshal(row)
	closeConnDB(db)
	return j

}
func searchDBAll(off string) []byte {
	row := []Servico{}
	db := openConnDB()
	err := db.Select(&row, "SELECT * FROM servico ORDER BY id LIMIT 5 OFFSET "+off)
	if err != nil {
		log.Fatal(err)
	}
	var json = jsoniter.ConfigCompatibleWithStandardLibrary
	j, _ := json.Marshal(row)
	closeConnDB(db)
	return j

}
func incrementCountDB(id string) bool {
	db := openConnDB()
	tx := db.MustBegin()
	tx.MustExec("UPDATE servico SET countpesquisa= countpesquisa+1 WHERE id=" + id)
	err := tx.Commit()
	if err != nil {
		return false
	}
	closeConnDB(db)
	return true
}

//Dummie test
func getPage(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode("It's live and working !!!")
}
func getSlideshowByCount(w http.ResponseWriter, r *http.Request) {
	rows := searchDBByCounter("0")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(rows)
}
func getServicoByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	rows := searchBDbyID(vars["id"])
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(rows)
}

//Retorna elementos com maior count
func getServicoByCount(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	rows := searchDBByCounter(vars["page"])
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(rows)
}

//Função para procurar por nome do serviço
func getServicoNome(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	vars := mux.Vars(r)
	rows := searchDBByName(vars["nome"], vars["page"])
	w.WriteHeader(http.StatusOK)
	w.Write(rows)
}
func incrementCount(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	vars := mux.Vars(r)
	result := incrementCountDB(vars["id"])
	j, _ := json.Marshal(result)
	w.WriteHeader(http.StatusOK)
	w.Write(j)

}

//Função para procurar por zona
func getServicoZona(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	vars := mux.Vars(r)
	rows := searchDBByCidade(vars["zona"], vars["page"])
	w.WriteHeader(http.StatusOK)
	w.Write(rows)
}

//Função para descubrir por nome e zona
func getServicoNomeZona(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	vars := mux.Vars(r)
	rows := searchDBByCidadeANDNome(vars["zona"], vars["nome"], vars["page"])
	w.WriteHeader(http.StatusOK)
	w.Write(rows)

}
func getServicos(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	vars := mux.Vars(r)
	rows := searchDBAll(vars["page"])
	w.WriteHeader(http.StatusOK)
	w.Write(rows)

}
func delete(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	vars := mux.Vars(r)
	result := DeleteServico(vars["id"])
	j, _ := json.Marshal(result)
	w.WriteHeader(http.StatusOK)
	w.Write(j)

}
func edit(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var servico Servico
	var json = jsoniter.ConfigCompatibleWithStandardLibrary
	json.NewDecoder(r.Body).Decode(&servico)
	result := EditServico(servico)
	j, _ := json.Marshal(result)
	w.WriteHeader(http.StatusOK)
	w.Write(j)
}
func insert(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var servico Servico
	var json = jsoniter.ConfigCompatibleWithStandardLibrary
	json.NewDecoder(r.Body).Decode(&servico)
	result := InsertServico(servico)
	j, _ := json.Marshal(result)
	w.WriteHeader(http.StatusOK)
	w.Write(j)
}
func login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var user Admin
	var json = jsoniter.ConfigCompatibleWithStandardLibrary
	json.NewDecoder(r.Body).Decode(&user)
	result := checkUser(user.Email, user.Pass)
	j, _ := json.Marshal(result)
	w.WriteHeader(http.StatusOK)
	w.Write(j)

}
func main() {
	//Init router
	r := mux.NewRouter() // := atribui tipo á variavel
	//CORS
	corsObj := handlers.AllowedOrigins([]string{"*"})
	headersOk := handlers.AllowedHeaders([]string{"Content-Type", "Bearer", "Bearer ", "content-type", "Origin", "Accept"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})

	// router handlers
	//r.HandleFunc("/api/porcurar/{key}", getbyNome).Methods("GET")
	r.HandleFunc("/api/insert", insert).Methods("POST")
	r.HandleFunc("/api/edit", edit).Methods("POST")
	r.HandleFunc("/api/delete/{id}", delete).Methods("GET")
	r.HandleFunc("/api/getTotal", getTotal).Methods("GET")
	r.HandleFunc("/api/getTotal/nome/{nome}/zona/{zona}", getTotalNomeZona).Methods("GET")
	r.HandleFunc("/api/getTotal/nome/{nome}", getTotalNome).Methods("GET")
	r.HandleFunc("/api/getTotal/zona/{zona}", getTotalZona).Methods("GET")
	r.HandleFunc("/api/incrementcount/{id}", incrementCount).Methods("GET")
	r.HandleFunc("/api/procurar/id/{id}", getServicoByID).Methods("GET")
	r.HandleFunc("/api/procurar/admin/page/{page}", getServicos).Methods("GET")
	r.HandleFunc("/api/procurar/page/{page}", getServicoByCount).Methods("GET")
	r.HandleFunc("/api/procurar/nome/{nome}/page/{page}", getServicoNome).Methods("GET")
	r.HandleFunc("/api/procurar/zona/{zona}/page/{page}", getServicoZona).Methods("GET")
	r.HandleFunc("/api/procurar/nome/zona/{nome}/{zona}/page/{page}", getServicoNomeZona).Methods("GET")
	r.HandleFunc("/api/procurar/slideshow", getSlideshowByCount).Methods("GET")
	r.HandleFunc("/api/procurar/coo/{rua}", getCoord).Methods("GET")
	r.HandleFunc("/api/login", login).Methods("POST")
	r.HandleFunc("/api", getPage).Methods("GET")                                             // pagina de testes
	log.Fatal(http.ListenAndServe(":8000", handlers.CORS(corsObj, headersOk, methodsOk)(r))) // se falhar dá erro !
}
