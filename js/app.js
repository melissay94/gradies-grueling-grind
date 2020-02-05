"use strict";

import Phaser from "phaser";
import Room from "./room.js";

const gameState = {};

let game = null;
let currentRoom;
let player;

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
    initializeGameKeys(this);

    currentRoom = new Room(this, 0xFF00FF, game.config.width, game.config.height);
    currentRoom.setDefaultCorners();
    currentRoom.renderWalls();
    currentRoom.renderDoors();

    player = this.add.rectangle(game.config.width/2, game.config.height/2, 50, 50, 0xFFFFFF);

    this.physics.add.existing(player);

    for (let door in currentRoom.doors) {
        this.physics.add.existing(currentRoom.doors[door]);
    }

    // this.physics.add.overlap(player, door1, function() {
    //     overlapDoor(this, "up");
    // })

    currentRoom.walls.forEach(wall => {
        this.physics.add.existing(wall);
        wall.body.immovable = true;
        this.physics.add.collider(player, wall);
    });

    player.body.collideWorldBounds = true;

};
function update() {
    player.body.velocity.y = 0;
    player.body.velocity.x = 0;


    if (gameState.sKey.isDown) {
        player.body.velocity.y = 100;
    }
    if (gameState.wKey.isDown) {
        player.body.velocity.y = -100;
    }
    if (gameState.dKey.isDown) {
        player.body.velocity.x = 100;
    }
    if (gameState.aKey.isDown) {
        player.body.velocity.x = -100;
    }

};

function initializeGameKeys(scene) {
    gameState.wKey = scene.input.keyboard.addKey('w');
    gameState.sKey = scene.input.keyboard.addKey('s');
    gameState.dKey = scene.input.keyboard.addKey('d');
    gameState.aKey = scene.input.keyboard.addKey('a');
    gameState.spaceKey = scene.input.keyboard.addKey('space');
}


function overlapDoor(scene, direction) {

    switch(direction) {
        case "up":
            let newRoom = new Room(scene, 0x00FFFF);
            newRoom.createWalls()
            break;
        case "down":
            break;
        case "left":
            break;
        case "right":
            break;
    }

}