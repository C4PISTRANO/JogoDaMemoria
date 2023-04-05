// Classe pai
class Personagem {
    constructor(nome, tipo) {
      this.nome = nome;
      this.tipo = tipo;
    }
  
    atacar() {
      console.log(`${this.nome} está atacando!`);
    }
  }
  
  // Subclasse Guerreiro
  class Guerreiro extends Personagem {
    constructor(nome, tipo, arma) {
      super(nome, tipo);
      this.arma = arma;
    }
  
    atacar() {
      console.log(`${this.nome} está atacando com ${this.arma}!`);
    }
  }
  
  // Subclasse Mago
  class Mago extends Personagem {
    constructor(nome, tipo, magia) {
      super(nome, tipo);
      this.magia = magia;
    }
  
    atacar() {
      console.log(`${this.nome} está lançando ${this.magia}!`);
    }
  }
  
  // Criando uma instância do Guerreiro
  const guerreiro1 = new Guerreiro("Conan", "Guerreiro", "Espada");
  
  // Chamando o método atacar() do guerreiro
  guerreiro1.atacar(); // Saída: Conan está atacando com Espada!
  
  // Criando uma instância do Mago
  const mago1 = new Mago("Merlin", "Mago", "Bola de Fogo");
  
  // Chamando o método atacar() do mago
  mago1.atacar(); // Saída: Merlin está lançando Bola de Fogo!
  