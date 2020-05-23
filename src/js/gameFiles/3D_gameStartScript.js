let scene_3D = null;

let stats_3D = null;

let mouseDown = false;

let renderer_3D = null;
let delta_3D = 1/60;

let camera_3D;// = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
let cameraView_3D = true;

let controls_3D;// = new PointerLockControls(camera, document.body);

let zombieNum_3D;

//external assets:
let player_3D = null;
let playerAnimation_3D = null;
let playerMixer_3D = null;

//add imported objects here and set them to null

let zombieImportArray_3D = null;

let world_3D = null;
let bullet_3D = null;
let bulletMixer_3D = null;
let bulletAnimation_3D = null;

let height_3D = 10;

let moveForward_3D = false;
let moveBackward_3D = false;
let moveLeft_3D = false;
let moveRight_3D = false;
let jumping_3D = false;
let flying_3D = false;
let shooting_3D = false;
let enableControls_3D = false;

function importPlayer(newPlayer){
    player_3D = newPlayer.scene;
    player_3D.position.z = 0;
    player_3D.position.y = -0.85;
    player_3D.position.x = -0.25;
    player_3D.rotation.y = Math.PI;

    playerMixer_3D = new THREE.AnimationMixer(player_3D);
    playerAnimation_3D = newPlayer.animations;

}

function importZombie(newZombieArray){
    zombieImportArray_3D = newZombieArray;
}

function importBullet(newBullet){
    bullet_3D = newBullet.scene;
    bullet_3D.castShadow = true;
    bullet_3D.position.y = 5;
    bullet_3D.position.x = -10;
    bullet_3D.scale.set(0.25,0.25,0.25);
    //bullet.visible = false;

    bulletMixer_3D = new THREE.AnimationMixer(bullet_3D);
    bulletAnimation_3D = newBullet.animations;
}

function importWorld(newWorld){
    world_3D = newWorld.scene;
    world_3D.position.y = 2;
    world_3D.position.z = 20;
}

//add import functions here

function loadControls(newCamera, newControls){
    camera_3D = newCamera;
    controls_3D = newControls;
}

function switchControls(mode){

    if (mode) {
        scene_3D.avatar.avatar.position.z = -5;
    } else {
        scene_3D.avatar.avatar.position.z = 0;
    }
    console.log(scene_3D.avatar.avatar.position.z)
}

function createGUI (withStats) {
    //let gui = new dat.GUI();

    if (withStats) stats_3D = initStats();

}

//Requires a previously created div in ZGame to work. Currently not implemented
function initStats(){

    let stats = new Stats();
    stats.setMode(0) //0: fps, 1:ms

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    //let statsElement = document.getElementById("Stats-output");
    //statsElement.append(stats.domElement);
    $("Stats-output").append(stats.domElement);
    return stats;
    //animate();

}

//Requires a previously created div in ZGame to work. Currently not implemented
function  setMessage(str) {
    document.getElementById("Messages").innerHTML = "<h2>" +str +"</h2>";

}
//processes the player shooting
function onMouseDown (event) {
    if (enableControls_3D) {
        if (event.buttons === 1 && blocker.style.display === 'none') {
            scene_3D.shoot();
            shooting_3D = true;
        }
    }
}

//processes player movement

function onKeyDown (event) {
    if (enableControls_3D) {
        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w
                moveForward_3D = true;
                break;

            case 37: // left
            case 65: // a
                moveLeft_3D = true;
                break;

            case 40: // down
            case 83: // s
                moveBackward_3D = true;
                break;

            case 39: // right
            case 68: // d
                moveRight_3D = true;
                break;

            case 16:
                flying_3D = true;
                break;


                /* currently we don't have functionality for weapon switching
            case 81: // q
                if (!disparando) scene.changeWeapon();
                break;
                */
        }
    }

    if (event.keyCode === 80 && enableControls_3D === false) { // p
        scene_3D.newGame();
    }
}

function onKeyUp (event) {
    if (enableControls_3D) {
        switch( event.keyCode ) {
            case 38: // up
            case 87: // w
                moveForward_3D = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft_3D = false;
                break;

            case 40: // down
            case 83: // s
                moveBackward_3D = false;
                break;

            case 39: // right
            case 68: // d
                moveRight_3D = false;
                break;

            case 32: // space
                jumping_3D = false;
                break;

            case 187:
                cameraView_3D = !cameraView_3D;
                switchControls(cameraView_3D);
                break;

            case 82:
                scene_3D.resetScene();
                break;

            case 32: // space
                jumping_3D = true;
                break;

            case 16:
                flying_3D = false;
                break;
        }
    }
}

