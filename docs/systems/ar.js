import * as THREE from "three";
import { MindARThree } from "mindar-image-three";

export class ARSystem {

    constructor() {

        this.mindar = null;

        this.renderer = null;

        this.scene = null;

        this.camera = null;

        this.anchor = null;

        this.clock = new THREE.Clock();

        this.isTracking = false;

        this.updateCallbacks = [];

    }

    //----------------------------------------------------
    // 初期化
    //----------------------------------------------------

    async init() {

        this.mindar = new MindARThree({

            container: document.querySelector("#ar-container"),

            imageTargetSrc: "./assets/targets/target.mind",

        });

        this.renderer = this.mindar.renderer;

        this.scene = this.mindar.scene;

        this.camera = this.mindar.camera;

        //----------------------------------
        // ライト
        //----------------------------------

        const hemiLight = new THREE.HemisphereLight(

            0xffffff,

            0x8888ff,

            1.3

        );

        this.scene.add(hemiLight);

        const dirLight = new THREE.DirectionalLight(

            0xffffff,

            0.9

        );

        dirLight.position.set(

            0,

            5,

            5

        );

        this.scene.add(dirLight);

        //----------------------------------
        // Anchor
        //----------------------------------

        this.anchor = this.mindar.addAnchor(0);

    }

    //----------------------------------------------------
    // 起動
    //----------------------------------------------------

    async start() {

        await this.mindar.start();

        // ローディングを消す
        const loading = document.querySelector("#loading");

        if (loading) {

            loading.style.display = "none";

        }

        //----------------------------------
        // 認識イベント
        //----------------------------------

        this.anchor.onTargetFound = () => {

            console.log("認識成功");

            this.isTracking = true;

        };

        this.anchor.onTargetLost = () => {

            console.log("認識解除");

            this.isTracking = false;

        };

        //----------------------------------
        // レンダーループ
        //----------------------------------

        this.renderer.setAnimationLoop(() => {

            const delta = this.clock.getDelta();

            // 登録された更新処理を全部実行
            for (const callback of this.updateCallbacks) {

                callback(delta);

            }

            this.renderer.render(

                this.scene,

                this.camera

            );

        });

    }

    //----------------------------------------------------
    // 更新処理を登録
    //----------------------------------------------------

    addUpdate(callback) {

        this.updateCallbacks.push(callback);

    }

    //----------------------------------------------------
    // Anchor取得
    //----------------------------------------------------

    getAnchor() {

        return this.anchor;

    }

    //----------------------------------------------------
    // Scene取得
    //----------------------------------------------------

    getScene() {

        return this.scene;

    }

    //----------------------------------------------------
    // Camera取得
    //----------------------------------------------------

    getCamera() {

        return this.camera;

    }

    //----------------------------------------------------
    // Renderer取得
    //----------------------------------------------------

    getRenderer() {

        return this.renderer;

    }

    //----------------------------------------------------
    // Tracking状態
    //----------------------------------------------------

    isTargetFound() {

        return this.isTracking;

    }

    //----------------------------------------------------
    // Tracking状態取得
    //----------------------------------------------------

    getTrackingState() {

        return this.isTracking;

    }

    //----------------------------------------------------
    // ウィンドウリサイズ
    //----------------------------------------------------

    resize() {

        if (this.renderer) {

            this.renderer.setSize(

                window.innerWidth,

                window.innerHeight

            );

        }

    }

    //----------------------------------------------------
    // 終了処理
    //----------------------------------------------------

    async stop() {

        if (!this.mindar) return;

        this.renderer.setAnimationLoop(null);

        await this.mindar.stop();

    }

}