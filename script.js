import './style.css'
import * as THREE from 'three';
import imageSource from '../static/skyBox.jpg';
import imageSource2 from '../static/test.jpg';
import * as dat from 'dat.gui';
import { DoubleSide } from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
//
import { parachutist } from "./physics/parachutist";

var windowSize = {
  width: window.innerWidth,
  height: window.innerHeight
}
var options = {

  position: {
    x: 0,
    y: 4000,
    z: 0
  },
  gravity: {
    x: 0,
    y: 0,
    z: 0
  },
  speed: {
    x: 0,
    y: 0,
    z: 0
  },
  acceleration: {
    x: 0,
    y: 0,
    z: 0
  },//  التسارع
  resistance: 0,//  مقاومة الهواء
  terminal_velocity1: 0,//  مقاومة الهواء
  terminal_velocity2: 0,//  مقاومة الهواء
  pressure: 0,//  الضغط الجوي
  temperature: 3,
  air_power: 0,
  air_direction: 0,
  size: 0,
  camera_state: 1,
  height: 0,
  intensity: 0,
  safety: false,
  state: false,
  weight: 100,
  bag_weight: 7,
  time: 0
}

const directionalLight = new THREE.DirectionalLight(0xA09B50, 3);
const canvas = document.querySelector('canvas.webgl')
//start model
const person = new THREE.Group();
const airplane_ = new THREE.Group();
const gltfLoader = new GLTFLoader();

gltfLoader.load(
  '/models/us_assault/us_assault.gltf',
  (gltf) => {
    gltf.scene.scale.set(0.1, 0.1, 0.1)
    gltf.scene.position.y = -24
    gltf.scene.position.x = +2
    gltf.scene.position.z = +2
    gltf.scene.rotation.y = 1
    person.add(gltf.scene);
  })

const gltfLoader2 = new GLTFLoader();
gltfLoader2.load(
  '/models/LP_Airplane.gltf',
  (gltf) => {
    gltf.scene.rotation.y = -0.4
    gltf.scene.position.y = 4000 - 20;
    gltf.scene.scale.set(40, 40, 40);
    airplane_.add(gltf.scene);

  })
//  start textuer
const skyimg = new Image();
const skyTextuer = new THREE.Texture(skyimg)
skyimg.onload = () => {
  skyTextuer.needsUpdate = true;
}
skyimg.src = imageSource;
const bagimg = new Image();
const greenTextuer = new THREE.Texture(bagimg)
bagimg.onload = () => {
  greenTextuer.needsUpdate = true;
}
bagimg.src = imageSource2
//  end textuer

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, windowSize.width / windowSize.height, 0.1, 1000000);
const renderer = new THREE.WebGLRenderer();

window.addEventListener('resize', () => {
  // this for responsevalty
  windowSize.width = window.innerWidth;
  windowSize.height = window.innerHeight;
  camera.aspect = windowSize.width / windowSize.height;
  camera.updateProjectionMatrix();
  renderer.setSize(windowSize.width, windowSize.height);
});

renderer.setSize(windowSize.width, windowSize.height);
document.body.appendChild(renderer.domElement);
camera.position.z = 40;

//drow parachut
const geometry = new THREE.SphereGeometry(17, 12, 12, 1.5707963267949, 2.11115026321234, 0.383274303737955, 2.34362811957799);
const material = new THREE.MeshBasicMaterial({ map: greenTextuer });
material.wireframe = false;
material.transparent = true;
material.side = DoubleSide;
const sphere = new THREE.Mesh(geometry, material);
sphere.rotation.x = -6.88;
sphere.rotation.y = 7;
sphere.rotation.z = 2;

