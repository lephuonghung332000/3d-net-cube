// Three.js 3D Cube: unfold/fold animation with pivot hierarchy
// Code fully commented for beginners

// Scene/camera/renderer: core Three.js objects
let scene, camera, renderer;
let pivots = Array(6),
  faces = Array(6),
  animating = false,
  isUnfolded = false;

// AR.js toolkit objects
let arToolkitSource, arToolkitContext, markerRoot;

// Main render loop: keeps rendering the scene
function animate() {
  requestAnimationFrame(animate);
  if (arToolkitSource && arToolkitSource.ready) {
    arToolkitContext.update(arToolkitSource.domElement);
  }
  renderer.render(scene, camera);
}

// Initialize scene and start animation
init();
animate();

function init() {
  // Create scene
  scene = new THREE.Scene();

  // Camera for AR.js (will be replaced by AR.js context)
  camera = new THREE.Camera();
  scene.add(camera);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0); // transparent background
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = "0px";
  renderer.domElement.style.left = "0px";
  document.body.appendChild(renderer.domElement);

  // ARToolkit Source (camera)
  arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: "webcam",
  });
  arToolkitSource.init(function onReady() {
    onResize();
  });
  window.addEventListener("resize", function () {
    onResize();
  });

  function onResize() {
    arToolkitSource.onResize();
    arToolkitSource.copySizeTo(renderer.domElement);
    if (arToolkitContext && arToolkitContext.arController !== null) {
      arToolkitSource.copySizeTo(arToolkitContext.arController.canvas);
    }
  }

  // ARToolkit Context
  arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: "camera_para.dat",
    detectionMode: "mono",
  });
  arToolkitContext.init(function onCompleted() {
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
  });

  // Marker root
  markerRoot = new THREE.Group();
  scene.add(markerRoot);
  new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
    type: "pattern",
    patternUrl: "pattern-hiro.patt",
  });

  // Create 6 faces for the cube, each with a different color (matching the reference image)
  // Order: 0-front, 1-back, 2-left, 3-right, 4-bottom, 5-top
  const size = 1;
  const colors = [0x2196f3, 0x43a047, 0xffd600, 0xe53935, 0x8e24aa, 0xff9800];
  const borderColor = 0x6d4c1b; // nâu đậm
  for (let i = 0; i < 6; i++) {
    let mat;
    mat = new THREE.MeshLambertMaterial({
      color: colors[i],
      side: THREE.DoubleSide,
      transparent: false,
      opacity: 1,
    });
    faces[i] = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat);
    const edge = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(size, size)),
      new THREE.LineBasicMaterial({
        color: borderColor,
        linewidth: 2,
        depthTest: false,
      })
    );
    edge.renderOrder = 1;
    faces[i].add(edge);
    pivots[i] = new THREE.Group();
  }

  // ...đã xoá nét đứt cho các cạnh khuất...

  // Set positions and parent-child relationships for each face
  // Bottom face (blue): at origin
  pivots[4].position.set(0, 0, 0);
  faces[4].position.set(0, 0, 0);
  pivots[4].add(faces[4]);
  markerRoot.add(pivots[4]);

  // Top face (yellow): above bottom
  pivots[5].position.set(0, 1, 0);
  faces[5].position.set(0, 0, 0);
  pivots[5].add(faces[5]);
  markerRoot.add(pivots[5]);

  // Front face (dark gray): in front of bottom
  pivots[0].position.set(0, 0, 0.5);
  faces[0].position.set(0, 0.5, 0);
  pivots[0].add(faces[0]);
  markerRoot.add(pivots[0]);

  // Back face (light gray): behind bottom
  pivots[1].position.set(0, 0, -0.5);
  faces[1].position.set(0, 0.5, 0);
  pivots[1].add(faces[1]);
  markerRoot.add(pivots[1]);

  // Left face (green): left of bottom, child of bottom
  pivots[2].position.set(-0.5, 0, 0);
  faces[2].position.set(0.5, 0, 0);
  pivots[2].add(faces[2]);
  pivots[4].add(pivots[2]);

  // Right face (red): right of bottom, child of bottom
  pivots[3].position.set(0.5, 0, 0);
  faces[3].position.set(-0.5, 0, 0);
  pivots[3].add(faces[3]);
  pivots[4].add(pivots[3]);

  // Set initial rotation for each face so the cube is closed
  pivots[0].rotation.set(0, 0, 0); // front
  pivots[1].rotation.set(0, Math.PI, 0); // back
  pivots[2].rotation.set(0, -Math.PI / 2, 0); // left
  pivots[3].rotation.set(0, Math.PI / 2, 0); // right
  pivots[4].rotation.set(-Math.PI / 2, 0, 0); // bottom
  pivots[5].rotation.set(Math.PI / 2, 0, 0); // top

  // Lighting: directional and ambient
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(2, 4, 2);
  markerRoot.add(light);
  markerRoot.add(new THREE.AmbientLight(0xffffff, 0.5));

  // (Đã xoá trục OXYZ và label)

  // Mouse click: toggle fold/unfold (optional, AR không cần controls)
  renderer.domElement.addEventListener("click", onCubeClick);

  // Add a 3D text label to a given axis
  // (Đã xoá hàm addAxisLabel)

  // Handle mouse click: toggle fold/unfold (AR: click anywhere)
  function onCubeClick(event) {
    if (animating) return;
    if (isUnfolded) foldAll();
    else unfoldAll();
  }

  // Fold all faces: animate 4 side faces (front, back, left, right) simultaneously, then fold the top
  function foldAll() {
    // ...đã xoá nét đứt...
    animating = true;
    const facesToAnimate = [0, 1, 2, 3]; // indices of side faces
    // Target rotation/position for each face to form a closed cube
    const targets = {
      0: { rx: 0, ry: 0, rz: 0, px: 0, py: 0, pz: 0.5 },
      1: { rx: 0, ry: Math.PI, rz: 0, px: 0, py: 0, pz: -0.5 },
      2: { rx: 0, ry: -Math.PI / 2, rz: 0, px: -0.5, py: 0, pz: 0 },
      3: { rx: 0, ry: Math.PI / 2, rz: 0, px: 0.5, py: 0, pz: 0 },
    };
    let done = 0;
    let total = facesToAnimate.length * 6;
    // Animate all 4 faces at once
    facesToAnimate.forEach((i) => {
      animatePivotTo(pivots[i], "rotation.x", targets[i].rx, 60, checkDone);
      animatePivotTo(pivots[i], "rotation.y", targets[i].ry, 60, checkDone);
      animatePivotTo(pivots[i], "rotation.z", targets[i].rz, 60, checkDone);
      animatePivotTo(pivots[i], "position.x", targets[i].px, 60, checkDone);
      animatePivotTo(pivots[i], "position.y", targets[i].py, 60, checkDone);
      animatePivotTo(pivots[i], "position.z", targets[i].pz, 60, checkDone);
    });
    // When all 4 faces are done, fold the top
    function checkDone() {
      done++;
      if (done === total) {
        animatePivotTo(pivots[5], "rotation.x", Math.PI / 2, 60, () => {
          // Detach top from back if needed
          if (pivots[5].parent !== scene) {
            pivots[1].remove(pivots[5]);
            scene.add(pivots[5]);
          }
          pivots[5].rotation.set(Math.PI / 2, 0, 0);
          pivots[5].position.set(0, 1, 0);
          faces[5].position.set(0, 0, 0);
          isUnfolded = false;
          animating = false;
        });
      }
    }
  }

  // Unfold all faces: animate back face first, then other sides, then top
  function unfoldAll() {
    // Khi unfold, mặt top (cam) vẫn là cam đậm
    faces[5].material.color.set(0xff9800);
    // Khi fold, mặt top (cam) vẫn là cam đậm
    faces[5].material.color.set(0xff9800);
    // ...đã xoá nét đứt...
    // Move top face down so its bottom edge matches back's top edge
    faces[5].position.set(0, -0.5, 0);
    // Reset rotations/positions for all faces
    pivots[0].rotation.set(0, 0, 0);
    pivots[1].rotation.set(0, Math.PI, 0);
    pivots[3].rotation.set(0, Math.PI / 2, 0);
    pivots[4].rotation.set(-Math.PI / 2, 0, 0);
    pivots[5].rotation.set(Math.PI / 2, 0, 0);
    pivots[0].position.set(0, 0, 0.5);
    pivots[1].position.set(0, 0, -0.5);
    pivots[3].position.set(0.5, 0, 0);
    pivots[5].position.set(0, 1, 0);
    // Attach top face to back if not already
    if (pivots[5].parent !== pivots[1]) {
      if (pivots[5].parent) pivots[5].parent.remove(pivots[5]);
      pivots[1].add(pivots[5]);
    }
    animating = true;
    // Animate front, left, right faces simultaneously
    const facesToAnimate = [0, 2, 3];
    const targets = {
      0: { rx: Math.PI / 2, ry: 0, rz: 0, px: 0, py: 0, pz: 0.5 }, // front
      2: { rx: 0, ry: -Math.PI, rz: 0, px: -1, py: 0, pz: 1 }, // left
      0: { rx: Math.PI / 2, ry: 0, rz: 0, px: 0, py: 0, pz: 0.5 }, // front
      2: { rx: 0, ry: -Math.PI, rz: 0, px: -1, py: 0, pz: 1 }, // left
      3: { rx: 0, ry: Math.PI, rz: 0, px: 1, py: 0, pz: 1 }, // right
    };
    let done = 0;
    facesToAnimate.forEach((i) => {
      animatePivotTo(pivots[i], "rotation.x", targets[i].rx, 60, checkDone);
      animatePivotTo(pivots[i], "rotation.y", targets[i].ry, 60, checkDone);
      animatePivotTo(pivots[i], "rotation.z", targets[i].rz, 60, checkDone);
      animatePivotTo(pivots[i], "position.x", targets[i].px, 60, checkDone);
      animatePivotTo(pivots[i], "position.y", targets[i].py, 60, checkDone);
      animatePivotTo(pivots[i], "position.z", targets[i].pz, 60, checkDone);
    });
    // Animate back face first, then top
    animatePivotTo(pivots[1], "rotation.x", -Math.PI / 2, 60, () => {
      animatePivotTo(pivots[5], "rotation.x", Math.PI, 60, checkDone);
      animatePivotTo(pivots[5], "rotation.y", 0, 60, checkDone);
      animatePivotTo(pivots[5], "rotation.z", 0, 60, checkDone);
      animatePivotTo(pivots[5], "position.x", 0, 60, checkDone);
      animatePivotTo(pivots[5], "position.y", 1, 60, checkDone);
      animatePivotTo(pivots[5], "position.z", 0, 60, checkDone);
    });
    let total = facesToAnimate.length * 6 + 6;
    function checkDone() {
      done++;
      if (done === total) {
        isUnfolded = true;
        animating = false;
      }
    }
  }

  // Animate a property of a pivot (rotation or position) to a target value over a number of frames
  // Calls onDone() when finished
  function animatePivotTo(obj, prop, target, frames, onDone) {
    let t = 0;
    let start = prop.startsWith("rotation.")
      ? obj.rotation[prop.split(".")[1]]
      : obj[prop];
    const delta = target - start;
    function tick() {
      t++;
      const value = start + (delta * t) / frames;
      if (prop.startsWith("rotation."))
        obj.rotation[prop.split(".")[1]] = value;
      else obj[prop] = value;
      if (t < frames) requestAnimationFrame(tick);
      else {
        if (prop.startsWith("rotation."))
          obj.rotation[prop.split(".")[1]] = target;
        else obj[prop] = target;
        onDone && onDone();
      }
    }
    tick();
  }
}
