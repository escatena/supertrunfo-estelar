const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Supertrunfo = require('./rps-game');
const app = express();

const clientPath = `/client`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));

const server = http.createServer(app);


// Variáveis globais//
const io = socketio(server);
let players = [];
var nomes =[];
var playerID = [];
var jogadores =[];
var todosNomes = [];


//Conexão//

io.on('connection', function(sock) {
  io.emit("total",todosNomes);


console.log('A player connected');

players.push(sock);
playerID.push(sock.id);

// ======================= Gerenciamento de Salas ================================


//Armazena o nome do jogador e coloca seu nome na lista de jogadores disponíveis
sock.on('nome', nome => {
nomes.push(nome);
todosNomes.push(nome)
io.emit("total",todosNomes)
console.log("total: "+todosNomes)
io.emit("salas", nomes)

let jogador = {
  "nome": nome,
  "id": sock.id,
  "sock": sock 
}
jogadores.push(jogador);

})

//Cria a lista de jogadores que estão na sala ou jogando//
sock.on("pegarNomes", (opa)=>{
  console.log(opa);
  io.emit("total",todosNomes)
})

//Avisa o jogador que ele está sendo desafiado
sock.on('match', (adversario) => {
var p1 = jogadores.find(jogador => jogador.nome === adversario);
var p2 = jogadores.find(jogador => jogador.id === sock.id);

console.log(p1,p2);
removeNome(nomes,p1.nome);
removeNome(nomes,p2.nome);

io.to(p1.id).emit("duelo", p2.nome);     
})

//Informa que o combate foi recusado
sock.on('recusa',(a,b) => {
  var p1 = jogadores.find(jogador => jogador.nome === a);
  var p2 = jogadores.find(jogador => jogador.id === b);

nomes.push(p1.nome,p2.nome);
io.emit('salas', nomes);
p1.sock.emit('mostrarSala', nomes);
p2.sock.emit('mostrarSala', nomes);
})


//Informa que o jogador voltou do combate e coloca seu nome na lista da sala novamente
sock.on('retorno',(b) => {
  var p2 = jogadores.find(jogador => jogador.id === b);

nomes.push(p2.nome);
io.emit('salas', nomes);
})

// ===================================Início do jogo =================================//

sock.on("inicio", (p1,p2) => {

//Identificação dos jogadores do duelo
var pl1 = jogadores.find(jogador => jogador.nome === p1);
var pl2 = jogadores.find(jogador => jogador.id === p2);
var sala = pl1.id+pl2.id;

pl1.sock.emit('jogando', pl1.nome, pl2.nome, sala);
pl2.sock.emit('jogando', pl2.nome, pl1.nome, sala);
console.log(p1,pl2.nome);

//Remove o nome do jogador da lista de disponíveis na sala

removeNome(nomes,p1);
removeNome(nomes,pl2.nome);

//Envia a nova lista de nomes
sock.emit("salas", nomes);

//Inicia o jogo
 var jogo = [];
 jogo.novo = new Supertrunfo(pl1, pl2, sala);
 delete jogo.novo;
})

function removeNome(arr, value) { 
  nomes = arr.filter(ele => ele != value); 
  io.emit('salas',nomes);
  }
// ================================= Desconexão ========================================//

sock.on('disconnect', function() {
  console.log('Got disconnect!');
  
  var player = jogadores.find(jogador => jogador.sock = sock);

  todosNomes = todosNomes.filter(ele => ele != player.nome); 
  io.emit('total', todosNomes);
  io.emit('salas', todosNomes);

})
})
server.on('error', (err) => {
console.error('Server error:', err);
});

var port_number = server.listen(process.env.PORT || 3000);
app.listen(port_number);


