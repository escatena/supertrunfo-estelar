class RpsGame {  
  constructor(p1, p2) {
    
    this._players = [p1, p2];
    this._cartas = [null, null];

    this._sendToPlayers('Supertrunfo Estelar!');

    this._players.forEach((player, idx) => {
      player.on('propriedade', (cartas) => {
        this._onTurn(idx, cartas);
      });
    });
  }

_sendToPlayer(playerIndex, msg) {
    this._players[playerIndex].emit('message', msg);
  }

  _sendToPlayers(msg) {
    this._players.forEach((player) => {
      player.emit('message', msg);
    });
  }

  _onTurn(playerIndex, cartas) {
    this._cartas[playerIndex] = cartas;
    this._sendToPlayer(playerIndex, `You selected ${cartas}`);

    this._checkGameOver();
  }

  _checkGameOver() {
    const cartas = this._cartas;

    if (cartas[0] && cartas[1]) {
      this._sendToPlayers('Game over ' + cartas.join(' : '));
      this._getGameResult();
      this._cartas = [null, null];
      this._sendToPlayers('Next Round!!!!');
    }
  }

  _getGameResult() {

    const p0 = this._cartas[0];
    const p1 = this._cartas[1];
    //const distance = (p0 - p1)/Math.abs(p0-p1);
    const distance = 0;

    switch (distance) {
      case 0:
        this._sendToPlayers('Draw!');
        break;

      case 1:
        this._sendWinMessage(this._players[0], this._players[1]);
        break;

      case -1:
        this._sendWinMessage(this._players[1], this._players[0]);
        break;
    }

  }

  _sendWinMessage(winner, loser) {
    winner.emit('message', 'You won!');
    loser.emit('message', 'You lost.');
  }

 
}

module.exports = RpsGame;