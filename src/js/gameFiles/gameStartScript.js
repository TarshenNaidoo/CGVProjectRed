let scene = null;

let stats = null;

let mouseDown = false;

let renderer = null;

let camera;// = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

let controls;// = new PointerLockControls(camera, document.body);

let zombieNum;

//external assets:
let player = null;
let playerAnimation = null;
let playerMixer = null;

let zombieImportArray = null;
let zombieScale = 7;
let bullet = null;

let height = 10;

let delta = 1/60;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let jumping = false;
let shooting = false;
let enableControls = false;

let sceneChildrenDisplayOnce = true;

//window.onload=function(){
    //$('.Play').onclick(main(event));
//}

function importPlayer(newPlayer){
    player = newPlayer.scene;
    player.position.z = 0;
    player.position.y = -0.85;
    player.position.x = -0.25;
    player.rotation.y = Math.PI;

    playerMixer = new THREE.AnimationMixer(player);
    playerAnimation = newPlayer.animations;

}

function importZombie(newZombieArray){
    zombieImportArray = newZombieArray;
}

function importBullet(newBullet){
    bullet = newBullet;
}

function loadControls(newCamera, newControls){
    camera = newCamera;
    controls = newControls;
}

function createGUI (withStats) {
    //let gui = new dat.GUI();

    if (withStats) stats = initStats();

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
    if (enableControls) {
        if (event.buttons === 1 && blocker.style.display === 'none') {
            scene.shoot();
            shooting = true;
        }
    }
}

//processes player movement

function onKeyDown (event) {
    if (enableControls) {
        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 37: // left
            case 65: // a
                moveLeft = true;
                break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;

            case 32: // space
                jumping = true;
                break;
                /* currently we don't have functionality for weapon switching
            case 81: // q
                if (!disparando) scene.changeWeapon();
                break;
                */
        }
    }

    if (event.keyCode === 80 && enableControls === false) { // p
        scene.newGame();
    }
}

function onKeyUp (event) {
    if (enableControls) {
        switch( event.keyCode ) {
            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // s
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;

            case 32: // space
                jumping = false;
                break;
        }
    }
}

//changing weapon functionality
function onMouseWheel (event) {
    if (enableControls) {
        if (!shooting) {
            scene.changeWeapon();
        }
    }

}

function onWindowResize () {
    scene.setCameraAspect(window.innerWidth/window.innerHeight);
    renderer.setSize(window.innerWidth/window.innerHeight);
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
    stats.update();
    //console.log("running");
    scene.animate();
    renderer.render(scene,scene.getCamera());
    scene.simulate();
}

//main function

async function main() {
    let PointerLockControls = await import("../three.js-master/examples/jsm/controls/PointerLockControls.js")
    'use strict';
    Physijs.scripts.worker = '../../exLibs/physijs_worker.js';
    Physijs.scripts.ammo = '../../exLibs/ammo.js';

    let instructions = document.getElementById('instructions');
    let zgame = document.getElementById("Z-GAME");
    let options = document.getElementById("Options");
    let play = document.getElementById("Play");
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
        "            Pause: ESC"
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
                controls.enabled = true;
                scene.isPaused = false;
                enableControls = true;

                blocker.style.display = 'none';

            } else {

                blocker.style.display = 'block'

                instructions.style.display = ''

                instructions.style.fontSize = '50px';
                instructions.innerHTML = "Paused";
                enableControls = false;
                controls.enabled = false;
                scene.isPaused = true;
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

            scene.display();
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

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 10;
    renderer = createRenderer();

    $("WebGL-output").append(renderer.domElement);

    window.addEventListener("resize", onWindowResize);
    window.addEventListener("mousedown", onMouseDown, true);
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("keyup", onKeyUp, true);
    window.addEventListener("mousewheel", onMouseWheel, true); //most browsers
    window.addEventListener("DOMMouseScroll", onMouseWheel, true); //for firefox

    controls = new PointerLockControls.PointerLockControls(camera, document.body);
    scene = new gameScene(renderer.domElement, camera);
    scene.add(controls.getObject());

    createGUI(true);

    animate();
}