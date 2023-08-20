// putin 

// ball parent
// putin.children[0].children[0].children[0].children[3]

// putin head
// putin.children[0].children[0].children[0].children[1]

// putin tank

// putin.children[0].children[0].children[6]

// prigozhin

// ball parent


// prigozhin.children[0]

// prigozhin ball parent

// prigozhin.children[0].children[0].children[0].children[2]

// prigozhin head

// prigozhin.children[0].children[0].children[0].children[0].children[0]

// progozhin tank

// prigozhin.children[0].children[0].children[8]


import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import {SphereGeometry, TextureLoader , CubeTextureLoader} from 'three'
import $ from "./Jquery"
import gsap from "gsap";

// 1. First, make sure you have GSAP properly integrated into your project.Refer to the GSAP documentation for installation instructions.

// 2. Assuming you have a Cannon.js body called "body" and a target position called "targetPosition," you can use GSAP's `to` method to smoothly animate the body's position to the target.

// ```javascript
// // Assuming you have a Cannon.js body object called "body" and a target position called "targetPosition"

// // Use GSAP to animate the body's position
// gsap.to(body.position, { x: targetPosition.x, y: targetPosition.y, z: targetPosition.z, duration: 1 });





import CANNON, { Sphere } from 'cannon'
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
// cannon physics
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, - 9.82, 0)
//individual materials 
const defaultMaterial = new CANNON.Material('default')

const textureLoader = new THREE.TextureLoader()
var audioHit = new Audio('/mug.wav');
audioHit.volume = .5

const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 30,
        restitution: 0.1
    }
)
//play sound on collision 
const playHitSound = (collision) => {
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()

    if (impactStrength > 10) {
        audioHit.volume = Math.random()
        audioHit.currentTime = 0
        // audioHit.play()
    }
}


// Canvas
const canvas = document.querySelector('canvas.webgl')
// Scene
const scene = new THREE.Scene()
//raycaster
const raycaster = new THREE.Raycaster()
const objectsToUpdate = []
const objectsToUpdate2 = []

const ballsToUpdate = []

/**
 * Sizes
 */
 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    if(sizes.width>860){
        camera.position.set(7, 5, 0)
        }
        else if (sizes.width>450){
            camera.position.set(7,3,0)
        }
        else{
            camera.position.set(13, 10, 0)
        }
})


const mouse = new THREE.Vector2()
mouse.x = null
mouse.y=null


window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
})


const gltfLoader = new GLTFLoader()
let putinMix = null;
let prigozhinMix = null;
let putinBob = null;
let prigozhinBob = null;
let prigozhWheel = null;
let putinwheel = null;
let putin = null;
let prigozhin = null;

let prigozhinHead;
let putinHead;
let prigozhinBall;
let putinBall;
let prigozhinTank;
let putinTank;
let prigozhinHeadIntersect = [];
let putinHeadIntersect = [];
let prigozhinTankIntersect = [];
let putinTankIntersect = [];
// const material = new THREE.MeshBasicMaterial({ color: "blue" });

// const geometry = new THREE.BoxGeometry(1, 1, 1);

// // Create a cube mesh with the geometry and material
// const cube = new THREE.Mesh(geometry, material);

// // Add the cube to the scene
// scene.add(cube);

