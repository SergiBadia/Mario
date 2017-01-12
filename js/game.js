var game = new Phaser.Game(900, 240, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	
	//Cargamos todas las imagenes que necesitaremos
    game.load.tilemap('fondo', 'mapa.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'Imagenes/super_mario.png');
	game.load.image('corazon', 'Imagenes/corazon.png');
    game.load.spritesheet('mario', 'Imagenes/mario2.png', 30, 33);
    game.load.spritesheet('fish', 'Imagenes/fish.png', 28.5, 23);
    game.load.spritesheet('gelfish', 'Imagenes/gelfish.png', 28.5, 25);
	game.load.spritesheet('pajaru', 'Imagenes/pajaros.png', 97, 120);
    game.load.spritesheet('princesa', 'Imagenes/princesa.png', 24, 32);
    game.load.spritesheet('rana', 'Imagenes/rana.png', 31.25, 33.33);
    game.load.spritesheet('seta', 'Imagenes/seta.png', 28, 21);
    game.load.spritesheet('star', 'Imagenes/star.png', 28.5, 25);
    game.load.spritesheet('tortuga', 'Imagenes/tortuga.png', 29.9, 29);
    game.load.spritesheet('tortuga_roja', 'Imagenes/tortuga_roja.png', 41.25, 30);
	game.load.spritesheet('money', 'Imagenes/monedas.png', 128, 128);
	game.load.spritesheet('misil', 'Imagenes/enemigos.png', 51.090, 58);
	game.load.spritesheet('planta', 'Imagenes/enemigos2.png', 29.06, 27);
	game.load.image('gameover', 'imagenes/gameover.png');
	game.load.image('end', 'imagenes/victoria.png');
	//Cargamos audios
	game.load.audio('moneda','audio/Moneda.mp3');
	game.load.audio('salto','audio/MW_Jump2.wav');
	game.load.audio('musicafondo','audio/Mariofondo.mp3');
	game.load.audio('gameover','audio/gameover.mp3');
	game.load.audio('victoria','audio/victoria.mp3');
	
	//Cargamos texto
	game.load.bitmapFont('desyrel', 'Imagenes/desyrel.png', 'desyrel.xml'); 
}

var player; //Mario
var cursors; //Teclas
var map; //Tilemap
var layer; //Mapa 
var pos; //Posicion actual de Mario
var sonidomoneda;
var bmpText; //Texto
var bmpText2;
var vidas = 3; //Vidas de mario
var setiña; //Enemigo seta
var invencible = false; //Determina si Mario es invencible o no
var locura = false; //Para el enemigo tortuga2
var puntuacion = 0; //Puntuacion del nivel
var segundos = 100; //Tiempo para el cronometro para superar el nivel

function create() {
	
	
    // Habilitamos la fisica ARCADE
    game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.startSystem(Phaser.Physics.NINJA);
	
	//Reescalamos el mapa al tamaño de la ventana de juego
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    Phaser.Canvas.setImageRenderingCrisp(game.canvas);
	
	//Añadimos Tilemap
    map = game.add.tilemap('fondo');
	map.addTilesetImage('SuperMarioBros-World1-1','tiles');
	
	//Indicamos que tiles del Tilemap seran solidos.
	map.setCollision(40);
	map.setCollisionBetween(14,16);
	map.setCollisionBetween(20,25);
	map.setCollisionBetween(27,29);

    layer = map.createLayer('World1');
	layer.resizeWorld();
	layer.wrap = true;
	
	
	//Añadimos textos en pantalla
	bmpText = game.add.bitmapText(10, 10, 'desyrel', 'Score : ' + puntuacion, 40);
	bmpText.fixedToCamera = true;
	
	bmpText2 = game.add.bitmapText(700, 10, 'desyrel', 'Lifes: ', 40);
	bmpText2.fixedToCamera = true;
	
	bmpText6 = game.add.bitmapText(300, 10, 'desyrel', 'Tiempo restante: ', 30);
	bmpText6.fixedToCamera = true;
	
	bmpText7 = game.add.bitmapText(540, 10, 'desyrel',''+game.time.events.duration, 30);
	bmpText7.fixedToCamera = true;
	
	
	
	//Audios
	sonidomoneda = game.add.audio('moneda');
	sonidosalto = game.add.audio('salto');
	musicaf = game.add.audio('musicafondo');
	musicaf.play();
	
	
	
	//Ponemos las vidas
	corazon1 = game.add.image(800,24,'corazon');
	corazon1.scale.setTo(0.15,0.15);
	corazon1.fixedToCamera = true;
	
	corazon2 = game.add.image(830,24,'corazon');
	corazon2.scale.setTo(0.15,0.15);
	corazon2.fixedToCamera = true;
	
	corazon3 = game.add.image(860,24,'corazon');
	corazon3.scale.setTo(0.15,0.15);
	corazon3.fixedToCamera = true;
	
		
    //Añadimos objetos
    player = game.add.sprite(20, 20, 'mario');
	tortuga = game.add.sprite(60,150,'tortuga_roja');
	tortuga2 = game.add.sprite(836,150,'tortuga');
	
	planta = game.add.sprite(2305,150,'planta',28);
	planta.scale.setTo(1.5,1.5);
	
	princess = game.add.sprite(3260,0,'princesa');
	
	monedas = game.add.group();
	monedas.enableBody = true;
	
	pajaros = game.add.group();
	pajaros.enableBody = true;
	
	peces = game.add.group();
	peces.enableBody = true;
	
	miniplantas = game.add.group();
	miniplantas.enableBody = true;
	
	cohetes = game.add.group();
	cohetes.enableBody = true;
	
	estrella = game.add.sprite(Math.random()*3000,0,'star'); //Ponemos una estrella que te vuelve invencible en un punto aleatorio
	
	setas = game.add.group();
	setas.enableBody = true;
	
	//Creamos las monedas del nivel
	for(var i=0;i<15;i++){
		var moneda = monedas.create(350 + 200*i, 0,'money');
		
		moneda.body.gravity.y = 300;
		moneda.body.bounce.y = 0.2;
		moneda.scale.setTo(0.25,0.25);
	}
	
	//Creamos 2 enemigos pajaros para el nivel
	for(var i=0;i<2;i++){
		
		var pajaro = pajaros.create(1050 + 147*i, 0+150*i,'pajaru');
		pajaro.body.velocity.y = 100;
		
		pajaro.scale.setTo(0.25,0.25);
		
	}
	
	//Habilitamos la fisica a los objetos
	
	game.physics.arcade.enable(player);
	game.physics.arcade.enable(tortuga);
	game.physics.arcade.enable(princess);
	game.physics.arcade.enable(estrella);
	game.physics.arcade.enable(estrella);
	game.physics.arcade.enable(tortuga2);
	game.physics.arcade.enable(pajaros);
	game.physics.arcade.enable(planta);

	player.anchor.setTo(0.5, 0.5);
	
	//Hacemos que la camara siga a Mario
    game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);

    //Hacemos que los objetos tengan gravedad.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
	
	tortuga.body.bounce.y = 0.2;
    tortuga.body.gravity.y = 300;
    tortuga.body.collideWorldBounds = true;
	
	tortuga2.body.bounce.y = 0.2;
	tortuga2.body.gravity.y = 300;
	tortuga2.body.collideWorldBounds = true;
	
	princess.body.gravity.y = 300;
	estrella.body.gravity.y = 300;
	
	planta.body.gravity.y = 300;

    // Creamos animaciones para los objetos
    player.animations.add('right', [7,6,5,4], 10, true);
    player.animations.add('left', [3,2,1,0], 10, true);
	
	tortuga.animations.add('right', [4,5,6,7], 10, true);
    tortuga.animations.add('left', [0,1,2,3], 10, true);
	
	tortuga2.animations.add('right', [4,5,6,7], 10, true);
	tortuga2.animations.add('left', [0,1,2,3], 10, true);
	tortuga2.animations.add('revote', [8,9], 10, true);
	
	estrella.animations.add('stand', [0,1,2,3], 10, true);
	estrella.animations.play('stand');
	
	planta.animations.add('cerrada', [28], 10, true);
	planta.animations.add('abierta', [29], 10, true);
	planta.animations.play('abierta');
	
	
	
	monedas.callAll('animations.add','animations','stand',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],10, true);
	
	pajaros.callAll('animations.add','animations','arriba',[0,1,2,3],10, true);
	pajaros.callAll('animations.add','animations','abajo',[4,5,6,7],10, true);
	
	tortuga.animations.play('right');
	tortuga.body.velocity.x = 20;
	
	tortuga2.animations.play('right');
	tortuga2.body.velocity.x = 30;
	
	// Creamos los controles
    cursors = game.input.keyboard.createCursorKeys();
	
	//Funciones que se ejecutan cada cierto tiempo
	
	setInterval(movimientoseta, 2000);	//Llamamos a la funcion que controla el movimiento de las setas cada 2 segundos
	setInterval(crearcohete, 3000); // Creamos un cohete cada 3 segundos
	setInterval(cambioanimacionplanta, aleatorio(2,4)*1000); //Cambiamos la animacion de la planta de abierta a cerrada o viceversa
	setInterval(crearminiplanta, 750); //Creamos miniplantas cada 750 ms
	setInterval(crearpeces, 2500); //Creamos peces cada 2,5 s
	
	game.time.events.loop(Phaser.Timer.SECOND * 1, cronometro);  //Funcion para la cuenta atras
	
	
	
}



