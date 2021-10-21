import './style/main.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'dat.gui'



/**
 * Sizes
 */
const sizes = {}
sizes.width = window.innerWidth
sizes.height = window.innerHeight

window.addEventListener('resize', () => {
    // Save sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
})

/**
 * Environnements
 */
// Scene
const scene = new THREE.Scene()

// Loader
const loader = new THREE.TextureLoader()

// Camera
const camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 5
scene.add(camera)

// Objects
const spheresArr = []
const cubesArr = []

{   // Sphere
    const geo = new THREE.SphereBufferGeometry(.5, 64, 64)
    const normalMap = loader.load("/normals/5689d0a9cef193cefd363cf7c23e3dac.png")
    const material = new THREE.MeshStandardMaterial()
    material.roughness = 0.7
    material.metalness = 0.7
    material.normalMap = normalMap
    const mesh = new THREE.Mesh(geo, material)
    mesh.position.set(-1, 0, 0)
    spheresArr.push(mesh)
}
{   // Cube
    const geo = new THREE.BoxBufferGeometry(2, 2, 2)
    const normalMap = loader.load("/normals/5689d0a9cef193cefd363cf7c23e3dac.png")
    const material = new THREE.MeshStandardMaterial()
    material.roughness = 0.7
    material.metalness = 0.7
    material.normalMap = normalMap
    const mesh = new THREE.Mesh(geo, material)
    mesh.position.set(1, 0, 0)
    cubesArr.push(mesh)
}

spheresArr.forEach((object) => {
    scene.add(object)
})

cubesArr.forEach((object) => {
    scene.add(object)
})


// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('.webgl')
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(sizes.width, sizes.height)

// Orbit Controls
const controls = new OrbitControls(camera, document.querySelector(".webgl"))
controls.target.set(0, 0, 0)
controls.update()


/**
 *  Lighting
 */
const pointLight = new THREE.PointLight(0x0000FF, 1)
pointLight.position.set(1, 1, 2)
scene.add(pointLight)
const pointLightHelper = new THREE.PointLightHelper(pointLight)
scene.add(pointLightHelper)

const updateLight = (light) => {
    light.update9
}

updateLight(pointLightHelper)


/**
 *  GUI
 */
// Color GUI Selector
class ColorGUIHelper {
    constructor(object, prop) {
        this.object = object
        this.prop = prop
    }
    get value() {
        // Allows us to get the color property from the passed object
        console.log(this.object[this.prop])
        return `#${this.object[this.prop].getHexString()}`
    }
    set value(hexString) {
        // Allows us to set the property for the object
        // console.log(this.object[this.prop])
        this.object[this.prop].set(hexString)
    }
}

const gui = new GUI()
gui.addColor(new ColorGUIHelper(pointLight, "color"), "value").name("color")
gui.add(pointLight, "intensity", 0, 2, 0.1)
gui.add(pointLight, "distance", 0, 40).onChange(updateLight)

const makeXYZControls = (gui, vector3, name, onChangeFn) => {
    const folder = gui.addFolder(name)
    folder.add(vector3, "x", -10, 10).onChange(onChangeFn)
    folder.add(vector3, "y", 0, 10).onChange(onChangeFn)
    folder.add(vector3, "z", -10, 10).onChange(onChangeFn)
    folder.open()
}

makeXYZControls(gui, pointLight.position, "position", updateLight)

/**
 * Animate
 */
const animate = (time) => {
    time *= 0.001 

    cubesArr.forEach((object) => {
        object.rotation.x = time
        object.rotation.y = time
    })

    // Render
    renderer.render(scene, camera)

    // Keep animateing
    window.requestAnimationFrame(animate)
} 
animate()