export default function(scene, id, x, y, w, h, health) {
    this.health = health;
    this.id = id;
    this.x_coor = x;
    this.y_coor = y;
    this.width = w;
    this.height = h;
    this.enemyObject = null;
    this.body = null;

    this.renderEnemy = function(player, room) {
        this.enemyObject = scene.add.rectangle(this.x_coor, this.y_coor, this.width, this.height, 0xFFFF00);
        scene.physics.add.existing(this.enemyObject);
        this.body = this.enemyObject.body;
        this.body.immovable = true;
        scene.physics.add.collider(this.enemyObject, player);
        for (let wall of room.walls) {
            scene.physics.add.collider(this.enemyObject, wall);
        }
    };
}