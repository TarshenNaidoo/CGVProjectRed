class Game{
    int x= 0;
    var canvas, renderer, scene, camera; // Standard three.js requirements
    var controls;  // An OrbitControls object that is used to implement
                   // rotation of the scene using the mouse.  (It actually rotates
                   // the camera around the scene.)

    var animating = false;  // Set to true when an animation is in progress.
    var frameNumber = 0;  // Frame number is advanced by 1 for each frame while animating.

    var tempObject;  // A temporary animated object.  DELETE IT.


    /**
     *  The render function draws the scene.
     */
    function render() {
        renderer.render(scene, camera);
    }


    /**
     * This function is called by the init() method to create the world. 
     */
    function createWorld() {

        renderer.setClearColor("black"); // Background color for scene.
        scene = new THREE.Scene();

        //commented out Richard's code so you can check how things work. you should delete once you understand

        // ------------------- Make a camera with viewpoint light ----------------------

        camera = new THREE.PerspectiveCamera(30, canvas.width/canvas.height, 0.1, 100);
        camera.position.z = 30;
        var light;  // A light shining from the direction of the camera; moves with the camera.
        light = new THREE.DirectionalLight();
        light.position.set(0,0,0);
        camera.add(light);
        scene.add(camera);

        //------------------- Create the scene's visible objects ----------------------

        tempObject =  new THREE.Mesh(  // DELETE THIS !
            new THREE.CylinderGeometry(2,4,8,6,1),
            new THREE.MeshPhongMaterial({
                color: 0x66BBFF,
                specular: 0x222222,
                shininess: 16,
                shading: THREE.FlatShading
            })
        );
        tempObject.rotation.y = Math.PI/12;
        scene.add(tempObject);
        
    } // end function createWorld()


    /**
     *  This function is called once for each frame of the animation, before
     *  the render() function is called for that frame.  It updates any
     *  animated properties.  The value of the global variable frameNumber
     *  is incrementd 1 before this function is called.
     */
    function updateForFrame() {
        //commented out Richard's code so you can check how things work. you should delete once you understand
        // Update size and rotation of tempObject.  DELETE THIS!
        /*var loopFrame = frameNumber % 240;
        if (loopFrame > 120) {
            loopFrame = 240 - loopFrame;
        }
        var scaleFactor = 1 + loopFrame/120;
        tempObject.scale.set(scaleFactor,scaleFactor,scaleFactor);
        tempObject.rotation.y += 0.01;*/

    }


    /* ---------------------------- MOUSE AND ANIMATION SUPPORT ------------------

    /**
     *  This page uses THREE.OrbitControls to let the user use the mouse to rotate
     *  the view.  OrbitControls are designed to be used during an animation, where
     *  the rotation is updated as part of preparing for the next frame.  The scene
     *  is not automatically updated just because the user drags the mouse.  To get
     *  the rotation to work without animation, I add another mouse listener to the
     *  canvas, just to call the render() function when the user drags the mouse.
     *  The same thing holds for touch events -- I call render for any mouse move
     *  event with one touch.
     */
    function installOrbitControls() {
        controls = new THREE.OrbitControls(camera,canvas);
        controls.noPan = true; 
        controls.noZoom = true;
        controls.staticMoving = true;
        function move() {
            controls.update();
            if (! animating) {
                render();
            }
        }
        function down() {
            document.addEventListener("mousemove", move, false);
        }
        function up() {
            document.removeEventListener("mousemove", move, false);
        }
        function touch(event) {
            if (event.touches.length == 1) {
                move();
            }
        }
        canvas.addEventListener("mousedown", down, false);
        canvas.addEventListener("touchmove", touch, false);
    }

    /*  Called when user changes setting of the Animate checkbox. */
    function doAnimateCheckbox() {
       var run = document.getElementById("animateCheckbox").checked;
       if (run != animating) {
           animating = run;
           if (animating) {
               requestAnimationFrame(doFrame);
           }
       }
    }

    /*  Drives the animation, called by system through requestAnimationFrame() */
    function doFrame() {
        if (animating) {
            frameNumber++;
            updateForFrame();
            render();
            requestAnimationFrame(doFrame);
        }
    }

    /*----------------------------- INITIALIZATION ----------------------------------------

    /**
     *  This function is called by the onload event so it will run after the
     *  page has loaded.  It creates the renderer, canvas, and scene objects,
     *  calls createWorld() to add objects to the scene, and renders the
     *  initial view of the scene.  If an error occurs, it is reported.
     */
    function init() {
        try {
            canvas = document.getElementById("glcanvas");
            renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                antialias: true,
                alpha: false
            });
        }
        catch (e) {
            document.getElementById("message").innerHTML="<b>Sorry, an error occurred:<br>" +
                    e + "</b>";
            return;
        }
        document.getElementById("animateCheckbox").checked = false;
        document.getElementById("animateCheckbox").onchange = doAnimateCheckbox;
        createWorld();
        installOrbitControls();
        render();
    }
}
