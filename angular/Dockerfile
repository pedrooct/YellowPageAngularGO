FROM node:8.12-alpine


#Copia para o WORKDIR a aplicação angular !
WORKDIR /home/angular/app

#install dependencies
RUN npm install -g @angular/cli@6.2.4

COPY ./angular/angular-app/ .

#Garante que a ultima alteração será sempre atualiza em real-time
#CMD ng serve --host 0.0.0.0
#Resolve problema de indexação dos NODE_modules , e permite segurança na aplicação
CMD npm install && ng serve --host 0.0.0.0