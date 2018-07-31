const THREE = require('three');

export default class Tunnel extends THREE.Object3D {
  constructor() {
    super();

    this.texture;
    this.globalLight;
    this.topLight;
    this.magicLight;
    this.createTunnel();
    this.min = 8;
    this.max = 15;
    this.minColor = 0.05;
  }

  createTunnel() {
    const geometry  = new THREE.CylinderGeometry( 1.5, 1, 30, 32, 1, true );
    this.texture   = THREE.ImageUtils.loadTexture( "../img/water.jpg" );
    this.texture.wrapT = THREE.RepeatWrapping;

    const material  = new THREE.MeshLambertMaterial({
      color : 0xFFFFFF,
      map : this.texture,
      side: THREE.DoubleSide
    });

    this.tube  = new THREE.Mesh( geometry, material );
    this.tube.rotation.x = Math.PI/2;
    this.tube.flipSided  = true;
    this.add(this.tube);

    this.topLight = new THREE.PointLight( 0xFFFFFF, 15, 25 );
    this.topLight.position.set( 0, -3.5, 0 );
    this.add( this.topLight );

    this.globalLight = new THREE.PointLight( 0xFFFFFF, 15, 25 );
    this.globalLight.position.set( -3.5, 3.5, 0 );
    this.add( this.globalLight );

    this.magicLight = new THREE.PointLight( 0xFFFFFF, 20, 30 );
    this.magicLight.position.set( 3.5, 3.5, 0 );
    this.add( this.magicLight );
  }

  update(average, treble, bass, medium) {
    this.texture.offset.y  -= 0.0035;
    this.texture.offset.y  %= 1;
    this.texture.needsUpdate = true;

    let red = bass / 140;
    let blue = treble / 10;
    let green = medium / 140;

    if (red < this.minColor) red = this.minColor;
    if (blue < this.minColor) blue = this.minColor;
    if (green < this.minColor) green = this.minColor;

    this.topLight.color.setRGB(red, blue, green);
    this.globalLight.color.setRGB(blue, green, red);
    this.magicLight.color.setRGB(green, red, blue);

    let lightIntensity = average / 10;
    if (lightIntensity < this.min) {
      lightIntensity = this.min
    } else if (lightIntensity > this.max) {
      lightIntensity = this.max
    }

    this.topLight.intensity = lightIntensity;
    this.globalLight.intensity = lightIntensity;
    this.magicLight.intensity = lightIntensity;
  }
}
