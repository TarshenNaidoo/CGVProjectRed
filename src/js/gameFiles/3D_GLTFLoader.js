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

//Trees
let treeType1Loader = new GLTFLoader();
let treeType1LoaderArray = [];
loadTotal += treeType1Num_3D;
for (let i = 0 ; i < treeType1Num_3D ; i++){
    treeType1Loader.load(
        './models/tree1.glb',
        function (treeType1){
            treeType1LoaderArray.push(treeType1);

            if (treeType1LoaderArray.length === treeType1Num_3D){
                importTreeType1(treeType1LoaderArray);
            }
            loadDone++;
            checkLoad();
        },
        function (xhr) {
            console.log('tree Type 1 model loading: ' + (xhr.loaded/xhr.total * 100) + '%');
        },
        function (err) {
            console.error('Error loading tree type 1 model: ' + err);
        }
    );
}

let treeType2Loader = new GLTFLoader();
let treeType2LoaderArray = [];
loadTotal += treeType2Num_3D;
for (let i = 0 ; i < treeType2Num_3D ; i++){
    treeType2Loader.load(
        './models/tree2.glb',
        function (treeType2){
            treeType2LoaderArray.push(treeType2);

            if (treeType2LoaderArray.length === treeType2Num_3D){
                importTreeType2(treeType2LoaderArray);
            }
            loadDone++;
            checkLoad();
        },
        function (xhr) {
            console.log('tree type 2 model loading: ' + (xhr.loaded/xhr.total * 100) + '%');
        },
        function (err) {
            console.error('Error loading tree type 2 model: ' + err);
        }
    );
}

let treeType3Loader = new GLTFLoader();
let treeType3LoaderArray = [];
loadTotal += treeType3Num_3D;
for (let i = 0 ; i < treeType3Num_3D ; i++){
    treeType3Loader.load(
        './models/tree3.glb',
        function (treeType3){
            treeType3LoaderArray.push(treeType3);

            if (treeType3LoaderArray.length === treeType3Num_3D){
                importTreeType3(treeType3LoaderArray);
            }
            loadDone++;
            checkLoad();
        },
        function (xhr) {
            console.log('tree type 3 model loading: ' + (xhr.loaded/xhr.total * 100) + '%');
        },
        function (err) {
            console.error('Error loading tree type 3 model: ' + err);
        }
    );
}

let rockLoader = new GLTFLoader();
let rockLoaderArray = [];
loadTotal += rockNum_3D;
for (let i = 0 ; i < rockNum_3D ; i++){
    rockLoader.load(
        './models/rock1.glb',
        function (rock){
            rockLoaderArray.push(rock);

            if (rockLoaderArray.length === rockNum_3D){
                importRock(rockLoaderArray);
            }
            loadDone++;
            checkLoad();
        },
        function (xhr) {
            console.log('rocks model loading: ' + (xhr.loaded/xhr.total * 100) + '%');
        },
        function (err) {
            console.error('Error loading rocks model: ' + err);
        }
    );
}

let rockType2Loader = new GLTFLoader();
let rockType2LoaderArray = [];
loadTotal += rockType2Num_3D;
for (let i = 0 ; i < rockType2Num_3D ; i++){
    rockType2Loader.load(
        './models/rock2.glb',
        function (rockType2){
            rockType2LoaderArray.push(rockType2);

            if (rockType2LoaderArray.length === rockType2Num_3D){
                importRockType2(rockType2LoaderArray);
            }
            loadDone++;
            checkLoad();
        },
        function (xhr) {
            console.log('rock type 2 model loading: ' + (xhr.loaded/xhr.total * 100) + '%');
        },
        function (err) {
            console.error('Error loading rock type 2 model: ' + err);
        }
    );
}

//castle
let castleLoader = new GLTFLoader();
loadTotal++;
castleLoader.load(
    './models/castle.glb',
    function(castle){
        importCastle(castle);
        loadDone++;
        checkLoad();
    },
    
    function (xhr) {
        console.log('castle model loading: ' + (xhr.loaded/xhr.total * 100) + '%');
    },
    function (err) {
        console.error('Error loading castle model: ' + err);
    }

)
//castle
let castleType2Loader = new GLTFLoader();
loadTotal++;
castleType2Loader.load(
    './models/castle2.glb',
    function(castleType2){
        importCastleType2(castleType2);
        loadDone++;
        checkLoad();
    },
    
    function (xhr) {
        console.log('castle type 2 model loading: ' + (xhr.loaded/xhr.total * 100) + '%');
    },
    function (err) {
        console.error('Error loading castle type 2 model: ' + err);
    }

)

let castleType3Loader = new GLTFLoader();
loadTotal++;
castleType3Loader.load(
    './models/castle3.glb',
    function(castleType3){
        importCastleType3(castleType3);
        loadDone++;
        checkLoad();
    },
    
    function (xhr) {
        console.log('castle type 3 model loading: ' + (xhr.loaded/xhr.total * 100) + '%');
    },
    function (err) {
        console.error('Error loading castle type 3 model: ' + err);
    }
)

let wallLoader = new GLTFLoader();
loadTotal++;
wallLoader.load(
    './models/wall.glb',
    function(wall){
        importWall(wall);
        loadDone++;
        checkLoad();
    },
    
    function (xhr) {
        console.log('castle wall model loading: ' + (xhr.loaded/xhr.total * 100) + '%');
    },
    function (err) {
        console.error('Error loading wall model: ' + err);
    }

)

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
