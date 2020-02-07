import Phaser from "phaser";

export default function(scene) {
    this.health = 10;
    this.speed = 100;
    this.attack = 5;
    this.controls = null;
    this.playerObject = null;
    this.body = null;
    this.direction = "top";
    this.sword = null;
    this.swordLength = 30;
    this.swordVector = new Phaser.Math.Vector2();

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
        this.playerObject = scene.add.sprite(x_coor, y_coor, 'gradie');
        scene.physics.add.existing(this.playerObject);
        this.body = this.playerObject.body;
        this.body.setBounce(1);
        this.indicateDirection();
    }

    this.movePlayer = function() {

        this.body.velocity.y = 0;
        this.body.velocity.x = 0;

        if (this.controls.sKey.isDown) {
            this.body.velocity.y = this.speed;
            this.direction = "bottom";

            this.indicateDirection();
        }
        if (this.controls.wKey.isDown) {
            this.body.velocity.y = -this.speed;
            this.direction = "top";

            this.indicateDirection();
        }
        if (this.controls.dKey.isDown) {
            this.body.velocity.x = this.speed;
            this.direction = "right";

            this.indicateDirection();
        }
        if (this.controls.aKey.isDown) {
            this.body.velocity.x = -this.speed;
            this.direction = "left";

            this.indicateDirection();
        }
        if (Phaser.Input.Keyboard.JustDown(this.controls.spaceKey)) {
            this.stabSword();
        } 

        if ((this.direction === "left" || this.direction === "right") && Math.abs(this.swordVector.x - this.sword.body.position.x) < 2) {
            this.sword.body.reset(this.swordVector.x, this.swordVector.y);

            if (this.swordVector.x !== this.body.position.x) {
                this.pullBackSword();
            }
        }
        if ((this.direction === "top" || this.direction === "bottom") && Math.abs(this.swordVector.y - this.sword.body.position.y) < 2) {
            this.sword.body.reset(this.swordVector.x, this.swordVector.y);

            if (this.swordVector.y !== this.body.position.y) {
                this.pullBackSword();
            }
        }
    }

    this.indicateDirection = function() {
        if (this.sword == null) {
            this.sword = scene.add.sprite(0, 0, 'sword');
            scene.physics.add.existing(this.sword);
        }

        switch(this.direction) {
            case "top":
                this.sword.x = this.body.position.x + 25;
                this.sword.y = this.body.position.y;
                this.sword.width = 5;
                this.sword.height = this.swordLength;
                break;
            case "bottom":
                this.sword.x = this.body.position.x + 25;
                this.sword.y = this.body.position.y + 25;
                this.sword.width = 5;
                this.sword.height = this.swordLength;
                break;
            case "left":
                this.sword.x = this.body.position.x;
                this.sword.y = this.body.position.y + 25;
                this.sword.height = 5;
                this.sword.width = this.swordLength;
                break;
            case "right":
                this.sword.x = this.body.position.x + 25;
                this.sword.y = this.body.position.y + 25;
                this.sword.height = 5;
                this.sword.width = this.swordLength;
                break;
        }
    }

    this.stabSword = function() {
        switch(this.direction) {
            case "top":
                this.swordVector.x = this.sword.body.position.x;
                this.swordVector.y = this.sword.body.position.y - this.swordLength;
                break;
            case "bottom":
                this.swordVector.x = this.sword.body.position.x;
                this.swordVector.y = this.sword.body.position.y + this.swordLength;
                break;
            case "left":
                this.swordVector.x = this.sword.body.position.x - this.swordLength;
                this.swordVector.y = this.sword.body.position.y;
                break;
            case "right":
                this.swordVector.x = this.sword.body.position.x + this.swordLength;
                this.swordVector.y = this.sword.body.position.y;
                break;
        }

        scene.physics.moveToObject(this.sword, this.swordVector, 20, 500);
    }

    this.pullBackSword = function() {

        switch(this.direction) {
            case "top":
                this.swordVector.x = this.body.position.x + 25;
                this.swordVector.y = this.body.position.y;
                break;
            case "bottom":
                this.swordVector.x = this.body.position.x + 25;
                this.swordVector.y = this.body.position.y + 25;
                break;
            case "left":
                this.swordVector.x = this.body.position.x;
                this.swordVector.y = this.body.position.y + 25;
                break;
            case "right":
                this.swordVector.x = this.body.position.x + 25;
                this.swordVector.y = this.body.position.y + 25;
                break;
        } 
        scene.physics.moveToObject(this.sword, this.swordVector, 20, 500);
    }


}