function update() {
	
	
	
	//Habilitamos la colision entre objetos y el mapa
	game.physics.arcade.collide(player, layer);
	game.physics.arcade.collide(tortuga, layer);
	game.physics.arcade.collide(monedas, layer);
	game.physics.arcade.collide(setas, layer);
	game.physics.arcade.collide(princess, layer);
	game.physics.arcade.collide(estrella, layer);
	game.physics.arcade.collide(tortuga2, layer);
	game.physics.arcade.collide(cohetes, layer);
	game.physics.arcade.collide(planta, layer);
	game.physics.arcade.collide(planta, player);
	
	//Ponemos el timer en pantalla
	
	bmpText7.text = segundos;
	
	//Configuramos que pasa cuando 2 objetos se sobreponen 
	game.physics.arcade.overlap(player, tortuga, muertetortuga, null, this);
	game.physics.arcade.overlap(player, monedas, collectMoney, null, this);
	game.physics.arcade.overlap(player, setas, muertesetas, null, this);
	game.physics.arcade.overlap(player, estrella, collectEstrella, null, this);
	game.physics.arcade.overlap(player, tortuga2, muertetortuga2, null, this);
	game.physics.arcade.overlap(player, pajaros, muertepajaros, null, this);
	game.physics.arcade.overlap(player, cohetes, muertecohete, null, this);
	game.physics.arcade.overlap(player, miniplantas, muerteminiplantas, null, this);
	game.physics.arcade.overlap(player, peces, muertepez, null, this);

    player.body.velocity.x = 0; //Si no se toca ningun boton, Mario estará quieto
	
	pos = map.getTileWorldXY(player.x,player.y + 20); //Sprite actual sobre el que esta apoyado mario
	caja = map.getTileWorldXY(player.x,player.y - 20); //Sprite actual encima de mario
	monedas.callAll('play',null,'stand'); //Ejecutamos animacion de las monedas
	
	bmpText.text = 'Score :' + puntuacion; //Texto para la puntuacion
	
	//Colisión con las cajas sorpresa
	if(caja.index==14){
		
		//Suistutimos la caja con interrogación por otra
		var posx = caja.x;
		var posy = caja.y;
		map.putTile(15,	posx,posy);
		
		
		//Creamos un objeto aleatorio encima (una moneda o un enemigo)
		
		var numero = aleatorio(1,10);
		
		if(numero == 1 || numero == 2 || numero == 3 || numero == 4 || numero == 5){
			var moneda = monedas.create(player.x - 20, player.y - 70,'money');
			moneda.body.gravity.y = 300;
			moneda.body.bounce.y = 0.2;
			moneda.scale.setTo(0.25,0.25);
			monedas.callAll('animations.add','animations','stand',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],10, true);
			monedas.callAll('play',null,'stand');
		}else{
		
		crearseta();
		} 
		
	}
	
	//Caida al vacio
	
	if(game.height - player.y < 20){
		
		player.kill();
		createPlayer();
		restavida();
		bmpText.text = 'Score :' + puntuacion;
	}
		
	//Controles
    if(invencible == false){
	
		if (cursors.left.isDown)
		{
			//  Move to the left
			player.body.velocity.x = -150;

			player.animations.play('left');
		}
		else if (cursors.right.isDown)
		{
			//  Move to the right
			player.body.velocity.x = 150;

			player.animations.play('right');
		}
		else
		{
			//  Stand still
			player.animations.stop();

			player.frame = 4;
		}
	}else if(invencible == true){
		
		
		
		if (cursors.left.isDown)
		{
			//  Move to the left
			player.body.velocity.x = -230;

			player.animations.play('left');
		}
		else if (cursors.right.isDown)
		{
			//  Move to the right
			player.body.velocity.x = 230;

			player.animations.play('right');
		}
		else
		{
			//  Stand still
			player.animations.stop();

			player.frame = 4;
		}
	}
    
	//Salto de Mario
	
    if (cursors.up.isDown && (pos.index == 40 || pos.index == 14 || pos.index == 15 || pos.index == 16 ||
	pos.index == 20 || pos.index == 21 || pos.index == 22 || pos.index == 23 || pos.index == 24 || pos.index == 25 ||
	pos.index == 27 || pos.index == 28 || pos.index == 29))  //Si la tecla up esta apretada y si Mario está apoyado sobre algun sprite indicado por su indice
    {
		player.body.velocity.y = -200;
		sonidosalto.play();
    }
	
	
	//Movimiento Tortuga
	if(tortuga.x < 60 || tortuga.body.velocity < 0){
		tortuga.animations.play('right');
		tortuga.body.velocity.x = 20;
		
	}
	
	if(tortuga.x > 200 || tortuga.body.velocity > 0){
		tortuga.animations.play('left');
		tortuga.body.velocity.x = -20;
		
	}
	
	
	
	//Cargamos los movimientos de la tortuga 2	
	if(locura==false){
		
		movimientotortuga2();
	}
	
	if(locura == true){
		
		movtortuga2();
		
	}
	
	//Cargamos los movimientos de los pajaros
	movimientopajaros();
	
	//Eliminamos enemigos que salen fuera de pantalla
	eliminarcohete();
	eliminarminiplanta();
	eliminarpez();
	
	//Ganas al llegar al final del nivel
	
	if(player.x > 3153) {
		
		player.kill();
		Victoria();
		
	}
}

	//Funcion para crear una seta nueva
