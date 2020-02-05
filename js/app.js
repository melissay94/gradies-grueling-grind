"use strict";

import Phaser from "phaser";
import Room from "./room.js";

const gameState = {};

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

    gameState.enteredDoor = false;

    initializeGameKeys(this);

    gameState.currentRoom = new Room(this, 0xFF00FF, game.config.width, game.config.height);
    gameState.currentRoom.setCorners();
    gameState.currentRoom.renderWalls();
    gameState.currentRoom.renderDoors();

    gameState.newRoom = new Room(this, 0x00FFFF, game.config.width, game.config.height);
    gameState.newRoom.setCorners(gameState.currentRoom.corners.topLeft.x_coor, gameState.currentRoom.corners.topLeft.y_coor - gameState.newRoom.height);
    gameState.newRoom.renderWalls();
    gameState.newRoom.renderDoors();

    gameState.player = this.add.rectangle(game.config.width/2, game.config.height/2, 50, 50, 0xFFFFFF);

    this.physics.add.existing(gameState.player);

    for (let door in gameState.currentRoom.doors) {
        this.physics.add.existing(gameState.currentRoom.doors[door]);
    }

    gameState.currentRoom.walls.forEach(wall => {
        this.physics.add.collider(gameState.player, wall);
    });

    gameState.newRoom.walls.forEach(wall => {
        this.physics.add.collider(gameState.player, wall);
    });

    console.log(gameState.currentRoom.walls[0].body.position.y, gameState.newRoom.walls[0].body.position.y);

    this.physics.add.overlap(gameState.player, gameState.currentRoom.doors.top, function() {
        gameState.enteredDoor = true;
            
    })

    gameState.player.body.collideWorldBounds = true;

};
function update() {
    gameState.player.body.velocity.y = 0;
    gameState.player.body.velocity.x = 0;

    if (!gameState.enteredDoor) {

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
        if (gameState.newRoom.walls[0].body.position.y < gameState.currentRoom.corners.topLeft.y_coor) {
            for (let i = 0; i < gameState.newRoom.walls.length; i++) {
                gameState.currentRoom.walls[i].body.velocity.y = 130;
                gameState.newRoom.walls[i].body.velocity.y = 130;
            }
            gameState.player.body.velocity.y = 70
        } else {
            for (let i = 0; i < gameState.newRoom.walls.length; i++) {
                gameState.currentRoom.walls[i].body.velocity.y = 0;
                gameState.newRoom.walls[i].body.velocity.y = 0;
            }
            gameState.newRoom.walls[0].body.velocity.y = 0;
            gameState.enteredDoor = false;
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