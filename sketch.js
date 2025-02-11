// ====================== Imagens ======================
function preload() {
  fundo = loadImage("assets/fundo.png");
  titulo = loadImage("assets/titulo.png");
  instrucoesImg = loadImage("assets/instrucoes.png");
  instrucoes2Img = loadImage("assets/instrucoes2.png");
  gameOverImg = loadImage("assets/gameOver.png");
  winImg = loadImage("assets/win.png");

  tartarugaEsq = loadImage("assets/tartarugaSprites/tartarugaEsq.png");
  tartarugaDir = loadImage("assets/tartarugaSprites/tartarugaDir.png");
  tartarugaCima = loadImage("assets/tartarugaSprites/tartarugaCima.png");
  tartarugaTiro = loadImage("assets/tartarugaSprites/tartarugaTiro.png");
  tartarugaTiroCol = loadImage("assets/tartarugaSprites/tartarugaTiroCol.png");

  coral = loadImage("assets/coral.png");
  tubarao1 = loadImage("assets/tubaraoSprites/tubarao1.png");
  tubarao2 = loadImage("assets/tubaraoSprites/tubarao2.png");
  tubarao3 = loadImage("assets/tubaraoSprites/tubarao3.png");
  tubaraoTiroImg = loadImage("assets/tubaraoSprites/tubaraoTiro.png");

  orca1 = loadImage("assets/orcaSprites/orca1.png");
  orca2 = loadImage("assets/orcaSprites/orca2.png");
  orca3 = loadImage("assets/orcaSprites/orca3.png");
  orcaTiroImg = loadImage("assets/orcaSprites/orcaTiro.png");

  lula1 = loadImage("assets/lulaSprites/lula1.png");
  lula2 = loadImage("assets/lulaSprites/lula2.png");
  lula3 = loadImage("assets/lulaSprites/lula3.png");
  lulaTiroImg = loadImage("assets/lulaSprites/lulaTiro.png");

  somFundo = loadSound("assets/sounds/Slugwood Shores - Pedro Silva.mp3");
  somMorreuTartaruga = loadSound("assets/sounds/somMorreuTartaruga.mp3");
  somMorreuInimigo = loadSound("assets/sounds/somMorreuInimigo.mp3");
  somPerdeu = loadSound("assets/sounds/somPerdeu.mp3");
  somGanhou = loadSound("assets/sounds/somGanhou.mp3");
}

// ====================== Configurações menu ======================
let estados = {
  menuOn: true,
  jogandoOn: false,
  instrucoesOn: false,
  instrucoes2On: false,
  gameOverOn: false,
  winOn: false,
};

// ====================== Variáveis globais ======================
let tartaruga;
let tiroPlayer;
let player;
let barreiras = [];
let tubaroes = [];
let orcas = [];
let lulas = [];
let inimigos = [];
let direcaoInimigos = 1;
let velInimigos = 0.5;
let tirosInimigosArr = [];
let somMorrer;

// ====================== Classes ======================
class Tartaruga {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vel = 2;
  }
}

class Tiro {
  constructor(pers, x, y, vel) {
    this.pers = pers;
    this.x = x;
    this.y = y;
    this.vel = vel;
    this.colidiu = false;
  }
}

class Player {
  constructor(tiro) {
    this.estaAtirando = false;
    this.tiro = tiro;
  }

  atirar() {
    this.tiro.y += this.tiro.vel;
    if (this.tiro.colidiu) {
      image(tartarugaTiroCol, this.tiro.x - 15, this.tiro.y - 15);
    } else {
      image(tartarugaTiro, this.tiro.x, this.tiro.y);
    }

    // Colisões barreiras e teto
    for (let i = 0; i < barreiras.length; i++) {
      if (
        this.tiro.y < 10 ||
        (this.tiro.y <= barreiras[i].y + barreiras[i].w &&
          this.tiro.x >= barreiras[i].x &&
          this.tiro.x <= barreiras[i].x + barreiras[i].w)
      ) {
        this.tiro.colidiu = true;
        this.estaAtirando = false;
        this.tiro.y = tartaruga.y - 20;
        this.tiro.x = tartaruga.x + 32;

        return this;
      } else {
        this.tiro.colidiu = false;
      }
    }
  }

  mover() {
    if (keyIsDown(37) && tartaruga.x > -10) {
      image(tartarugaEsq, tartaruga.x, tartaruga.y);
      tartaruga.x -= tartaruga.vel;
    } else if (keyIsDown(39) && tartaruga.x < 340) {
      image(tartarugaDir, tartaruga.x, tartaruga.y);
      tartaruga.x += tartaruga.vel;
    } else if (keyIsDown(32) && !player.estaAtirando) {
      image(tartarugaCima, tartaruga.x, tartaruga.y, 70, 45);
      this.estaAtirando = true;
      this.tiro.y = tartaruga.y - 20;
      this.tiro.x = tartaruga.x + 32;
    } else {
      image(tartarugaCima, tartaruga.x, tartaruga.y, 70, 45);
    }
  }
}