function crearseta(){
	var setiña = setas.create(player.x - 10, player.y - 70,'seta');
	setiña.body.gravity.y = 300;
	setiña.body.bounce.y = 0.2;
	setiña.body.velocity.x = 35;
	setas.callAll('animations.add','animations','camina',[0,1],10, true);
	setas.callAll('animations.add','animations','chafado',[2],10, true);
		
	setas.forEachAlive(function(item){
		item.animations.play('camina');
	},this);
}

//Crear miniplanta
function crearminiplanta(){
	
	if(planta.animations.currentAnim.name == 'abierta'){
		mini = miniplantas.create(2320,150,'planta',29);
		mini.scale.setTo(0.75,0.75);
		mini.body.velocity.y = -130;
		miniplantas.callAll('animations.add','animations','abierta',[29],10, true);
		miniplantas.callAll('play',null,'abierta');
	}else{
		return;
	}
}

//Eliminar una miniplanta

function eliminarminiplanta(){
	
	miniplantas.forEach(function(item){
		if(item.y < 5){
			
			item.kill();
			
		}
	},this);
}

//Permite cambiar la animacion de la planta grande

function cambioanimacionplanta(){
	
	if(planta.animations.currentAnim.name == 'abierta'){
		planta.animations.play('cerrada');
		
	}else{
		
		planta.animations.play('abierta');
	}
	
}

