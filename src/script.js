import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import {SphereGeometry, TextureLoader , CubeTextureLoader} from 'three'
import $ from "./Jquery"
import gsap from "gsap";
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'

const textureLoader = new THREE.TextureLoader()
var audioCup = new Audio('/mug.wav');
var audioPlay = new Audio('/korob.mp3');
var audioClick = new Audio('/click.wav');
audioPlay.volume=.04
audioPlay.loop=true
audioPlay.playbackRate=.5
audioCup.volume=.5
// Canvas
const canvas = document.querySelector('canvas.webgl')
// Scene
const scene = new THREE.Scene()
const portfolioButton=document.getElementsByClassName("portfolio");
const aboutButton = document.getElementsByClassName("about")
const  contactButton = document.getElementsByClassName("contact")
const  newsButton = document.getElementsByClassName("news")
//raycaster
const raycaster = new THREE.Raycaster()
const objectsToUpdate = []
// Create sphere
const sphereGeometry = new THREE.SphereGeometry(1, 8, 8)
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

const teaTexture= textureLoader.load('/UVimage.png')
const headTexture= textureLoader.load('/skin.jpg')
teaTexture.flipY = false
headTexture.flipY= false
const teaMaterial = new THREE.MeshBasicMaterial({map:teaTexture})
const headMaterial = new THREE.MeshBasicMaterial({map:headTexture})
const mouse = new THREE.Vector2()
mouse.x = null
mouse.y=null

$(".button").click((e)=>{
    console.log("clock")
    e.preventDefault();
    e.stopPropagation();

    $(".monitor").removeClass("invisibleP")
    $(".menue").addClass("invisibleP")
    var ButtonName = $(e.target).attr("name")
    switch(ButtonName){
        case "portfolio":
            $(".display").html(portfolio)
            break;
            case "contact":
            $(".display").html(contact)
            break;
            case "about":
            $(".display").html(about)
            break;
            case "news":
                $(".display").html(news)
                break;
    }
})

$(".xButton").click((e)=>{
    e.preventDefault();
    e.stopPropagation();
    $(".monitor").addClass("invisibleP")
    $(".menue").removeClass("invisibleP")
})

$(".play").click((e)=>{  
    e.preventDefault();
    e.stopPropagation(); 
   $(".play").addClass("invisibleP")
   $(".stop").removeClass("invisibleP")
   gsap.to(teaset.children[8].rotation,{duration:1,x:Math.PI*.25})
   gsap.to(teaset.children[8].position,{duration:1,z:1.5})
   gsap.to(teaset.children[8].position,{duration:1,y:.4})
   setTimeout(() => {
    audioClick.play()
   }, 1000);
   setTimeout(() => {
    dance="on"
    audioPlay.play()
   }, 1500);
})
$(".stop").click((e)=>{
    e.preventDefault();
    e.stopPropagation(); 
   $(".play").removeClass("invisibleP")
   $(".stop").addClass("invisibleP")
   gsap.to(teaset.children[8].rotation,{duration:.5,x:Math.PI*0})
   gsap.to(teaset.children[8].position,{duration:.5,z:.7})
   gsap.to(teaset.children[8].position,{duration:.5,y:.2})
   setTimeout(() => {
    audioClick.play()
   }, 800);
   setTimeout(() => {
    gsap.to( teaset.children[5].position,{duration:.3,y:-1.45})
    gsap.to( teaset.children[12].position,{duration:.3,y:-1.45})
    gsap.to( teaset.children[11].position,{duration:.3,y:.8})
    gsap.to( teaset.children[1].rotation,{duration:.6,y:0})
    audioPlay.pause()
    dance="off"   
   }, 1500);
})
window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
    // console.log(mouse)
})
/**
 * Models
 */
// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
// gltfLoader.setDRACOLoader(dracoLoader)
let putinMix = null;
let prigzhinMix = null;
let putinBob = null;
let priozhinBob = null;
let putin = null;
let prigozhin = null;

gltfLoader.load(
    '/putin.glb',
    (gltf) =>
    {
        putin=gltf.scene
        // console.log(teaset)
        putin.scale.set(0.25, 0.25, 0.25)
        putin.rotation.y =  Math.PI * 0.5

        scene.add(putin)
  
    }
)

gltfLoader.load(
    '/prigozhin.glb',
    (gltf) => {
        prigozhin = gltf.scene
        // console.log(teaset)
        prigozhin.rotation.y = Math.PI * 0.5

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
$(portfolioButton).mouseover(()=>{
    // teaset.children[1].position.y=-1;
    // teaset.children[1].rotation.x=-.05*Math.PI
    gsap.to( teaset.children[1].rotation,{duration:.3,x:-.05*Math.PI})
})
$(aboutButton).mouseover(()=>{  

    gsap.to( teaset.children[5].position,{duration:.3,y:-.5})
    gsap.to( teaset.children[12].position,{duration:.3,y:-.5})
})
$(contactButton).mouseover(()=>{
    gsap.to( teaset.children[11].position,{duration:.3,y:1})
})
$(newsButton).mouseover(()=>{
    gsap.to( teaset.children[9].position,{duration:.3,y:1})
})

$(".button").mouseout(()=>{
    gsap.to( teaset.children[5].position,{duration:.3,y:-1.45})
    gsap.to( teaset.children[12].position,{duration:.3,y:-1.45})
    gsap.to( teaset.children[1].rotation,{duration:.3,x:0})
    gsap.to( teaset.children[11].position,{duration:.3,y:.8})
    gsap.to( teaset.children[9].position,{duration:.3,y:.02})
    gsap.to( teaset.children[1].rotation,{duration:.3,y:0})
    setTimeout(() => {
        audioCup.play()
    }, 100);
})
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
    if(prigzhinMix)
    {
        prigzhinMix.update(deltaTime)
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