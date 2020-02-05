"use strict";

import Phaser from "phaser";
import Room from "./room.js";

const gameState = {};
gameState.rooms = [];

let game = null;

const phaserConfig = {
    type: Phaser.CANVAS,
    width: 600,
    height: 400,
    backgroundColor: "#222222",
    parent: "gradie-window",
    title: "Gradie's Grueling Grind",
    version: "0.0.1",
    physics: {
        default: 'arcade',
        arcade: {}
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    fps: 30
};


document.addEventListener("DOMContentLoaded", () => {
    game = new Phaser.Game(phaserConfig);
});

function preload() {

};

function create() {

    gameState.enteredDoor = {
        direction: null,
        hasEntered: false
    };

    initializeGameKeys(this);

    gameState.currentRoom = new Room(this, 0xFF00FF, gameState.rooms.length, 0, 0, game.config.width, game.config.height);
    gameState.currentRoom.renderRoom();
    gameState.rooms.push(gameState.currentRoom);

    gameState.player = this.add.rectangle(game.config.width/2, game.config.height/2, 50, 50, 0xFFFFFF);

    this.physics.add.existing(gameState.player);

    gameState.currentRoom.walls.forEach(wall => {
        this.physics.add.collider(gameState.player, wall);
    });

    this.physics.add.overlap(gameState.player, gameState.currentRoom.doors.top,() => {
        gameState.enteredDoor.hasEntered = true;
        gameState.enteredDoor.direction = "top";

        if (gameState.currentRoom.connectedRooms.top == null) {
            gameState.nextRoom = new Room(this, 0x00FFFF, gameState.rooms.length, gameState.currentRoom.corners.topLeft.x_coor, gameState.currentRoom.corners.topLeft.y_coor - game.config.height, game.config.width, game.config.height);
            gameState.nextRoom.renderRoom();
            gameState.currentRoom.connectedRooms.top = gameState.nextRoom;
            gameState.nextRoom.connectedRooms.bottom = gameState.currentRoom;
        } else {
            gameState.nextRoom = gameState.currentRoom.connectedRooms.top;
        }
            
        gameState.player.body.velocity.y += 200;
    });

    this.physics.add.overlap(gameState.player, gameState.currentRoom.doors.bottom, () => {
        gameState.enteredDoor.hasEntered = true;
        gameState.enteredDoor.direction = "bottom";

        if (gameState.currentRoom.connectedRooms.bottom == null) {
            gameState.nextRoom = new Room(this, 0x00FFFF, gameState.rooms.length, gameState.currentRoom.corners.bottomLeft.x_coor, gameState.currentRoom.corners.bottomLeft.y_coor, game.config.width, game.config.height);
            gameState.nextRoom.renderRoom();
            gameState.currentRoom.connectedRooms.bottom = gameState.nextRoom;
            gameState.nextRoom.connectedRooms.top = gameState.currentRoom;
        } else {
            gameState.nextRoom = gameState.currentRoom.connectedRooms.bottom;
        }
            
        gameState.player.body.velocity.y -= 200;
            
    });

    this.physics.add.overlap(gameState.player, gameState.currentRoom.doors.left, () => {
        gameState.enteredDoor.hasEntered = true;
        gameState.enteredDoor.direction = "left";

        if (gameState.currentRoom.connectedRooms.left == null) {
            gameState.nextRoom = new Room(this, 0x00FFFF, gameState.rooms.length, gameState.currentRoom.corners.topLeft.x_coor - game.config.width, gameState.currentRoom.corners.topLeft.y_coor, game.config.width, game.config.height);
            gameState.nextRoom.renderRoom();
            gameState.currentRoom.connectedRooms.left = gameState.nextRoom;
            gameState.nextRoom.connectedRooms.right = gameState.currentRoom;
        } else {
            gameState.nextRoom = gameState.currentRoom.connectedRooms.left;
        }
            
        gameState.player.body.velocity.x -= 200;
            
    });

    this.physics.add.overlap(gameState.player, gameState.currentRoom.doors.right, () => {
        gameState.enteredDoor.hasEntered = true;
        gameState.enteredDoor.direction = "right";

        if (gameState.currentRoom.connectedRooms.right == null) {
            gameState.nextRoom = new Room(this, 0x00FFFF, gameState.rooms.length, gameState.currentRoom.corners.topRight.x_coor, gameState.currentRoom.corners.topLeft.y_coor, game.config.width, game.config.height);
            gameState.nextRoom.renderRoom();
            gameState.currentRoom.connectedRooms.right = gameState.nextRoom;
            gameState.nextRoom.connectedRooms.left = gameState.currentRoom;
        } else {
            gameState.nextRoom = gameState.currentRoom.connectedRooms.right;
        }
            
        gameState.player.body.velocity.x += 200;
            
    });

    gameState.player.body.collideWorldBounds = true;

};
function update() {
    gameState.player.body.velocity.y = 0;
    gameState.player.body.velocity.x = 0;

    if (!gameState.enteredDoor.hasEntered) {

        if (gameState.sKey.isDown) {
            gameState.player.body.velocity.y = 100;
        }
        if (gameState.wKey.isDown) {
            gameState.player.body.velocity.y = -100;
        }
        if (gameState.dKey.isDown) {
            gameState.player.body.velocity.x = 100;
        }
        if (gameState.aKey.isDown) {
            gameState.player.body.velocity.x = -100;
        }
    } else {
        switch(gameState.enteredDoor.direction) {
            case "top":
                gameState.currentRoom.goToUpperRoom(gameState.nextRoom);
                break;
            case "bottom":
                gameState.currentRoom.goToLowerRoom(gameState.nextRoom);
                break;
            case "left":
                gameState.currentRoom.goToLeftRoom(gameState.nextRoom);
                break;
            case "right":
                gameState.currentRoom.goToRightRoom(gameState.nextRoom);
                break;
        }
    }
};

function initializeGameKeys(scene) {
    gameState.wKey = scene.input.keyboard.addKey('w');
    gameState.sKey = scene.input.keyboard.addKey('s');
    gameState.dKey = scene.input.keyboard.addKey('d');
    gameState.aKey = scene.input.keyboard.addKey('a');
    gameState.spaceKey = scene.input.keyboard.addKey('space');
}


// function overlapDoor(scene, direction) {

//     switch(direction) {
//         case "up":
//             let newRoom = new Room(scene, 0x00FFFF);
//             newRoom.createWalls()
//             break;
//         case "down":
//             break;
//         case "left":
//             break;
//         case "right":
//             break;
//     }

// }