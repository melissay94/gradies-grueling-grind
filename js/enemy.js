import Phaser from "phaser";

// export default function(scene, id, x, y, w, h, health) {
//     this.health = health;
//     this.id = id;
//     this.x_coor = x;
//     this.y_coor = y;
//     this.vector = new Phaser.Math.Vector2(),
//     this.width = w;
//     this.height = h;
//     this.enemyObject = null;
//     this.body = null;
//     this.t = 0;
//     this.path = scene.add.path();
//     this.asset = "../assets/adventurer.png";

//     this.load = function(){
//     }

//     this.renderEnemy = function(player, room, sprite) {
//         this.enemyObject = scene.physics.add.sprite(this.x_coor, this.y_coor, 'adventurer');
        
//         this.body = this.enemyObject.body;
//         this.enemyObject.immovable = true;
//         scene.physics.add.collider(this.enemyObject, player);
//         for (let wall of room.walls) {
//             scene.physics.add.collider(this.enemyObject, wall);
//         }

//         this.calculatePath();
//     };

//     this.calculatePath = function() {
//         let lineLength = 40;

//         let line1 = new Phaser.Curves.Line([this.x_coor, this.y_coor, this.x_coor + lineLength, this.y_coor]);
//         let line2 = new Phaser.Curves.Line([this.x_coor + lineLength, this.y_coor, this.x_coor + lineLength, this.y_coor + lineLength]);

//         let path1 = new Phaser.Curves.Path(200, 200).lineTo(600, 400);

//         this.path.add(line1);
//         this.path.add(line2);

//         console.log(this.path);

//         let moving = scene.add.follower(path1, 0, 0, this.enemyObject);

//         moving.startFollow({
//             positionOnPath: true,
//             duration: 400,
//             yoyo: true,
//             repeat: -1,
//         });
//     }

//     this.followPath = function() {

//     }
// }

export default new Phaser.Class({

    Extends: Phaser.Physics.Arcade.Sprite,

    initialize: function Enemy(scene, id, x, y, w, h, health) {
        Phaser.Physics.Arcade.Sprite.call(this, scene, x, y, 'adventurer');

        // Our path

        let line1 = new Phaser.Curves.Line([x, y, x + 40, x]);
        let line2 = new Phaser.Curves.Line([x + 40, y, x + 40, y + 40]);

        this.path = new Phaser.Curves.Path();
        this.path.add(line1);
        this.path.add(line2);

        this.pathIndex = 0;
        this.pathSpeed = 0.01;
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