import { ARSystem } from "./systems/ar.js";

const ar = new ARSystem();

await ar.init();

await ar.start();