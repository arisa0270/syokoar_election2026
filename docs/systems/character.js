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

        const texture = this.loader.load(options.texture);

        texture.colorSpace = THREE.SRGBColorSpace;

        const material = new THREE.SpriteMaterial({

            map: texture,

            transparent: true,

            depthWrite: false

        });

        const sprite = new THREE.Sprite(material);

        sprite.scale.set(

            options.width,

            options.height,

            1

        );

        sprite.position.set(

            options.x,

            options.y,

            options.z

        );

        sprite.userData = {

            baseY: options.y,

            speed: options.speed ?? 1,

            amplitude: options.amplitude ?? 0.02,

            elapsed: Math.random() * 100

        };

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