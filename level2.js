// The first level, JS object literal notation
// global variable for the playAgain button
var button;
// variable to control the feedback message display
var update = true;
var score;

var level2 = {

	create: function () {
		game.add.image(0, 0, 'bg2');
	
		//ENABLE THE ARCADE PHYSICS SYSTEM
		game.physics.startSystem(Phaser.Physics.ARCADE);

		//CREATE A GROUP OF PLATFORMS THAT ARE THE GROUND AND LEDGES 
		platforms = game.add.group();

		//ENABLE PHYSICS FOR ANY OBJECTS CREATED IN THE GROUP:
		platforms.enableBody = true;
		
		
		
		//CREATE THE GROUND OF THE GAME
		var ground = platforms.create(0, game.world.height - 50, 'ground');

		//SCALE THE GROUND TO FIT THE GAME CANVAS
		ground.scale.setTo(3, 2);
		
		//THIS STOPS THE GROUND FROM FALLING AWAY WHEN JUMPED ON
		ground.body.immovable = true;

		//CREATE LEDGES FOR THE GAME
		var ledge = platforms.create(400, 400, 'groundbloody');
		ledge.body.immovable = true;

		ledge = platforms.create(150, 250, 'groundbloody');
		ledge.body.immovable = true;
		
		//SMALL LEDGES
		ledge = platforms.create(0, 360, 'ground_small');
		ledge.body.immovable = true;
		
		ledge = platforms.create(700, 280, 'ground_small');
		ledge.body.immovable = true;
		
		ledge = platforms.create(900, 130, 'ground_small');
		ledge.body.immovable = true;
		
		ledge = platforms.create(90, 100, 'ground_small');
		ledge.body.immovable = true;
		
		
		
		//ADDING DOOR
		doors = this.add.sprite(750, 181, 'door');		
		this.physics.enable(doors, Phaser.Physics.ARCADE);
		doors.enableBody = true;
		
		
		
		//ADDING THE PLAYER AND SETTINGS
		player = this.add.sprite(32, game.world.height - 150, 'victim');
	
		this.physics.enable(player, Phaser.Physics.ARCADE);
		player.enableBody = true;
		
		//PLAYER PHYSICS PROPERTIES 
		player.body.bounce.y = 0.2;
		player.body.gravity.y = 500;
		player.body.collideWorldBounds = true;


		
		//ADDING FIRSTAID KITS TO COLLECT
		//ADDING THEM IN A GROUP
		kits = game.add.group();
		
		//ENABLE PHYSICS FOR THE KITS 
		kits.enableBody = true;

		
		//CREATING 15 KITS SPACED OUT ON THE CANVAS
		for (var i = 0; i < 15; i++)
		{
			var kit = kits.create(i * 70, 0, 'kit');
			kit.body.gravity.y = 500;
			kit.body.bounce.y = 0.3 + Math.random() * 0.2;
    }
		
		
		//ADDING KEYS TO COLLECT
		keys = game.add.group();
		

		//ENABLE PHYSICS FOR THE KEYS IN THE GROUP
		keys.enableBody = true;

		//CREATE 5 KEYS
		for (var i = 0; i < 5; i++)
		{
			var key = keys.create(i * 230, 0, 'key');
			key.body.gravity.y = 500;
			key.body.bounce.y = 0.2 + Math.random() * 0.2;
    }


		//KEYBOARD CONTROLS
		cursors = game.input.keyboard.createCursorKeys();
		
		
		//SCORE TEXT
		this.scoreTxt = game.add.text(10, 10, score.toString(), {
			font: "30px Arial",
			fill: "#ff0"
		});
		
		this.scoreTxt.font = 'Creepster';

		//TIMER (global variable countDown + format function in game.js)
		this.timer = game.time.create();

		// Create a delayed event 1m and 30s from now
		this.timerEvent = this.timer.add(Phaser.Timer.SECOND * countDown, this.endTimer, this);

		//START IMER
		this.timer.start();

		//DISPLAY TIMER
		this.txtTimer = game.add.text(940, 10, formatTime(Math.round((this.timerEvent.delay - this.timer.ms) / 1000)), {
			font: "40px Arial",
			fill: "#680101"
		});
		
		this.txtTimer.font = 'Creepster';
		
		//BUTTON TO BE CREATED - BUT IT'S HIDDEN AS DEFAULT
		button = game.add.button(game.world.centerX - 150, 350, 'playAgain', this.actionOnClick, this, 2, 1, 0);
		button.visible = false;

	},

	update: function () {
		
		 //COLLIDE THE PLAYER WITH THE PLATFORM. WON'T FALL THROUGH
    	var hitPlatform = game.physics.arcade.collide(player, platforms);
		
		//COLLIDE THE KITS WITH THE PLATFORM. WON'T FALL THROUGH
		game.physics.arcade.collide(kits, platforms);
		
		//COLLIDE THE KITS WITH THE PLATFORM. WON'T FALL THROUGH
		game.physics.arcade.collide(keys, platforms);
		
		//WHEN THE PLAYER AND KITS OVERLAP = THE COLLECTKIT FUNCTION
		game.physics.arcade.overlap(player, kits, this.collectKit, null, this);
		
		//WHEN THE PLAYER AND KEYS OVERLAP = THE COLLECTKEY FUNCTION
		game.physics.arcade.overlap(player, keys, this.collectKey, null, this);

		
		
	 	//Reset the players velocity (movement)
		player.body.velocity.x = 0;
		if (cursors.left.isDown)
		{
			//MOVE TO THE LEFT
			player.body.velocity.x = -150;
			player.scale.x = -1;
		}
		else if (cursors.right.isDown)
		{
			//MOVE TO THE RIGHT
			player.body.velocity.x = 150;
			player.scale.x = 1;
		}
		else
		{
			//STAND STILL
			player.frame = 4;
		}

		////JUMPING IF THE PLAYER IS TOUCHING THE GROUND
		if (cursors.up.isDown && player.body.touching.down && hitPlatform)
		{
			player.body.velocity.y = -400;
		}
		
		
		//COUNTDOWM
		this.tmp = formatTime(Math.round((this.timerEvent.delay - this.timer.ms) / 1000));

		if (this.timer.running && this.tmp >= 0) {
			this.txtTimer.text = formatTime(Math.round((this.timerEvent.delay - this.timer.ms) / 1000));
		} else if (score < 20 && update === true) {
			//CALLING THE LOOSE SCENARIO
			this.loose();
			//UPDATE IS USED TO PREVENT THE PHASER UPDATE LOOP CALLING THIS FUNCTIO INDEFINITELY
			update = false;
		}

		//WINNING CONDITION
		if (score === 20){
			game.physics.arcade.overlap(player, doors, this.doorOpen, null, this);
			console.log('door open!');
		}

	},
	
		//WINNING
	doorOpen: function (player, doors) {
		console.log('door!');
		player.kill();
		this.win();
	},
	
	collectKit: function (player, kit) {
    //REMOVES THE KITS FROM THE SCREEN
	console.log('Firstaid Kit caught!');
    kit.kill();
	score++;
	level2.scoreTxt.setText(score.toString());
}, 
	
	collectKey: function (player, key) {
    //REMOVES THE KEYS FROM THE SCREEN
	console.log('Key Kit caught!');
    key.kill();
	score++;
	level2.scoreTxt.setText(score.toString());
},

	endTimer: function () {
		//STOP THE TIMER
		this.timer.stop();
	},
	
	win: function () {
		update = false;
		player.kill();
		this.timer.stop();
		bgSound.stop();
		txtGameOver = game.add.text(game.world.centerX, -100, "YOU ESCAPED!", {
			font: "50px Anton",
			fill: "#FFF"
		});
		txtGameOver.anchor.set(0.5);
		tween = game.add.tween(txtGameOver).to({
			y: game.world.centerY
		}, 1500, Phaser.Easing.Bounce.Out, true);
		//RESET GLOBAL SCORE
		score = 0;
	},

	loose: function () {
		this.looseScream = game.add.audio('scream');
		this.looseScream.play();
		player.kill();
		this.timer.stop();
		txtGameOver = game.add.text(game.world.centerX, -100, "NOT FAST ENOUGH - GAME OVER", {
			font: "50px Anton",
			fill: "#FFF"
		});
		txtGameOver.anchor.set(0.5);
		//TEXT ANIMATION
		tween = game.add.tween(txtGameOver).to({
			y: game.world.centerY
		}, 1500, Phaser.Easing.Bounce.Out, true);
		//SHOW THE PLAY AGAIN BUTTON
		button.visible = true;
	},

	actionOnClick: function () {
		score = 0;
		//RESET UPDATE WHEN REPLAYING THE LEVEL
		update = true;
		//PLAY LEVEL 2 AGAIN
		game.state.start('level2');
	}
}