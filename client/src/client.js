//Elementos HTML

const opc = document.getElementsByClassName('carta')[0];
const parent = document.getElementById("lista");
const avisoJogo = document.getElementById("aviso");
const salas = document.getElementsByClassName("room")[0];
const figura = document.getElementById("estrelas");
const figuras = document.getElementsByClassName("estrelas")[0];
const gameroom = document.getElementsByClassName("salas")[0]



avisoJogo.style.visibility="hidden";
figura.style.visibility = "hidden";
figuras.style.visibility = "hidden";

var carta;
const sock = io();
var nome = [];
var jogador = [];
var adversario;
var adv=[];
var turno=0;
var nomes = [];
var todosNomes = [];
var player =[];
var sala = [];

// ========================== Início ==========================================//

//Define o nome ao entrar no jogo
document.getElementById("nome").addEventListener("click", e => {
  pegarNome();
})

function pegarNome() {
  sock.emit('pegarNomes', "opa" );
  nome = document.getElementById("nomeJogador").value;
  var nomeLimpo = nome.replace(/\s+/g, '')

  var check = todosNomes.indexOf(nome);
  if (check > -1) {
    alert("Este nome já está em uso, escolha outro nome.");
  } else if (nomeLimpo.length < 3) { alert ("Seu nome deve ter ao menos 3 caracteres")

  }
  
  else {
  sock.emit("nome", nome);
  document.getElementsByClassName("capa")[0].style.visibility = "hidden";
  }
  if (nomes.length < 1) {alert("Aguardando adversários!")}
  
}

//Mantem uma lista de todos jogadores em sala ou jogando
sock.on("total",(todos) =>  {
  todosNomes = todos;
})


// ======================== Gerenciamento de Salas ============================//

//Recebe os nomes dos jogadores disponíveis
sock.on("salas", (salaNome) => {
  document.getElementsByClassName('salas')[0].style.visibility = "visible"
  nomes = salaNome;
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  nomes.forEach((item)=> {
    if (item !== nome){
   var el = document.createElement("div");
   el.innerHTML=item;
   el.id = item;
   parent.appendChild(el);}
  })
})

sock.on('mostrarSala', a => {
      nomes=a;
      salas.style.visibility = "visible";
      while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
      }
      nomes.forEach((item)=> {
        if (item !== nome){
       var el = document.createElement("div");
       el.innerHTML=item;
       el.id = item;
       if (nomes.indexOf(item) < 25) {    
        el.style.width= "50%";
        el.style.float = "left";
    }
      else { 
      el.style.width= "50%";
      el.style.float = "right";
 
    }
       parent.appendChild(el);}
      })
       
})

//Habilita os jogadores a escolherem os adversários
parent.addEventListener("click", (e) => {
  adversario = e.target.id;
  if (nomes.indexOf(adversario) > -1) {
 sock.emit("match", adversario, nome);
 salas.style.visibility = "hidden";
  }
})


// =========================================== Pedido de jogo ====================================================
// Recebe o pedido de duelo
sock.on('duelo', (p) => {
  _jogar(p);
  
})

function _jogar(p) {
  gameroom.style.visibility = "visible"
  salas.style.visibility = "hidden";
  adv = p;
  avisoJogo.style.visibility="visible";

  while (aviso.firstChild) {
    aviso.removeChild(aviso.firstChild);
    }
  var caixa = document.getElementById("aviso");
  var el = document.createElement("div");
      el.id = 'desafio'
       el.innerHTML= "O jogador "+adv+" está te desafiando para uma partida! <br> Você aceita?";
       caixa.appendChild(el);
       var yep = document.createElement('button');
       yep.className = "butao2";  
          yep.innerHTML = "Sim";
          caixa.appendChild(yep)
      var nope = document.createElement('button');
      nope.className = "butao1";  

          nope.innerHTML = "Não";
          caixa.appendChild(nope);

       nope.addEventListener('click', _nope);

       yep.addEventListener('click', _yep);
}


//Recusa o duelo

function _nope() {
    avisoJogo.style.visibility="hidden";
    salas.style.visibility = "visible";
    sala = [];

    var element = document.getElementById("desafio");
    element.parentNode.removeChild(element);
    sock.emit('recusa', adv, nome);  
}