//changing weapon functionality
function onMouseWheel (event) {
    if (enableControls_3D) {
        if (!shooting_3D) {
            scene_3D.changeWeapon();
        }
    }

}

function onWindowResize () {
    scene_3D.setCameraAspect(window.innerWidth/window.innerHeight);
    renderer_3D.setSize(window.innerWidth/window.innerHeight);
}

function createRenderer() {
    let renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 0.1);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;
    return renderer;
}

function animate() {
    requestAnimationFrame(animate);
    stats_3D.update();
    //console.log("running");
    scene_3D.animate();
    renderer_3D.render(scene_3D,scene_3D.getCamera());
    scene_3D.simulate();
}

//main function

async function main_3D() {
    let PointerLockControls = await import("../three.js-master/examples/jsm/controls/PointerLockControls.js")
    'use strict';
    Physijs.scripts.worker = '../../exLibs/physijs_worker.js';
    Physijs.scripts.ammo = '../../exLibs/ammo.js';

    let instructions = document.getElementById('instructions');
    let zgame = document.getElementById("Z-GAME");
    let options = document.getElementById("Options");
    let play = document.getElementById("Play_3D");
    instructions.innerHTML= "<span id=\"title\" style=\"font-size:30px\">Click to start game</span>\n" +
        "            <br/>\n" +
        "            Move: WASD\n" +
        "            <br/>\n" +
        "            Jump: Space\n" +
        "            <br/>\n" +
        "            Left click: Shoot\n" +
        "            <br/>\n" +
        "            Look: Mouse\n" +
        "            <br/>\n" +
        "            Pause: ESC\n" +
        "            <br/>\n" +
        "            See character from behind: =\n" +
        "            <br/>\n" +
        "            Fly: SHIFT"
    zgame.innerHTML = "";
    options.innerHTML = "";
    play.innerHTML = "";
    //let title = document.getElementById('title');
    let havePointerLock =
        'pointerLockElement' in document ||
        'mozPointerLockElement' in document ||
        'webkitPointerLockElement' in document;

    if (havePointerLock) {
        let element = document.body;

        let pointerlockchange = function (event) {
            if (
                document.pointerLockElement === element ||
                document.mozPointerLockElement === element ||
                document.webkitPointerLockElement === element
            ) {
                controlsEnabled = true;
                controls_3D.enabled = true;
                scene_3D.isPaused = false;
                enableControls_3D = true;

                blocker.style.display = 'none';

            } else {

                blocker.style.display = 'block'

                instructions.style.display = ''

                instructions.style.fontSize = '50px';
                instructions.innerHTML = "Paused";
                enableControls_3D = false;
                controls_3D.enabled = false;
                scene_3D.isPaused = true;
            }
        };

        let pointerlockerr = function (event) {
            instructions.style.display = '';
        };

        document.addEventListener( 'pointerlockchange', pointerlockchange, false );
        document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
        document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

        document.addEventListener( 'pointerlockerror', pointerlockerr, false );
        document.addEventListener( 'mozpointerlockerror', pointerlockerr, false );
        document.addEventListener( 'webkitpointerlockerror', pointerlockerr, false );


        instructions.addEventListener('click', function (event) {
            instructions.style.display = 'none';

            scene_3D.display();
            element.requestPointerLock =
                element.requestPointerLock ||
                element.mozRequestPointerLock ||
                webkitRequestPointerLock;
            element.requestPointerLock();
        }, false);


    } else {
        instructions.innerHTML = 'Your browser doesn\'t support Pointer Lock API';
    }

    let controlsEnabled = false;

    camera_3D = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1500);
    camera_3D.position.y = 100;
    renderer_3D = createRenderer();

    $("WebGL-output").append(renderer_3D.domElement);

    window.addEventListener("resize", onWindowResize);
    window.addEventListener("mousedown", onMouseDown, true);
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("keyup", onKeyUp, true);
    window.addEventListener("mousewheel", onMouseWheel, true); //most browsers
    window.addEventListener("DOMMouseScroll", onMouseWheel, true); //for firefox

    controls_3D = new PointerLockControls.PointerLockControls(camera_3D, document.body);
    scene_3D = new gameScene(renderer_3D.domElement, camera_3D);
    scene_3D.add(controls_3D.getObject());

    createGUI(true);

    animate();
}