//Muerte debido a las miniplantas
function muerteminiplantas(player,miniplantas){
	
	if(invencible == false){
		
		player.kill();
		restavida();
		puntuacion = 0;
		
		if(vidas != -1){
			createPlayer();
		}
		}else{
		
		return;
	}
	
	
}

//Crea un cohete
function crearcohete(){
	
	var cohete = cohetes.create(2108, 180,'misil');
		
	cohete.scale.setTo(0.6,0.6);
	cohete.body.velocity.x = -60;
	cohetes.callAll('animations.add','animations','vuela',[0,1,2],10, true);
	cohetes.callAll('play',null,'vuela');
	
}

//Elimina un cohete
function eliminarcohete(){
	
	cohetes.forEach(function(item){
		if(item.x < 1444){
			
			item.kill();
			
		}
	},this);
	
	
}

//Muerte debido a un cohete

function muertecohete(player,cohete){
	
	if(invencible == false){
		
		//Si caemos por encima muere el enemigo. Sino muere Mario.	
		if(cohete.y - player.y > 16){
					
			cohete.kill();
			puntuacion++;
			player.body.velocity.y = -200;
					
		}else{
				
			cohete.kill();
			restavida();
			puntuacion = 0;
			bmpText.text = 'Score :' + puntuacion;
			createPlayer();
		}
	}else{
				
		cohete.kill();
		puntuacion++;
	}
		
}

