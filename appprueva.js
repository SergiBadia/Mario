var game = new Phaser.Game(900, 480, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.tilemap('fondo', 'mapa.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'super_mario.png');
    game.load.spritesheet('mario', 'mario2.png', 30, 33);
    game.load.spritesheet('fish', 'fish.png', 31.25, 33.33);
    game.load.spritesheet('gelfish', 'gelfish.png', 31.25, 33.33);
    game.load.spritesheet('princesa', 'princesa.png', 31.25, 33.33);
    game.load.spritesheet('rana', 'rana.png', 31.25, 33.33);
    game.load.spritesheet('seta', 'seta.png', 31.25, 33.33);
    game.load.spritesheet('star', 'star.png', 31.25, 33.33);
    game.load.spritesheet('tortuga', 'tortuga.png', 31.25, 33.33);
    game.load.spritesheet('tortuga_roja', 'tortuga_roja.png', 41.25, 30);
}

var player; //Mario
var cursors; //Teclas
var map; //Tilemap
var layer; //Mapa 
var pos; //Posicion actual de Mario

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
	

    map = game.add.tilemap('fondo');
	map.addTilesetImage('SuperMarioBros-World1-1','tiles');
	
	//Indicamos que tiles del Tilemap seran solidos.
	map.setCollision(40);
	map.setCollisionBetween(14,16);
	map.setCollisionBetween(20,25);
	map.setCollisionBetween(27,29);

	
	//map.setTileIndexCallback(40, hitCoin, this);


    layer = map.createLayer('World1');

    layer.resizeWorld();

    layer.wrap = true;

    //Al reescalar el mapa las colisiones fallan. Hay que preguntar al Marc.
    //layer.scale.setTo(1.6, 2);

	/*
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, 800);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create 2 plataformas en el aire
    var ledge = platforms.create(80, 100, 'ground');

    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');

    ledge.body.immovable = true;
		*/
		
    // The player and its settings
    player = game.add.sprite(32, 150, 'mario');
	
	tortuga = game.add.sprite(60,150,'tortuga_roja');
	
	

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
	
	game.physics.arcade.enable(tortuga);

    player.anchor.setTo(0.5, 0.5);

    game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
	
	tortuga.body.bounce.y = 0.2;
    tortuga.body.gravity.y = 300;
    tortuga.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('right', [4,5,6,7], 10, true);
    player.animations.add('left', [3,2,1,0], 10, true);
	
	tortuga.animations.add('right', [4,5,6,7], 7, true);
    tortuga.animations.add('left', [0,1,2,3], 3, true);
	
	tortuga.animations.play('right');
	tortuga.body.velocity.x = 20;
	
	
	

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();

    //malotes
    //game.add.sprite(0, 0, 'tortuga_roja');

    
	
    //  These are the frame names for the octopus animation. We use the generateFrames function to help create the array.
    //var frameNames = Phaser.Animation.generateFrameNames('tortuga_roja', 0, 24, '', 4);

    //  Here is the important part. Group.callAll will call a method that exists on every child in the Group.
    //  In this case we're saying: child.animations.add('swim', frameNames, 30, true, false)
    //  The second parameter ('animations') is really important and is the context in which the method is called.
    //  For animations the context is the Phaser.AnimationManager, which is linked to the child.animations property.
    //  Everything after the 2nd parameter is just the usual values you'd pass to the animations.add method.
    //group.callAll('animations.add', 'animations', 'tortuga_roja', frameNames, 30, true, false);

    //  Here we just say 'play the swim animation', this time the 'play' method exists on the child itself, so we can set the context to null.
    //group.callAll('play', null, 'tortuga_roja');

}

function update() {
	
	
	game.physics.arcade.collide(player, layer);
	game.physics.arcade.collide(tortuga, layer);
	game.physics.arcade.overlap(player, tortuga, muerte, null, this);

    player.body.velocity.x = 0;
	
	pos = map.getTileWorldXY(player.x,player.y + 20); //Sprite actual sobre el que esta apoyado mario

  
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

    
	
	
	//Salto de Mario
	
    if (cursors.up.isDown && (pos.index == 40 || pos.index == 14 || pos.index == 15 || pos.index == 16))  //Si la tecla up esta apretada y si Mario está apoyado sobre algun sprite indicado por su indice
    {
        console.log('weebbababa');
		player.body.velocity.y = -200;
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
	

}

function muerte(player,tortuga){
		
	player.kill();
	//Aqui habra que restar una vida
	createPlayer();
		
}
	
	
	//Funcion para crear a Mario
function createPlayer(){
	player = game.add.sprite(32, 150, 'mario');
	game.physics.arcade.enable(player);
	player.anchor.setTo(0.5, 0.5);
	game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
	player.animations.add('right', [4,5,6,7], 10, true);
    player.animations.add('left', [3,2,1,0], 10, true);
}