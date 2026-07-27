import * as THREE from "three";

export class CharacterSystem {

    constructor(anchor) {

        this.anchor = anchor;

        this.characters = [];

        this.loader = new THREE.TextureLoader();

    }

    //------------------------------------------------
    // キャラクター追加
    //------------------------------------------------

    createCharacter(options) {

    const texture = this.loader.load(

        options.texture,

        () => {

            console.log("画像ロード成功");

        },

        undefined,

        (err) => {

            console.error("画像ロード失敗", err);

        }

    );

    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.SpriteMaterial({

        map: texture,

        transparent: true,

    });

    const sprite = new THREE.Sprite(material);

    sprite.scale.set(1,1,1);

    sprite.position.set(0,0,0);

    this.anchor.group.add(sprite);

    this.characters.push(sprite);

    return sprite;

}

    //------------------------------------------------
    // 全員更新
    //------------------------------------------------

    update(delta) {

        for (const sprite of this.characters) {

            sprite.userData.elapsed += delta;

            sprite.position.y =

                sprite.userData.baseY +

                Math.sin(

                    sprite.userData.elapsed *

                    sprite.userData.speed

                ) *

                sprite.userData.amplitude;

        }

    }

}