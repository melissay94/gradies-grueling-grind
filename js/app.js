"use strict";

import Phaser from "phaser";
import Room from "./room.js";
import Player from "./player.js";
import Clock from "./clock.js";
import Adventurer from "../assets/ghosts.png";
import Gradie from "../assets/gradie.png";
import Sword from "../assets/sword.png";
import TopWall from "../assets/top_wall.png";
import LeftWall from "../assets/left_wall.png";
import BottomWall from "../assets/bottom_wall.png";
import RightWall from "../assets/right_wall.png";
import DoorTop from "../assets/doorway.png";
import DoorRight from "../assets/doorway_right.png";
import DoorLeft from "../assets/doorway_left.png";
import DoorBottom from "../assets/doorway_down.png";
import Floor from "../assets/cave_floor.jpg";


const gameState = {};
gameState.rooms = [];

let game = null;
let interval = null;

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
    
    this.load.image('adventurer', Adventurer);
    this.load.image('gradie', Gradie);
    this.load.image('sword', Sword);
    this.load.image('top_wall', TopWall);
    this.load.image('left_wall', LeftWall);
    this.load.image('bottom_wall', BottomWall);
    this.load.image('right_wall', RightWall);
    this.load.image('floor', Floor);
    this.load.image('doorTop', DoorTop);
    this.load.image('doorRight', DoorRight);
    this.load.image('doorLeft', DoorLeft);
    this.load.image('doorBottom', DoorBottom);

    document.getElementById("reset").style.display = "none";
    const timeElement = new Clock();
    interval = setInterval(() => {
        timeElement.setTime();
    }, timeElement.interval);
};

function create() {

    this.add.image(300, 200, 'floor');

    gameState.enteredDoor = {
        direction: null,
        hasEntered: false
    };
    
    gameState.player = new Player(this);
    document.getElementById("health").textContent = gameState.player.health;

    gameState.controls = gameState.player.initializePlayerControls();   
    
    gameState.player.renderPlayer(game.config.width/2, game.config.height/2);

    gameState.currentRoom = new Room(this, gameState.player, gameState.rooms.length, 0, 0, game.config.width, game.config.height);
    gameState.currentRoom.renderRoom();
    gameState.currentRoom.isFocus = true;
    gameState.rooms.push(gameState.currentRoom.id);

    overlapDoor(this);

    gameState.player.body.collideWorldBounds = true;
};
function update() {

    if (!gameState.enteredDoor.hasEntered) {
        gameState.player.movePlayer();
    } else {
        gameState.currentRoom.goToNextRoom(gameState.nextRoom, gameState.enteredDoor.direction);
        switch(gameState.enteredDoor.direction) {
            case "top":
                resetRooms(this, gameState.currentRoom.corners.bottomLeft.x_coor, gameState.currentRoom.corners.bottomLeft.y_coor);
                break;
            case "bottom":
                resetRooms(this, gameState.currentRoom.corners.topLeft.x_coor, gameState.currentRoom.corners.topLeft.y_coor - game.config.height);
                break;
            case "left":
                resetRooms(this, gameState.currentRoom.corners.topRight.x_coor, gameState.currentRoom.corners.topLeft.y_coor);
                break;
            case "right":
                resetRooms(this, gameState.currentRoom.corners.topLeft.x_coor - game.config.width, gameState.currentRoom.corners.topLeft.y_coor);
                break;
        }
    }

    if (gameState.player.health <= 0) {
        this.scene.pause();
        document.getElementById("reset").style.display = "initial";

        document.getElementById("reset").addEventListener("click", () => {
            this.scene.restart();
            clearInterval(interval);
        });
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

function overlapDoor(scene) {
    for (let doorKey in gameState.currentRoom.doors) {
        scene.physics.add.overlap(gameState.player, gameState.currentRoom.doors[doorKey], () => {
            overlapUpdate(scene, doorKey);
        });
    }
}

function overlapUpdate(scene, direction) {
    gameState.enteredDoor.hasEntered = true;
    let x = null;
    let y = null;

    switch(direction) {
        case "top":
            gameState.enteredDoor.direction = "top";
            x = gameState.currentRoom.corners.topLeft.x_coor;
            y = gameState.currentRoom.corners.topLeft.y_coor - game.config.height;
            gameState.player.body.velocity.y = gameState.player.speed;
            gameState.player.sword.body.velocity.y = gameState.player.speed;
            break;
        case "bottom":
            gameState.enteredDoor.direction = "bottom";
            x = gameState.currentRoom.corners.bottomLeft.x_coor;
            y = gameState.currentRoom.corners.bottomLeft.y_coor;
            gameState.player.body.velocity.y = -gameState.player.speed;
            gameState.player.sword.body.velocity.y = -gameState.player.speed;
            break;
        case "left":
            gameState.enteredDoor.direction = "left";
            x = gameState.currentRoom.corners.topLeft.x_coor - game.config.width;
            y = gameState.currentRoom.corners.topLeft.y_coor;
            gameState.player.body.velocity.x = gameState.player.speed;
            gameState.player.sword.body.velocity.x = gameState.player.speed;
            break;
        case "right":
            gameState.enteredDoor.direction = "right";
            x = gameState.currentRoom.corners.topRight.x_coor;
            y = gameState.currentRoom.corners.topLeft.y_coor;
            gameState.player.body.velocity.x = -gameState.player.speed;
            gameState.player.sword.body.velocity.x = -gameState.player.speed;
            break;
    }

    if (gameState.currentRoom.connectedRooms[direction] == null) {
        gameState.nextRoom = new Room(scene, gameState.player, gameState.rooms.length, x, y, game.config.width, game.config.height);
        gameState.rooms.push(gameState.nextRoom.id);
        gameState.currentRoom.connectedRooms[direction] = gameState.nextRoom;
        let opposite = null;
        switch(direction) {
            case "top":
                opposite = "bottom";
                break;
            case "bottom":
                opposite = "top";
                break;
            case "left":
                opposite = "right";
                break;
            case "right":
                opposite = "left";
                break;
        }
        gameState.nextRoom.connectedRooms[opposite] = gameState.currentRoom;
    } else {
        gameState.nextRoom = gameState.currentRoom.connectedRooms[direction];
    }

    if (gameState.nextRoom.hasRendered === false) {
        gameState.nextRoom.renderRoom();
    }
}