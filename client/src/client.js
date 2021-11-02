//Elementos HTML

const opc = document.querySelector('.carta');
const parent = document.getElementById("lista");
const avisoJogo = document.getElementById("aviso");
const salas = document.getElementsByClassName("room")[0];
const figura = document.getElementById("estrelas");
const figuras = document.getElementsByClassName("estrelas")[0];




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
  
}

//Mantem uma lista de todos jogadores em sala ou jogando
sock.on("total",(todos) =>  {
  todosNomes = todos;
})


// ======================== Gerenciamento de Salas ============================//

//Recebe os nomes dos jogadores disponíveis
sock.on("salas", (sala) => {
  nomes = sala;
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  sala.forEach((item)=> {
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
      a.forEach((item)=> {
        if (item !== nome){
       var el = document.createElement("div");
       el.innerHTML=item;
       el.id = item;
       if (nomes.indexOf(item) < 25) {    
        el.style.width= "50%";
        el.style.float = "right";
    }
      else { 
      el.style.width= "50%";
      el.style.float = "left";
 
    }
       parent.appendChild(el);}
      })
       
})

//Habilita os jogadores a escolherem os adversários
salas.addEventListener("click", (e) => {
  adversario = e.target.id;
 sock.emit("match", adversario);
 salas.style.visibility = "hidden";

})

// Recebe o pedido de duelo
sock.on('duelo', (p2) => {
  _jogar(p2);
  
})

function _jogar(p2) {
  salas.style.visibility = "hidden";
  adv = p2;
  while (aviso.firstChild) {
    aviso.removeChild(aviso.firstChild);
    }
  var caixa = document.getElementById("aviso");
  var el = document.createElement("div");
      el.id = 'desafio'
       el.innerHTML= "O jogador "+adv+" está te desafiando para uma partida! <br> Você aceita?";
       caixa.appendChild(el);
       avisoJogo.style.visibility="visible";
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

    var element = document.getElementById("desafio");
    element.parentNode.removeChild(element);
    sock.emit('recusa', adv, sock.id);  
}

//Aceita o duelo
function _yep() {
  sock.emit('inicio', adv, sock.id)
  while (aviso.firstChild) {
    aviso.removeChild(aviso.firstChild);
    }
}


// =========================== Durante o jogo ===================================//

//Esconde a lista de adversários e define os jogadores
sock.on("jogando", (p1,p2, room) => {
  document.getElementsByClassName("salas")[0].style.visibility = "hidden";
  avisoJogo.style.visibility="hidden";
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
  if (room === sala) {
    sala = [];
  turno = 0;
  figuras.style.visibility = "hidden";
  document.getElementsByClassName("salas")[0].style.visibility = "visible";
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
        caixa.appendChild(restart);
        restart.addEventListener('click', (e) => {
         
          avisoJogo.style.visibility="hidden";
          salas.style.visibility = "visible";

          sock.emit('retorno',sock.id);  
          document.getElementById("score").innerHTML='';
          for (j=0 ; j < 8 ; j++) {
          document.getElementById(j).innerHTML='';
          }

        })
      }
})





