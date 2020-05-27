let scene_2D = null;

let renderer_2D = null;
let delta_2D = 1/60; //controls fps timestep

let camera_2D; // = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
let cameraView_2D = true; //control Variable used when switching between 3rd person and 1st person view

let controls_2D; // = new PointerLockControls(camera, document.body);

let zombieNum_2D = 5; //number of zombies within this level
let zombieScale = 1;

//external assets:
let player_2D = null; //see function importPlayer below
let playerAnimation_2D = null; //see function importPlayer below
let playerMixer_2D = null; //see function importPlayer below

//add imported objects here and set them to null

let zombieImportArray_2D = null; //see function importZombie below

let bullet_2D = null; //see function importBullet below
let bulletMixer_2D = null; //see function importBullet below
let bulletAnimation_2D = null; //see function importBullet below

let height_2D = 10; //controls the minimum height of the character so that it doesn't move below ground level

let moveForward_2D = false; //identifies whether the play is moving in this direction
let moveBackward_2D = false; //identifies whether the play is moving in this direction
let moveLeft_2D = false; //identifies whether the play is moving in this direction
let moveRight_2D = false; //identifies whether the play is moving in this direction
let jumping_2D = false; //identifies whether the play is jumping
let flying_2D = false; //identifies whether the play is flying
let shooting_2D = false; //identifies whether the play is shooting
let enableControls_2D = false;
let dev_enableControls_2D = true; //halts animation without showing the pause menu for debugging

function importPlayer(newPlayer){
    //adds the player model and animations to variables
    player_2D = newPlayer.scene;
    player_2D.position.z = 0;
    player_2D.position.y = -0.85;
    player_2D.position.x = -0.25;
    player_2D.rotation.y = Math.PI;

    playerMixer_2D = new THREE.AnimationMixer(player_2D);
    playerAnimation_2D = newPlayer.animations;

}

function importZombie(newZombieArray){
    //array containing zombie models
    zombieImportArray_2D = newZombieArray;
}

function importBullet(newBullet){
    //all bullet objects will share this bullet model and reposition/make visible or invisible when needed
    //animations are imported
    bullet_2D = newBullet.scene;
    bullet_2D.castShadow = true;
    bullet_2D.position.y = 5;
    bullet_2D.position.x = -10;
    bullet_2D.scale.set(0.25,0.25,0.25);
    bullet_2D.visible = false;

    bulletMixer_2D = new THREE.AnimationMixer(bullet_2D);
    bulletAnimation_2D = newBullet.animations;
}

//future function for view switching

function loadControls(newCamera, newControls){
    camera_2D = newCamera;
    controls_2D = newControls;
}

//controls view switching for now until other control schemes are implemented

function switchControls(mode){

    if (mode) {
        scene_2D.avatar.avatar.position.z = -5;
    } else {
        scene_2D.avatar.avatar.position.z = 0;
    }
    console.log(scene_2D.avatar.avatar.position.z)
}

//Requires a previously created div in ZGame to work. Currently not implemented
function  setMessage(str) {
    document.getElementById("Messages").innerHTML = "<h2>" +str +"</h2>";

}
//processes the player shooting
function onMouseDown (event) {
    if (enableControls_2D) {
        if (event.buttons === 1 && blocker.style.display === 'none') {
            scene_2D.shoot();
            shooting_2D = true;
        }
    }
}

//processes input

function onKeyDown (event) {
    if (enableControls_2D) {
        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w
                moveForward_2D = true;
                break;

            case 37: // left
            case 65: // a
                moveLeft_2D = true;
                break;

            case 40: // down
            case 83: // s
                moveBackward_2D = true;
                break;

            case 39: // right
            case 68: // d
                moveRight_2D = true;
                break;

            case 16:
                flying_2D = true;
                break;

            case 32: // space
                jumping_2D = true;
                break;
        }
    }

    if (event.keyCode === 80 && !enableControls_2D) { // p
        scene_2D.newGame();
    }
}

function onKeyUp (event) {
    if (enableControls_2D) {
        switch( event.keyCode ) {
            case 38: // up
            case 87: // w
                moveForward_2D = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft_2D = false;
                break;

            case 40: // down
            case 83: // s
                moveBackward_2D = false;
                break;

            case 39: // right
            case 68: // d
                moveRight_2D = false;
                break;

            case 32: // space
                jumping_2D = false;
                break;

            case 187: //'='
                cameraView_2D = !cameraView_2D;
                switchControls(cameraView_2D);
                break;

            case 82: //'r'
                scene_2D.resetScene();
                break;

            case 16: //shift
                flying_2D = false;
                break;

            case 84:
                dev_enableControls_2D = !dev_enableControls_2D;
                break;
        }
    }
}

//changing weapon functionality (not implemented)
function onMouseWheel (event) {
    if (enableControls_2D) {
        if (!shooting_2D) {
            scene_2D.changeWeapon();
        }
    }

}

//attempts to resize window when window dimensions change

function onWindowResize () {
    scene_2D.setCameraAspect(window.innerWidth/window.innerHeight);
    renderer_2D.setSize(window.innerWidth/window.innerHeight);
}

//creates the renderer and sets properties

function createRenderer() {
    let renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 0.1);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;
    return renderer;
}

//layer 1 recursive animate function

function animate() {
    requestAnimationFrame(animate);
    //console.log("running");
    scene_2D.animate();
    renderer_2D.render(scene_2D,scene_2D.getCamera());
    scene_2D.simulate(); //simulates physijs objects
}

//Main method

async function main_2D() {
    let PointerLockControls = await import("../three.js-master/examples/jsm/controls/PointerLockControls.js")
    'use strict';
    Physijs.scripts.worker = '../../exLibs/physijs_worker.js';
    Physijs.scripts.ammo = '../../exLibs/ammo.js';

    let instructions = document.getElementById('instructions');
    let zgame = document.getElementById("Z-GAME");
    let options = document.getElementById("Options");
    let play = document.getElementById("Play_2D");
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
                controls_2D.enabled = true; //keeps track if game is paused
                enableControls_2D = true;

                blocker.style.display = 'none';

            } else {

                blocker.style.display = 'block'

                instructions.style.display = ''

                instructions.style.fontSize = '50px';
                instructions.innerHTML = "Paused";
                enableControls_2D = false;
                controls_2D.enabled = false;
                scene_2D.isPaused = true;
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

            scene_2D.display();
            element.requestPointerLock =
                element.requestPointerLock ||
                element.mozRequestPointerLock ||
                webkitRequestPointerLock;
            element.requestPointerLock();
        }, false);


    } else {
        instructions.innerHTML = 'Your browser doesn\'t support Pointer Lock API';
    }

    camera_2D = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1500);
    camera_2D.position.y = 10;
    renderer_2D = createRenderer();

    $("WebGL-output").append(renderer_2D.domElement);

    window.addEventListener("resize", onWindowResize);
    window.addEventListener("mousedown", onMouseDown, true);
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("keyup", onKeyUp, true);
    window.addEventListener("mousewheel", onMouseWheel, true); //most browsers
    window.addEventListener("DOMMouseScroll", onMouseWheel, true); //for firefox

    controls_2D = new PointerLockControls.PointerLockControls(camera_2D, document.body);
    scene_2D = new gameScene(renderer_2D.domElement, camera_2D, 0,5,0);
    scene_2D.add(controls_2D.getObject());

    animate();
}