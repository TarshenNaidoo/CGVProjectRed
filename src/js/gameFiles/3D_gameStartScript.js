let scene_3D = null;

let renderer_3D = null;
let delta_3D = 1/60; //controls fps timestep

let camera_3D; // = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
let cameraView_3D = true; //control Variable used when switching between 3rd person and 1st person view

let controls_3D; // = new PointerLockControls(camera, document.body);


//external assets:
let player_3D = null; //see function importPlayer below
let playerAnimation_3D = null; //see function importPlayer below
let playerMixer_3D = null; //see function importPlayer below

let zombieImportArray_3D = []; //see function importZombie below
let zombieNum_3D = Math.floor(Math.random()*15+5); //number of zombies within this level
let zombieScale = 7;

let bullet_3D = null; //see function importBullet below
let bulletMixer_3D = null; //see function importBullet below
let bulletAnimation_3D = null; //see function importBullet below

let lanternNum_3D = Math.floor(Math.random()*15+5);
let lanternArray_3D = [];

let cloudNum_3D = Math.floor(Math.random()*7+3);
let cloudArray_3D = [];

let treeType1Num_3D = Math.floor(Math.random()*9+1);
let treeType1Array_3D = []; //tree objects array

let treeType2Num_3D = Math.floor(Math.random()*9+1);
let treeType2Array_3D = []; //tree objects array

let rockNum_3D = Math.floor(Math.random()*9+1);
let rockArray_3D = []; //rock objects array

let puddleContainer = null;
let puddleContainerScale = 4;

let mirrorControl = 0;

let castle = null; //castle objects
let castleType2 = null; //another castle object
let castleType3 = null; // another castle object

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

    for (let i  = 0 ; i < newZombieArray.length ; i++){
        let zombieMixer_3D = new THREE.AnimationMixer(newZombieArray[i].scene);
        let zombieAnimation_3D = newZombieArray[i].animations;

        zombieImportArray_3D.push([newZombieArray[i].scene, zombieMixer_3D, zombieAnimation_3D]);
    }
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
// --------------- imports the external objects --------------
function importLantern(newLanternArray){
    lanternArray_3D = newLanternArray;
}

function importTreeType1(newTreeType1Array){
    treeType1Array_3D = newTreeType1Array;
}

function importTreeType2(newTreeType2Array){
    treeType2Array_3D = newTreeType2Array;
}

function importCastle(newCastle){
    castle = newCastle;
}

function importCastleType2(newCastleType2){
    castleType2 = newCastleType2;
}

function importCastleType3(newCastleType3){
    castleType3 = newCastleType3;
}

function importRock(newRockArray){
    rockArray_3D = newRockArray;
}

function importCloud(newCloudArray){

    for (let i = 0 ; i < newCloudArray.length ; i++){
        let cloudMixer_3D = new THREE.AnimationMixer(newCloudArray[i].scene);
        let cloudAnimation_3D = newCloudArray[i].animations;

        cloudArray_3D.push([newCloudArray[i].scene, cloudMixer_3D, cloudAnimation_3D]);
    }
}

function importPuddleContainer(newPuddleContainer){
    newPuddleContainer.scene.scale.set(puddleContainerScale,puddleContainerScale,puddleContainerScale);

    puddleContainer = newPuddleContainer;
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
            var listener = new THREE.AudioListener();
		camera_3D.add(listener);
		var audioLoader = new THREE.AudioLoader();
		var sound3 = new THREE.PositionalAudio( listener );
		audioLoader.load( "/src/sounds/Steam-hiss-sound-effect.mp3", function ( buffer ) {

			sound3.setBuffer( buffer );
			sound3.setRefDistance( 20 );
			sound3.setLoop( false );
			sound3.setVolume( 0.4 );
			sound3.play();

		} );
		scene_3D.add(sound3);
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
                var audioJump = new Audio("/src/sounds/Jump-sound.mp3");
	            audioJump.play();
                break;
        }
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

            case 80:
                if (!enableControls_2D){
                    scene_2D.newGame(); //starts a new game at the end screen
                }
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
    renderer.physicallyCorrectLights = true;
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 0.1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    return renderer;
}

