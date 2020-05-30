// this class will load all objects needed for the game when the game is opened
let loadDone = 0;
let loadTotal = 0;

import {GLTFLoader} from "../three.js-master/examples/jsm/loaders/GLTFLoader.js";
let gunGtlfloader = new GLTFLoader();
let that = this;

//Whenever a new object is going to be imported - i.e. A new importer and asynchronous task is created; increase
//loadTotal by 1 the line before loading the import. When the import is successfully handled, increase loadDone by 1
//and call checkLoad() to verify that no other imports are running and everything is loaded.
//load function is an abstract function as follows:
//<loader name>.load(<import path as string>, function onLoad, function onUpdate, function onError);
//to refer to 3D_gameStartScript context; use 'that' instead of 'this' (context within .load is GLTFLoader.js)

//gun import
loadTotal++;
gunGtlfloader.load(
    'models/MagicianAllNewAnime.glb',
    function (playerModel) {

        playerModel.scene.traverse((object) => {
                if (object.isMesh) {
                    object.frustumCulled = false;
                    object.receiveShadow = true;
                    object.castShadow = true;
                }
            }
        )
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
let zombieImportArray = []; //Will hold all zombie objects of type Object3D or Group (not sure but should be handled the
                            //same
loadTotal += zombieNum_3D;  //zombieNum_3D is declared in 3D_gameStartScript
for (let i = 0 ; i < zombieNum_3D ; i++) {
    let zLoader = new GLTFLoader();
    zLoader.load(
        'models/zombieWalk6.glb',
        function (zombieImport) {

            zombieImport.scene.scale.set(zombieScale,zombieScale,zombieScale);
            zombieImport.scene.traverse((object) => {
                if (object.isMesh){
                    object.frustumCulled = false;
                    object.receiveShadow = true;
                    object.castShadow = true;
                }
                //Traverses Mesh and ensures that the zombie mesh will not be derendered. This is due to a bug where the
                //the bounding box for the mesh is to small. Simplest solution is to prevent this. The performance impact
                //is negligible
            });


            zombieImportArray.push(zombieImport);
            if (zombieImportArray.length === zombieNum_3D) {
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
);

let lanternLoader = new GLTFLoader();
let lanternLoaderArray = [];
loadTotal += lanternNum_3D;
for (let i = 0 ; i < lanternNum_3D ; i++){
    lanternLoader.load(
        './models/lightWStand.glb',
        function (lantern){
            lanternLoaderArray.push(lantern);

            if (lanternLoaderArray.length === lanternNum_3D){
                importLantern(lanternLoaderArray);
            }
            loadDone++;
            checkLoad();
        },
        function (xhr) {
            console.log('Lantern model loading: ' + (xhr.loaded/xhr.total * 100) + '%');
        },
        function (err) {
            console.error('Error loading lantern model: ' + err);
        }
    );
}

let cloudLoaderArray = [];
loadTotal += cloudNum_3D;
for (let i = 0 ; i < cloudNum_3D ; i++) {
    let cloudLoader = new GLTFLoader();
    cloudLoader.load(
        './models/cloudGroupAni.glb',
        function (cloud){
            cloudLoaderArray.push(cloud);

            if (cloudLoaderArray.length === cloudNum_3D){
                importCloud(cloudLoaderArray);
            }
            loadDone++;
            checkLoad();
        },
        function (xhr) {
            console.log('Cloud model loading: ' + (xhr.loaded/xhr.total * 100) + '%');
        },
        function (err) {
            console.error('Error loading Cloud model: ' + err);
        }
    );

}

let puddleContainerLoader = new GLTFLoader();
loadTotal++;
puddleContainerLoader.load(
    './models/WavyContainer1.glb',
    function(container){
        importPuddleContainer(container);
        loadDone++;
        checkLoad();
    },
    function (xhr) {
        console.log('Puddle Container model loading: ' + (xhr.loaded/xhr.total * 100) + '%');
    },
    function (err) {
        console.error('Error loading puddle container model: ' + err);
    }
);



//function checks that all created imports have completed successfully, and then changes text to Play and
//adds onclick function to start the game

function checkLoad(){
    if (loadDone === loadTotal){
        console.log("done!")
        let play = document.getElementById("Play_3D");
        play.style.color = "yellowgreen";
        play.innerHTML = "Play level 1: 3D";
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