//draw network 
const networkgeometry = new THREE.SphereGeometry(17, 12, 12, 1.5707963267949, 2.11115026321234, 0.383274303737955, 2.34362811957799);
const networkmaterial = new THREE.MeshBasicMaterial({ color: 0x002100 });
networkmaterial.wireframe = true;
networkmaterial.transparent = true;
networkmaterial.side = DoubleSide;
const networksphere = new THREE.Mesh(networkgeometry, networkmaterial);
networksphere.rotation.x = -6.88;
networksphere.rotation.y = 7;
networksphere.position.y += 0.1;
networksphere.rotation.z = 2;
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x002100 });
const points = [];
points.push(new THREE.Vector3(15, 3, -7));
points.push(new THREE.Vector3(0, -10, 0));
points.push(new THREE.Vector3(6, 4, -15));
points.push(new THREE.Vector3(0, -10, 0));
points.push(new THREE.Vector3(-6.5, 3, 16));
points.push(new THREE.Vector3(0, -10, 0));
points.push(new THREE.Vector3(-15, 3.5, 8));
const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(lineGeometry, lineMaterial);
const group = new THREE.Group();
group.add(sphere);
group.add(networksphere);
group.add(line);
scene.add(directionalLight);

// drow skybox
let materialArray = [];
let texture_ft = new THREE.TextureLoader().load("desertdawn_ft.jpg");
let texture_bk = new THREE.TextureLoader().load("desertdawn_bk.jpg");
let texture_up = new THREE.TextureLoader().load("desertdawn_up.jpg");
let texture_dn = new THREE.TextureLoader().load("desertdawn_dn.jpg");
let texture_rt = new THREE.TextureLoader().load("desertdawn_rt.jpg");
let texture_lf = new THREE.TextureLoader().load("desertdawn_lf.jpg");
materialArray.push(new THREE.MeshBasicMaterial({ map: skyTextuer }));
materialArray.push(new THREE.MeshBasicMaterial({ map: skyTextuer }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_dn }));//up
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_up }));//down
materialArray.push(new THREE.MeshBasicMaterial({ map: skyTextuer }));
materialArray.push(new THREE.MeshBasicMaterial({ map: skyTextuer }));

for (let i = 0; i < 6; i++) materialArray[i].side = THREE.BackSide;

let skyboxGeo = new THREE.BoxGeometry(20000, 20000, 20000);
let skybox = new THREE.Mesh(skyboxGeo, materialArray);
skybox.position.setY(10000);
scene.add(skybox);

const skyBoxGeometry = new THREE.BoxGeometry(100000, 100000, 100000);
const skyBoxMaterial1 = new THREE.MeshBasicMaterial({ map: skyTextuer });
const skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial1);
skyBoxMaterial1.side = DoubleSide;

person.add(group);
person.rotation.y = -0.75
scene.add(person, airplane_);

const gui = new dat.GUI();

const player_position = gui.addFolder('position');
player_position.add(options.position, "x").name("position  (X):").listen();
player_position.add(options.position, "y").name("position  (Y):").listen();
player_position.add(options.position, "z").name("position  (Z):").listen();
player_position.open();

const player_state = gui.addFolder('states');
player_state.add(options, "state").name("open").onChange(() => { state = true });
player_state.add(options, "size").name("size").min(0).max(30).step(0.001).listen();
player_state.add(options, "bag_weight").name("bag weight").min(0).listen();
player_state.add(options, "time").step(0.01).listen()
player_state.open();

const player_options = gui.addFolder('options');
player_options.add(options.gravity, "y").name("gravity").listen().step(0.001);
player_options.add(options.speed, "x").name("speed in X").listen().step(0.000001);
player_options.add(options.speed, "y").name("speed in Y").listen().step(0.000001);
player_options.add(options.speed, "z").name("speed in Z").listen().step(0.000001);;
player_options.add(options, "terminal_velocity1").name("tVelocity1").listen();
player_options.add(options, "terminal_velocity2").name("tVelocity2").listen();
player_options.add(options.acceleration, "x").name("acceleration in X").step(0.000001).listen();
player_options.add(options.acceleration, "y").name("acceleration in Y").step(0.000001).listen();
player_options.add(options.acceleration, "z").name("acceleration in Z").step(0.000001).listen();
player_options.add(options, "weight").name("player weight").min(0).step(0.1).listen();
player_options.add(options, "intensity").name("collision intensity").listen();
player_options.add(options, "safety").name("landing safety").listen();

