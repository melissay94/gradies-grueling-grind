export default function(scene, color, width, height) {

    this.width = width;
    this.height = height;
    this.wallDepth = 40;
    this.doorLength = 100;
    this.wallXLength = (this.width - this.doorLength)/2;
    this.wallYLength = (this.height - this.doorLength)/2;
    this.roomVelocity = 0;

    this.walls = [];

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

        console.log(this.corners);
    
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
        });
    
    }

    this.setCorners = function(x=0, y=0) {        
        this.corners.topLeft = new Coordinates(x, y);
        this.corners.topRight = new Coordinates(x + this.width, y);
        this.corners.bottomLeft = new Coordinates(x, y + this.height);
        this.corners.bottomRight = new Coordinates(x + this.width, y + this.height);
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

    this.goToUpperRoom = function(nextRoom) {
        if (nextRoom.doors.top.body.position.y < this.corners.topLeft.y_coor) {
            this.roomVelocity = 130;
            nextRoom.roomVelocity = 130;
        } else {
            this.roomVelocity = 0;
            nextRoom.roomVelocity = 0;

        }

        for (let door in this.doors) {
            this.doors[door].body.velocity.y = this.roomVelocity;
        }
        for (let door in nextRoom.doors) {
            nextRoom.doors[door].body.velocity.y = nextRoom.roomVelocity;
        }
        this.walls.forEach(wall => {
            wall.body.velocity.y = this.roomVelocity;
        });
        nextRoom.walls.forEach(wall => {
            wall.body.velocity.y = nextRoom.roomVelocity;
        });
    }

    this.goToLowerRoom = function(nextRoom) {
        if (nextRoom.doors.bottom.body.position.y > this.corners.bottomLeft.y_coor) {
            this.roomVelocity = -130;
            nextRoom.roomVelocity = -130;
        } else {
            this.roomVelocity = 0;
            nextRoom.roomVelocity = 0;

        }

        for (let door in this.doors) {
            this.doors[door].body.velocity.y = this.roomVelocity;
        }
        for (let door in nextRoom.doors) {
            nextRoom.doors[door].body.velocity.y = nextRoom.roomVelocity;
        }
        this.walls.forEach(wall => {
            wall.body.velocity.y = this.roomVelocity;
        });
        nextRoom.walls.forEach(wall => {
            wall.body.velocity.y = nextRoom.roomVelocity;
        });
    }

    this.goToLeftRoom = function(nextRoom) {
        if (nextRoom.doors.top.body.position.y > this.corners.topLeft.y_coor) {
            this.roomVelocity = -130;
            nextRoom.roomVelocity = -130;
        } else {
            this.roomVelocity = 0;
            nextRoom.roomVelocity = 0;

        }

        for (let door in this.doors) {
            this.doors[door].body.velocity.x = this.roomVelocity;
        }
        for (let door in nextRoom.doors) {
            nextRoom.doors[door].body.velocity.x = nextRoom.roomVelocity;
        }
        this.walls.forEach(wall => {
            wall.body.velocity.x = this.roomVelocity;
        });
        nextRoom.walls.forEach(wall => {
            wall.body.velocity.x = nextRoom.roomVelocity;
        });
    }
}

const Coordinates = function(x_coor, y_coor) {
    this.x_coor = x_coor;
    this.y_coor = y_coor;
}