import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js'
import { Group, Vector3 } from 'three'



/**
 *Loaders 
 */
 const dracoloader = new DRACOLoader()
 dracoloader.setDecoderPath('/draco/')
 
const gltfloader = new GLTFLoader()
gltfloader.setDRACOLoader(dracoloader)
// const cubeTextureLoader = new THREE.CubeTextureLoader()



/**
 * Base
 */



// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * AxisHelper
 */
 const AxisHelper = new THREE.AxesHelper(4)
//  scene.add(AxisHelper)





/**
 * Models
 */
let mixer1 = null
gltfloader.load(
    'models/bitcoin.gltf',
    (gltf) => 
    {
        mixer1 = new THREE.AnimationMixer(gltf.scene)
        const action = mixer1.clipAction(gltf.animations[0])

        action.play()
        gltf.scene.position.set(-1,-1,0)
        gltf.scene.scale.set(1,1,1)
        scene.add(gltf.scene)
        console.log(gltf);
    }
)
let mixer2 = null;
gltfloader.load(
    'models/ethereum.gltf',
    (gltf) => 
    {
        mixer2 = new THREE.AnimationMixer(gltf.scene)
        const action = mixer2.clipAction(gltf.animations[0])
        action.play()
        gltf.scene.scale.set(1,1,1)
        gltf.scene.position.set(1,-1,0)
        scene.add(gltf.scene)
    }
)
let mixer3 = null
gltfloader.load(
    'models/flo.gltf',
    (gltf) => 
    {
        mixer3 = new THREE.AnimationMixer(gltf.scene)
        const action = mixer3.clipAction(gltf.animations[0])
        action.play()
        gltf.scene.scale.set(2,2,2)
        gltf.scene.position.set(0,-3,0)
        // gltf.scene.rotation.y = Math.PI * 0.5
        
        scene.add(gltf.scene)
    }
)



/**
 * Light
 */
const Light = new THREE.PointLight("#ffff" , 100 , 100);
Light.position.set(
    1,
    0.9677633047103882, 
    1)

scene.add(Light)








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
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// console.log(CameraPosition);
camera.position.set( 
    0.01926213502883911,
    1.0094302654266357,
    3.5491838455200195)

scene.add(camera)



// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias : true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true  //to get same light between blender and threejs
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 3
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap



/**
 * Animate
 */
 const clock = new THREE.Clock()
 let previousTime = 0

const tick = () =>
{
    // Update controls
    controls.update()

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //Updata Mixer
    if(mixer1 !== null)
    {
        mixer1.update(deltaTime)
    }
    if(mixer2 !== null)
    {
        mixer2.update(deltaTime)
    }
    if(mixer3 !== null)
    {
        mixer3.update(deltaTime)
    }


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()