const createBall = (radius, position, worldRotation, warlord) => {
    console.log(position)
    const spherecolor = function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    console.log("fire")
    const sphereMaterial = new THREE.MeshStandardMaterial({ emissive: spherecolor() })

    // Three.js mesh
    const sphereGeometry = new THREE.SphereGeometry(radius, 8, 8);

    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
    mesh.scale.set(radius, radius, radius)
    mesh.rotation.y = Math.PI * .5
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon.js body

    const shape = new CANNON.Sphere(radius)

    const body = new CANNON.Body({
        // mass: radius,
        mass: 50,
        position: new CANNON.Vec3(0, 5, 0),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)

    // Assuming you have a body object called "body" and a rotation angle in radians called "rotationAngle"

    // Calculate the force vector
     // Example force vector
    if (warlord == "putin") {
        var force = new CANNON.Vec3(0, 0, -50000);
    }
    else{
        var force = new CANNON.Vec3(0, 0, 50000);
    }
    // var offset = new CANNON.Vec3(0, 0, 0); // Example offset vector

    // Apply the world rotation quaternion to the force vector
   
    var cannonQuaternion = new CANNON.Quaternion().setFromEuler(worldRotation.x, worldRotation.y, worldRotation.z, 'XYZ');
    console.log(worldRotation)
    console.log(cannonQuaternion)
    const resultVector = new CANNON.Vec3();

    cannonQuaternion.vmult(force, resultVector);
    console.log(resultVector);
   
    // Apply the force to the body
    body.applyForce(resultVector, body.position);
    // body.applyForce(new CANNON.Vec3(- 2000, -500, 0), body.position)
    body.addEventListener('collide', playHitSound)

    world.addBody(body)

    // Save in objects
    ballsToUpdate.push({ mesh, body })
}

gltfLoader.load(
    '/putin.glb',
    (gltf) =>
    {
        putin=gltf.scene
        console.log("putin")
        console.log(putin)
        putin.scale.set(0.25, 0.25, 0.25)

        putinTank = putin.children[0].children[0].children[6]
        putinHead = putin.children[0].children[0].children[0].children[1].children[0]
        putinBall = putin.children[0].children[0].children[0].children[3]
        putinMix = new THREE.AnimationMixer(putin)


        putinwheel = putinMix.clipAction(gltf.animations[2])
        putinBob = putinMix.clipAction(gltf.animations[3])

        putinwheel.timeScale = 5
        putinwheel.clampWhenFinished = false

        // putinwheel.play()
        // putinBob.play()
        scene.add(putin)
        const shape = new CANNON.Box(new CANNON.Vec3(1,  0.5,  1))
        const body = new CANNON.Body({
            mass: 4,
            position: new CANNON.Vec3(15, 5, 15),
            shape: shape,
            material: defaultMaterial
        })

        // body.position.copy(position)
        body.addEventListener('collide', playHitSound)

        world.addBody(body)

        // Save in objects
        objectsToUpdate.push({ putin, body })
    }
)

gltfLoader.load(
    '/prigozhin.glb',
    (gltf) => {
        prigozhin = gltf.scene
        console.log("prigozhin")
        console.log(prigozhin);
        // console.log(teaset)
        // prigozhin.rotation.y = Math.PI * 0.5
        prigozhinMix = new THREE.AnimationMixer(prigozhin)
        // console.log(mixer)
        prigozhWheel = prigozhinMix.clipAction(gltf.animations[2])
        prigozhinBob = prigozhinMix.clipAction(gltf.animations[1])

        prigozhinBall = prigozhin.children[0].children[0].children[0].children[2]
        prigozhinTank = prigozhin.children[0].children[0].children[8]
        prigozhinHead = prigozhin.children[0].children[0].children[0].children[0].children[0]

        prigozhWheel.timeScale = 5
        prigozhWheel.clampWhenFinished = false

        prigozhin.scale.set(0.25, 0.25, 0.25)
        scene.add(prigozhin)

        const shape = new CANNON.Box(new CANNON.Vec3(5, 4, 5))
        const body = new CANNON.Body({
            mass: 4,
            position: new CANNON.Vec3(-15, 5, -15),
            shape: shape,
            material: defaultMaterial
        })

        // body.position.copy(position)
        body.addEventListener('collide', playHitSound)

        world.addBody(body)


        objectsToUpdate2.push({ prigozhin, body })


    }
)

const cubeTextureLoader = new THREE.CubeTextureLoader()


const RoomMap = cubeTextureLoader.load([
    './px.png',
    './nx.png',
    './py.png',
    './ny.png',
    './pz.png',
    './nz.png'
])

const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshBasicMaterial({color:"gray"})
)
floorMesh.receiveShadow = true
floorMesh.rotation.x = - Math.PI * 0.5
floorMesh.position.y = -.5
scene.add(floorMesh)

