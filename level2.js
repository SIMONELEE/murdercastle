// global variables
var winningCondition = 10;
// variable to control the feedback message display
var update = true;
var button;

// JS object literal notation
var level2 = {

	create: function () {
		// attaching the background image
		game.add.image(0, 0, 'bg');
		// the catcher sprite
		this.catcher = game.add.sprite(game.width / 2, game.height / 2, 'catcher');
		this.catcher.anchor.setTo(0.5, 0);
		// animation added (name, frames, frameRate, loop)
		this.catcher.animations.add('catch', [0, 1, 2, 3, 4], 42, false);
		// default idle frame, with the catcher facing left
        this.catcher.frame = 0;
		game.physics.enable(this.catcher);
		game.physics.arcade.enableBody(this.catcher); // important for velocity (movement) + collision detection
		this.catcher.body.collideWorldBounds = true; // catcher cannot leave the world ;-)

		this.trees = this.add.group(); // adding a "normal" group
		//this.trees = game.add.physicsGroup(); // physicsGroup to enable collision detection
		//game.physics.arcade.enableBody(this.trees); // enablng physics for a whole group

		for (var i = 0; i < 20; i++) {
			// populating the trees group with 20 randomly placed tree sprites
			// create(x, y, image)
			let sprite = this.trees.create(game.rnd.between(50, 750), game.rnd.between(30, 550), 'tree');
			game.physics.enable(sprite); // enabling physics on every single tree
			game.physics.arcade.enableBody(sprite);
			sprite.body.allowGravity = false;
			sprite.body.immovable = true;

		}

		this.monkeys = this.add.group();
		for (var i = 0; i < winningCondition; i++) {
			let sprite = this.monkeys.create(game.rnd.between(100, 700), game.rnd.between(50, 550), 'monkey');
			game.physics.enable(sprite); // enabling physics on every single tree
			game.physics.arcade.enableBody(sprite);
			sprite.body.collideWorldBounds = true;
			sprite.body.velocity.setTo(60, 60);
			sprite.body.bounce.set(1, 1);
			sprite.body.gravity.set(45, 30);
		}


		// the snake
		this.snake = game.add.sprite(game.rnd.between(600, 800), game.rnd.between(0, 200), 'snake');
		this.snake.anchor.setTo(0.5, 0);
		game.physics.enable(this.snake);
		game.physics.arcade.enableBody(this.snake);
		this.snake.body.collideWorldBounds = true;

		this.snake.body.velocity.setTo(100, 100);
		this.snake.body.bounce.set(0.9, 0.8);
		this.snake.body.gravity.set(25, 30);

		// button needs to be created here, but is hidden as default
		button = game.add.button(game.world.centerX - 150, 450, 'playAgain', this.actionOnClick, this, 2, 1, 0);
		button.visible = false;

		// Create a custom timer (global variable countDown + format function in game.js)
		this.timer = game.time.create();

		// Create a delayed event 1m and 30s from now
		this.timerEvent = this.timer.add(Phaser.Timer.SECOND * countDown, this.endTimer, this);

		// Start the timer
		this.timer.start();

		// Display the timer
		this.txtTimer = game.add.text(740, 10, formatTime(Math.round((this.timerEvent.delay - this.timer.ms) / 1000)), {
			font: "40px Chewy",
			fill: "#ff0044"
		});

		// enabling keyboard input
		this.cursors = game.input.keyboard.createCursorKeys();

	},

	update: function () {

		// velocity (property on body) moves the catcher/monkey in any direction
		// variable for movement speed
		var speed = 150;
		// default velocity is 0 (catcher is not moving)
		this.catcher.body.velocity.x = 0;
		this.catcher.body.velocity.y = 0;

		if (this.cursors.left.isDown) {
			this.catcher.body.velocity.x = -speed;
			this.catcher.scale.x = 1;
			// moveToObject(displayObject, destination, speed, maxTime) → {number}
			// Move the given display object (snake) towards the destination object (catcher) at a steady velocity.
			game.physics.arcade.moveToObject(this.snake, this.catcher, 80, 1400);
		}
		if (this.cursors.right.isDown) {
			this.catcher.body.velocity.x = speed;
			this.catcher.scale.x = -1;
			game.physics.arcade.moveToObject(this.snake, this.catcher, 80, 1400);
		}
		if (this.cursors.up.isDown) {
			this.catcher.body.velocity.y = -speed;
			game.physics.arcade.moveToObject(this.snake, this.catcher, 80, 1400);
		}
		if (this.cursors.down.isDown) {
			this.catcher.body.velocity.y = speed;
			game.physics.arcade.moveToObject(this.snake, this.catcher, 80, 1400);
		}

		// collision and overlaps
		game.physics.arcade.collide(this.catcher, this.trees);
		game.physics.arcade.collide(this.monkeys, this.trees);
		game.physics.arcade.collide(this.snake, this.trees);
		game.physics.arcade.collide(this.monkeys, this.monkeys);

		game.physics.arcade.overlap(this.catcher, this.monkeys, this.catchAnimal);
		game.physics.arcade.overlap(this.catcher, this.snake, this.killCatcher);


		// the countdown
		this.tmp = formatTime(Math.round((this.timerEvent.delay - this.timer.ms) / 1000));

		// losing
		if (this.timer.running && this.tmp >= 0) {
			this.txtTimer.text = formatTime(Math.round((this.timerEvent.delay - this.timer.ms) / 1000));
		} else if (score < winningCondition && update === true) {
			this.loose();
			update = false;
		}

		// winning
		if (score === winningCondition && update === true) {
			this.win();
		}
	},

	// collision and overlaps handlers
	catchAnimal: function (player, animal) {
		// in here, 'player' is the player, and 'animal' is the monkey the player collided with
		player.animations.play('catch');
		this.catcherSound = game.add.audio('woosh');
		this.catcherSound.play();
		this.monkeySound = game.add.audio('monkey');
		// avoiding sound doubling
		this.monkeySound.stop();
		this.monkeySound.play();
		score++;
		console.log(score);
		animal.kill();
		//animal.destroy();
	},

	killCatcher: function (player) {
		this.catcherSound = game.add.audio('oowh');
		this.catcherSound.play();
		player.kill();
		level2.loose();
		level2.timer.stop();
	},

	// end timer handling
	endTimer: function () {
		// Stop the timer when the delayed event triggers
		this.timer.stop();
	},

	// winning / loosing
	win: function () {
		update = false;
		this.catcher.kill();
		this.timer.stop();
		txtGameOver = game.add.text(-800, game.world.centerY, "YOU WON THE GAME :-)", {
			font: "25px Luckiest Guy",
			fill: "#ff0044"
		});
		txtGameOver.anchor.set(0.5);
		tween = game.add.tween(txtGameOver).to({
			x: game.world.centerX
		}, 1500, Phaser.Easing.Bounce.Out, true);
		/*
		// freezing the game at current state
		game.lockRender = true;
		*/

	},

	loose: function () {

		this.catcher.kill();

		/*
		Difference between Kill and Destroy

		Kill is supposed to halt rendering, but the object still exists. It is good if you want to make a reusable object. You could create the object again without the cost of actually creating the object again.

		Destroy should remove the object and everything related to it. You use this when you want to send the object to the garbage collector.
		*/

		txtGameOver = game.add.text(game.world.centerX, -100, "GAME OVER - YOU LOST :-(", {
			font: "50px Luckiest Guy",
			fill: "#ff0044"
		});
		txtGameOver.anchor.set(0.5);
		tween = game.add.tween(txtGameOver).to({
			y: game.world.centerY
		}, 1500, Phaser.Easing.Bounce.Out, true);
		// revealing the playAgain button
		button.visible = true;

	},
	actionOnClick: function () {
		score = 0;
		update = true;
		// launching level 2 again
		game.state.start('level2');
	}
};