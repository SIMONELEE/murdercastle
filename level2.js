// The first level, JS object literal notation
// global variable for the playAgain button
var button;
// variable to control the feedback message display
var update = true;
var score;
//var player;
//var platforms, ledge;
//var cursors;
//var kits;

var level2 = {

	create: function () {
		game.add.image(0, 0, 'bg2');
	
		//We're going to be using physics, so enable the Arcade Physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);

		//The platforms group contains the ground and the 2 ledges we can jump on
		platforms = game.add.group();

		//We will enable physics for any object that is created in this group
		//game.physics.arcade.enableBody(this.platforms);
		platforms.enableBody = true;
		//this.platforms.body.immovable = true;
		// Here we create the ground.
		var ground = platforms.create(0, game.world.height - 50, 'ground');
		//var ground = platforms.create(0, game.world.height - 50, 'ground');

		//  Scale it to fit the width of the game 
		ground.scale.setTo(3, 2);
		//  This stops it from falling away when you jump on it
		ground.body.immovable = true;

		//  Now let's create two ledges
		var ledge = platforms.create(400, 400, 'groundbloody');
		ledge.body.immovable = true;

		ledge = platforms.create(150, 250, 'groundbloody');
		ledge.body.immovable = true;
		
		//small ledge 
		ledge = platforms.create(0, 360, 'ground_small');
		ledge.body.immovable = true;
		
		//small ledge 
		ledge = platforms.create(700, 280, 'ground_small');
		ledge.body.immovable = true;
		
		//small ledge 
		ledge = platforms.create(900, 130, 'ground_small');
		ledge.body.immovable = true;
		
		//small ledge 
		ledge = platforms.create(90, 100, 'ground_small');
		ledge.body.immovable = true;
		
		
		doors = this.add.sprite(750, 181, 'door');
		//this.doors = game.add.image(750, 181, 'door');
		//game.physics.arcade.enable(this.doors)
		
/*		//Add door
		doors = this.add.image(750, 181, 'door');
		//door.enableBody = false;*/
		
		this.physics.enable(doors, Phaser.Physics.ARCADE);
		doors.enableBody = true;
		
		 //The player and its settings
		player = this.add.sprite(32, game.world.height - 150, 'victim');
	
		this.physics.enable(player, Phaser.Physics.ARCADE);
		player.enableBody = true;

		//  Player physics properties. Give the little guy a slight bounce.
		player.body.bounce.y = 0.2;
		player.body.gravity.y = 500;
		player.body.collideWorldBounds = true;


		
		//  Finally some kits to collect
		kits = game.add.group();
		

		//  We will enable physics for any kit that is created in this group
		kits.enableBody = true;

		//  Here we'll create 12 of them evenly spaced apart
		for (var i = 0; i < 15; i++)
		{
			//  Create a kit inside of the 'kits' group
			var kit = kits.create(i * 70, 0, 'kit');

			//  Let gravity do its thing
			kit.body.gravity.y = 500;

			//  This just gives each kit a slightly random bounce value
			kit.body.bounce.y = 0.3 + Math.random() * 0.2;
    }
		
		
		//  Finally some keys to collect
		keys = game.add.group();
		

		//  We will enable physics for any key that is created in this group
		keys.enableBody = true;

		//  Here we'll create 12 of them evenly spaced apart
		for (var i = 0; i < 5; i++)
		{
			//  Create a kit inside of the 'kits' group
			var key = keys.create(i * 230, 0, 'key');

			//  Let gravity do its thing
			key.body.gravity.y = 500;

			//  This just gives each kit a slightly random bounce value
			key.body.bounce.y = 0.2 + Math.random() * 0.2;
    }



		
		//  Our controls.
		cursors = game.input.keyboard.createCursorKeys();
		
		this.scoreTxt = game.add.text(10, 10, score.toString(), {
			font: "30px Arial",
			fill: "#ff0"
		});
		
		this.scoreTxt.font = 'Creepster';

		// Create a custom timer (global variable countDown + format function in game.js)
		this.timer = game.time.create();

		// Create a delayed event 1m and 30s from now
		this.timerEvent = this.timer.add(Phaser.Timer.SECOND * countDown, this.endTimer, this);

		// Start the timer
		this.timer.start();

		// Display the timer
		this.txtTimer = game.add.text(940, 10, formatTime(Math.round((this.timerEvent.delay - this.timer.ms) / 1000)), {
			font: "40px Arial",
			fill: "#680101"
		});
		
		this.txtTimer.font = 'Creepster';
		
		// button needs to be created here, but is hidden as default
		button = game.add.button(game.world.centerX - 150, 350, 'playAgain', this.actionOnClick, this, 2, 1, 0);
		button.visible = false;

	},

	update: function () {
		
		 //  Collide the player and the kits with the platforms
    	var hitPlatform = game.physics.arcade.collide(player, platforms);
		
		game.physics.arcade.collide(kits, platforms);
		game.physics.arcade.collide(keys, platforms);
		game.physics.arcade.overlap(player, kits, this.collectKit, null, this);
		game.physics.arcade.overlap(player, keys, this.collectKey, null, this);
		game.physics.arcade.overlap(player, doors, this.doorOpen, null, this);

	 //  Reset the players velocity (movement)
		player.body.velocity.x = 0;
		if (cursors.left.isDown)
		{
			//Move to the left
			player.body.velocity.x = -150;
			player.scale.x = -1;
			//player.animations.play('left');
		}
		else if (cursors.right.isDown)
		{
			//Move to the right
			player.body.velocity.x = 150;
			player.scale.x = 1;
			//player.animations.play('right');
		}
		else
		{
			//  Stand still
			//player.animations.stop();

			player.frame = 4;
		}

		//  Allow the player to jump if they are touching the ground.
		if (cursors.up.isDown && player.body.touching.down && hitPlatform)
		{
			player.body.velocity.y = -400;
		}
		
		
		
		// the countdown
		this.tmp = formatTime(Math.round((this.timerEvent.delay - this.timer.ms) / 1000));

		if (this.timer.running && this.tmp >= 0) {
			this.txtTimer.text = formatTime(Math.round((this.timerEvent.delay - this.timer.ms) / 1000));
		} else if (score < 20 && update === true) {
			// calling the function handling a "loose" scenario
			this.loose();
			// update is used to prevent the Phaser update loop calling this function indefinitely
			update = false;
		}

		//testing new winning condition
		if (score === 20){
/*			console.log('door open!');
			//update = true;
			
			door.enableBody = true;
			//player.kill();
			//this.doorOpen();*/
		}

	},
	
	collectKit: function (player, kit) {
    // Removes the kit from the screen
	console.log('Firstaid Kit caught!');
    kit.kill();
	score++;
	level2.scoreTxt.setText(score.toString());
}, 
	
	collectKey: function (player, key) {
    // Removes the kit from the screen
	console.log('Key Kit caught!');
    key.kill();
	score++;
	level2.scoreTxt.setText(score.toString());
},

	endTimer: function () {
		// Stop the timer when the delayed event triggers
		this.timer.stop();
	},
	
	// winning, loosing
	doorOpen: function (player, doors) {
		console.log('door!');
		player.kill();
	},
	
	win: function () {
		update = false;
		player.kill();
		this.timer.stop();
		txtGameOver = game.add.text(game.world.centerX, -100, "YOU ESCAPED!", {
			font: "50px Anton",
			fill: "#FFF"
		});
		txtGameOver.anchor.set(0.5);
		tween = game.add.tween(txtGameOver).to({
			y: game.world.centerY
		}, 1500, Phaser.Easing.Bounce.Out, true);
		// resetting the global score
		score = 0;
		game.state.start('splash2');
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
		// text animation
		tween = game.add.tween(txtGameOver).to({
			y: game.world.centerY
		}, 1500, Phaser.Easing.Bounce.Out, true);
		// revealing the playAgain button
		button.visible = true;
	},

	actionOnClick: function () {
		score = 0;
		// resetting update when replaying the level
		update = true;
		// launching level 1 again
		game.state.start('level2');
	}
}