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

    isMatch ? CartaAnimais.disableCards() : CartaAnimais.unflipCards();
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