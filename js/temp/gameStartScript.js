let scene = null;

let stats = null;

let mouseDown = false;

let renderer = null;

let camera = null;

let controls = null;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let jumping = false;
let shooting = false;
let enableControls = false;

function createGUI (withStats) {
    let gui = new dat.GUI();

    if (withStats) stats = initStats();

}

//Requires a previously created div in ZGame to work. Currently not implemented
function initStats(){

    let stats = new Stats();

    stats.setMode(0) //0: fps, 1:ms

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    $("Stats-output").append(stats.domElement);

}

//Requires a previously created div in ZGame to work. Currently not implemented
function  setMessage() {
    document.getElementById("Messages").innerHTML = "<h2>" +str +"</h2>";

}
//processes the player shooting
function onMouseDown (event) {
    if (enableControls) {
        if (event.buttons == 1 && blocker.style.display == 'none') {
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

    if (event.keyCode == 80 && enableControls == false) { // p
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
    let renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth/window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;
    return renderer;
}

function animate() {
    requestAnimationFrame(animate);
    stats.update();
    scene.animate();
    renderer.render(scene,scene.getCamera());
    scene.simulate();
}

//main function

$(function() {
    'use strict';
    Physijs.scripts.worker = '../../exLibs/physijs_worker.js';
    Physijs.scripts.ammo = '../../exLibs/ammo.js';

    let instructions = document.getElementById('insturctions');
    let title = document.getElementById('title');
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

                enableControls = true;

                blocker.style.display = 'none';

            } else {

                blocker.style.display = 'block'

                instructions.style.display = ''

                instructions.style.fontSize = '50px';
                instructions.innerHTML = "Paused";
                enableControls = false;
                controls.enabled = false;
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

    renderer = createRenderer();

    $("WebGL-output").append(renderer.domElement);

    window.addEventListener("resize", onWindowResize);
    window.addEventListener("mousedown", onMouseDown, true);
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("keyup", onkeyup, true);
    window.addEventListener("mousewheel", onMouseWheel, true); //most browsers
    window.addEventListener("DOMMouseScroll", onMouseWheel, true); //for firefox

    scene = new gameScene(renderer.domElement, camera);
    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());

    createGUI(true);

    render();
})