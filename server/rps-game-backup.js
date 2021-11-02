class Supertrunfo {
  #players
  #rodada
  #escolha
  #score1
  #score2
  #estrelas
  #estrelas2
  #turno
  #cartas
  

//Embaralha as cartas
shuffle(array) {
  var w = array.length, ta, j;

  // While there remain elements to shuffle…
  while (w) {

    // Pick a remaining element…
    j = Math.floor(Math.random() * w--);

    // And swap it with the current element.
    ta = array[w];
    array[w] = array[j];
    array[j] = ta;
  }

  return array;
}
constructor(p1,p2) {

    this.room = p1.nome;
    this.#players = [p1.sock,p2.sock];

    this.#estrelas = [[18.00,73.00,11500,773.0,85000,0.15,"Rigel","Órion"],
    [2.00,1.71,25369,8.6,24.7,-1.45,"Sírius","Cão Maior"],
    [1.10,1.22,5795,4.4,1.52,0.10,"Alfa Centauri","Centauro"],
    [2.15,2.80,8152,25.0,40,0.00,"Vega","Lira"],
    [14.00,4.76,30000,320.0,25000,1.25,"Acrux","Cruzeiro Do Sul"],
    [1.13,45.00,4055,66.6,518.0,0.85,"Aldebaran","Touro"],
    [15.50,883.00,3500,605.0,11000,1.05,"Antares","Escorpião"],
    [1.91,8.80,4666,33.8,43.0,1.15,"Pollux","Gêmeos"],
    [2.56,11.98,4970,42.0,78.7,0.05,"Capella","Cocheiro"],
    [14.00,887.00,3600,720.0,4520,0.45,"Betelgeuse","Órion"],
    [2.00,1.60,6900,16.0,10.6,0.75,"Altair","Águia"],
    [1.08,25.00,4280,36.7,170.0,0.15,"Arcturus","Boieiro"],
    [8.00,71.00,6998,310.0,10700,-0.65,"Canopus","Carina"],
    [1.40,0.01,6530,11.4,7.10,0.40,"Procyon","Cão Menor"],
    [6.70,7.30,15000,139.0,3150,0.45,"Achernar","Eridano"],
    [10.25,7.40,22400,260.0,12100,0.95,"Spica","Virgem"],
    [1.92,1.84,8590,24.8,16.6,1.15,"Formalhaut","Peixes"],
    [19.00,203.00,8525,2613.0,196000,1.25,"Deneb","Cisne"],
    [3.80,4.35,11668,70.3,0.50,1.35,"Regulus","Leão"],
    [10.00,13.90,24750,430.0,20000,1.50,"Adhara","Cão Maior"],
    [9.60,4.70,25000,540.0,36300,1.60,"Shaula","Escorpião"],
    [2.76,2.40,10286,51.0,34,1.90,"Castor","Gêmeos"]];
    
    this.#estrelas2 = [[18.00,73.00,11500,773.0,85000,0.15,"Rigel","Órion"],
    [2.00,1.71,25369,8.6,24.7,-1.45,"Sírius","Cão Maior"],
    [1.10,1.22,5795,4.4,1.52,0.10,"Alfa Centauri","Centauro"],
    [2.15,2.80,8152,25.0,40,0.00,"Vega","Lira"],
    [14.00,4.76,30000,320.0,25000,1.25,"Acrux","Cruzeiro Do Sul"],
    [1.13,45.00,4055,66.6,518.0,0.85,"Aldebaran","Touro"],
    [15.50,883.00,3500,605.0,11000,1.05,"Antares","Escorpião"],
    [1.91,8.80,4666,33.8,43.0,1.15,"Pollux","Gêmeos"],
    [2.56,11.98,4970,42.0,78.7,0.05,"Capella","Cocheiro"],
    [14.00,887.00,3600,720.0,4520,0.45,"Betelgeuse","Órion"],
    [2.00,1.60,6900,16.0,10.6,0.75,"Altair","Águia"],
    [1.08,25.00,4280,36.7,170.0,0.15,"Arcturus","Boieiro"],
    [8.00,71.00,6998,310.0,10700,-0.65,"Canopus","Carina"],
    [1.40,0.01,6530,11.4,7.10,0.40,"Procyon","Cão Menor"],
    [6.70,7.30,15000,139.0,3150,0.45,"Achernar","Eridano"],
    [10.25,7.40,22400,260.0,12100,0.95,"Spica","Virgem"],
    [1.92,1.84,8590,24.8,16.6,1.15,"Formalhaut","Peixes"],
    [19.00,203.00,8525,2613.0,196000,1.25,"Deneb","Cisne"],
    [3.80,4.35,11668,70.3,0.50,1.35,"Regulus","Leão"],
    [10.00,13.90,24750,430.0,20000,1.50,"Adhara","Cão Maior"],
    [9.60,4.70,25000,540.0,36300,1.60,"Shaula","Escorpião"],
    [2.76,2.40,10286,51.0,34,1.90,"Castor","Gêmeos"]];

    this.#cartas = [this.shuffle(this.#estrelas), this.shuffle(this.#estrelas2)]
    this.#rodada = 0;
    this.#score1 = 0;
    this.#score2 = 0;
    this.mandaCartas();
    
  
    this.#players.forEach((player,idx) => {
    player.on('pass_turn', (opt,turn)=> {
    this.qualTurno(opt,turn,idx);
    })
    })
 }

