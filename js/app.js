let canvas = null;
let ctx = null;

document.addEventListener("DOMContentLoaded", () => {
    setUpCanvas();
});

const setUpCanvas = () => {
    canvas = document.getElementById("gradie-window");
    ctx  =game.getContext("2d");
    game.setAttribute("width", getComputedStyle(game)["width"]);
    game.setAttribute("height", getComputedStyle(game)["height"]);
}