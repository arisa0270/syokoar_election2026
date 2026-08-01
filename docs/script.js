//--------------------------------------------------
// Version3
// Shoko AR
//--------------------------------------------------

const THREE = window.THREE;
const MindARThree = window.MINDAR.IMAGE.MindARThree;

//==================================================
// Global
//==================================================

let mindarThree;

let renderer;
let scene;
let camera;

let anchor;

let clock = new THREE.Clock();

let character = null;

let particles = [];

let started = false;

const loader = new THREE.TextureLoader();

//==================================================
// Init
//==================================================

async function startAR(){

    //--------------------------------------------------
    // MindAR
    //--------------------------------------------------

    mindarThree = new MindARThree({

        container: document.querySelector("#ar-container"),

        imageTargetSrc: "./assets/targets/target.mind"

    });

    renderer = mindarThree.renderer;

    scene = mindarThree.scene;

    camera = mindarThree.camera;

    anchor = mindarThree.addAnchor(0);

    //--------------------------------------------------
    // Light
    //--------------------------------------------------

    const hemi = new THREE.HemisphereLight(
        0xffffff,
        0x666666,
        1.5
    );

    scene.add(hemi);

    const dir = new THREE.DirectionalLight(
        0xffffff,
        1.3
    );

    dir.position.set(0,5,5);

    scene.add(dir);

    //--------------------------------------------------
    // 認識イベント
    //--------------------------------------------------

    anchor.onTargetFound = ()=>{

        console.log("認識成功");

        if(started) return;

        started = true;

        beginPresentation();

    };

    anchor.onTargetLost = ()=>{

        console.log("認識解除");

    };

    //--------------------------------------------------
    // Start
    //--------------------------------------------------

    await mindarThree.start();

    document
        .getElementById("loading")
        .classList.add("fadeout");

    renderer.setAnimationLoop(loop);

}

//==================================================
// MainLoop
//==================================================

function loop(){

    const delta = clock.getDelta();

    updateParticles(delta);

    updateCharacter(delta);

    renderer.render(scene,camera);

}

//==================================================
// Presentation
//==================================================

function beginPresentation(){

    console.log("Presentation Start");

    createParticles();

    createCharacter();

}

//==================================================
// Particles
//==================================================

function createParticles(){

    const texture = loader.load(
        "./assets/particles/spore.png"
    );

    const material = new THREE.SpriteMaterial({

        map:texture,

        transparent:true,

        depthWrite:false,

        opacity:0.0

    });

    for(let i=0;i<60;i++){

        const sprite = new THREE.Sprite(material.clone());

        sprite.scale.setScalar(

            0.02 + Math.random()*0.03

        );

        sprite.position.set(

            (Math.random()-0.5)*1.6,

            (Math.random()-0.5)*1.8,

            (Math.random()-0.5)*0.4

        );

        sprite.userData={

            speed:0.2+Math.random()*0.5,

            angle:Math.random()*Math.PI*2,

            radius:0.8+Math.random()*0.8,

            alpha:0,

            target:new THREE.Vector3(

                (Math.random()-0.5)*0.35,

                0.15+Math.random()*0.5,

                0

            )

        };

        anchor.group.add(sprite);

        particles.push(sprite);

    }

}

//==================================================

function updateParticles(delta){

    if(!started)return;

    particles.forEach((p)=>{

        p.userData.angle += delta*p.userData.speed;

        p.material.opacity=Math.min(

            1,

            p.material.opacity+delta

        );

        p.position.lerp(

            p.userData.target,

            delta*0.8

        );

        p.scale.multiplyScalar(

            1.0 + delta*0.03

        );

    });

}


//==================================================
// Character
//==================================================

let characterTexture = null;

let characterMaterial = null;

let characterSprite = null;

//--------------------------------------------------

function createCharacter(){

    console.log("立ち絵生成開始");

    characterTexture = loader.load(

        "./assets/characters/cu_open.png",

        ()=>{

            console.log("立ち絵ロード成功");

        },

        undefined,

        (err)=>{

            console.error("立ち絵ロード失敗",err);

        }

    );

    characterTexture.colorSpace = THREE.SRGBColorSpace;

    characterMaterial = new THREE.SpriteMaterial({

        map:characterTexture,

        transparent:true,

        depthWrite:false

    });

    characterSprite = new THREE.Sprite(characterMaterial);

    //--------------------------------------------------
    // サイズ
    //--------------------------------------------------

    characterSprite.scale.set(

        0.9,

        1.35,

        1

    );

    //--------------------------------------------------
    // 位置
    //--------------------------------------------------

    characterSprite.position.set(

        0,

        0.2,

        0

    );

    //--------------------------------------------------
    // 最初は透明
    //--------------------------------------------------

    characterMaterial.opacity = 0;

    anchor.group.add(characterSprite);

}

//==================================================

function showCharacter(){

    if(!characterSprite)return;

    characterMaterial.opacity = Math.min(

        1,

        characterMaterial.opacity + 0.03

    );

}

//==================================================

function updateCharacter(delta){

    if(!characterSprite)return;

    showCharacter();

}