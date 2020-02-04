"use strict";

import Phaser from "phaser";

let canvas = null;
let game = null;


document.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("gradie-window");
    game = new Phaser.Game(phaserConfig());
});

function phaserConfig () {
    let canvasWidth = getComputedStyle(canvas)["width"];
    canvasWidth = parseInt(canvasWidth.slice(0, canvasWidth.length-2));
    let canvasHeight = getComputedStyle(canvas)["height"];
    canvasHeight = parseInt(canvasHeight.slice(0, canvasHeight.length-2));
    let canvasBackground = getComputedStyle(canvas)["background-color"];
    return {
        type: Phaser.CANVAS,
        width: canvasWidth,
        height: canvasHeight,
        backgroundColor: canvasBackground,
        parent: "gradie-window",
        title: "Gradie's Grueling Grind",
        version: "0.0.1",
        scene: {
            preload: preload,
            create: create,
            update: update
        },
        fps: 30
    };
};

function preload() {};
function create () {
    this.add.rectangle(100, 100, 50, 50, 0xFFFFFF);
};
function update () {};