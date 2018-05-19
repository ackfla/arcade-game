class GameEntity {

	resetPos() {
		this.x = this.xReset;
		this.speed = Math.floor(Math.random() * 4) + 1;
		this.y = this.yReset;
	}

}


// Enemies our player must avoid
class Enemy extends GameEntity {

	constructor() {
		super();
		// Variables applied to each of our instances go here,
		// we've provided one for you to get started
		// The image/sprite for our enemies, this uses
		// a helper we've provided to easily load images
		this.sprite = 'images/enemy-bug.png';
		// X Position
		this.x = -101;
		// X Reset Position
		this.xReset = -101;
		// Travel speed
		this.speed = Math.floor(Math.random() * 4) + 1;
		// Array of possible enemy row positions
		this.yPos = [41.5, 124.5, 207.5];
		// Y Position
		this.y = this.randomiser(this.yPos);
	  // Y Reset Position
		this.yReset = this.randomiser(this.yPos);
	}

	// function that randomly selects item from an array
	randomiser(arr) {
		return arr[Math.floor(Math.random() * arr.length)]
	}

	// Update the enemy's position, required method for game
	// Parameter: dt, a time delta between ticks
	update(dt) {
		// You should multiply any movement by the dt parameter
		// which will ensure the game runs at the same speed for
		// all computers.
		this.x += 83 * dt * this.speed;
	}

	// Draw the enemy on the screen, required method for game
	render() {
		if(this.x > 505) { // Check if off screen
			this.resetPos(); // If off screen reset position
		} else {
			ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
		}
	}

}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player extends GameEntity {

	constructor() {
		super();
		this.sprite = 'images/char-pink-girl.png';
		this.x = 202;
		this.xReset = 202;
		this.y = 373.5;
		this.yReset = 373.5;
		this.score = 0;
	}

	update() {
		this.collisionCheck();
	}

	collisionCheck() {
		for(let e = 0; e < allEnemies.length; e++) { // Loop through all enemies
			if(allEnemies[e].y === this.y) { // Check if on same row
				const enemyL = allEnemies[e].x,
					enemyR = allEnemies[e].x + 101,
					playerL = this.x + 15,
					playerR = this.x + 86;
				if((playerL < enemyL && enemyL < playerR) // Check left edge of enemy
					||
					(playerL < enemyR && enemyR < playerR)) { // Check right edge of enemy
					// Check if any lives remaining
					if(document.getElementsByClassName('fa fa-heart').length > 1) {
						const lives = document.querySelector('.lives');
						lives.removeChild(lives.lastElementChild); // Update lives remaining
						this.scoreMinus();
						this.resetPos();
					} else {
						// If no lives remaining end game
						// Update final moves
						const score = document.getElementById('score').textContent; // Get score
						document.getElementById('scoreFinal').textContent = score; // Apply score to screen
						// Hide game
						document.querySelector('.container').style.display = 'none';
						// Show winner screen
						document.querySelector('.winner-wrapper').style.display = 'block';
					}
				}
			}
		}
	}

	// Decrease score
	scoreMinus() {
		if(this.score > 0) { // If score more than 0...
			this.score--; // ...deduct 1 point
			document.getElementById('score').innerHTML = this.score; // update score board
		}
	}

	// Increase score
	scoreAdd() {
		this.score++; // Add 1 point
		document.getElementById('score').innerHTML = this.score; // update score board
	}

	render() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}

	handleInput(key) {
		if(key === 'down') {
			if(this.y < 373.5) {
				this.y += 83;
			}
		} else if(key === 'up') {
			if(this.y === 41.5) {
				this.scoreAdd();
				this.y = 373.5;
			} else {
				this.y -= 83;
			}
		} else if(key === 'left') {
			if(this.x > 0) {
				this.x -= 101;
			}
		} else if(key === 'right')
			if(this.x < 404) {
				this.x += 101;
			}
	}
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy()];
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

	player.handleInput(allowedKeys[e.keyCode]);
});
