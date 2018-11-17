# Repositorio paginas_amarelas

# Dados login para area de admin :
- teste@gmail.com  
- teste  

# Para comecar e necessario :   
## - docker-compose up --build (build apenas da primeira vez)  

# Para desinstalar tudo basta :  
## - docker-compose down --rmi all --volume
Sendo que isto desativa redes e volumes associados juntamente com containers e images.   

## Go e angular e recompilado on the fly

# Para recompilar o angular em modo produção:  
1. Entrar no container com docker exec -it rep_paginas_amarelas_angular_1 sh
2. ng build --prod
3. voila

# Para alterar DB postgres através do dump
1. Entrar no container com docker exec -it rep_paginas_amarelas_postgres_1 sh
- Para fazer o dump : pg_dump -U docker -c paginasamarelas > db.sql
2. alterar db dump com editor favorito
3. psql -U docker paginasamarelas < db.sql
4. voila

# Para aceder aos containers por SH
docker exec -it {container name} sh   

# Localhost
- GO API-localhost:8000
- Angular-localhost:4200

# DESCULPEM PELOS NODE_MODULES ! Espero que não ocupe muito em disco :)
- Para apagar os mode_modules caso não seja possivel em sistemas UNIX
- rm -rf node_modules/
