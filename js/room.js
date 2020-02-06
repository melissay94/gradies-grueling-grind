import Enemy from "./enemy";

export default function(scene, player, color, id, x_coor, y_coor, width, height) {

    this.id = id;
    this.width = width;
    this.height = height;
    this.x_coor = x_coor;
    this.y_coor = y_coor;
    this.wallDepth = 40;
    this.doorLength = 100;
    this.wallXLength = (this.width - this.doorLength)/2;
    this.wallYLength = (this.height - this.doorLength)/2;
    this.roomVelocity = new Coordinates(0, 0);
    this.hasRendered = false;
    this.isFocus = false;
    this.player = player;

    this.walls = [];
    this.enemies = [];

    this.connectedRooms = {
        top: null, 
        right: null,
        left: null,
        bottom: null
    };

    this.corners = {
        topLeft: null,
        topRight: null,
        bottomLeft: null,
        bottomRight: null
    };

    this.doors = {
        top: null,
        right: null,
        left: null,
        bottom: null
    };

    this.renderWalls = function() {  

        // Left Top Wall
        this.walls.push(scene.add.rectangle(
            this.corners.topLeft.x_coor + this.wallXLength/2, 
            this.corners.topLeft.y_coor + this.wallDepth/2,
            this.wallXLength, this.wallDepth, color));

        // Right Top Wall
        this.walls.push(scene.add.rectangle(
            this.corners.topRight.x_coor - this.wallXLength/2, 
            this.corners.topRight.y_coor + this.wallDepth/2, 
            this.wallXLength, this.wallDepth, color));
    
        // Top Left Wall
        this.walls.push(scene.add.rectangle(
            this.corners.topLeft.x_coor + this.wallDepth/2, 
            this.corners.topLeft.y_coor + this.wallYLength/2, 
            this.wallDepth, this.wallYLength, color));
        // Bottom Left Wall
        this.walls.push(scene.add.rectangle(
            this.corners.bottomLeft.x_coor + this.wallDepth/2,
            this.corners.bottomLeft.y_coor - this.wallYLength/2,
            this.wallDepth, this.wallYLength, color));
    
        // Top Right Wall
        this.walls.push(scene.add.rectangle(
            this.corners.topRight.x_coor - this.wallDepth/2,
            this.corners.topRight.y_coor + this.wallYLength/2,
            this.wallDepth, this.wallYLength, color));

        // Bottom Left Wall
        this.walls.push(scene.add.rectangle(
            this.corners.bottomRight.x_coor - this.wallDepth/2,
            this.corners.bottomRight.y_coor - this.wallYLength/2,
            this.wallDepth, this.wallYLength, color));
    
        // Left Bottom Wall
        this.walls.push(scene.add.rectangle(
            this.corners.bottomLeft.x_coor + this.wallXLength/2, 
            this.corners.bottomLeft.y_coor - this.wallDepth/2, 
            this.wallXLength, this.wallDepth, color));
        // Right Bottom Wall
        this.walls.push(scene.add.rectangle(
            this.corners.bottomRight.x_coor - this.wallXLength/2,
            this.corners.bottomRight.y_coor - this.wallDepth/2, 
            this.wallXLength, this.wallDepth, color));

        this.walls.forEach(wall => {
            scene.physics.add.existing(wall);
            wall.body.immovable = true;
            scene.physics.add.collider(this.player, wall);
        });
    }

    this.setCorners = function(x_coor=0, y_coor=0) {
        this.x_coor = x_coor;
        this.y_coor = y_coor;
        this.corners.topLeft = new Coordinates(this.x_coor, this.y_coor);
        this.corners.topRight = new Coordinates(this.x_coor + this.width, this.y_coor);
        this.corners.bottomLeft = new Coordinates(this.x_coor, this.y_coor + this.height);
        this.corners.bottomRight = new Coordinates(this.x_coor + this.width, this.y_coor + this.height);
    }

    this.renderRoom = function() {
        this.setCorners(this.x_coor, this.y_coor);
        this.renderWalls();
        this.renderDoors();
        if (this.enemies.length < 1) {
            this.generateEnemies();
        }
        this.hasRendered = true;
    }

    this.renderDoors = function() {

        this.doors.top = scene.add.rectangle(
            this.corners.topLeft.x_coor + this.width/2, 
            this.corners.topLeft.y_coor + this.wallDepth/2, 
            this.doorLength, this.wallDepth, 0xFFFFFF);

        this.doors.bottom = scene.add.rectangle(
            this.corners.bottomLeft.x_coor + this.width/2, 
            this.corners.bottomLeft.y_coor - this.wallDepth/2, 
            this.doorLength, this.wallDepth, 0xFFFFFF);

        this.doors.left = scene.add.rectangle(
            this.corners.topLeft.x_coor + this.wallDepth/2, 
            this.corners.topLeft.y_coor + this.height/2, 
            this.wallDepth, this.doorLength, 0xFFFFFF);

        this.doors.right = scene.add.rectangle(
            this.corners.bottomRight.x_coor - this.wallDepth/2, 
            this.corners.bottomRight.y_coor - this.height/2, 
            this.wallDepth, this.doorLength, 0xFFFFFF);

        for (let door in this.doors) {
            scene.physics.add.existing(this.doors[door]);
        }
    }

    this.stopRoom = function(nextRoom) {
        this.roomVelocity = new Coordinates(0, 0);
        nextRoom.roomVelocity = new Coordinates(0, 0);
        nextRoom.setCorners();
        this.isFocus = false;
        nextRoom.isFocus = true;
    }

    this.goToNextRoom = function(nextRoom, direction) {
        switch(direction) {
            case "top":
                if (nextRoom.doors.top.body.position.y < this.corners.topLeft.y_coor) {
                    this.roomVelocity.y_coor = 150;
                    nextRoom.roomVelocity.y_coor = 150;
                } else {
                    this.stopRoom(nextRoom);
                }
                break;
            case "bottom":
                if (nextRoom.doors.bottom.body.position.y + this.wallDepth > this.corners.bottomLeft.y_coor) {
                    this.roomVelocity.y_coor = -150;
                    nextRoom.roomVelocity.y_coor = -150;
                } else {
                    this.stopRoom(nextRoom);
                }
                break;
            case "left":
                if (nextRoom.doors.left.body.position.x < this.corners.topLeft.x_coor) {
                    this.roomVelocity.x_coor = 130;
                    nextRoom.roomVelocity.x_coor = 130;
                } else {
                    this.stopRoom(nextRoom)
                }
                break;
            case "right":
                if (nextRoom.doors.right.body.position.x + this.wallDepth > this.corners.topRight.x_coor) {
                    this.roomVelocity.x_coor = -130;
                    nextRoom.roomVelocity.x_coor = -130;
                } else {
                    this.stopRoom(nextRoom);
                }
                break;
        }

        for (let door in this.doors) {
            this.doors[door].body.velocity.x = this.roomVelocity.x_coor;
            this.doors[door].body.velocity.y = this.roomVelocity.y_coor;
        }
        for (let door in nextRoom.doors) {
            nextRoom.doors[door].body.velocity.x = nextRoom.roomVelocity.x_coor;
            nextRoom.doors[door].body.velocity.y = nextRoom.roomVelocity.y_coor;
        }
        this.walls.forEach(wall => {
            wall.body.velocity.x = this.roomVelocity.x_coor;
            wall.body.velocity.y = this.roomVelocity.y_coor;
        });
        nextRoom.walls.forEach(wall => {
            wall.body.velocity.x = nextRoom.roomVelocity.x_coor;
            wall.body.velocity.y = nextRoom.roomVelocity.y_coor;
        });
    }

    this.destroy = function() {

        for (let door in this.doors) {
            this.doors[door].destroy();
            this.doors[door] = null;
        }
        this.walls.forEach(wall => {
            wall.destroy();
        });
        this.walls = [];
    }

    this.generateEnemies = function() {
        let randomAmount = Math.floor((Math.random() * 4 + 1));
        for (let i = 0; i < randomAmount; i++) {
            this.enemies.push(new Enemy(scene, i, 100 * (i+1), 100 * (i+1), 40, 40, 5));
        }
        for (let enemy of this.enemies) {
            enemy.renderEnemy();
        }
    }
}

const Coordinates = function(x_coor, y_coor) {
    this.x_coor = x_coor;
    this.y_coor = y_coor;
}