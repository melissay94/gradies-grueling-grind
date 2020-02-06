import Phaser from "phaser";

export default function(scene, id, x, y, w, h, health) {
    this.health = health;
    this.id = id;
    this.x_coor = x;
    this.y_coor = y;
    this.vector = new Phaser.Math.Vector2(),
    this.width = w;
    this.height = h;
    this.enemyObject = null;
    this.body = null;
    this.t = 0;
    this.path = scene.add.path();

    this.renderEnemy = function(player, room) {
        this.enemyObject = scene.add.rectangle(this.x_coor, this.y_coor, this.width, this.height, 0xFFFF00);
        scene.physics.add.existing(this.enemyObject);
        this.body = this.enemyObject.body;
        this.body.immovable = true;
        scene.physics.add.collider(this.enemyObject, player);
        for (let wall of room.walls) {
            scene.physics.add.collider(this.enemyObject, wall);
        }
        this.calculatePath();
    };

    this.calculatePath = function() {
        let lineLength = 40;

        let line1 = new Phaser.Curves.Line([this.x_coor, this.y_coor, this.x_coor + lineLength, this.y_coor]);
        let line2 = new Phaser.Curves.Line([this.x_coor + lineLength, this.y_coor, this.x_coor + lineLength, this.y_coor + lineLength]);

        let path1 = new Phaser.Curves.Path(200, 200).lineTo(600, 400);

        this.path.add(line1);
        this.path.add(line2);

        console.log(this.path);

        let moving = scene.add.follower(path1, 0, 0, this.enemyObject);

        moving.startFollow({
            positionOnPath: true,
            duration: 400,
            yoyo: true,
            repeat: -1,
        });
    }

    this.followPath = function() {

    }
}