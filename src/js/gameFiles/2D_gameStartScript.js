let scene_2D = null;

let renderer_2D = null;
let delta_2D = 1/60; //controls fps timestep

let camera_2D; // = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
let cameraView_2D = true; //control Variable used when switching between 3rd person and 1st person view


let moveForward_2D = false; //identifies whether the play is moving in this direction
let moveBackward_2D = false; //identifies whether the play is moving in this direction
let moveLeft_2D = false; //identifies whether the play is moving in this direction
let moveRight_2D = false; //identifies whether the play is moving in this direction
let shooting_2D = false; //identifies whether the play is shooting
let enableControls_2D = false; //pause control variable
let dev_enableControls_2D = true; //halts animation without showing the pause menu for debugging



//Requires a previously created div in ZGame to work. Currently not implemented
function  setMessage_2D(str) {
    document.getElementById("Messages").innerHTML = "<h2>" +str +"</h2>";

}
//processes the player shooting
function onMouseDown_2D (event) {
    if (enableControls_2D) {
        if (event.buttons === 1 && blocker.style.display === 'none') {
            scene_2D.shoot();
            shooting_2D = true;
        }
    }
}

function startGame_2D(){

    scene_2D.display();

    enableControls_2D = false;

    let instructions = document.getElementById('instructions');
    instructions.removeEventListener("mousedown", startGame_2D);


}

function togglePause(){
    let blocker = document.getElementById('blocker');
    let instructions = document.getElementById('instructions');

    if (!enableControls_2D){
        blocker.style.display = 'block'

        instructions.style.display = ''

        instructions.style.fontSize = '50px';
        instructions.innerHTML = "Paused";
    } else {
        blocker.style.display = 'none';
    }
}

//processes input

function onKeyDown_2D (event) {
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
        }
    }
}

function onKeyUp_2D (event) {
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

            case 187: //'='
                cameraView_2D = !cameraView_2D;
                switchControls(cameraView_2D);
                break;

            case 82: //'r'
                scene_2D.resetScene();
                break;

            case 84:
                dev_enableControls_2D = !dev_enableControls_2D;
                break;

            case 27:
                enableControls_2D = !enableControls_2D;
                togglePause();
        }
    }
}

//changing weapon functionality (not implemented)
function onMouseWheel_2D (event) {
    if (enableControls_2D) {
        if (!shooting_2D) {
            scene_2D.changeWeapon();
        }
    }

}

//attempts to resize window when window dimensions change

function onWindowResize_2D () {
    scene_2D.setCameraAspect(window.innerWidth/window.innerHeight);
    renderer_2D.setSize(window.innerWidth/window.innerHeight);
}

//creates the renderer and sets properties

function createRenderer_2D() {
    let renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 0.1);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;
    return renderer;
}

//layer 1 recursive animate function

function animate_2D() {
    requestAnimationFrame(animate_2D);
    scene_2D.animate();
    renderer_2D.render(scene_2D,scene_2D.getCamera());
}

//Main method

function main_2D() {
    let blocker = document.getElementById('blocker');
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
        "            Pause: ESC\n" +
        "            <br/>\n" +
        "            See character from behind: =\n" +
        "            <br/>\n" +
        "            Dev Pause: T"
    zgame.innerHTML = "";
    options.innerHTML = "";
    play.innerHTML = "";



    camera_2D = new THREE.OrthographicCamera(45, window.innerWidth / window.innerHeight, 0.1, 1500);
    camera_2D.position.y = 10;
    renderer_2D = createRenderer_2D();

    $("WebGL-output").append(renderer_2D.domElement);

    window.addEventListener("resize", onWindowResize_2D);
    window.addEventListener("mousedown", onMouseDown_2D, true);
    window.addEventListener("keydown", onKeyDown_2D, true);
    window.addEventListener("keyup", onKeyUp_2D, true);
    window.addEventListener("mousewheel", onMouseWheel_2D, true); //most browsers
    window.addEventListener("DOMMouseScroll", onMouseWheel_2D, true); //for firefox

    instructions.addEventListener("mousedown", startGame_2D, true);

    scene_2D = new gameScene2D(camera_2D, 0,5,0);
    scene_2D.add(camera_2D);

    enableControls_2D = true;

    animate_2D();
}