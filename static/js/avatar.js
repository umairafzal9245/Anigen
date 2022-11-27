
import { GLTFLoader } from './threeimport/GLTFLoader.js';

document.getElementById('webgl').hidden = true;

var avataraddress = null;
const subdomain = 'demo'; // Replace with your custom subdomain
const frame = document.getElementById('frame');

frame.src = `https://${subdomain}.readyplayer.me/avatar?frameApi`;

window.addEventListener('message', subscribe);
document.addEventListener('message', subscribe);

function subscribe(event) {

  const json = parse(event);
  if (json?.source !== 'readyplayerme') {
    return;
  }
  // Susbribe to all events sent from Ready Player Me once frame is ready
  if (json.eventName === 'v1.frame.ready') {
    frame.contentWindow.postMessage(
      JSON.stringify({
        target: 'readyplayerme',
        type: 'subscribe',
        eventName: 'v1.**'
      }),
      '*'
    );
  }
  // Get avatar GLB URL
  if (json.eventName === 'v1.avatar.exported') {
    console.log(`Avatar URL: ${json.data.url}`);
    avataraddress = json.data.url;
    const element = document.getElementById('frame');
    element.remove();
    document.getElementById('webgl').hidden = false;
    showavatar(avataraddress);
  }

  // Get user id
  if (json.eventName === 'v1.user.set') {
    console.log(`User with id ${json.data.id} set: ${JSON.stringify(json)}`);
  }
}

function parse(event) {
  try {
    return JSON.parse(event.data);
  } catch (error) {
    return null;
  }
}

function displayIframe() {
  document.getElementById('frame').hidden = false;
}


//-------------------------------------------------------------------------
function showavatar(avataraddress)
{

    const canvas = document.querySelector('#webgl');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);
    const sizes = {
        width: 500,
        height: 500
    };

    const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 1000);
    camera.position.set(0,2,10);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: false,
        preserveDrawingBuffer: false,
        premultipliedAlpha: false,

    });

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x101010, 1);
    renderer.render(scene, camera);

    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;


    const loader = new GLTFLoader();

    loader.load(avataraddress,function(glb){
        console.log(glb);
        const root = glb.scene;
        scene.add(root);
    }, function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, function (error) {
        console.log('An error happened');
    });
    
    const light = new THREE.HemisphereLight(0xffffff, 0x000000, 2);
    scene.add(light);

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();
}