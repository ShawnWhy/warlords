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
        audioHit.play()
    }
}


// Canvas
const canvas = document.querySelector('canvas.webgl')
// Scene
const scene = new THREE.Scene()
//raycaster
const raycaster = new THREE.Raycaster()
const objectsToUpdate = []

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
    // console.log(mouse)
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

const createBall = (radius, position) => {
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

    const mesh = new THREE.Mesh(star, sphereMaterial)
    mesh.scale.set(radius, radius, radius)
    mesh.rotation.y = Math.PI * .5
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon.js body
    const shape = new CANNON.Sphere(radius)

    const body = new CANNON.Body({
        mass: radius,
        position: new CANNON.Vec3(0, 5, 0),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    body.applyForce(new CANNON.Vec3(- 2000, -500, 0), body.position)
    body.addEventListener('collide', playHitSound)

    world.addBody(body)

    // Save in objects
    objectsToUpdate.push({ mesh, body })
}

gltfLoader.load(
    '/putin.glb',
    (gltf) =>
    {
        putin=gltf.scene
        console.log("putin")
        console.log(putin)
        // console.log(teaset)
        putin.scale.set(0.25, 0.25, 0.25)
        putin.rotation.y =  Math.PI * 0.5
        putinMix = new THREE.AnimationMixer(putin)

        putinwheel = putinMix.clipAction(gltf.animations[2])

        putinBob = putinMix.clipAction(gltf.animations[3])
        // console.log(walk)
        putinwheel.timeScale = 5
        putinwheel.clampWhenFinished = false

        // putinwheel.play()
        putinBob.play()




        scene.add(putin)
  
    }
)

gltfLoader.load(
    '/prigozhin.glb',
    (gltf) => {
        prigozhin = gltf.scene
        console.log("prigozhin")
        console.log(prigozhin);
        // console.log(teaset)
        prigozhin.rotation.y = Math.PI * 0.5
        prigozhinMix = new THREE.AnimationMixer(prigozhin)
        // console.log(mixer)
        prigozhWheel = prigozhinMix.clipAction(gltf.animations[2])

        prigozhinBob = prigozhinMix.clipAction(gltf.animations[1])
        // console.log(walk)
        prigozhWheel.timeScale = 5
        prigozhWheel.clampWhenFinished = false
            // prigozhWheel.play()

        prigozhinBob.play()

        prigozhin.scale.set(0.25, 0.25, 0.25)
        scene.add(prigozhin)

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

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.focus=20
if(sizes.width>860){
camera.position.set(7, 5, 0)
}
else if (sizes.width>450){
    camera.position.set(7,3,0)
}
else{
    camera.position.set(9, 4, 0)
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

// const effectComposer = new EffectComposer(renderer)
// effectComposer.setSize(sizes.width, sizes.height)
// effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// const renderPass = new RenderPass(scene, camera)
// effectComposer.addPass(renderPass)
renderer.setClearColor( 'orange',.5);
// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
raycaster.setFromCamera(mouse, camera)

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

    
    for(const object of objectsToUpdate)
    {
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
    controls.update()
    renderer.render(scene, camera)
    // effectComposer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()