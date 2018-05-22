// The Google WebFont Loader will look for this object, so create it before loading the script.
WebFontConfig = {

    // 'active' means all requested fonts have finished loading
    // We set a 1 second delay before calling the dummy function 'createText'.
    // For some reason if we don't the browser cannot render the text the first time it's created.
    active: function() { game.time.events.add(Phaser.Timer.SECOND, this.createText); },

    // The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Chewy', 'Luckiest Guy']
    },
	
	createText: function () {
		// dummy function to render Google web fonts
	}

};

// Boot screen, JS object literal notation
var boot = {

	preload: function () {
		// Add the loadingbar to the scene:
		var loadingBar = game.add.sprite(game.world.centerX - (387 / 2), 400, 'loading');

		this.load.setPreloadSprite(loadingBar);
		
		// Load the Google WebFont Loader script
    	game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

		// preloading all images files
		game.load.image('bg', 'images/bg.png');
		game.load.image('cat', 'images/cat.png');
		game.load.image('tree', 'images/tree.png');
		game.load.image('monkey', 'images/monkey.png');
		game.load.image('snake', 'images/snake.png');
		
		// preloading animation sprites
		game.load.spritesheet('catcher', 'images/catcher.png', 36, 40);
		game.load.spritesheet('button', 'images/button_sprite.png', 300, 75, 3);
		game.load.spritesheet('playAgain', 'images/button_again_sprite.png', 300, 75, 3);
		
		//  300x75 is the size of each frame
		//  There are 3 frames in the PNG - you can leave this value blank if the frames fill up the entire PNG...

		// preloading all audio files
		game.load.audio('wouldn_doo', 'audio/level1.mp3');
		game.load.audio('cat', 'audio/cat.mp3');
		game.load.audio('woosh', 'audio/airslide.mp3');
		game.load.audio('jungle', 'audio/level2.mp3');
		game.load.audio('monkey', 'audio/monkey.mp3');
		game.load.audio('oowh', 'audio/oowh.mp3');
		
		
		//preload the images from the tutorial
		game.load.image('sky', 'images/sky.png');
    	game.load.image('ground', 'images/platform.png');
		game.load.image('star', 'images/star.png');
    	game.load.spritesheet('dude', 'images/dude.png', 32, 48);

	},

	create: function () {

		game.add.image(0, 0, 'bg');
		
		var titleShadow = game.add.text(game.world.centerX + 3, 53, 'MURDER CASTLE', {
			font: "75px Luckiest Guy",
			fill: "#000"
		});
		
		titleShadow.anchor.set(0.5);
		
		var title = game.add.text(game.world.centerX, 50, 'MURDER CASTLE', {
			font: "75px Luckiest Guy",
			fill: "#fff"
		});
		
		title.anchor.set(0.5);
		
		var subTitle = game.add.text(game.world.centerX, 230, 'Phaser 2/CE demo, 2 levels', {
			font: "25px Chewy",
			fill: "#fff"
		});
		
		subTitle.anchor.set(0.5);

		var button = game.add.button(game.world.centerX - 150, 250, 'button', this.actionOnClick, this, 2, 1, 0);

		this.catcher = game.add.sprite(game.width / 2, 100, 'catcher');
		this.catcher.anchor.setTo(0.5, 0);
		game.physics.enable(this.catcher);
		game.physics.arcade.enableBody(this.catcher); // important for velocity (movement) + collision detection
		this.catcher.body.collideWorldBounds = true; // catcher cannot leave the world ;-)
		this.catcher.body.velocity.setTo(-100, 0);
		this.catcher.body.bounce.set(1, 1);
		
		//add sprite from the tutorial
		//game.add.sprite(0, 0, 'star');
	},

	update: function () {
		// changing catcher's sprite orientation on impact with the world's bounds
		if (this.catcher.body.blocked.left) {
			this.catcher.scale.x = -1;
		} else if (this.catcher.body.blocked.right) {
			this.catcher.scale.x = 1;
		}

	},

	actionOnClick: function () {
		// launching level 1 splash screen
		game.state.start('splash1');
	}

}