//Crea los peces del nivel
function crearpeces(){
	
		var pez = peces.create(2780, 250,'fish');
		pez.body.gravity.y = 300;
		pez.body.velocity.y = -350;
		
		var pez2 = peces.create(2810, 540,'fish');
		pez2.body.gravity.y = 300;
		pez2.body.velocity.y = -550;
		
		
		
		peces.callAll('animations.add','animations','salta',[0,1],10, true);
		peces.callAll('play',null,'salta');
			
}

//Elimina un pez
function eliminarpez(){
	
	peces.forEach(function(item){
		if(item.y > 550){
			
			item.kill();
			
		}
	},this);
	
	
}

//Muerte por los peces
function muertepez(player,peces){
	
	if(invencible == false){
		
		player.kill();
		restavida();
		puntuacion = 0;
		
		if(vidas != -1){
			createPlayer();
		}
		}else{
		
		return;
	}
		
}

//Controla el movimiento de los pajaros
function movimientopajaros(){
	
	pajaros.forEachAlive(function(item) {
		
		if (item.y < 10 || item.body.velocity < 0) {
			item.animations.play('abajo');
			item.body.velocity.y = 100;

		}

		if (item.y > 185 || item.body.velocity > 0) {
			item.animations.play('arriba');
			item.body.velocity.y = -100;
		}
	}, this);
	
}
	
	
	
//Controla el movimiento de las setas .Las setas se mueven de derecha a izquierda
function movimientoseta(){
		
	setas.forEachAlive(function(item) {
		
		if(item.body.velocity.x >= 0){
			item.body.velocity.x = -35;
			return;
		} 
			
		if(item.body.velocity.x <= 0){
			item.body.velocity.x = 35;
			return;
		}
	}, this);
	
}

