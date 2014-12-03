function MegaMan(xPos,yPos,board) {
	var self = this;
	this.xPos = xPos;
	this.yPos = yPos;
	this.board = board;
	this.tooClose = 4; //number of spaces things can't be created within
	// var move = function () {
	// 	if(board.isValidPosition(tempX, tempY)){
	// 		this.xPos = tempX;
	// 		this.yPos = tempY;
	// 	}

	// }
	this.move = function(x, y) {
		//move returns true if megaman moved
		var canMove = !this.board.isInvalidMove(x,y);
		if(canMove) {
			this.xPos = x;
			this.yPos = y;
		}
		return canMove;
	}

	this.moveUp = function() {
		return this.move(this.xPos,this.yPos - 1);
	}

	this.moveDown = function() {
		return this.move(this.xPos, this.yPos + 1);
	}

	this.moveLeft = function() {
		return this.move(this.xPos - 1,this.yPos);
	}

	this.moveRight = function() {
		return this.move(this.xPos + 1,this.yPos);
	}

	this.isTooClose = function(x,y) {
		//Checks if a position is too close to mega man
		//used when creating power-ups and obstacles
		return (Math.abs(x - this.xPos) + Math.abs(y - this.yPos)) <= this.tooClose;
	}

}



function Obstacle(xPos, yPos) {
	this.xPos = xPos;
	this.yPos = yPos;
}

function PowerUp(xPos, yPos) {
	this.xPos = xPos;
	this.yPos = yPos;
}

function Board (xSize, ySize, xCellSize, yCellSize, numObstacles, numPowerUps) {
	// var self = this;
	// var i;
	// var pos;
	this.xSize = xSize;
	this.ySize = ySize;
	this.xCellSize = xCellSize;
	this.yCellSize = yCellSize;
	this.megaMan = new MegaMan(0, 0, this);
	this.obstacles = [];
	this.powerUps = [];



	this.isOffBoard = function (x,y) {
		//makes sure the x and y position is on the board
		// return x < self.xSize 
		return x >= this.xSize || y >= this.ySize || x < 0 || y < 0;
	}
	

	this.createPowerUps = function(numPowerUps) {
		var i;
		var pos;
		this.powerUps = [];
		for(i = 0; i < numPowerUps; i++) {
			pos = this.pickCreatePos();
			this.powerUps.push(new PowerUp(pos[0], pos[1]));
		}
	}

	this.createObstacles = function(numObstacles) {
		var i;
		var pos;
		this.obstacles = [];
		for(i = 0; i < numObstacles; i++) {
			pos = this.pickCreatePos();
			this.obstacles.push(new Obstacle(pos[0], pos[1]));
		}
	}

	this.toIndex = function (x,y) {
		return y * this.xSize + x;
	}

	this.isInvalidMove = function(x, y) {
		return this.isOffBoard(x,y) || this.containsObstacle(x,y);
	}

	this.createBoard = function () {
		var i;
		var j;
		var boardNode = document.getElementById("board");
		var rowDivNode;
		var divNode;


		for(i = 0; i < this.ySize; i++) {
			rowDivNode = document.createElement("div");
			rowDivNode.style.textAlign = "center";
			rowDivNode.style.height = (yCellSize) + 'px';
			boardNode.appendChild(rowDivNode);
			for(j = 0; j < this.xSize; j++) {
				divNode = document.createElement("div");
				divNode.style.height = yCellSize + 'px';
				divNode.style.width = xCellSize + 'px';
				divNode.style.display = "inline-block";
				rowDivNode.appendChild(divNode);
			}
		}
	}

	this.updateMegaManPos = function () {
		var divNodes = document.querySelectorAll("#board>div>div");
		var megaManNode = document.getElementById("mega-man");
		var i = this.toIndex(this.megaMan.xPos, this.megaMan.yPos);
		var theFirstChild = divNodes[i].firstChild;

		// divNodes[i].appendChild(megaManNode);
		divNodes[i].insertBefore(megaManNode, theFirstChild);

	}

	this.addItemsToBoard = function () {
		var divNodes = document.querySelectorAll("#board>div>div");
		var rockNode;
		var powerUpNode;
		var i;

		for(i = 0; i < this.powerUps.length; i++) {
			powerUpNode = document.createElement("img");
			powerUpNode.src = "images/power-up.png";
			powerUpNode.style.height = this.yCellSize + "px";
			powerUpNode.style.width = this.xCellSize + "px";
			divNodes[this.toIndex(this.powerUps[i].xPos, this.powerUps[i].yPos)].appendChild(powerUpNode);
		}
		for(i = 0; i < this.obstacles.length; i++) {
			rockNode = document.createElement("img");
			rockNode.src = "images/rock.png";
			rockNode.style.height = this.yCellSize + "px";
			rockNode.style.width = this.xCellSize + "px";
			divNodes[this.toIndex(this.obstacles[i].xPos, this.obstacles[i].yPos)].appendChild(rockNode);
		}

	}

	this.init = function () {}

	this.getRandomBoardPos = function () {
		//returns a random [x,y] position that is on the board
		var position = Math.floor(Math.random() * (this.xSize * this.ySize));
		return [position%this.xSize, Math.floor(position/this.xSize)]
	}




	this.containsPowerUp = function (x, y) {
		//returns true if the given position contains a powerup
		var i;
		for(i = 0; i < this.powerUps.length; i++) {
			if(x === this.powerUps[i].xPos && y === this.powerUps[i].yPos) {
				return true;
			}
		}
		return false;
	}

	this.containsObstacle = function (x,y) {
		//returns true if the given position contains an Obstacle
		var i;
		for(i = 0; i < this.obstacles.length; i++) {
			if(x === this.obstacles[i].xPos && y === this.obstacles[i].yPos) {
				return true;
			}
		}
		return false;
	}

	this.pickCreatePos = function () {
		//picks a random board position
		//checks if that position contains anything or is too close to MegaMan
		//if any of those are true it picks another random position
		var pos;
		var x;
		var y;
		var badPosition = true;
		while(badPosition) {
			pos = this.getRandomBoardPos();
			x = pos[0];
			y = pos[1];
			badPosition = this.containsPowerUp(x,y) || this.containsObstacle(x,y) || this.megaMan.isTooClose(x,y);
		}
		return pos;
	}

	this.hasWon = function() {
		var i;
		for(i = 0; i < this.powerUps.length; i++) {
			if(this.megaMan.xPos === this.powerUps[i].xPos && this.megaMan.yPos === this.powerUps[i].yPos) {
				console.log("You Win!");
				return true;
			}
		}
		return false;
	}

	this.move = function(dir) {
		switch(dir) {
			case "up":
				this.megaMan.moveUp();
				break;
			case "down":
				this.megaMan.moveDown();
				break;
			case "left":
				this.megaMan.moveLeft();
				break;
			case "right":
				this.megaMan.moveRight();
				break
			default:
				break;
		}

		this.updateMegaManPos();
		this.hasWon();

	}
}

var board = new Board(10, 10, 50, 50, 6, 2);

board.createBoard();
board.updateMegaManPos();
board.createPowerUps(2);
board.createObstacles(6);
board.addItemsToBoard();

// var myMegaMan = new MegaMan();

window.onkeydown = function(keyDown) {
	// console.log(keyDown.keyCode);
	switch (keyDown.keyCode) {
		case 38:
		board.move("up");
		break;
		case 39:
		board.move("right");
		break;
		case 40:
		board.move("down");
		break;
		case 37:
		board.move("left");
		break;
		default:
		break;
	}
}

// megaMan {
// 	xPos
// 	yPos
// }