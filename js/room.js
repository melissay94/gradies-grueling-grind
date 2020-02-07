import Enemy from "./enemy";

export default function(scene, player, id, x_coor, y_coor, width, height) {

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
    this.colors = [0xFF00FF, 0xFFFF00, 0x00FFFF, 0x0000FF];

    this.walls = null;
    this.enemies = null;

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

        let randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];

        this.walls = scene.physics.add.group({
            immovable: true,
            bounceX: 1,
            bounceY: 1
        });

        // Left Top Wall
        this.walls.add(scene.add.sprite(
            this.corners.topLeft.x_coor + this.wallXLength/2, 
            this.corners.topLeft.y_coor + this.wallDepth/2,
            'top_wall'));

        // Right Top Wall
        this.walls.add(scene.add.sprite(
            this.corners.topRight.x_coor - this.wallXLength/2, 
            this.corners.topRight.y_coor + this.wallDepth/2, 
            'top_wall'));
    
        // Top Left Wall
        this.walls.add(scene.add.sprite(
            this.corners.topLeft.x_coor + this.wallDepth/2, 
            this.corners.topLeft.y_coor + this.wallYLength/2, 
            'left_wall'));
        // Bottom Left Wall
        this.walls.add(scene.add.sprite(
            this.corners.bottomLeft.x_coor + this.wallDepth/2,
            this.corners.bottomLeft.y_coor - this.wallYLength/2,
            'left_wall'));
    
        // Top Right Wall
        this.walls.add(scene.add.sprite(
            this.corners.topRight.x_coor - this.wallDepth/2,
            this.corners.topRight.y_coor + this.wallYLength/2,
            'right_wall'));

        // Bottom Right Wall
        this.walls.add(scene.add.sprite(
            this.corners.bottomRight.x_coor - this.wallDepth/2,
            this.corners.bottomRight.y_coor - this.wallYLength/2,
            'right_wall'));
    
        // Left Bottom Wall
        this.walls.add(scene.add.sprite(
            this.corners.bottomLeft.x_coor + this.wallXLength/2, 
            this.corners.bottomLeft.y_coor - this.wallDepth/2, 
            'bottom_wall'));

        // Right Bottom Wall
        this.walls.add(scene.add.sprite(
            this.corners.bottomRight.x_coor - this.wallXLength/2,
            this.corners.bottomRight.y_coor - this.wallDepth/2, 
            'bottom_wall'));

        scene.physics.add.collider(this.walls, this.player.playerObject);
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
        this.hasRendered = true;
    }

    this.renderDoors = function() {

        this.doors.top = scene.add.sprite(
            this.corners.topLeft.x_coor + this.width/2, 
            this.corners.topLeft.y_coor + this.wallDepth/2, 
            'doorTop');

        this.doors.bottom = scene.add.sprite(
            this.corners.bottomLeft.x_coor + this.width/2, 
            this.corners.bottomLeft.y_coor - this.wallDepth/2, 
            'doorBottom');

        this.doors.left = scene.add.sprite(
            this.corners.topLeft.x_coor + this.wallDepth/2, 
            this.corners.topLeft.y_coor + this.height/2, 
            'doorLeft');

        this.doors.right = scene.add.sprite(
            this.corners.bottomRight.x_coor - this.wallDepth/2, 
            this.corners.bottomRight.y_coor - this.height/2, 
            'doorRight');

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
        this.generateEnemies();
        this.player.sword.body.velocity.x = 0;
        this.player.sword.body.velocity.y = 0;

        scene.physics.add.overlap(this.enemies, this.player.sword, (sword, enemy) => {
            enemy.destroy();
        });
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

        this.walls.setVelocityX(this.roomVelocity.x_coor);
        this.walls.setVelocityY(this.roomVelocity.y_coor);

        nextRoom.walls.setVelocityX(this.roomVelocity.x_coor);
        nextRoom.walls.setVelocityY(this.roomVelocity.y_coor);
        
        
    }

    this.destroy = function() {

        for (let door in this.doors) {
            this.doors[door].destroy();
            this.doors[door] = null;
        }
        this.walls.clear();
    }

    this.generateEnemies = function() {
    
        let randomAmount = Math.floor((Math.random() * 4 + 1));

        let group = scene.physics.add.group({
            bounceX: 1, 
            bounceY: 1,
            collideWorldBounds: true
        });

        for (let i = 0; i < randomAmount; i++) {
            let coordinates = this.generateRandomCoordinates();
            group.create(coordinates.start.x_coor, coordinates.start.y_coor, 'adventurer').setVelocity(100, 100);
        }

        scene.physics.add.collider(group, group);
        scene.physics.add.collider(group, this.player.playerObject, () =>{
            this.player.health -= 1;
            document.getElementById("health").textContent = this.player.health;
        });
        scene.physics.add.collider(group, this.walls, function(enemy, wall) {
            console.log('pink floyd')
        });

        this.enemies = group;
    }

     this.generateRandomCoordinates = function() {
        let xStart = this.corners.topLeft.x_coor + this.wallDepth + 20;
        let xEnd = this.corners.topRight.x_coor/2;
        let xRandom = Math.floor(Math.random() * (xEnd - xStart)) + xStart;

        let xRange = this.corners.topRight.x_coor - this.wallDepth - xRandom - 20;
        let xRangeRandom = Math.floor(Math.random() * xRange);
    
        let yStart = this.corners.topLeft.y_coor + this.wallDepth + 20;
        let yEnd = this.corners.bottomLeft.y_coor/2;
        let yRandom = Math.floor(Math.random() * (yEnd - yStart)) + yStart;

        let yRange = this.corners.bottomLeft.y_coor - this.wallDepth - yRandom - 20;
        let yRangeRandom = Math.floor(Math.random() * yRange);
    
        return {
            start: new Coordinates(xRandom, yRandom), 
            end: new Coordinates(xRandom + xRangeRandom, yRandom + yRangeRandom)
        };
    }
}

const Coordinates = function(x_coor, y_coor) {
    this.x_coor = x_coor;
    this.y_coor = y_coor;
}

