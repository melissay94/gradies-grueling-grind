import Phaser from "phaser";

// export default function(scene, id, x, y, w, h, health) {
//     this.health = health;
//     this.vector = new Phaser.Math.Vector2(),
//     this.width = w;
//     this.height = h;
//     this.enemyObject = null;
//     this.body = null;
//     this.t = 0;
//     this.path = scene.add.path();
//     this.asset = "../assets/adventurer.png";

// Where I got the base idea for extending the sprite class: https://phaser.io/examples/v3/view/physics/arcade/body-on-a-path#

export default new Phaser.Class({

    Extends: Phaser.Physics.Arcade.Sprite,

    initialize: function Enemy(scene, id, startX, startY, endX, endY, w, h, health) {

        Phaser.Physics.Arcade.Sprite.call(this, scene, startX, startY, 'adventurer');

        let line1 = new Phaser.Curves.Line([startX, startY, endX, startY]);
        let line2 = new Phaser.Curves.Line([endX, startY, endX, endY]);
        let line3 = new Phaser.Curves.Line([endX, endY, endX, startY]);
        let line4 = new Phaser.Curves.Line([endX, startY, startX, startY]);

        this.path = new Phaser.Curves.Path();
        this.path.add(line1);
        this.path.add(line2);
        this.path.add(line3);
        this.path.add(line4);

        this.pathIndex = 0;
        this.pathSpeed = 0.0025;
        this.pathVector = new Phaser.Math.Vector2();

        this.path.getPoint(0, this.pathVector);
        this.setPosition(this.pathVector.x, this.pathVector.y);
    }, 

    preUpdate: function(time, delta) {
        this.anims.update(time, delta);
        this.path.getPoint(this.pathIndex, this.pathVector);
        this.setPosition(this.pathVector.x, this.pathVector.y);
        this.pathIndex = Phaser.Math.Wrap(this.pathIndex + this.pathSpeed, 0, 1);

    }
});