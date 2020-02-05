"use strict";

import Phaser from "phaser";

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

const Room = function(scene) {
    this.walls = [];
    this.createWalls = function() {
        renderWalls(this, scene);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    game = new Phaser.Game(phaserConfig);
});

function preload() {

};

function create() {
    initializeGameKeys(this);

    currentRoom = new Room(this);
    currentRoom.createWalls();

    player = this.add.rectangle(game.config.width/2, game.config.height/2, 50, 50, 0xFFFFFF);

    const door1 = this.add.rectangle(game.config.width/2, 20, 100, 40, 0xFFFFFF);
    const door2 = this.add.rectangle(game.config.width/2, game.config.height-20, 100, 40, 0xFFFFFF)
    const door3 = this.add.rectangle(20, game.config.height/2, 40, 100, 0xFFFFFF);
    const door4 = this.add.rectangle(game.config.width-20, game.config.height/2, 40, 100, 0xFFFFFF);


    this.physics.add.existing(player);

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

function renderWalls(room, scene) {    

    let wallDepth = 40;
    let doorLength = 100;
    let wallXLength = (game.config.width - doorLength)/2;
    let wallYLength = (game.config.height - doorLength)/2;

    // Left Top Wall
    room.walls.push(scene.add.rectangle(wallXLength/2, wallDepth/2, wallXLength, wallDepth, 0xFF00FF));
    room.walls.push(scene.add.rectangle(game.config.width - (wallXLength/2), wallDepth/2, wallXLength, wallDepth, 0xFF00FF));

    // Left Right Wall
    room.walls.push(scene.add.rectangle(wallDepth/2, wallYLength/2, wallDepth, wallYLength, 0xFF00FF));
    room.walls.push(scene.add.rectangle(wallDepth/2, game.config.height - wallYLength/2, wallDepth, wallYLength, 0xFF00FF));

    room.walls.push(scene.add.rectangle(game.config.width-(wallDepth/2), wallYLength/2, wallDepth, wallYLength, 0xFF00FF));
    room.walls.push(scene.add.rectangle(game.config.width-(wallDepth/2), game.config.height - (wallYLength/2), wallDepth, wallYLength, 0xFF00FF));

    room.walls.push(scene.add.rectangle(wallXLength/2, game.config.height-(wallDepth/2), wallXLength, wallDepth, 0xFF00FF));
    room.walls.push(scene.add.rectangle(game.config.width - wallXLength/2, game.config.height-(wallDepth/2), wallXLength, wallDepth, 0xFF00FF));

}