"use strict";

import Phaser from "phaser";

let canvas = null;
let game = null;


document.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("gradie-window");
    game = new Phaser.Game(phaserConfig());
});

const phaserConfig = () => {
    return {
        width: getComputedStyle(canvas)["width"],
        height: getComputedStyle(canvas)["height"],
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

const preload = () => {};
const create = () => {};
const update = () => {};