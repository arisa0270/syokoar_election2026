import { ARSystem } from "./systems/ar.js";
import { CharacterSystem } from "./systems/character.js";

async function main() {

    const ar = new ARSystem();

    await ar.init();

    const character = new CharacterSystem(ar.getAnchor());

    character.createCharacter({
        texture: "./assets/characters/cu_open.png",
        width: 1,
        height: 1.5,
        x: 0,
        y: 0,
        z: 0
    });

    ar.addUpdate((delta) => {
        character.update(delta);
    });

    await ar.start();

}

main();