// Splash screen level 2, JS object literal notation
var splash2 = {

	create: function () {
		game.add.image(0, 0, 'bg');

		var instructions = game.add.text(game.world.centerX, -50, 'Level 2:\nMove around the palms and catch all monkeys.\nBut be aware of the snake!', {
			font: "25px Luckiest Guy",
			fill: "#fff"
		});

		instructions.anchor.setTo(0.5);

		tween = game.add.tween(instructions).to({
			y: game.world.centerY
		}, 1500, Phaser.Easing.Bounce.Out, true);
		tween.onComplete.add(onComplete, this);

		// Add the background sound
		bgSound.stop();
		bgSound = game.add.audio('jungle');
		bgSound.play();
		bgSound.loopFull();

		setTimeout(function () {
			game.state.start("level2");
		}, 5000);

		function onComplete() {

			tween = game.add.tween(instructions).to( { y: 700 }, 1000, Phaser.Easing.Exponential.Out, true, 2500);

		}
	}
};