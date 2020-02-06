export default function(scene) {
    this.health = 100;
    this.speed = 100;
    this.attack = 5;
    this.controls = null;
    this.playerObject = null;
    this.body = null;

    this.initializePlayerControls = function() {
        this.controls = {
            wKey: scene.input.keyboard.addKey('w'),
            sKey: scene.input.keyboard.addKey('s'),
            dKey: scene.input.keyboard.addKey('d'),
            aKey: scene.input.keyboard.addKey('a'),
            spaceKey: scene.input.keyboard.addKey('space')
        }
        return this.controls;
    };

    this.renderPlayer = function(x_coor, y_coor) {
        this.playerObject = scene.add.rectangle(x_coor, y_coor, 50, 50, 0xFFFFFF);
        scene.physics.add.existing(this.playerObject);
        this.body = this.playerObject.body;
    }

    this.movePlayer = function() {

        this.body.velocity.y = 0;
        this.body.velocity.x = 0;

        if (this.controls.sKey.isDown) {
            this.body.velocity.y = this.speed;
        }
        if (this.controls.wKey.isDown) {
            this.body.velocity.y = -this.speed;
        }
        if (this.controls.dKey.isDown) {
            this.body.velocity.x = this.speed;
        }
        if (this.controls.aKey.isDown) {
            this.body.velocity.x = -this.speed;
        }
    }
}
