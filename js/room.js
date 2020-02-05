export default function(scene, color, width, height) {

    this.width = width;
    this.height = height;
    this.wallDepth = 40;
    this.doorLength = 100;
    this.wallXLength = (this.width - this.doorLength)/2;
    this.wallYLength = (this.height - this.doorLength)/2;

    this.walls = [];

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
            (this.corners.topLeft.x_coor + this.wallXLength)/2, 
            (this.corners.topLeft.y_coor + this.wallDepth)/2,
             this.wallXLength, this.wallDepth, color));
        // Right Top Wall
        this.walls.push(scene.add.rectangle(
            this.corners.topRight.x_coor - this.wallXLength/2, 
            this.corners.topRight.y_coor + this.wallDepth/2, 
            this.wallXLength, this.wallDepth, color));
    
        // Top Left Wall
        this.walls.push(scene.add.rectangle(
            (this.corners.topLeft.x_coor + this.wallDepth)/2, 
            (this.corners.topLeft.y_coor + this.wallYLength)/2, 
            this.wallDepth, this.wallYLength, color));
        // Bottom Left Wall
        this.walls.push(scene.add.rectangle(
            (this.corners.bottomLeft.x_coor + this.wallDepth)/2,
            this.corners.bottomLeft.y_coor - this.wallYLength/2,
            this.wallDepth, this.wallYLength, color));
    
        // Top Right Wall
        this.walls.push(scene.add.rectangle(
            this.corners.topRight.x_coor - this.wallDepth/2,
            (this.corners.topRight.y_coor + this.wallYLength)/2,
            this.wallDepth, this.wallYLength, color));

        // Bottom Left Wall
        this.walls.push(scene.add.rectangle(
            this.corners.bottomRight.x_coor - this.wallDepth/2,
            this.corners.bottomRight.y_coor - this.wallYLength/2,
            this.wallDepth, this.wallYLength, color));
    
        // Left Bottom Wall
        this.walls.push(scene.add.rectangle(
            (this.corners.bottomLeft.x_coor + this.wallXLength)/2, 
            this.corners.bottomLeft.y_coor - this.wallDepth/2, 
            this.wallXLength, this.wallDepth, color));
        // Right Bottom Wall
        this.walls.push(scene.add.rectangle(
            this.corners.bottomRight.x_coor - this.wallXLength/2,
            this.corners.bottomRight.y_coor - this.wallDepth/2, 
            this.wallXLength, this.wallDepth, color));
    
    }

    this.setDefaultCorners = function() {
        
        this.corners.topLeft = new Coordinates(0, 0);
        this.corners.topRight = new Coordinates(this.width, 0);
        this.corners.bottomLeft = new Coordinates(0, this.height);
        this.corners.bottomRight = new Coordinates(this.width, this.height);
    }

    this.renderDoors = function() {

        this.doors.top = scene.add.rectangle(this.corners.topLeft.x_coor + this.width/2, this.corners.topLeft.y_coor + this.wallDepth/2, this.doorLength, this.wallDepth, 0xFFFFFF);
        this.doors.bottom = scene.add.rectangle(this.corners.topLeft.x_coor + this.width/2, this.height-20, this.doorLength, this.wallDepth, 0xFFFFFF)
        this.doors.left = scene.add.rectangle(this.corners.topLeft.x_coor + this.wallDepth/2, this.corners.topLeft.y_coor + this.height/2, this.wallDepth, this.doorLength, 0xFFFFFF);
        this.doors.right = scene.add.rectangle(this.corners.bottomRight.x_coor - this.wallDepth/2, this.corners.bottomRight.y_coor - this.height/2, this.wallDepth, this.doorLength, 0xFFFFFF);
    }
}

const Coordinates = function(x_coor, y_coor) {
    this.x_coor = x_coor;
    this.y_coor = y_coor;
}