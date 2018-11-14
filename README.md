# Repositorio paginas_amarelas

# Para comecar e necessario :   
## - docker-compose up --build (sendo o build opcional)  

# Para desisntalar tudo basta :  
## - docker-compose down --rmi all --volume
Sendo que isto desativa redes e volumes associados juntamente com containers e images.   

## Go e recompilado a cada alteracao

# Para recompilar o angular:  
1. Entrar no container com docker exec -it rep_paginas_amarelas_angular_1 sh
2. ng build --prod
3. voila

# Para alterar DB postgres através do dump
1. Entrar no container com docker exec -it rep_paginas_amarelas_postgres_1 sh
- Para fazer o dump : pg_dump -U docker -c paginasamarelas > db.sql
2. alterar db dump com editor favorito
3. psql -U docker paginasamarelas < db.sql


# Localhost
- GO API-localhost:8000
- Angular-localhost:4200

# DESCULPEM PELOS NODE_MODULES ! Espero que não ocupe muito em disco :)
- Para apagar os mode_modules caso não seja possivel em sistemas UNIX
- rm -rf node_modules/