scene.background = RoomMap;
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('orange', .5)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight('#F5F5DC', 2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(- 5, 5, 0)
scene.add(directionalLight)
const directionalLight2 = new THREE.DirectionalLight('#5F9EA0', 1)
directionalLight2.castShadow = true
directionalLight2.shadow.mapSize.set(1024, 1024)
directionalLight2.shadow.camera.far = 15
directionalLight2.shadow.camera.left = - 7
directionalLight2.shadow.camera.top = 7
directionalLight2.shadow.camera.right = 7
directionalLight2.shadow.camera.bottom = - 7
directionalLight2.position.set(5, 5, 0)
scene.add(directionalLight2)

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 100)
camera.focus=20
if(sizes.width>860){
camera.position.set(7, 5, 1)
}
else if (sizes.width>450){
    camera.position.set(7,3,1)
}
else{
    camera.position.set(9, 4, 1)
}
scene.add(camera)
// Controls
const controls = new OrbitControls(camera, canvas)
// controls.target.set(4, 2, 0)
controls.enableDamping = true
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setClearColor( 'orange',.5);
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
raycaster.setFromCamera(mouse, camera)



let isDraggingPrig = false;
let isDraggingPutin = false;


// add dragging
var prigozhinRotate = document.getElementById("prigRotate")
var putinRotate = document.getElementById("putinRotate")
prigozhinRotate.addEventListener("mousedown", (event) => {
  isDraggingPrig = true;

});
prigozhinRotate.addEventListener("mousemove", (event) => {
  if (!isDraggingPrig) return;

  event.preventDefault();
  
        const newQuaternion = new CANNON.Quaternion();

        newQuaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), .1);

        for (const object of objectsToUpdate2) {
            object.body.quaternion.mult(newQuaternion, object.body.quaternion);

            // object.body.applyForce(new CANNON.Vec3(- 10, 0, 0), object.body.position)
        }
 })

 //Putin rotate
prigozhinRotate.addEventListener("mouseup", () => {
  isDraggingPrig = false;
});



putinRotate.addEventListener("mousedown", (event) => {
    isDraggingPutin = true;

});
putinRotate.addEventListener("mousemove", (event) => {
    if (!isDraggingPutin) return;

    event.preventDefault();

    const newQuaternion = new CANNON.Quaternion();

    newQuaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), .1);

    for (const object of objectsToUpdate) {
        object.body.quaternion.mult(newQuaternion, object.body.quaternion);

        // object.body.applyForce(new CANNON.Vec3(- 10, 0, 0), object.body.position)
    }
})
putinRotate.addEventListener("mouseup", () => {
    isDraggingPutin = false;
});

