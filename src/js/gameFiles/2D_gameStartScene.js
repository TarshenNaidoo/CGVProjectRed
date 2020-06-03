class gameScene2D extends THREE.Scene{

    constructor(theCamera) {
        super();
        this.camera = theCamera;

        this.background = null;
        this.createBackground();

    }

    display(){

    }

    getCamera(){
        return this.camera;
    }

    createBackground(){

        let vertex = new THREE.Vector3();
        let color = new THREE.Color();

        let place = new THREE.Object3D();
        let floorGeometry = new THREE.PlaneBufferGeometry( 2000, 2000, 100, 100 );
        floorGeometry.rotateX( - Math.PI / 2 );

        // vertex displacement

        let position = floorGeometry.attributes.position;

        for ( let i = 0, l = position.count; i < l; i ++ ) {

            vertex.fromBufferAttribute( position, i );

            vertex.x += Math.random() * 20 - 10;
            vertex.y += Math.random() * 2;
            vertex.z += Math.random() * 20 - 10;

            position.setXYZ( i, vertex.x, vertex.y, vertex.z );

        }

        floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

        position = floorGeometry.attributes.position;
        let colors = [];

        for ( let i = 0, l = position.count; i < l; i ++ ) {

            let randVar = Math.random() * 0.5 + 0.25;
            let randR = randVar + (Math.random() - 0.5) * 0.2;
            let randG = randVar + (Math.random() - 0.5) * 0.2;
            let randB = randVar + (Math.random() - 0.5) * 0.2;
            color.setRGB(randR,randG,randB);
            colors.push( color.r, color.g, color.b );

        }

        floorGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

        let floorMaterial = new THREE.MeshPhongMaterial( { vertexColors: true } );

        this.background = new THREE.Mesh( floorGeometry, floorMaterial );
        this.background.receiveShadow = true;
        place.add(this.background);
    }

    animate(){

    }

}