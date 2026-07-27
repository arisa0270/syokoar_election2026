import { ARSystem } from "./systems/ar.js";

const ar = new ARSystem();

import { CharacterSystem } from "./systems/character.js";

await ar.init();

const character = new CharacterSystem(

    ar.getAnchor()

);


character.createCharacter({

    texture: "./assets/characters/cu_open.png",

    width: 0.9,

    height: 1.35,

    x: 0,

    y: 0.1,

    z: 0

});

await ar.start();

ar.addUpdate((delta)=>{

    character.update(delta);

});