//Controla el movimiento de la segunda tortuga
function movimientotortuga2() {

		if (tortuga2.x < 785 || tortuga2.body.velocity < 0) {
			tortuga2.animations.play('right');
			tortuga2.body.velocity.x = 90;

		}

		if (tortuga2.x > 879 || tortuga2.body.velocity > 0) {
			tortuga2.animations.play('left');
			tortuga2.body.velocity.x = -90;
		}
	}

//Controla el movimiento de la segunda tortuga cuando se vuelve loca	
	function movtortuga2(){
		
		locura = true;
		if (tortuga2.x < 785 || tortuga2.body.velocity < 0) {
			tortuga2.animations.play('revote');
			tortuga2.body.velocity.x = 200;

		}

		if (tortuga2.x > 879 || tortuga2.body.velocity > 0) {
			tortuga2.animations.play('revote');
			tortuga2.body.velocity.x = -200;
		}
	}
	
	//Devuelve un numero aleatorio para conseguir la aleatoriedad de las cajas sorpresa
function aleatorio(inferior,superior){ 
     var numPosibilidades = superior - inferior 
     var aleat = Math.random() * numPosibilidades 
     aleat = Math.round(aleat) 
     return parseInt(inferior) + aleat 
} 

 //Muerte debido a la tortuga
function muertetortuga(player,tortuga){
	
		
	if(invencible == false){
		
		//Si caemos por encima muere el enemigo. Sino muere Mario.	
		if(tortuga.y - player.y > 16){
			
			tortuga.kill();
			puntuacion++;
			player.body.velocity.y = -200;
			
		}else{
		
		player.kill();
		restavida();
		puntuacion = 0;
		bmpText.text = 'Score :' + puntuacion;
		if(vidas != -1){
			createPlayer();
		}
		}
	}else{
		
		tortuga.kill();
		puntuacion++;
	}
		
}

//Muerte debido a la segunda tortuga
function muertetortuga2(player,tortuga2){
	
	if(locura==false){
		if(invencible == false){
			
				
			if(tortuga2.y - player.y > 16){
				
				movtortuga2();
				player.body.velocity.y = -200;
				
			}else{
			
			player.kill();
			restavida();
			puntuacion = 0;
			bmpText.text = 'Score :' + puntuacion;
			if(vidas != -1){
			createPlayer();
			}
			}
		}else{
			
			movtortuga2();
		}

	}else{
		if(invencible == false){
			
			//Si caemos por encima muere el enemigo. Sino muere Mario.	
			if(tortuga2.y - player.y > 16){
				
				tortuga2.kill();
				puntuacion++;
				player.body.velocity.y = -200;
				
			}else{
			
			player.kill();
			restavida();
			puntuacion = 0;
			bmpText.text = 'Score :' + puntuacion;
			if(vidas != -1){
			createPlayer();
			}
			}
		}else{
			
			tortuga2.kill();
			puntuacion++;
		}
	}	
}

//Muerte de las setas
function muertesetas(player,seta){
	
	if(invencible == false){
		//Si la seta ya esta chafada no nos hara nada
		if(seta.alive == false){
			return;
		}	
		
		//Si caemos por encima mataremos a la seta y la animacion cambiara a chafado
		if(seta.y - player.y > 15){
			
			
			seta.alive = false;
			player.body.velocity.y = -200;
			setas.forEachDead(function(item) {
			
				item.animations.play('chafado');
				setTimeout(function(){
					item.kill();
					puntuacion++;
				},3000);
				
			}, this);
			
		//Si no morira Mario
		}else{
		
		player.kill();
		restavida();
		puntuacion = 0;
		bmpText.text = 'Score :' + puntuacion;
		if(vidas != -1){
			createPlayer();
		}
		}
	}else{
		
		seta.kill();
		puntuacion++;
	}
		
}

