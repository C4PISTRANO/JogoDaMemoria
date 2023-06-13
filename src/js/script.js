// Classe base para representar uma carta
class Carta {
  constructor(element, valor, viradaParaCima) {
    this.element = element; // Elemento HTML da carta
    this.valor = valor; // Valor da carta (pode ser usado para verificar correspondência)
    this.viradaParaCima = viradaParaCima; // Indica se a carta está virada para cima
  }

  // Método para virar a carta
  virar() {
    if (this.viradaParaCima) {
      this.element.classList.remove('flip'); // Remove a classe 'flip' para esconder a face da carta
    } else {
      this.element.classList.add('flip'); // Adiciona a classe 'flip' para mostrar a face da carta
    }
    this.viradaParaCima = !this.viradaParaCima; // Altera o estado da carta (virada para cima ou para baixo)
  }
}

// Classe que representa uma carta de animais, estendendo a classe Carta
class CartaAnimais extends Carta {
  constructor(element, valor, viradaParaCima, animal) {
    super(element, valor, viradaParaCima);
    this.animal = animal; // Nome do animal associado à carta

    // Adiciona um evento de clique para virar a carta quando clicada
    this.element.addEventListener('click', this.flipCard.bind(this));
  }

  // Método chamado quando a carta é clicada
  flipCard() {
    if (CartaAnimais.lockBoard || this.viradaParaCima) return; // Se o tabuleiro está bloqueado ou a carta já está virada, não faz nada

    if (!CartaAnimais.hasFlippedCard) {
      // Se é a primeira carta virada
      this.virar(); // Vira a carta
      CartaAnimais.hasFlippedCard = true; // Define a primeira carta virada
      CartaAnimais.firstCard = this; // Armazena a referência da primeira carta
    } else {
      // Se é a segunda carta virada
      this.virar(); // Vira a carta
      CartaAnimais.secondCard = this; // Armazena a referência da segunda carta
      CartaAnimais.checkForMatch(); // Verifica se as duas cartas são iguais
    }
  }

  // Método estático para verificar se as duas cartas viradas são iguais
  static checkForMatch() {
    let isMatch = CartaAnimais.firstCard.valor === CartaAnimais.secondCard.valor; // Verifica se os valores das cartas são iguais

    if (isMatch) {
      // Se as cartas são iguais
      CartaAnimais.disableCards(); // Desabilita as cartas
      CartaAnimais.updateScore(true); // Atualiza a pontuação (acerto)
    } else {
      // Se as cartas são diferentes
      CartaAnimais.unflipCards(); // Desvira as cartas
      CartaAnimais.updateScore(false); // Atualiza a pontuação (erro)
    }
  }

  // Método estático para desabilitar as cartas viradas em caso de acerto
  static disableCards() {
    CartaAnimais.firstCard.element.removeEventListener('click', CartaAnimais.firstCard.flipCard); // Remove o evento de clique da primeira carta
    CartaAnimais.secondCard.element.removeEventListener('click', CartaAnimais.secondCard.flipCard); // Remove o evento de clique da segunda carta

    CartaAnimais.resetBoard(); // Reseta o estado do tabuleiro
  }

  // Método estático para desvirar as cartas viradas em caso de erro
  static unflipCards() {
    CartaAnimais.lockBoard = true; // Bloqueia o tabuleiro temporariamente

    setTimeout(() => {
      CartaAnimais.firstCard.virar(); // Desvira a primeira carta
      CartaAnimais.secondCard.virar(); // Desvira a segunda carta

      CartaAnimais.resetBoard(); // Reseta o estado do tabuleiro
    }, 1500); // Espera 1,5 segundos antes de desvirar as cartas
  }

  // Método estático para resetar o estado das variáveis de controle
  static resetBoard() {
    CartaAnimais.hasFlippedCard = false; // Reseta a primeira carta virada
    CartaAnimais.lockBoard = false; // Desbloqueia o tabuleiro
    CartaAnimais.firstCard = null; // Reseta a referência da primeira carta
    CartaAnimais.secondCard = null; // Reseta a referência da segunda carta
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

    
    //Mostrar mensagem de vitória e esconder seção das cartas.
    const totalCartas = document.querySelectorAll('.memory-card').length;
    const cartasViradas = document.querySelectorAll('.flip').length;

    if (cartasViradas === totalCartas) {
      const mensagemVitoria = document.getElementById('victory-msg');
      mensagemVitoria.textContent = `Parabéns ${currentPlayer.name} você venceu com ${currentPlayer.score} pontos!!`;
      
      //esconder as cartas.
      cards.forEach(card => {
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

//embaralhar as cartas.
(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * cards.length);
    card.style.order = randomPos;
  });
})();