class Inimigo {
  constructor(tipo, x, y) {
    this.tipo = tipo;
    this.x = x;
    this.y = y;
    this.spritesLista = {
      tubarao: [tubarao1, tubarao2, tubarao3],
      lula: [lula1, lula2, lula3],
      orca: [orca1, orca2, orca3],
    };
    this.spriteAtual = 1;
    this.sprites = this.spritesLista[this.tipo];

    switch (tipo) {
      case "tubarao":
        this.w = 64;
        this.h = 58;
        break;
      case "orca":
        this.w = 64;
        this.h = 64;
        break;
      case "lula":
        this.w = 58;
        this.h = 60;
        break;
    }
  }

  MEF() {
    if (frameCount % 10 === 0 && this.spriteAtual === 1) {
      this.spriteAtual = 2;
    } else if (frameCount % 20 === 0 && this.spriteAtual === 2) {
      this.spriteAtual = 3;
    } else if (frameCount % 30 === 0 && this.spriteAtual === 3) {
      this.spriteAtual = 1;
    }
  }

  exibir() {
    image(this.sprites[this.spriteAtual - 1], this.x, this.y);
    this.MEF();
  }

  mover() {
    this.x += velInimigos * direcaoInimigos;
  }

  descer() {
    if (this.y < height - 60) {
      this.y += 10;
    }
    if (this.y == tartaruga.y) {
      gameOver();
    }
  }

  recebeuTiro() {
    if (
      tiroPlayer.x > this.x - 5 &&
      tiroPlayer.x < this.x + this.w - 5 &&
      tiroPlayer.y < this.y + this.h
    ) {
      player.estaAtirando = false;
      tiroPlayer.y = tartaruga.y - 20;
      tiroPlayer.x = tartaruga.x + 32;
      return this;
    }
  }

  atirar() {
    let novoTiro = new Tiro(this.tipo, this.x + this.w / 2, this.y + this.h, 3);
    tirosInimigosArr.push(novoTiro);
  }
}

class Barreira {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 66;
  }

  exibir() {
    image(coral, this.x, this.y);
  }
}

// ====================== Funções Jogo ======================
function iniciarPlayer() {
  tartaruga = new Tartaruga(width / 2 - 30, height - 60);
  tiroPlayer = new Tiro(tartaruga, tartaruga.x + 32, tartaruga.y - 20, -4);
  player = new Player(tiroPlayer);
}

function iniciarInimigos() {
  tubaroes = gerarLinhaInimigos("tubarao", 50, 5, 4, 73);
  orcas = gerarLinhaInimigos("orca", 50, 60, 3, 110);
  lulas = gerarLinhaInimigos("lula", 50, 125, 5, 60);
  inimigos = [tubaroes, orcas, lulas];
}

function gerarLinhaBarreiras(x, y, qtd, espaco) {
  const linha = [];
  for (let i = 0; i < qtd; i++) {
    linha.push(new Barreira(x + i * espaco, y));
  }
  return linha;
}

function barreirasDisplay() {
  for (let barreira of barreiras) {
    barreira.exibir();
  }
}

function gerarLinhaInimigos(tipo, x, y, qtd, espaco) {
  const linha = [];
  for (let i = 0; i < qtd; i++) {
    linha.push(new Inimigo(tipo, x + i * espaco, y));
  }
  return linha;
}

function inimigoDisplay() {
  let atingiuBorda = false;
  for (let tipos of inimigos) {
    for (let inimigo of tipos) {
      // Inimigo move-se
      inimigo.mover();
      if (inimigo.x <= 0 || inimigo.x + inimigo.w >= width) {
        atingiuBorda = true;
      }

      // Inimigo aparece
      inimigo.exibir();

      // Inimigo morre
      if (inimigo.recebeuTiro()) {
        somMorreuInimigo.play();
        tipos.splice(tipos.indexOf(inimigo), 1);
        if (inimigos.every((tipo) => tipo.length === 0)) {
          somGanhou.play();
          estados.jogandoOn = false;
          estados.winOn = true;
        }
      }

      for (let barreira of barreiras) {
        if (
          inimigo.y + inimigo.h >= barreira.y &&
          inimigo.x + inimigo.w >= barreira.x &&
          inimigo.x <= barreira.x + barreira.w
        ) {
          somPerdeu.play();
          estados.jogandoOn = false;
          estados.gameOverOn = true;
          return;
        }
      }
    }
  }

  if (atingiuBorda) {
    direcaoInimigos *= -1;
    velInimigos += 0.1;
    for (let tipos of inimigos) {
      for (let inimigo of tipos) {
        inimigo.descer();
      }
    }
  }
}

function sortearAtirador() {
  for (let tipos of inimigos) {
    let atirador = tipos[Math.floor(Math.random() * tipos.length)];
    if (tipos.length !== 0) {
      atirador.atirar();
    }
  }
}

