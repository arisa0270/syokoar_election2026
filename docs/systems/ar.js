import * as THREE from "three";
import { MindARThree } from "mindar-image-three";

export async function startAR() {

    const mindarThree = new MindARThree({

        container: document.querySelector("#ar-container"),

        imageTargetSrc: "./assets/targets/target.mind",

    });

    const {

        renderer,
        scene,
        camera

    } = mindarThree;

    //----------------------------------
    // ライト
    //----------------------------------

    const light = new THREE.HemisphereLight(
        0xffffff,
        0xbbbbff,
        1
    );

    scene.add(light);

    //----------------------------------
    // Anchor
    //----------------------------------

    const anchor = mindarThree.addAnchor(0);

    //----------------------------------
    // デバッグ用Cube
    //----------------------------------

    const geometry = new THREE.BoxGeometry(
        0.4,
        0.4,
        0.4
    );

    const material = new THREE.MeshStandardMaterial({

        color: 0x00ff00

    });

    const cube = new THREE.Mesh(
        geometry,
        material
    );

    anchor.group.add(cube);

    //----------------------------------
    // 認識イベント
    //----------------------------------

    anchor.onTargetFound = () => {

        console.log("認識成功！");

    };

    anchor.onTargetLost = () => {

        console.log("認識解除");

    };

    //----------------------------------

    await mindarThree.start();

    document.querySelector("#loading").style.display = "none";

    renderer.setAnimationLoop(() => {

        cube.rotation.y += 0.02;

        renderer.render(scene, camera);

    });

}