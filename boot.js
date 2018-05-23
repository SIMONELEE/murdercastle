// The Google WebFont Loader will look for this object, so create it before loading the script.
WebFontConfig = {

    // 'active' means all requested fonts have finished loading
    // We set a 1 second delay before calling the dummy function 'createText'.
    // For some reason if we don't the browser cannot render the text the first time it's created.
    active: function() { game.time.events.add(Phaser.Timer.SECOND, this.createText); },

    // The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Creepster', 'Anton']
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
		
		// preloading animation sprites
		game.load.spritesheet('catcher', 'images/catcher.png', 36, 40);
		game.load.spritesheet('button', 'images/button_sprite.png', 300, 75, 3);
		game.load.spritesheet('playAgain', 'images/button_again_sprite.png', 300, 75, 3);		
		
		//preload the images from the tutorial
		game.load.image('bg', 'images/bg_1.png');
    	game.load.image('ground', 'images/platform.png');
		game.load.image('ground_small', 'images/platformsmall.png');
		game.load.image('star', 'images/first-aid-kit.png');
    	game.load.spritesheet('victim', 'images/victim.png');

	},

	create: function () {

		game.add.image(0, 0, 'bg');
		
		var titleShadow = game.add.text(game.world.centerX + 3, 53, 'MURDER CASTLE', {
			font: "75px Creepster",
			fill: "#ed2929"
		});
		
		titleShadow.anchor.set(0.5);
		
		var title = game.add.text(game.world.centerX, 50, 'MURDER CASTLE', {
			font: "75px Creepster",
			fill: "#fff"
		});
		
		title.anchor.set(0.5);
		
		var subTitle = game.add.text(game.world.centerX, 230, 'Prototype. Version 1.0', {
			font: "25px Anton",
			fill: "#fff"
		});
		
		subTitle.anchor.set(0.5);

		var button = game.add.button(game.world.centerX - 150, 250, 'button', this.actionOnClick, this, 2, 1, 0);
	},

	update: function () {

	},

	actionOnClick: function () {
		// launching level 1 splash screen
		game.state.start('splash1');
	}

};