FROM golang:1.11-alpine

# configurar Go , workdir fica na pasta git para ter acesso ao mux
WORKDIR /go/src/github.com/app/restapi

#diretorio de a aplicação !
COPY ./go/app /go/src/github.com/app/restapi

#Instalas pacotes necessários para correr go e buscar do git as bibliotecas.
RUN apk add --update \  
    git \ 
    && rm -rf /var/cache/apk/*


# mux para a REST api e lib/pq para a api postgres
RUN go get github.com/gorilla/mux && go get github.com/gorilla/handlers && go get github.com/lib/pq && go get github.com/json-iterator/go && go get github.com/jmoiron/sqlx && go get github.com/pilu/fresh

#abre porta 8000 para a comunicação
#cria o main.go para correr no CMD
EXPOSE 8000 
#CMD go run main.go 
CMD fresh
