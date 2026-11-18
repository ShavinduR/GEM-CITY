/**
 * Interactive 3D ring (three.js). Performance rules:
 *  - three.js (~150 KB) is downloaded only when the viewer scrolls near view
 *  - rendering pauses whenever the viewer is off-screen or the tab is hidden
 *  - auto-rotation is disabled for users who prefer reduced motion
 * Requires the <script type="importmap"> on jewellery.html.
 */
export function initRingViewer(el) {
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { io.disconnect(); start(el); }
  }, { rootMargin: '300px' });
  io.observe(el);
}

async function start(el) {
  const status = el.querySelector('.viewer__status');
  const hint = el.querySelector('.viewer__hint');
  try {
    const THREE = await import('three');
    const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
    const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.domElement.setAttribute('aria-label', '3D ring model. Drag to rotate, pinch or scroll to zoom.');
    renderer.domElement.setAttribute('role', 'img');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.01, 100);
    camera.position.set(0, 0.5, 3.5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.enablePan = false;
    controls.minDistance = 1.2;
    controls.maxDistance = 7;
    controls.autoRotate = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    controls.autoRotateSpeed = 1.4;
    controls.addEventListener('start', () => { controls.autoRotate = false; if (hint) hint.style.opacity = '0'; });

    const lights = [
      [THREE.DirectionalLight, 0xffe8b0, 4.0, [4, 5, 4]],
      [THREE.DirectionalLight, 0xb0d4ff, 1.5, [-4, 2, -3]],
      [THREE.DirectionalLight, 0xffd580, 2.5, [0, -3, -5]],
    ];
    lights.forEach(([Light, color, intensity, pos]) => { const l = new Light(color, intensity); l.position.set(...pos); scene.add(l); });
    scene.add(new THREE.AmbientLight(0xfff5e0, 0.8));

    const gltf = await new GLTFLoader().loadAsync(el.dataset.model);
    const model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const fit = (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z * 0.55) / Math.max(size.x, size.y, size.z);
    model.position.copy(box.getCenter(new THREE.Vector3()).multiplyScalar(-fit));
    model.scale.setScalar(fit);
    scene.add(model);

    el.append(renderer.domElement);
    status?.remove();
    if (hint) hint.hidden = false;

    const resize = () => {
      const { width, height } = el.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    new ResizeObserver(resize).observe(el);
    resize();

    let running = false;
    const loop = () => {
      if (!running) return;
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    };
    const setRunning = (on) => { if (on && !running) { running = true; loop(); } else if (!on) running = false; };
    new IntersectionObserver(([e]) => setRunning(e.isIntersecting && !document.hidden)).observe(el);
    document.addEventListener('visibilitychange', () => setRunning(!document.hidden));
  } catch (err) {
    console.warn('[3D viewer]', err);
    if (status) status.innerHTML = '<p>The 3D preview could not load on this device.<br>Ask us for a live video of the ring instead.</p>';
  }
}