//Muerte de los pajaros
function muertepajaros(player,pajaro){
	
	if(invencible == false){
		
		player.kill();
		restavida();
		puntuacion = 0;
		
		if(vidas != -1){
			createPlayer();
		}
		}else{
		
		return;
	}
}


	
	//Funcion para crear a Mario
function createPlayer(){
	if(vidas != -1){
		player = game.add.sprite(32, 150, 'mario');
		game.physics.arcade.enable(player);
		player.anchor.setTo(0.5, 0.5);
		game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);
		player.body.bounce.y = 0.2;
		player.body.gravity.y = 300;
		player.body.collideWorldBounds = true;
		player.animations.add('right', [4,5,6,7], 10, true);
		player.animations.add('left', [3,2,1,0], 10, true);
	}else{
		return;
	}
}

//Funcion para coger monedas
function collectMoney(player,moneda){
	
	
	moneda.kill();
	sonidomoneda.play();
	puntuacion++;
	
	
}

//Al coger una estrella te vuelves invencible durante 10 segundos
function collectEstrella(player,estrella){
	
	estrella.kill();
	bmpText5 = game.add.bitmapText(10, 50, 'desyrel', '', 30);
	bmpText5.fixedToCamera = true;
	cambioinvencibilidad();
	bmpText5.text = 'Invencible';
	game.time.events.add(Phaser.Timer.SECOND * 10, cambioinvencibilidad, this);
		
}

//Cambio Valor de invencible
function cambioinvencibilidad(){
	
	if(invencible == true){
		invencible = false;
		bmpText5.text = '';
	}else{
		
		invencible = true;
		
		
	}
	
}


//Elimina corazones a medida que pierdes vidas
	function restavida(){
		
		if(vidas == 3){
			corazon3.kill();
			vidas--;
			return;
		}
		
		if(vidas == 2){
			corazon2.kill();
			vidas--;
			return;
		}
		
		if(vidas == 1){
			corazon1.kill();
			vidas--;
			return;
		}
		
		if(vidas == 0){
		
			vidas--;
			GameOver();
			
		}
	}
	
	//Funcion para acabar la partida
	function GameOver(){
		
		player.kill();
		game.world.removeAll();
		musicaf.stop();
		musicafinal = game.add.audio('gameover');
		musicafinal.play();
		
		background = game.add.tileSprite(0, 0, 3500, game.height, 'gameover');
		background.autoScroll(-20, -20);
		
		
		bmpText3 = game.add.bitmapText(300, 70, 'desyrel', 'Score : ' + puntuacion, 40);
		bmpText3.fixedToCamera = true;
	
		bmpText4 = game.add.bitmapText(300, 120, 'desyrel', 'Fin de Partida', 40);
		bmpText4.fixedToCamera = true;
		
		bmpText8 = game.add.bitmapText(790,180, 'desyrel','Made by:\nSergi & Isa', 20);
		bmpText8.fixedToCamera = true;
		
		
	}
	
	//Funcion para usar cuando se gana la partida llegando al final del nivel
	function Victoria(){
		
		player.destroy();
		game.world.removeAll();
		musicaf.stop();
		
		musicavictoria = game.add.audio('victoria');
		musicavictoria.play();
		
		background = game.add.image(0,0,'end');
		background.scale.setTo(1,0.30);
		background.fixedToCamera = true;
		
		bmpText3 = game.add.bitmapText(300, 70, 'desyrel', 'Score : ' + puntuacion, 40);
		bmpText3.fixedToCamera = true;
	
		bmpText4 = game.add.bitmapText(300, 120, 'desyrel', 'Lo has conseguido!!!', 40);
		bmpText4.fixedToCamera = true;
		
		bmpText8 = game.add.bitmapText(790,180, 'desyrel','Made by:\nSergi & Isa', 20);
		bmpText8.fixedToCamera = true;
		
		
		
	}
	
	//Controla el tiempo
	function cronometro(){
		
		segundos--;
		
		if(segundos == -1){
			
			GameOver(puntuacion);
			
		}
	
	}
	
