Projeto de cadastro usando Flask e MySQL

Foi usado Python/Flask , MySQL, docker e hash para criptografia

São 2 containers: um para o site o outro para o banco de dados
Os cadastros ficam salvos dentro do container mesmo depois de encerrada os containers
As senhas ficam protegidas graças ao hash

Funcionamento do codigo:
docker compose up --build // inicialiaz o projeto
abrir http://localhost:5000 para ver o projeto
docker compose down // termina o pr5ocesso