//Aceita o duelo
function _yep() {
  sock.emit('inicio', adv, nome)
  while (aviso.firstChild) {
    aviso.removeChild(aviso.firstChild);
    }
  
}


// =========================== Durante o jogo ===================================//

//Esconde a lista de adversários e define os jogadores
sock.on("jogando", (p1,p2, room) => {
  salas.style.visibility = "hidden";
  document.getElementsByClassName("salas")[0].style.visibility = "hidden";
  document.getElementById("sala").style.visibility = "hidden";
  avisoJogo.style.visibility="hidden";
  figuras.style.visibility = "visible";
  gameroom.style.visibility = "hidden";

  player = [p1,p2];
  sala = room;

})

//Recebe as cartas da rodada
sock.on("rodada", (card) => {
  var j;
  for (j= 0; j < 8; j++) {
  var itens = document.getElementById(j);
  itens.disabled=true;
  }
  setTimeout(_rodada,3000,card);
  });

//Exibe os valores da rodada
function _rodada(rodadaTurno) {
    var j = 0;
    for (j= 0; j < 8; j++) {
    var dados = rodadaTurno[j];
    var itens = document.getElementById(j);
    itens.style.color="white";
    itens.innerHTML=dados;
    itens.disabled=false;
    }
    figuras.style.visibility = "visible";
    const imagem = rodadaTurno[6];
        figura.src = imagem+".png";
        figura.style.visibility = "visible"
  
}

//Emite o resultado
sock.on("resultado", (p, o , s1, s2, option,cor1,cor2, turn, room)=>{
  if (sala === room) {
      turno = turn;
      var col=document.getElementById(option);
      col.style.fontstretch = "extra-condensed";
      col.innerHTML= `<font color=${cor2}> ${o[option]}</font>/<font color=${cor1}>${p[option]}</font>`;
      document.getElementById("score").innerHTML= `${player[0]}: ${s1} / ${player[1]}: ${s2}`;
      document.getElementById(6).innerHTML= `<font color=${cor2}> ${o[6]}</font>/<font color=${cor1}>${p[6]}</font>`;
  }
})
  
//Recebe a escolha do turno
document.getElementsByClassName('carta')[0].addEventListener('click', e => {
  
    var opt = parseFloat(e.target.id);
              if (opt<6) {
              sock.emit('pass_turn', opt, turno, sala);
            }     
          
        })

//Resultado final
sock.on('final', (p_meu, p_adv, resultado, room) =>{
  setTimeout(final, 3000,p_meu, p_adv, resultado, room)
})

function final(p_meu, p_adv, resultado, room) {
  if (room === sala) {
    sala = [];
  turno = 0;
  figuras.style.visibility = "hidden";
  var caixa = document.getElementById("aviso");
  var el = document.createElement("div");
       while (aviso.firstChild) {
      aviso.removeChild(aviso.firstChild);
      }
       el.innerHTML= resultado + "<br>"+player[0]+" :"+p_meu+ "<br>" +player[1]+" :"+p_adv;
       caixa.appendChild(el);
       caixa.style.visibility="visible";
       avisoJogo.style.visibility="visible";

    var restart = document.createElement('button');
        restart.style.fontSize = "1.3rem"
        restart.innerHTML = "Voltar para sala";
        player = [];
        caixa.appendChild(restart);
        restart.addEventListener('click', (e) => {
         
          avisoJogo.style.visibility="hidden";
          salas.style.visibility = "visible";
          document.getElementById("sala").style.visibility = "visible";
          document.getElementById("score").innerHTML='';
          for (j = 0 ; j < 8 ; j++) {
          document.getElementById(j).innerHTML='';
          }
          sock.emit('retorno',nome);  

          

        })
      }
}
// ===================================== Desconexão ===========================================

//Adversário se desconecta
sock.on("volta", a =>{
  turno = 0;

  document.getElementsByClassName("salas")[0].style.visibility = "visible";
  avisoJogo.style.visibility="hidden";
  figuras.style.visibility = "hidden";
  document.getElementById("sala").style.visibility = "visible";
  salas.style.visibility = "visible";
  gameroom.style.visibility = "visible";
  sala = [];
  player = [];
  sock.emit('retorno', nome);  
 })

sock.on("msg", msg =>{
  alert(msg);
})