player_options.open();

const air_options = gui.addFolder('air_options');
air_options.add(options, "resistance").name("air resistance").listen();
air_options.add(options, "air_power").name("air power").step(0.1);
air_options.add(options, "air_direction").name("air direction");
air_options.open();

const camera_option_1 = () => {
  camera.position.x = options.position.x - 200;
  camera.position.y = options.position.y + 70;
  camera.position.z = options.position.z - 85;
  camera.rotation.y = -2
}

const move_camera = () => {
  if (camera.position.x < person.position.x)
    camera.position.x += 8
  if (camera.position.y > person.position.y)
    camera.position.y -= 2
  if (camera.position.z < person.position.z + 40)
    camera.position.z += 2
  if (camera.rotation.y < 0)
    camera.rotation.y += 0.02
}

document.body.onkeyup = function (e) {
  if (e.key == " " ||
    e.code == "Space" ||
    e.keyCode == 32
  ) {
    options.camera_state = 2;
    person.children[0].scale.set(0, 0, 0)
  }
}

var state = false;
const input = () => {
  if (options.size > 0)
    options.size -= 0.2
  if (options.size < 0.1 && options.height > 0)
    options.height -= 0.1
  if (options.height < 0) {
    options.height = 0;
    state = false;
  }
}

const open = () => {
  if (options.size < 10 && options.height > 0.8)
    options.size += 0.2
  if (options.height < 1)
    options.height += 0.2
  if (options.size > 10) {
    options.height = 1
    state = false
  }
}

// physics - Create Object from parachutist Class
const para = new parachutist(
  options.position,
  options.weight,
  options.bag_weight,
  options.size,
  options.temperature,
  options.air_power,
  options.air_direction,
  1.2,
  1
);
let oldTime = 0
const clock = new THREE.Clock();
function animate() {
  if (state) {
    if (!options.state)
      input();
    if (options.state)
      open();
  }
  group.scale.x = options.size / 10;
  group.scale.z = options.size / 10;
  group.scale.y = options.height;

  person.position.x = options.position.x;
  person.position.y = options.position.y;
  person.position.z = options.position.z;

  camera.position.y = options.position.y;
  camera.position.x = options.position.x;
  camera.position.z = options.position.z - 40;

  if (options.camera_state === 1) {
    camera_option_1();
    airplane_.position.x += 2
    airplane_.position.z += 1
    para.position._x = options.position.x;
    para.position._z = options.position.z;
    para.position._y = options.position.y
    person.position.x = airplane_.position.x;
    person.position.z = airplane_.position.z;
    options.position.x = airplane_.position.x;
    options.position.z = airplane_.position.z;
  }
  if (options.camera_state === 2 && options.position.y > 40) {
    para.paratRadius = options.size
    para.windSpeed = options.air_power
    para.windDirection = options.air_direction
    para.paratrooperMass = options.weight
    para.bagMass = options.bag_weight
    options.speed.x = para.velocity._x;
    options.speed.y = para.velocity._y;
    options.speed.z = para.velocity._z;
    options.acceleration.x = para.acc._x;
    options.acceleration.y = para.acc._y;
    options.acceleration.z = para.acc._z;
    options.gravity.y = para.gravity._y;
    options.resistance = para.friction._y;
    options.terminal_velocity1 = para.tVelocity1;
    options.terminal_velocity2 = para.tVelocity2;
    options.intensity = para.collision_int;
    options.safety = para.landing_Safety;
    camera.lookAt(person.position);
    airplane_.position.x += 20
    airplane_.position.z += 10
    move_camera();
    const time = clock.getElapsedTime();
    const deltaTime = time - oldTime
    para.update(deltaTime, time)
    options.position.x = para.position._x;
    options.position.y = para.position._y;
    options.position.z = para.position._z;
    oldTime = time
    options.time = time;
  }
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();