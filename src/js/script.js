class Carta {
  constructor(element, valor, viradaParaCima) {
    this.element = element;
    this.valor = valor;
    this.viradaParaCima = viradaParaCima;
  }

  virar() {
    if (this.viradaParaCima) {
      this.element.classList.remove('flip');
    } else {
      this.element.classList.add('flip');
    }
    this.viradaParaCima = !this.viradaParaCima;
  }
}

class CartaAnimais extends Carta {
  constructor(element, valor, viradaParaCima, animal) {
    super(element, valor, viradaParaCima);
    this.animal = animal;

    this.element.addEventListener('click', this.flipCard.bind(this));
  }

  flipCard() {
    if (CartaAnimais.lockBoard || this.viradaParaCima) return;
    if (!CartaAnimais.hasFlippedCard) {
      this.virar();
      CartaAnimais.hasFlippedCard = true;
      CartaAnimais.firstCard = this;
    } else {
      this.virar();
      CartaAnimais.secondCard = this;
      CartaAnimais.checkForMatch();
    }
  }

  static checkForMatch() {
    let isMatch = CartaAnimais.firstCard.valor === CartaAnimais.secondCard.valor;

    if (isMatch) {
      CartaAnimais.disableCards();
      CartaAnimais.updateScore(true);
    } else {
      CartaAnimais.unflipCards();
      CartaAnimais.updateScore(false);
    }
  }

  static disableCards() {
    CartaAnimais.firstCard.element.removeEventListener('click', CartaAnimais.firstCard.flipCard);
    CartaAnimais.secondCard.element.removeEventListener('click', CartaAnimais.secondCard.flipCard);

    CartaAnimais.resetBoard();
  }

  static unflipCards() {
    CartaAnimais.lockBoard = true;

    setTimeout(() => {
      CartaAnimais.firstCard.virar();
      CartaAnimais.secondCard.virar();

      CartaAnimais.resetBoard();
    }, 1500);
  }

  static resetBoard() {
    CartaAnimais.hasFlippedCard = false;
    CartaAnimais.lockBoard = false;
    CartaAnimais.firstCard = null;
    CartaAnimais.secondCard = null;
  }

  static updateScore(isMatch) {
    if (isMatch) {
      currentPlayer.score++;
    } else {
      currentPlayer = getNextPlayer();
      currentPlayer.name = document.getElementById(`player${currentPlayer.id}`).value;
      function updateCurrentPlayerHighlight() {
        const player1Element = document.getElementById('player1');
        const player2Element = document.getElementById('player2');

        if (currentPlayer === players[0]) {
          player1Element.classList.add('current-player');
          player2Element.classList.remove('current-player');
        } else {
          player1Element.classList.remove('current-player');
          player2Element.classList.add('current-player');
        }
      }

      updateCurrentPlayerHighlight(); // Chame essa função após a definição de currentPlayer e players.

    }

    players.forEach(player => {
      const scoreElement = document.getElementById(`score-${player.id}`);
      scoreElement.textContent = `Pontos: ${player.score}`;
    });

    const totalCartas = document.querySelectorAll('.memory-card').length;
    const cartasViradas = document.querySelectorAll('.flip').length;


    //Mostrar mensagem de vitória e esconder seção das cartas.
    if (cartasViradas === totalCartas) {
      const mensagemVitoria = document.getElementById('victory-msg');
      mensagemVitoria.textContent = `Parabéns ${currentPlayer.name} você venceu com ${currentPlayer.score} pontos!!`;

      cards.forEach(card => {
        card.classList.add('hidden');
        const section = document.querySelector('section');
        section.classList.add('hidden');
      });
    };

  }
}

const players = [
  { id: 1, name: '', score: 0 },
  { id: 2, name: '', score: 0 }
];
let currentPlayer = players[0];

const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');

player1Input.addEventListener('input', function () {
  players[0].name = player1Input.value;
});

player2Input.addEventListener('input', function () {
  players[1].name = player2Input.value;
});

function getNextPlayer() {
  return currentPlayer === players[0] ? players[1] : players[0];
}

const cards = document.querySelectorAll('.memory-card');
cards.forEach(card => {
  const framework = card.getAttribute('data-framework');
  const animal = card.querySelector('.front-face').alt;
  new CartaAnimais(card, framework, false, animal);
});

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * cards.length);
    card.style.order = randomPos;
  });
})();