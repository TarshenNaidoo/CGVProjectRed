let scene_3D = null;

let renderer_3D = null;
let delta_3D = 1/60; //controls fps timestep

let camera_3D; // = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
let cameraView_3D = true; //control Variable used when switching between 3rd person and 1st person view

let controls_3D; // = new PointerLockControls(camera, document.body);

let zombieNum_3D = 5; //number of zombies within this level
let zombieScale = 7;

//external assets:
let player_3D = null; //see function importPlayer below
let playerAnimation_3D = null; //see function importPlayer below
let playerMixer_3D = null; //see function importPlayer below

//add imported objects here and set them to null

let zombieImportArray_3D = null; //see function importZombie below

let bullet_3D = null; //see function importBullet below
let bulletMixer_3D = null; //see function importBullet below
let bulletAnimation_3D = null; //see function importBullet below

let height_3D = 10; //controls the minimum height of the character so that it doesn't move below ground level

let moveForward_3D = false; //identifies whether the play is moving in this direction
let moveBackward_3D = false; //identifies whether the play is moving in this direction
let moveLeft_3D = false; //identifies whether the play is moving in this direction
let moveRight_3D = false; //identifies whether the play is moving in this direction
let jumping_3D = false; //identifies whether the play is jumping
let flying_3D = false; //identifies whether the play is flying
let shooting_3D = false; //identifies whether the play is shooting
let enableControls_3D = false;
let dev_enableControls_3D = true; //halts animation without showing the pause menu for debugging

function importPlayer(newPlayer){
    //adds the player model and animations to variables
    player_3D = newPlayer.scene;
    player_3D.position.z = 0;
    player_3D.position.y = -0.85;
    player_3D.position.x = -0.25;
    player_3D.rotation.y = Math.PI;

    playerMixer_3D = new THREE.AnimationMixer(player_3D);
    playerAnimation_3D = newPlayer.animations;

}

function importZombie(newZombieArray){
    //array containing zombie models
    zombieImportArray_3D = newZombieArray;
}

function importBullet(newBullet){
    //all bullet objects will share this bullet model and reposition/make visible or invisible when needed
    //animations are imported
    bullet_3D = newBullet.scene;
    bullet_3D.castShadow = true;
    bullet_3D.position.y = 5;
    bullet_3D.position.x = -10;
    bullet_3D.scale.set(0.25,0.25,0.25);
    bullet_3D.visible = false;

    bulletMixer_3D = new THREE.AnimationMixer(bullet_3D);
    bulletAnimation_3D = newBullet.animations;
}

//future function for view switching

function loadControls(newCamera, newControls){
    camera_3D = newCamera;
    controls_3D = newControls;
}

//controls view switching for now until other control schemes are implemented

function switchControls(mode){

    if (mode) {
        scene_3D.avatar.avatar.position.z = -5;
    } else {
        scene_3D.avatar.avatar.position.z = 0;
    }
    console.log(scene_3D.avatar.avatar.position.z)
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

//processes input

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

            case 32: // space
                jumping_3D = true;
                break;
        }
    }

    if (event.keyCode === 80 && !enableControls_3D) { // p
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

            case 187: //'='
                cameraView_3D = !cameraView_3D;
                switchControls(cameraView_3D);
                break;

            case 82: //'r'
                scene_3D.resetScene();
                break;

            case 16: //shift
                flying_3D = false;
                break;

            case 84:
                dev_enableControls_3D = !dev_enableControls_3D;
                break;
        }
    }
}

//changing weapon functionality (not implemented)
function onMouseWheel (event) {
    if (enableControls_3D) {
        if (!shooting_3D) {
            scene_3D.changeWeapon();
        }
    }

}

//attempts to resize window when window dimensions change

function onWindowResize () {
    scene_3D.setCameraAspect(window.innerWidth/window.innerHeight);
    renderer_3D.setSize(window.innerWidth/window.innerHeight);
}

//creates the renderer and sets properties

function createRenderer() {
    let renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 0.1);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMapType
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;
    return renderer;
}

//layer 1 recursive animate function

function animate() {
    requestAnimationFrame(animate);
    //console.log("running");
    scene_3D.animate();
    renderer_3D.render(scene_3D,scene_3D.getCamera());
    scene_3D.simulate(); //simulates physijs objects
}

//Main method

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

    //confirms that browser supports pointer lock controls
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
                controls_3D.enabled = true; //keeps track if game is paused
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

    animate();
}