import Tunnel from './Tunnel';
const THREE = require('three');
window.THREE = THREE;

export default class Canvas {
  constructor(width, height) {

    this.scene = new THREE.Scene();
    this.xPos = 0;
    this.yPos = 0;
    this.minX = .5;
    this.minY = .5;
    // Set up camera
    this.camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 10000 );
    this.camera.position.set = (0, 0, 7);
    this.camera.lookAt(this.scene.position);
    this.scene.add(this.camera);

    this.mouse = new THREE.Vector2();
    this.scene.fog = new THREE.FogExp2( 0x000000, 0.15 );

    this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000);

    this.tunnel = new Tunnel();
    this.tunnel.position.set(0, 0, 0);
    this.scene.add(this.tunnel);
    this.dom = this.renderer.domElement;
    this.setMousePosition = this.setMousePosition.bind(this);
    document.addEventListener('mousemove', this.setMousePosition);
  }

  resize(width, height) {
    this.composer.setSize(width, height);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  setMousePosition(event) {
    const xPos = ( event.clientX / window.innerWidth ) * 2 - 1;
    const yPos = - ( event.clientY / window.innerHeight ) * 2 + 1;
    if (xPos > this.minX) {
      this.mouse.x = this.minX;
    } else if (xPos < -this.minX) {
      this.mouse.x = -this.minX;
    } else {
      this.mouse.x = xPos;
    }
    if (yPos > this.minX) {
      this.mouse.y = this.minY;
    } else if (yPos < -this.minY) {
      this.mouse.y = -this.minY;
    } else {
      this.mouse.y = yPos;
    }
  }

  render(average, treble, bass, medium) {
    this.renderer.autoClear = false;
    this.renderer.clear();

    this.renderer.render(this.scene, this.camera);
    this.camera.position.x = this.mouse.x;
    this.camera.position.y = this.mouse.y;
    // Update tunnel with audio values
    this.tunnel.update(average, treble, bass, medium);
  }
}