$(canvas).click((e) => {
    console.log(raycaster.ray.direction)
    e.preventDefault()
    e.stopPropagation()
    // putinHead.children[2].material = new THREE.MeshBasicMaterial({ color: "red" })

    // prigozhinBob.play()
    // putinBob.play()


    if (prigozhinHeadIntersect.length > 0) {
        console.log(prigozhinHead)
        console.log("prig head")
        prigozhinBob.setLoop(THREE.LoopOnce);
        prigozhinBob.clampWhenFinished = true;
        prigozhinBob.reset().play()
        const worldPosition = new THREE.Vector3();
        prigozhinBall.getWorldPosition(worldPosition);
        console.log(worldPosition);
        prigozhin.children[0].updateMatrixWorld();
        var worldRotation = new THREE.Euler().setFromQuaternion(prigozhin.children[0].quaternion, 'XYZ');
        setTimeout(() => {
            createBall(.2, worldPosition, worldRotation, "prig")

        }, 1400);
       

    }
    
    if (prigozhinTankIntersect.length > 0) {
        console.log(prigozhinTank)

        console.log("prig tank")

        prigozhWheel.play()
        // gsap.to(body.position, { x: targetPosition.x, y: targetPosition.y, z: targetPosition.z, duration: 1 });



    }
    if (putinHeadIntersect.length > 0) {


        console.log("putin head")
        putinBob.setLoop(THREE.LoopOnce);
        putinBob.clampWhenFinished = true;
        
        putinBob.reset().play()
        const worldPosition = new THREE.Vector3();
        putinBall.getWorldPosition(worldPosition);
        console.log(worldPosition);
        putin.children[0].updateMatrixWorld();
        var worldRotation = new THREE.Euler().setFromQuaternion(putin.children[0].quaternion, 'XYZ');
        // var worldRotation = putin.quaternion
        setTimeout(() => {
            createBall(.3, worldPosition, worldRotation, "putin")

        }, 1000);

    }
    if (putinTankIntersect.length > 0) {

        console.log(putinTank)
        console.log("prig tank")

        putinwheel.play()

    }

})
const floorShape = new CANNON.Plane()

const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0),
    Math.PI * 0.5
)
floorBody.position.y = -2
floorBody.addShape(floorShape)
floorBody.material = defaultMaterial
world.addBody(floorBody)
world.addContactMaterial(defaultContactMaterial)

/**
 * Animate
 */

let oldElapsedTime=null;

const clock = new THREE.Clock()
let previousTime = 0
const tick = () =>
   
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime
    raycaster.ray.origin.z =0;
    raycaster.setFromCamera(mouse, camera)

    
    for(const object of objectsToUpdate)
    {
        object.putin.children[0].position.copy(object.body.position)
        object.putin.children[0].position.y -= 5.1
        // object.putin.children[0].position.z += 2

        object.putin.children[0].quaternion.copy(object.body.quaternion)
        // object.body.applyForce(new CANNON.Vec3(- 10, 0, 0), object.body.position)
    }
    for (const object of objectsToUpdate2) {
        object.prigozhin.children[0].position.copy(object.body.position)
        object.prigozhin.children[0].position.y -= 5
        // object.putin.children[0].position.z += 2

        object.prigozhin.children[0].quaternion.copy(object.body.quaternion)
        // object.body.applyForce(new CANNON.Vec3(- 10, 0, 0), object.body.position)
    }
    for (const object of ballsToUpdate) {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
        // object.body.applyForce(new CANNON.Vec3(- 10, 0, 0), object.body.position)
    }
    if(prigozhinMix)
    {
        prigozhinMix.update(deltaTime)
    }

    if (putinMix) {
        putinMix.update(deltaTime)
    }

    if (prigozhinHead != null){
        
        prigozhinHeadIntersect = raycaster.intersectObject(prigozhinHead,true)
        
    }
    if (putinHead != null){
        putinHeadIntersect = raycaster.intersectObject(putinHead,true)
        }
    if (prigozhinTank != null)
    {
        prigozhinTankIntersect = raycaster.intersectObject(prigozhinTank,true)
        // prigozhinTank.material=new THREE.MeshBasicMaterial({color:"blue"})

    }

    if(putinTank != null){

        putinTankIntersect = raycaster.intersectObject(putinTank,true)
        if(putinTankIntersect.length>0){
            // putinTank.material = new THREE.MeshBasicMaterial({ color: "blue" })

        }


    }
//     if(cube !=null){

//         const intersectsBox = raycaster.intersectObjects(cube, true);

//     if (intersectsBox.length > 0) {
//         // Change the color of the intersected cube to red
//         console.log(intersectsBox)
//         cube.material.color.set(0xff0000);
//     }
// }

    

    
    controls.update()
    renderer.render(scene, camera)
    world.step(1 / 60, deltaTime, 3)
    floorMesh.position.copy(floorBody.position)
    floorMesh.quaternion.copy(floorBody.quaternion)

    // effectComposer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()