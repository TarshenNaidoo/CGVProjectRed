
let loadDone = 0;
let loadTotal = 0;

import {GLTFLoader} from "../three.js-master/examples/jsm/loaders/GLTFLoader.js";
let gunGtlfloader = new GLTFLoader();

//gun
loadTotal++;
gunGtlfloader.load(
    'models/MagicianAllAni.glb',
    function (playerModel) {
        importPlayer(playerModel);

        loadDone++;
        checkLoad();

    },
    function ( xhr ) {

        console.log('Gun loading: ' + (xhr.loaded/xhr.total * 100) + '%');

    },
    function ( error ) {

        console.error( 'Error loading gun: ' + error);

    }
);

//zombie
let zombieImportArray = [];
let zNum = 5;
zombieNum = zNum;
loadTotal += zNum;
for (let i = 0 ; i < zNum ; i++) {
    let zLoader = new GLTFLoader();
    zLoader.load(
        'models/zombieWalk6.glb',
        function (zombieImport) {

            let zombieImportScene = zombieImport.scene;
            //zombieImportScene.rotation.x = 90;
            zombieImportScene.scale.set(7,7,7);
            zombieImportScene.traverse((object) => {
                if (object.isMesh) object.frustumCulled = false;
            });


            zombieImportArray.push(zombieImportScene);
            if (zombieImportArray.length === zombieNum) {
                importZombie(zombieImportArray);
            }
            loadDone += 1;
            checkLoad();

        },
        function (xhr) {
            console.log('Zombie model loading: ' + (xhr.loaded/xhr.total * 100) + '%');
        },
        function (err) {
            console.error('Error loading Zombie model: ' + err);
        }
    );
}


let bulletLoader = new GLTFLoader();
loadTotal++;
bulletLoader.load(
    './models/metalOrbGit.glb',
    function (bulletImport) {

        importBullet(bulletImport);

        loadDone++;
        checkLoad();
    },
    function (xhr) {
        console.log('Bullet model loading: ' + (xhr.loaded/xhr.total * 100) + '%');
    },
    function (err) {
        console.error('Error loading bullet model: ' + err);
    }
);

//for each object
//create a new gltfLoader() object
//add one to loadtotal for each object imported
// load the object using <loader name>.load(
// '<path to file>',
// function(<import object>){ <onload function>}, ##call a function in gameStartScript and pass parameter to assign to an object
// function(xhr) {<update function>} ##keep console logging in the same format as above
// function(xhr) {<error function>} ##keep console error in the same format as above

/*
let worldLoader = new GLTFLoader();
loadTotal++;
worldLoader.load(
    './models/Draft/world.glb',
    function (worldImport) {

        importWorld(worldImport); //calling function in gameStartScript

        loadDone++;
        checkLoad();

    },
    function (xhr){
        console.log('World model loading: ' + (xhr.loaded/xhr.total * 100) + '%');
    },
    function (err){
    console.error('Error loading world model: ' + err);
    }
)
 */


function checkLoad(){
    if (loadDone === loadTotal){
        console.log("done!")
        let play = document.getElementById("Play_3D");
        play.style.color = "yellowgreen";
        play.innerHTML = "Play!";
        play.onclick = function() {
            loadMain();
        }
    } else {console.log("loading still");}
}

function loadMain(){
    let play = document.getElementById("Play_3D");
    play.style.color = "orange";
    play.innerHTML = "Starting...";
    main_3D();
}
