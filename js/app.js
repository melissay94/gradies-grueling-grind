"use strict";

import Phaser from "phaser";
import Room from "./room.js";
import Clock from "./clock.js";

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
    const timeElement = new Clock();
    let interval = setInterval(() => {
        timeElement.setTime();
    }, timeElement.interval);
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
    
    gameState.player = this.add.rectangle(game.config.width/2, game.config.height/2, 50, 50, 0xFFFFFF);

    gameState.currentRoom = new Room(this, gameState.player, 0xFF00FF, gameState.rooms.length, 0, 0, game.config.width, game.config.height);
    gameState.currentRoom.renderRoom();
    gameState.currentRoom.isFocus = true;
    gameState.rooms.push(gameState.currentRoom.id);

    this.physics.add.existing(gameState.player);

    overlapDoor(this);

    gameState.player.body.collideWorldBounds = true;

};
function update() {

    if (!gameState.enteredDoor.hasEntered) {

        gameState.player.body.velocity.y = 0;
        gameState.player.body.velocity.x = 0;

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
                resetRooms(this, gameState.currentRoom.corners.bottomLeft.x_coor, gameState.currentRoom.corners.bottomLeft.y_coor);
                break;
            case "bottom":
                gameState.currentRoom.goToLowerRoom(gameState.nextRoom);
                resetRooms(this, gameState.currentRoom.corners.topLeft.x_coor, gameState.currentRoom.corners.topLeft.y_coor - game.config.height);
                break;
            case "left":
                gameState.currentRoom.goToLeftRoom(gameState.nextRoom);
                resetRooms(this, gameState.currentRoom.corners.topRight.x_coor, gameState.currentRoom.corners.topLeft.y_coor);
                break;
            case "right":
                gameState.currentRoom.goToRightRoom(gameState.nextRoom);
                resetRooms(this, gameState.currentRoom.corners.topLeft.x_coor - game.config.width, gameState.currentRoom.corners.topLeft.y_coor);
                break;
        }
    }
};

function resetRooms(scene, x, y) {
    if (gameState.nextRoom.isFocus) {
        gameState.enteredDoor.hasEntered = false;
        gameState.enteredDoor.direction = null;
        gameState.currentRoom.destroy();
        gameState.currentRoom.hasRendered = false;
        gameState.currentRoom.setCorners(x, y);
        gameState.currentRoom = gameState.nextRoom;
        overlapDoor(scene);
    }

}

function initializeGameKeys(scene) {
    gameState.wKey = scene.input.keyboard.addKey('w');
    gameState.sKey = scene.input.keyboard.addKey('s');
    gameState.dKey = scene.input.keyboard.addKey('d');
    gameState.aKey = scene.input.keyboard.addKey('a');
    gameState.spaceKey = scene.input.keyboard.addKey('space');
}


function overlapDoor(scene) {
    scene.physics.add.overlap(gameState.player, gameState.currentRoom.doors.top,() => {
        gameState.enteredDoor.hasEntered = true;
        gameState.enteredDoor.direction = "top";

        if (gameState.currentRoom.connectedRooms.top == null) {
            gameState.nextRoom = new Room(scene, gameState.player, 0x00FFFF, gameState.rooms.length, gameState.currentRoom.corners.topLeft.x_coor, gameState.currentRoom.corners.topLeft.y_coor - game.config.height, game.config.width, game.config.height);
            gameState.rooms.push(gameState.nextRoom.id);
            gameState.currentRoom.connectedRooms.top = gameState.nextRoom;
            gameState.nextRoom.connectedRooms.bottom = gameState.currentRoom;
        } else {
            gameState.nextRoom = gameState.currentRoom.connectedRooms.top;
        }

        if (gameState.nextRoom.hasRendered === false) {
            gameState.nextRoom.renderRoom();
        }
            
        gameState.player.body.velocity.y = 80;
    });

    scene.physics.add.overlap(gameState.player, gameState.currentRoom.doors.bottom, () => {
        gameState.enteredDoor.hasEntered = true;
        gameState.enteredDoor.direction = "bottom";

        if (gameState.currentRoom.connectedRooms.bottom == null) {
            gameState.nextRoom = new Room(scene, gameState.player, 0x00FFFF, gameState.rooms.length, gameState.currentRoom.corners.bottomLeft.x_coor, gameState.currentRoom.corners.bottomLeft.y_coor, game.config.width, game.config.height);
            gameState.rooms.push(gameState.nextRoom.id);
            gameState.currentRoom.connectedRooms.bottom = gameState.nextRoom;
            gameState.nextRoom.connectedRooms.top = gameState.currentRoom;
        } else {
            gameState.nextRoom = gameState.currentRoom.connectedRooms.bottom;
        }
        
        if (gameState.nextRoom.hasRendered === false) {
            gameState.nextRoom.renderRoom();
        }

        gameState.player.body.velocity.y = -80;
            
    });

    scene.physics.add.overlap(gameState.player, gameState.currentRoom.doors.left, () => {
        gameState.enteredDoor.hasEntered = true;
        gameState.enteredDoor.direction = "left";

        if (gameState.currentRoom.connectedRooms.left == null) {
            gameState.nextRoom = new Room(scene, gameState.player, 0x00FFFF, gameState.rooms.length, gameState.currentRoom.corners.topLeft.x_coor - game.config.width, gameState.currentRoom.corners.topLeft.y_coor, game.config.width, game.config.height);
            gameState.rooms.push(gameState.nextRoom.id);
            gameState.currentRoom.connectedRooms.left = gameState.nextRoom;
            gameState.nextRoom.connectedRooms.right = gameState.currentRoom;
        } else {
            gameState.nextRoom = gameState.currentRoom.connectedRooms.left;
        }

        if (gameState.nextRoom.hasRendered === false) {
            gameState.nextRoom.renderRoom();
        }
            
        gameState.player.body.velocity.x = 100;
            
    });

    scene.physics.add.overlap(gameState.player, gameState.currentRoom.doors.right, () => {
        gameState.enteredDoor.hasEntered = true;
        gameState.enteredDoor.direction = "right";

        if (gameState.currentRoom.connectedRooms.right == null) {
            gameState.nextRoom = new Room(scene, gameState.player, 0x00FFFF, gameState.rooms.length, gameState.currentRoom.corners.topRight.x_coor, gameState.currentRoom.corners.topLeft.y_coor, game.config.width, game.config.height);
            gameState.rooms.push(gameState.nextRoom.id);
            gameState.currentRoom.connectedRooms.right = gameState.nextRoom;
            gameState.nextRoom.connectedRooms.left = gameState.currentRoom;
        } else {
            gameState.nextRoom = gameState.currentRoom.connectedRooms.right;
        }
        if (gameState.nextRoom.hasRendered === false) {
            gameState.nextRoom.renderRoom();
        }
        gameState.player.body.velocity.x = -100;
            
    });

}