//layer 1 recursive animate function

function animate() {
    requestAnimationFrame(animate);
    scene_3D.animate();
    //this makes the puddle reflective
    scene_3D.pudd.visible = false;

    //this makes the mirror in gameScene reflective
    scene_3D.mirrorCube.visible = false;
    //scene_3D.puddCubeCamera.update(renderer_3D,scene_3D);
    mirrorControl++;

    if (mirrorControl % 30 === 0) {
        scene_3D.mirrorCubeCamera.update(renderer_3D,scene_3D);
        mirrorControl = 0;
    }
    scene_3D.mirrorCube.visible = true;
    scene_3D.pudd.visible = true;
    renderer_3D.render(scene_3D,scene_3D.getCamera());

    /*
    This next few lines switches the viewport and scissoring region (only a certain area will be affected), renders the picture in picture
    and resets the viewport and scissoring region
     */
    let initialViewport = new THREE.Vector4();
        renderer_3D.getViewport(initialViewport);
    let initialScissor = new THREE.Vector4();
        renderer_3D.getScissor(initialScissor);

    let currentViewport = new THREE.Vector4(window.innerWidth*0.75, window.innerHeight*0.1,window.innerWidth*0.2, window.innerHeight*0.2);
    let currentScissor = new THREE.Vector4(window.innerWidth*0.75, window.innerHeight*0.1,window.innerWidth*0.2, window.innerHeight*0.2);
    renderer_3D.setViewport(currentViewport);
    renderer_3D.setScissor(currentScissor);
    renderer_3D.setScissorTest(true);

    if (scene_3D.minimap.getObject() != null){
        renderer_3D.render(scene_3D, scene_3D.minimap.getObject());
    }


    renderer_3D.setViewport(initialViewport);
    renderer_3D.setScissor(initialScissor);
    renderer_3D.setScissorTest(false);

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
        "            Fly: SHIFT\n" +
        "            <br/>\n" +
        "            Pause Time: T"
    zgame.innerHTML = "";
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
    camera_3D.position.y = 10;
    renderer_3D = createRenderer();

    $("WebGL-output").append(renderer_3D.domElement);

    window.addEventListener("resize", onWindowResize);
    window.addEventListener("mousedown", onMouseDown, true);
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("keyup", onKeyUp, true);
    window.addEventListener("mousewheel", onMouseWheel, true); //most browsers
    window.addEventListener("DOMMouseScroll", onMouseWheel, true); //for firefox

    controls_3D = new PointerLockControls.PointerLockControls(camera_3D, document.body);
    scene_3D = new gameScene(renderer_3D.domElement, camera_3D, 0,5,0);
    scene_3D.add(controls_3D.getObject());
    
    //adding background sound
	var listener = new THREE.AudioListener();
	camera_3D.add(listener);
	var audioLoader = new THREE.AudioLoader();
	var sound1 = new THREE.PositionalAudio( listener );
	audioLoader.load( "/src/sounds/Battle-music.mp3", function ( buffer ) {

		sound1.setBuffer( buffer );
		sound1.setRefDistance( 20 );
		sound1.setLoop( true );
		sound1.setVolume( 0.5 );
		sound1.play();

	} );
	scene_3D.add(sound1);
	
	//Zombie sounds
	var audioZombo = new THREE.PositionalAudio(listener);
	audioLoader.load( "/src/sounds/Large-Zombie-Horde.mp3", function ( buffer ) {

		audioZombo.setBuffer( buffer );
		audioZombo.setRefDistance( 20 );
		audioZombo.setLoop( true );
		audioZombo.setVolume( 0.25 );
		audioZombo.play();

	} );
	scene_3D.add(audioZombo);

    animate();
}
