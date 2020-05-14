/**
 * @author David Infante, Jose Ariza
 *
 */

class Crosshair extends THREE.Object3D {

    constructor () {
        super();

        this.material = new THREE.LineBasicMaterial({ color: 0x23ff02 });

        this.xLength = 0.0007;
        this.yLength = 0.005;
        this.zLength = 0.0;
        this.crosshairPos = 0.0075;

        this.crosshair = null;

        this.crosshair = this.createRoot();
        this.crosshair.visible = false;
        this.add (this.crosshair);
    }

    createRoot() {
        let root = new THREE.Object3D();
        root.castShadow = false;
        root.autoUpdateMatrix = false;
        root.updateMatrix();
        root.add(this.createCrosshair("U"));
        root.add(this.createCrosshair("D"));
        root.add(this.createCrosshair("L"));
        root.add(this.createCrosshair("R"));
        return root;
    }

    createCrosshair(part) {
        let rectangle = new THREE.Mesh (new THREE.BoxGeometry (this.xLength, this.yLength, this.zLength), this.material);

        rectangle.castShadow = false;
        rectangle.autoUpdateMatrix = false;

        switch (part) {
            case "U":
                rectangle.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, this.crosshairPos, 0));
                break;
            case "D":
                rectangle = new THREE.Mesh (new THREE.BoxGeometry (this.xLength, this.yLength, this.zLength), this.material);
                rectangle.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, -this.crosshairPos, 0));
                break;
            case "L":
                rectangle = new THREE.Mesh (new THREE.BoxGeometry (this.yLength, this.xLength, this.zLength), this.material);
                rectangle.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (-this.crosshairPos, 0, 0));
                break;
            case "R":
                rectangle = new THREE.Mesh (new THREE.BoxGeometry (this.yLength, this.xLength, this.zLength), this.material);
                rectangle.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (this.crosshairPos, 0, 0));
                break;
        }

        rectangle.updateMatrix();

        return rectangle;
    }

    setVisible() {
        this.crosshair.visible = true;
    }
}