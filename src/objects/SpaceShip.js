import Phaser from "phaser";

const DIAGONAL_SPEED = 200 / Math.sqrt(2);

export default class SpaceShip extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "spaceShip");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.name = "spaceShip";
    this.setCollideWorldBounds(true);
    this.invincible = false; // 무적 상태 플래그 추가

    // 속도 설정
    this.speed = 200;
  }

  update(cursors, pointer, curserKeys) {
    this.setVelocity(0);

    if (cursors.left.isDown) {
      this.setVelocityX(-this.speed);
      this.anims.play("spaceShip_left", true);
    } else if (cursors.right.isDown) {
      this.setVelocityX(this.speed);
      this.anims.play("spaceShip_right", true);
    }
    // 터치 입력이 없을 때
    else if (pointer.isDown === false) {
      this.anims.play("spaceShip_straight", true);
    }
    if (cursors.up.isDown) {
      this.setVelocityY(-this.speed);
    } else if (cursors.down.isDown) {
      this.setVelocityY(this.speed);
    }

    if (curserKeys) {
      var s = "Key down: ";
      for (var name in curserKeys) {
        if (curserKeys[name].isDown) {
          s += `${name} `;
          if (name === "down") {
            this.setVelocityY(this.speed);
          } else if (name === "up") {
            this.setVelocityY(-this.speed);
          } else if (name === "left") {
            this.setVelocityX(-this.speed);
            this.anims.play("spaceShip_left", true);
          } else if (name === "right") {
            this.setVelocityX(this.speed);
            this.anims.play("spaceShip_right", true);
          } else if (name === "down_left") {
            this.setVelocityY(DIAGONAL_SPEED);
            this.setVelocityX(-DIAGONAL_SPEED);
            this.anims.play("spaceShip_left", true);
          } else if (name === "down_right") {
            this.setVelocityY(DIAGONAL_SPEED);
            this.setVelocityX(DIAGONAL_SPEED);
            this.anims.play("spaceShip_right", true);
          } else if (name === "up_left") {
            this.setVelocityY(-DIAGONAL_SPEED);
            this.setVelocityX(-DIAGONAL_SPEED);
            this.anims.play("spaceShip_left", true);
          } else if (name === "up_right") {
            this.setVelocityY(-DIAGONAL_SPEED);
            this.setVelocityX(DIAGONAL_SPEED);
            this.anims.play("spaceShip_right", true);
          }
        }
      }
    }

    if (this.scene.lives <= 0) {
      console.log("게임오버");

      //씬 전환
      this.scene.gameOver();
      console.log("게임오버");
    }
  }

  hitEffect() {
    this.scene.sound.play("impact1");
  }

  setInvincible(duration) {
    this.invincible = true;
    // 무적 상태 시 깜빡거림 효과
    this.scene.time.addEvent({
      delay: 100,
      callback: () => {
        this.visible = !this.visible;
      },
      repeat: duration / 100 - 1,
    });

    // 충돌 무시
    this.body.checkCollision.none = true; // 충돌 검사 비활성화

    setTimeout(() => {
      this.invincible = false;
      this.clearTint(); // 무적 상태가 끝나면 색을 원래대로 변경
      this.body.checkCollision.none = false; // 충돌 검사 다시 활성화
    }, duration);
  }
}
