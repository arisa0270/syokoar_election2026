import * as THREE from "three";
import { MindARThree } from "mindar-image-three";

const start = async () => {

    //==============================
    // MindAR初期化
    //==============================

    const mindarThree = new MindARThree({

        container: document.querySelector("#ar-container"),

        imageTargetSrc: "./assets/targets/target.mind",

    });

    const {

        renderer,

        scene,

        camera,

    } = mindarThree;

    //==============================
    // ライト
    //==============================

    const light = new THREE.HemisphereLight(
        0xffffff,
        0xbbbbff,
        1
    );

    scene.add(light);

    //==============================
    // 起動
    //==============================

    await mindarThree.start();

    //==============================
    // ローディング消す
    //==============================

    document.querySelector("#loading").style.display = "none";

    renderer.setAnimationLoop(() => {

        renderer.render(scene, camera);

    });

};

start();