import * as THREE from './vendor/three.module.min.js';

const stage = document.querySelector('#fieldcraftStage');
const canvas = document.querySelector('#fieldcraftCanvas');
const fallback = document.querySelector('#fieldcraftFallback');
const status = document.querySelector('#fieldcraftStatus');

if (stage && canvas && fallback && status) {
  const models = {
    985: {
      image: 'assets/cutout-985-three-quarter.png',
      alt: 'New Hira 985 combine harvester',
      width: '4.4 <small>m</small>',
      tank: '1,800 <small>kg</small>',
      walkers: '5'
    },
    785: {
      image: 'assets/cutout-785-brochure-model.png',
      alt: 'New Hira 785 combine harvester',
      width: '3.7 <small>m</small>',
      tank: '1,600 <small>kg</small>',
      walkers: '4'
    }
  };

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const compact = window.matchMedia('(max-width: 760px)').matches;
  const context = canvas.getContext('webgl2', {
    alpha: true,
    antialias: !compact,
    powerPreference: 'high-performance',
    premultipliedAlpha: true
  });

  const fallbackMode = (label = 'PRODUCT VIEW / COMPATIBLE') => {
    stage.classList.remove('is-ready', 'is-switching');
    stage.classList.add('is-fallback');
    status.textContent = label;
  };

  if (!context) {
    fallbackMode();
  } else {
    try {
      const renderer = new THREE.WebGLRenderer({
        canvas,
        context,
        alpha: true,
        antialias: !compact,
        powerPreference: 'high-performance'
      });
      renderer.setClearColor(0x06110b, 0);
      renderer.setPixelRatio(1);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.04;

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x06110b, compact ? 0.055 : 0.045);

      const camera = new THREE.PerspectiveCamera(compact ? 39 : 34, 1, 0.1, 80);
      camera.position.set(0, compact ? 0.25 : 0.45, compact ? 13.45 : 10.2);
      camera.lookAt(0, -0.1, 0);

      scene.add(new THREE.AmbientLight(0xfff2d2, 0.72));
      const hemisphere = new THREE.HemisphereLight(0xdde7c6, 0x07110b, 1.65);
      scene.add(hemisphere);
      const keyLight = new THREE.DirectionalLight(0xffd695, 3.5);
      keyLight.position.set(-4.5, 6.5, 5.5);
      scene.add(keyLight);
      const rimLight = new THREE.DirectionalLight(0xa8ca5f, 2.6);
      rimLight.position.set(5.5, 2.5, -3.5);
      scene.add(rimLight);

      const world = new THREE.Group();
      scene.add(world);

      const platformMaterial = new THREE.MeshStandardMaterial({
        color: 0x102219,
        metalness: 0.54,
        roughness: 0.42
      });
      const platform = new THREE.Mesh(new THREE.CylinderGeometry(3.45, 3.72, 0.22, 96), platformMaterial);
      platform.position.y = -1.52;
      world.add(platform);

      const platformGlow = new THREE.Mesh(
        new THREE.TorusGeometry(3.5, 0.018, 8, 180),
        new THREE.MeshBasicMaterial({ color: 0xd89a4a, transparent: true, opacity: 0.62 })
      );
      platformGlow.rotation.x = Math.PI / 2;
      platformGlow.position.y = -1.39;
      world.add(platformGlow);

      const floor = new THREE.Mesh(
        new THREE.CircleGeometry(13, 96),
        new THREE.MeshStandardMaterial({ color: 0x07130c, roughness: 1, metalness: 0 })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -1.65;
      world.add(floor);

      const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(2.75, 64),
        new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.38, depthWrite: false })
      );
      shadow.scale.set(1, 0.34, 1);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.set(-0.15, -1.385, 0.08);
      world.add(shadow);

      const sun = new THREE.Mesh(
        new THREE.SphereGeometry(compact ? 0.72 : 0.9, 48, 32),
        new THREE.MeshBasicMaterial({ color: 0xe8c986, transparent: true, opacity: 0.76 })
      );
      sun.position.set(compact ? 2.1 : 2.75, compact ? 1.65 : 2.05, -4.8);
      world.add(sun);

      const cropMaterial = new THREE.MeshStandardMaterial({
        color: 0x8dac4d,
        roughness: 0.82,
        metalness: 0.02
      });
      const headMaterial = new THREE.MeshStandardMaterial({
        color: 0xd8aa55,
        roughness: 0.75,
        metalness: 0.01
      });
      const cropCount = compact ? 150 : 310;
      const stalks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.014, 0.025, 1, 5), cropMaterial, cropCount);
      const heads = new THREE.InstancedMesh(new THREE.ConeGeometry(0.055, 0.27, 5), headMaterial, cropCount);
      const matrix = new THREE.Matrix4();
      const position = new THREE.Vector3();
      const rotation = new THREE.Euler();
      const quaternion = new THREE.Quaternion();
      const scale = new THREE.Vector3();
      let seed = 341927;
      const random = () => {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
      };

      for (let index = 0; index < cropCount; index += 1) {
        const side = index % 2 === 0 ? -1 : 1;
        const row = Math.floor(index / 2) % (compact ? 7 : 11);
        const spread = compact ? 3.25 : 4.25;
        const x = side * (2.45 + random() * spread) + (random() - 0.5) * 0.28;
        const z = -4.2 + row * 0.52 + (random() - 0.5) * 0.22;
        const height = 0.68 + random() * 0.72;
        const lean = (random() - 0.5) * 0.12;
        position.set(x, -1.63 + height / 2, z);
        rotation.set(lean, random() * Math.PI, lean * 0.65);
        quaternion.setFromEuler(rotation);
        scale.set(0.9 + random() * 0.5, height, 0.9 + random() * 0.5);
        matrix.compose(position, quaternion, scale);
        stalks.setMatrixAt(index, matrix);

        position.y = -1.61 + height + 0.1;
        scale.setScalar(0.75 + random() * 0.45);
        matrix.compose(position, quaternion, scale);
        heads.setMatrixAt(index, matrix);
      }
      stalks.instanceMatrix.needsUpdate = true;
      heads.instanceMatrix.needsUpdate = true;
      world.add(stalks, heads);

      const rowMaterial = new THREE.LineBasicMaterial({ color: 0xb2ce72, transparent: true, opacity: 0.2 });
      const rowPoints = [];
      for (let index = -5; index <= 5; index += 1) {
        rowPoints.push(new THREE.Vector3(index * 0.72, -1.37, -5.5));
        rowPoints.push(new THREE.Vector3(index * 1.32, -1.37, 1.9));
      }
      const rows = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(rowPoints), rowMaterial);
      world.add(rows);

      const dustCount = compact ? 62 : 130;
      const dustPositions = new Float32Array(dustCount * 3);
      for (let index = 0; index < dustCount; index += 1) {
        dustPositions[index * 3] = (random() - 0.5) * 12;
        dustPositions[index * 3 + 1] = -0.8 + random() * 5;
        dustPositions[index * 3 + 2] = -5 + random() * 7;
      }
      const dustGeometry = new THREE.BufferGeometry();
      dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
      const dust = new THREE.Points(
        dustGeometry,
        new THREE.PointsMaterial({ color: 0xf0bd72, size: compact ? 0.025 : 0.034, transparent: true, opacity: 0.42, depthWrite: false })
      );
      world.add(dust);

      const machineGroup = new THREE.Group();
      machineGroup.position.set(-0.15, compact ? -0.08 : -0.02, 0.38);
      world.add(machineGroup);

      const machineMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        alphaTest: 0.02,
        side: THREE.DoubleSide,
        depthWrite: true,
        toneMapped: false
      });
      const machine = new THREE.Mesh(new THREE.PlaneGeometry(5.65, 3.75), machineMaterial);
      machineGroup.add(machine);

      const loader = new THREE.TextureLoader();
      const textureCache = new Map();
      const loadTexture = (url) => {
        if (textureCache.has(url)) return Promise.resolve(textureCache.get(url));
        return new Promise((resolve, reject) => {
          loader.load(url, (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
            textureCache.set(url, texture);
            resolve(texture);
          }, undefined, reject);
        });
      };

      let activeModel = '985';
      let activeTexture = null;
      let visible = false;
      let frame = 0;
      let targetRotation = 0;
      let targetLift = 0;
      let pointerX = 0;
      let pointerY = 0;
      let dragging = false;
      let dragStartX = 0;
      let dragStartRotation = 0;
      const clock = new THREE.Clock();

      const resize = () => {
        const width = Math.max(1, stage.clientWidth);
        const height = Math.max(1, stage.clientHeight);
        const density = Math.min(window.devicePixelRatio || 1, compact ? 1.45 : 1.75);
        const maximumPixels = compact ? 1000000 : 2200000;
        let drawWidth = Math.round(width * density);
        let drawHeight = Math.round(height * density);
        const pixelCount = drawWidth * drawHeight;
        if (pixelCount > maximumPixels) {
          const reduction = Math.sqrt(maximumPixels / pixelCount);
          drawWidth = Math.round(drawWidth * reduction);
          drawHeight = Math.round(drawHeight * reduction);
        }
        if (canvas.width !== drawWidth || canvas.height !== drawHeight) renderer.setSize(drawWidth, drawHeight, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      const render = () => {
        resize();
        renderer.render(scene, camera);
      };

      const animate = () => {
        frame = 0;
        if (!visible || document.hidden) return;
        const elapsed = clock.getElapsedTime();
        const idleRotation = reducedMotion ? 0 : Math.sin(elapsed * 0.34) * 0.035;
        world.rotation.y += (targetRotation + idleRotation - world.rotation.y) * 0.055;
        world.rotation.x += ((compact ? -0.025 : -0.045) + targetLift - world.rotation.x) * 0.05;
        machineGroup.position.y = (compact ? -0.08 : -0.02) + (reducedMotion ? 0 : Math.sin(elapsed * 0.72) * 0.025);
        platformGlow.material.opacity = 0.52 + (reducedMotion ? 0 : Math.sin(elapsed * 1.2) * 0.12);
        dust.rotation.y = elapsed * 0.025;
        camera.position.x += (pointerX * 0.3 - camera.position.x) * 0.035;
        camera.position.y += ((compact ? 0.25 : 0.45) + pointerY * 0.12 - camera.position.y) * 0.035;
        camera.lookAt(0, -0.1, 0);
        render();
        if (!reducedMotion) frame = window.requestAnimationFrame(animate);
      };

      const requestRender = () => {
        if (reducedMotion) render();
        else if (!frame && visible && !document.hidden) frame = window.requestAnimationFrame(animate);
      };

      const setMachineGeometry = (texture) => {
        const image = texture.image;
        const aspect = image?.naturalWidth && image?.naturalHeight ? image.naturalWidth / image.naturalHeight : 1.5;
        const maxWidth = compact ? 5.75 : 5.95;
        const maxHeight = compact ? 3.75 : 3.88;
        let width = maxWidth;
        let height = width / aspect;
        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspect;
        }
        machine.geometry.dispose();
        machine.geometry = new THREE.PlaneGeometry(width, height);
      };

      const setModel = async (modelKey, announce = true) => {
        const model = models[modelKey];
        if (!model) return;
        activeModel = modelKey;
        stage.classList.add('is-switching');
        fallback.src = model.image;
        fallback.alt = model.alt;
        document.querySelector('#fieldcraftWidth').innerHTML = model.width;
        document.querySelector('#fieldcraftTank').innerHTML = model.tank;
        document.querySelector('#fieldcraftWalkers').textContent = model.walkers;
        document.querySelectorAll('[data-fieldcraft-model]').forEach((button) => {
          const active = button.dataset.fieldcraftModel === modelKey;
          button.classList.toggle('is-active', active);
          button.setAttribute('aria-pressed', String(active));
        });
        if (announce) status.textContent = '3D SYSTEM / LOADING ' + modelKey;
        try {
          const texture = await loadTexture(model.image);
          if (activeModel !== modelKey) return;
          activeTexture = texture;
          machineMaterial.map = activeTexture;
          machineMaterial.needsUpdate = true;
          setMachineGeometry(activeTexture);
          stage.classList.add('is-ready');
          status.textContent = '3D SYSTEM / LIVE / ' + modelKey;
          window.setTimeout(() => stage.classList.remove('is-switching'), 520);
          requestRender();
        } catch (error) {
          fallbackMode('PRODUCT VIEW / ' + modelKey);
        }
      };

      document.querySelectorAll('[data-fieldcraft-model]').forEach((button) => {
        button.addEventListener('click', () => setModel(button.dataset.fieldcraftModel));
      });

      stage.addEventListener('pointerdown', (event) => {
        if (event.target.closest('button, a')) return;
        dragging = true;
        dragStartX = event.clientX;
        dragStartRotation = targetRotation;
        stage.setPointerCapture?.(event.pointerId);
      });
      stage.addEventListener('pointermove', (event) => {
        const bounds = stage.getBoundingClientRect();
        pointerX = THREE.MathUtils.clamp(((event.clientX - bounds.left) / bounds.width - 0.5) * 2, -1, 1);
        pointerY = THREE.MathUtils.clamp((0.5 - (event.clientY - bounds.top) / bounds.height) * 2, -1, 1);
        if (dragging) targetRotation = THREE.MathUtils.clamp(dragStartRotation + (event.clientX - dragStartX) * 0.0022, -0.24, 0.24);
        else targetRotation = pointerX * 0.08;
        targetLift = pointerY * 0.018;
        requestRender();
      });
      const releasePointer = (event) => {
        dragging = false;
        stage.releasePointerCapture?.(event.pointerId);
      };
      stage.addEventListener('pointerup', releasePointer);
      stage.addEventListener('pointercancel', releasePointer);
      stage.addEventListener('pointerleave', () => {
        if (!dragging) {
          pointerX = 0;
          pointerY = 0;
          targetRotation = 0;
          targetLift = 0;
        }
      });

      const observer = new IntersectionObserver((entries) => {
        visible = entries[0]?.isIntersecting || false;
        if (visible) requestRender();
        else if (frame) {
          window.cancelAnimationFrame(frame);
          frame = 0;
        }
      }, { rootMargin: '180px 0px', threshold: 0.02 });
      observer.observe(stage);

      const resizeObserver = new ResizeObserver(() => requestRender());
      resizeObserver.observe(stage);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden && frame) {
          window.cancelAnimationFrame(frame);
          frame = 0;
        } else {
          requestRender();
        }
      });
      window.addEventListener('orientationchange', requestRender, { passive: true });
      canvas.addEventListener('webglcontextlost', (event) => {
        event.preventDefault();
        fallbackMode('3D SYSTEM / PAUSED');
      });

      setModel('985', false);
      loadTexture(models['785'].image).catch(() => {});
    } catch (error) {
      fallbackMode();
    }
  }
}