//Envia as cartas da rodada
 mandaCartas() {
  this.#players.forEach((player,idx) => {
    player.emit("rodada", this.#cartas[idx][this.#rodada])
  })
}

// Determina de qual jogador é a vez e qual o item escolhido
qualTurno(item,p,index) {
    const resp = p-index;
    switch(resp) {
    case 0:    
    const c1 = this.#cartas[0][this.#rodada];
    const c2 = this.#cartas[1][this.#rodada];
    this.#escolha = item;
  
      if (c1[this.#escolha] > c2[this.#escolha]) {
        this.#turno = 0;
        this.#score1 = this.#score1 + 1;
        this.#players[0].emit("resultado", c1, c2,this.#score1,this.#score2, this.#escolha,"lime", "red", this.#turno);
        this.#players[1].emit("resultado", c2, c1,this.#score2,this.#score1, this.#escolha,"red", "lime", this.#turno);
        }
       else if (c2[this.#escolha] > c1[this.#escolha]) {
        this.#turno = 1;
        this.#score2=this.#score2+1;
        this.#players[1].emit("resultado", c2, c1, this.#score2,this.#score1,this.#escolha,"lime","red", this.#turno) ;
        this.#players[0].emit("resultado",c1, c2, this.#score1,this.#score2,this.#escolha,"red","lime", this.#turno);
      } 
      else {
        this.#players[0].emit("resultado",c1, c2, this.#score1,this.#score2,this.#escolha,"yellow","yellow", this.#turno);
        this.#players[1].emit("resultado",c2, c1, this.#score2,this.#score1,this.#escolha,"yellow","yellow",this.#turno);
      }

      if (this.#rodada < this.#cartas[0].length-20) {
      this.#rodada = this.#rodada +1; 
      this.mandaCartas(); 
      console.log("rodada: "+this.#rodada+ " Cartas: "+this.#cartas[0].length)
    }
      else {this.final();
      console.log("rodada: "+this.#rodada+ " Cartas: "+this.#cartas[0].length)
      }

}
 
  }

//Determina o fim do jogo
final() {
  const final = this.#score1-this.#score2;
  if (final > 0) {
    this.#players[0].emit("final", this.#score1, this.#score2, "Parabéns, você ganhou!");
    this.#players[1].emit("final", this.#score2, this.#score1, "Você perdeu dessa vez!");
    this.reset();
  }
  else if (final<0){
    this.#players[1].emit("final", this.#score2, this.#score1, "Parabéns, você ganhou!");
    this.#players[0].emit("final", this.#score1, this.#score2, "Você perdeu dessa vez!");
    this.reset();
  }
  else {
    this.#players[0].emit("final", this.#score1, this.#score2, "Houve um empate!");
    this.#players[1].emit("final", this.#score2, this.#score1, "Houve um empate!");
    this.reset();
  }
  
}

//Zera os resultados
reset() {
  this.#score1 = 0;
  this.#score2 = 0;
  this.#rodada = 0;
  
}  


}

module.exports = Supertrunfo;