FROM postgres:10-alpine


WORKDIR /docker-entrypoint-initdb.d
#Comando para ler a BD para dentro de paginasamarelas DB
#Faz isto copiando a BD inicial para o docker entrypoint do postgres que executa SQL
ADD ./postgres/db.sql /docker-entrypoint-initdb.d