function tirosInimigosDisplay() {
  for (let i = tirosInimigosArr.length - 1; i >= 0; i--) {
    let tiroInimigo = tirosInimigosArr[i];
    tiroInimigo.y += tiroInimigo.vel;

    if (tiroInimigo.pers === "tubarao") {
      image(tubaraoTiroImg, tiroInimigo.x, tiroInimigo.y);
    } else if (tiroInimigo.pers === "orca") {
      image(orcaTiroImg, tiroInimigo.x, tiroInimigo.y);
    } else if (tiroInimigo.pers === "lula") {
      image(lulaTiroImg, tiroInimigo.x, tiroInimigo.y);
    }

    // Colisões com barreiras
    for (let j = 0; j < barreiras.length; j++) {
      if (
        tiroInimigo.y > height ||
        (tiroInimigo.y >= barreiras[j].y &&
          tiroInimigo.x >= barreiras[j].x &&
          tiroInimigo.x <= barreiras[j].x + barreiras[j].w)
      ) {
        tirosInimigosArr.splice(i, 1);
        return this;
      }
    }

    // Colisões com tartaruga
    if (
      tiroInimigo.y >= tartaruga.y &&
      tiroInimigo.x >= tartaruga.x &&
      tiroInimigo.x <= tartaruga.x + 58
    ) {
      somMorreuTartaruga.play();
      somPerdeu.play();
      tirosInimigosArr.splice(i, 1);
      estados.jogandoOn = false;
      estados.gameOverOn = true;
    }
  }
}

function tirosInimigosVel() {
  if (frameCount % 100 == 0) {
    sortearAtirador();
  }
}

// ====================== Funções Menu ======================
function menu() {
  image(titulo, 0, 30);
  fill(255);
  text("Por Ana Carolina Furtado", width / 2 - 55, height - 20);
}

function botoes() {
  canvasContainer = createDiv();
  canvasContainer.id("canvas-div");
  botaoContainer = createDiv();
  botaoContainer.id("botao-div");
  botaoJogar = createButton("JOGAR").parent(botaoContainer);
  botaoJogar.mousePressed(() => {
    botoesEsconder();
    estados.jogandoOn = true;
    estados.menuOn = false;
  });
  botaoInstrucoes = createButton("INSTRUÇÕES").parent(botaoContainer);
  botaoInstrucoes.mousePressed(() => {
    botoesEsconder();
    estados.instrucoesOn = true;
    estados.menuOn = false;
  });
  botaoContainer.parent(canvasContainer);
}

function botoesMostrar() {
  botaoJogar.show();
  botaoInstrucoes.show();
}

function botoesEsconder() {
  botaoJogar.hide();
  botaoInstrucoes.hide();
}

function instrucoes() {
  image(instrucoesImg, 0, 0);
  // Voltar pro menu
  if (
    mouseIsPressed &&
    mouseX > 17 &&
    mouseX < 63 &&
    mouseY > 15 &&
    mouseY < 50
  ) {
    estados.menuOn = true;
    estados.instrucoesOn = false;
    botoesMostrar();
  }
  if (
    mouseIsPressed &&
    mouseX > 332 &&
    mouseX < 460 &&
    mouseY > 445 &&
    mouseY < 472
  ) {
    estados.instrucoesOn = false;
    estados.instrucoes2On = true;
  }
}

function instrucoes2() {
  image(instrucoes2Img, 0, 0);
  if (
    mouseIsPressed &&
    mouseX > 17 &&
    mouseX < 63 &&
    mouseY > 15 &&
    mouseY < 50
  ) {
    estados.instrucoes2On = false;
    estados.instrucoesOn = true;
  }
}

function reiniciarJogo() {
  somPerdeu.stop();
  somGanhou.stop();
  estados.gameOverOn = false;
  estados.jogandoOn = false;
  estados.menuOn = true;
  botoesMostrar();
  iniciarPlayer();
  iniciarInimigos();
  tirosInimigosArr = [];
  sortearAtirador();
  barreiras = gerarLinhaBarreiras(10, height - 160, 4, 105);
  velInimigos = 0.5;
}

function gameOver() {
  image(gameOverImg, 0, 0);
}

function win() {
  image(winImg, 0, 0);
}

function keyPressed() {
  if (keyCode === 82) {
    reiniciarJogo();
  }
}

// ====================== Funções Default ======================
function setup() {
  somFundo.loop();
  botoes();
  createCanvas(400, 500).parent(canvasContainer);
  botaoContainer.position(width / 3, height / 2);

  iniciarPlayer();
  iniciarInimigos();
  barreiras = gerarLinhaBarreiras(10, height - 160, 4, 105);
}

function draw() {
  background(fundo);
  if (estados.menuOn) {
    menu();
  } else if (estados.instrucoesOn) {
    instrucoes();
  } else if (estados.instrucoes2On) {
    instrucoes2();
  } else if (estados.jogandoOn) {
    player.mover();
    if (player.estaAtirando) {
      player.atirar();
    }

    barreirasDisplay();
    inimigoDisplay();
    tirosInimigosVel();
    tirosInimigosDisplay();
  } else if (estados.gameOverOn) {
    gameOver();
  } else if (estados.winOn) {
    win();
  }
}
