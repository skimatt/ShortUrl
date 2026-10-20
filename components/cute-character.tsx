"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface CuteCharacterProps {
  theme?: "light" | "dark";
}

export default function CuteCharacter({ theme = "light" }: CuteCharacterProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Perspective Camera
    const scene = new THREE.Scene();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.3, 11.5);
    camera.lookAt(0, 0, 0);

    // 2. High-Performance WebGL Renderer with Soft Shadow Mapping
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Aesthetic Lighting (Warm Golden Sunlight + Rim Light + Ambient Fill)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.5);
    sunLight.position.set(7, 15, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 42;
    sunLight.shadow.camera.left = -14;
    sunLight.shadow.camera.right = 14;
    sunLight.shadow.camera.top = 11;
    sunLight.shadow.camera.bottom = -11;
    sunLight.shadow.bias = -0.0008;
    sunLight.shadow.radius = 3.5;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0xd97757, 1.2);
    rimLight.position.set(-9, 7, -7);
    scene.add(rimLight);

    // 4. Ground Shadow Receiver
    const floorY = -2.7;
    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.17 });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = floorY;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // 5. Aesthetic Materials Palette
    const peachMat = new THREE.MeshStandardMaterial({
      color: 0xee8b6b,
      roughness: 0.35,
      metalness: 0.05,
    });

    const mintMat = new THREE.MeshStandardMaterial({
      color: 0x65c4b1,
      roughness: 0.35,
      metalness: 0.05,
    });

    const yellowChickMat = new THREE.MeshStandardMaterial({
      color: 0xf6cf55, // Chirp - Tiny baby chick mascot
      roughness: 0.3,
      metalness: 0.05,
    });

    const beakMat = new THREE.MeshStandardMaterial({
      color: 0xf58a38,
      roughness: 0.3,
    });

    const creamMat = new THREE.MeshStandardMaterial({
      color: 0xfff3eb,
      roughness: 0.4,
    });

    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.1,
    });

    const pupilMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const blushMat = new THREE.MeshBasicMaterial({
      color: 0xff6b84,
      transparent: true,
      opacity: 0.75,
    });

    const woodMat = new THREE.MeshStandardMaterial({
      color: 0xb58055,
      roughness: 0.6,
    });

    const woodDarkMat = new THREE.MeshStandardMaterial({
      color: 0x8c5b36,
      roughness: 0.65,
    });

    const slideYellowMat = new THREE.MeshStandardMaterial({
      color: 0xf4bf42,
      roughness: 0.35,
    });

    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x80c976,
      roughness: 0.6,
      flatShading: true,
    });

    const flowerWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
    });

    const flowerYellowMat = new THREE.MeshStandardMaterial({
      color: 0xf6c544,
      roughness: 0.2,
    });

    const flowerPinkMat = new THREE.MeshStandardMaterial({
      color: 0xf492a5,
      roughness: 0.3,
    });

    const mushroomCapMat = new THREE.MeshStandardMaterial({
      color: 0xee5d52,
      roughness: 0.3,
    });

    const mushroomStemMat = new THREE.MeshStandardMaterial({
      color: 0xfffaea,
      roughness: 0.5,
    });

    const ballMat1 = new THREE.MeshStandardMaterial({
      color: 0xf5b742,
      roughness: 0.25,
      metalness: 0.1,
    });

    const ballMat2 = new THREE.MeshStandardMaterial({
      color: 0xd97757,
      roughness: 0.25,
      metalness: 0.1,
    });

    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      transparent: true,
      opacity: 0.55,
    });

    const pinwheelBladeMat = new THREE.MeshStandardMaterial({
      color: 0x5ea8de,
      roughness: 0.3,
    });

    function enableShadows(obj: THREE.Object3D) {
      obj.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }

    // 6. PLAYGROUND SCENERY & PROPS
    const playgroundGroup = new THREE.Group();
    scene.add(playgroundGroup);

    // A. Wooden Swing Set (Ayunan Kayu yang Bergoyang)
    const swingGroup = new THREE.Group();
    const beamGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.8, 12);
    beamGeo.rotateZ(Math.PI / 2);
    const beam = new THREE.Mesh(beamGeo, woodMat);
    beam.position.y = 2.4;
    swingGroup.add(beam);

    // A-frame Legs
    const poleGeo = new THREE.CylinderGeometry(0.06, 0.08, 2.7, 12);
    const leg1 = new THREE.Mesh(poleGeo, woodDarkMat);
    leg1.position.set(-1.25, 1.25, 0.45);
    leg1.rotation.set(0.32, 0, -0.15);
    swingGroup.add(leg1);

    const leg2 = new THREE.Mesh(poleGeo, woodDarkMat);
    leg2.position.set(-1.25, 1.25, -0.45);
    leg2.rotation.set(-0.32, 0, -0.15);
    swingGroup.add(leg2);

    const leg3 = new THREE.Mesh(poleGeo, woodDarkMat);
    leg3.position.set(1.25, 1.25, 0.45);
    leg3.rotation.set(0.32, 0, 0.15);
    swingGroup.add(leg3);

    const leg4 = new THREE.Mesh(poleGeo, woodDarkMat);
    leg4.position.set(1.25, 1.25, -0.45);
    leg4.rotation.set(-0.32, 0, 0.15);
    swingGroup.add(leg4);

    // Swinging Seat Group
    const seatSwingGroup = new THREE.Group();
    seatSwingGroup.position.set(0, 2.35, 0);
    swingGroup.add(seatSwingGroup);

    const ropeGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.6, 6);
    const rope1 = new THREE.Mesh(ropeGeo, creamMat);
    rope1.position.set(-0.38, -0.8, 0);
    seatSwingGroup.add(rope1);

    const rope2 = new THREE.Mesh(ropeGeo, creamMat);
    rope2.position.set(0.38, -0.8, 0);
    seatSwingGroup.add(rope2);

    const seatGeo = new THREE.BoxGeometry(0.95, 0.06, 0.35);
    const seat = new THREE.Mesh(seatGeo, woodMat);
    seat.position.set(0, -1.6, 0);
    seatSwingGroup.add(seat);

    swingGroup.position.set(4.0, floorY, -3.2);
    swingGroup.rotation.y = -0.3;
    enableShadows(swingGroup);
    playgroundGroup.add(swingGroup);

    // B. Playground Slide (Perosotan Lucu)
    const slideGroup = new THREE.Group();
    // Platform
    const platformGeo = new THREE.BoxGeometry(1.0, 0.1, 0.9);
    const platform = new THREE.Mesh(platformGeo, woodMat);
    platform.position.y = 1.6;
    slideGroup.add(platform);

    // 4 Platform Pillars
    const pillarGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.6, 8);
    [[-0.45, -0.4], [0.45, -0.4], [-0.45, 0.4], [0.45, 0.4]].forEach(([px, pz]) => {
      const p = new THREE.Mesh(pillarGeo, woodDarkMat);
      p.position.set(px, 0.8, pz);
      slideGroup.add(p);
    });

    // Curved Slide Ramp
    const slideRampGeo = new THREE.BoxGeometry(0.65, 0.08, 2.6);
    slideRampGeo.rotateX(Math.PI / 4.8);
    const slideRamp = new THREE.Mesh(slideRampGeo, slideYellowMat);
    slideRamp.position.set(0, 0.8, 1.15);
    slideGroup.add(slideRamp);

    slideGroup.position.set(-4.5, floorY, -3.0);
    slideGroup.rotation.y = 0.45;
    enableShadows(slideGroup);
    playgroundGroup.add(slideGroup);

    // C. Spinning Pinwheel (Kincir Angin Warna-Warni)
    const pinwheelGroup = new THREE.Group();
    const pinwheelPoleGeo = new THREE.CylinderGeometry(0.02, 0.025, 1.2, 8);
    pinwheelPoleGeo.translate(0, 0.6, 0);
    const pinwheelPole = new THREE.Mesh(pinwheelPoleGeo, creamMat);
    pinwheelGroup.add(pinwheelPole);

    const pinwheelBladesGroup = new THREE.Group();
    pinwheelBladesGroup.position.set(0, 1.18, 0.04);
    pinwheelGroup.add(pinwheelBladesGroup);

    const bladeGeo = new THREE.ConeGeometry(0.12, 0.35, 4);
    bladeGeo.scale(0.3, 1, 0.8);
    for (let b = 0; b < 4; b++) {
      const blade = new THREE.Mesh(bladeGeo, pinwheelBladeMat);
      const angle = (b / 4) * Math.PI * 2;
      blade.position.set(Math.cos(angle) * 0.16, Math.sin(angle) * 0.16, 0);
      blade.rotation.z = angle - Math.PI / 2;
      pinwheelBladesGroup.add(blade);
    }

    pinwheelGroup.position.set(-2.8, floorY, -1.8);
    enableShadows(pinwheelGroup);
    playgroundGroup.add(pinwheelGroup);

    // D. Soft Floating Clouds in Sky
    function createCloud(x: number, y: number, z: number, scale = 1) {
      const cloud = new THREE.Group();
      const puffGeo = new THREE.SphereGeometry(0.5, 12, 12);

      const p1 = new THREE.Mesh(puffGeo, cloudMat);
      p1.scale.set(1.4, 0.9, 0.9);
      cloud.add(p1);

      const p2 = new THREE.Mesh(puffGeo, cloudMat);
      p2.position.set(-0.45, -0.1, 0);
      p2.scale.set(0.9, 0.7, 0.7);
      cloud.add(p2);

      const p3 = new THREE.Mesh(puffGeo, cloudMat);
      p3.position.set(0.48, -0.05, 0);
      p3.scale.set(1.0, 0.75, 0.8);
      cloud.add(p3);

      cloud.position.set(x, y, z);
      cloud.scale.setScalar(scale);
      return cloud;
    }

    const clouds = [
      createCloud(-4.8, 3.8, -6, 1.1),
      createCloud(4.2, 4.2, -7, 1.3),
      createCloud(0.5, 4.6, -8, 0.9),
    ];
    clouds.forEach((c) => scene.add(c));

    // ----------------------------------------------------
    // F. Celestial Day/Night System (Sun, Moon & Twinkling Stars)
    // ----------------------------------------------------
    // 1) Glowing Daytime Sun with Orbiting Soft Rays
    const sunGroup = new THREE.Group();
    const sunCoreGeo = new THREE.SphereGeometry(0.72, 32, 32);
    const sunCoreMat = new THREE.MeshBasicMaterial({ color: 0xffb72b });
    const sunCore = new THREE.Mesh(sunCoreGeo, sunCoreMat);
    sunGroup.add(sunCore);

    const sunGlowGeo = new THREE.SphereGeometry(1.02, 24, 24);
    const sunGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffdf78,
      transparent: true,
      opacity: 0.35,
    });
    const sunGlow = new THREE.Mesh(sunGlowGeo, sunGlowMat);
    sunGroup.add(sunGlow);

    const sunRaysGroup = new THREE.Group();
    const rayGeo = new THREE.CapsuleGeometry(0.08, 0.28, 4, 8);
    const rayMat = new THREE.MeshBasicMaterial({
      color: 0xffcc33,
      transparent: true,
      opacity: 0.85,
    });
    for (let r = 0; r < 8; r++) {
      const angle = (r / 8) * Math.PI * 2;
      const ray = new THREE.Mesh(rayGeo, rayMat);
      ray.position.set(Math.cos(angle) * 1.32, Math.sin(angle) * 1.32, 0);
      ray.rotation.z = angle + Math.PI / 2;
      sunRaysGroup.add(ray);
    }
    sunGroup.add(sunRaysGroup);
    scene.add(sunGroup);

    // 2) Glowing Night Moon with Atmospheric Halo and Craters
    const moonGroup = new THREE.Group();
    const moonGeo = new THREE.SphereGeometry(0.68, 32, 32);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.35,
      emissive: 0xc8ddf5,
      emissiveIntensity: 0.45,
    });
    const moonCore = new THREE.Mesh(moonGeo, moonMat);
    moonGroup.add(moonCore);

    const moonGlowGeo = new THREE.SphereGeometry(0.98, 24, 24);
    const moonGlowMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.28,
    });
    const moonGlow = new THREE.Mesh(moonGlowGeo, moonGlowMat);
    moonGroup.add(moonGlow);

    // Subtle moon craters
    const craterMat = new THREE.MeshStandardMaterial({
      color: 0xcfdce8,
      roughness: 0.5,
    });
    const cratersData = [
      { x: -0.22, y: 0.2, z: 0.62, r: 0.13 },
      { x: 0.24, y: -0.16, z: 0.6, r: 0.17 },
      { x: -0.1, y: -0.3, z: 0.58, r: 0.1 },
      { x: 0.18, y: 0.32, z: 0.56, r: 0.09 },
    ];
    cratersData.forEach(({ x, y, z, r }) => {
      const cGeo = new THREE.SphereGeometry(r, 12, 12);
      cGeo.scale(1, 1, 0.25);
      const cMesh = new THREE.Mesh(cGeo, craterMat);
      cMesh.position.set(x, y, z);
      moonGroup.add(cMesh);
    });
    scene.add(moonGroup);

    // 3) Night Starfield (Twinkling 3D Stars)
    const starsGroup = new THREE.Group();
    const starGeo = new THREE.OctahedronGeometry(0.065, 0);
    const starMatList: THREE.MeshBasicMaterial[] = [];
    const starData: { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; phase: number }[] = [];

    for (let s = 0; s < 42; s++) {
      const sMat = new THREE.MeshBasicMaterial({
        color: s % 3 === 0 ? 0xfff6cf : 0xe0f2fe,
        transparent: true,
        opacity: 0,
      });
      starMatList.push(sMat);
      const sMesh = new THREE.Mesh(starGeo, sMat);
      const sx = (Math.random() - 0.5) * 20;
      const sy = 1.0 + Math.random() * 6.5;
      const sz = -6.0 + Math.random() * 3.5;
      sMesh.position.set(sx, sy, sz);
      const sScale = 0.6 + Math.random() * 0.7;
      sMesh.scale.setScalar(sScale);
      starsGroup.add(sMesh);
      starData.push({ mesh: sMesh, mat: sMat, phase: Math.random() * Math.PI * 2 });
    }
    scene.add(starsGroup);

    // E. 3D Grass Tufts, Daisies & Mushrooms
    const grassList: THREE.Group[] = [];
    function createGrassClump(x: number, z: number, scale = 1) {
      const clump = new THREE.Group();
      const bladeGeo = new THREE.ConeGeometry(0.05, 0.36, 4);
      bladeGeo.translate(0, 0.18, 0);

      for (let i = 0; i < 6; i++) {
        const blade = new THREE.Mesh(bladeGeo, grassMat);
        const angle = (i / 6) * Math.PI * 2;
        blade.position.set(Math.cos(angle) * 0.08, 0, Math.sin(angle) * 0.08);
        blade.rotation.set(
          (Math.random() - 0.5) * 0.4,
          Math.random() * Math.PI,
          (Math.random() - 0.5) * 0.4
        );
        clump.add(blade);
      }
      clump.position.set(x, floorY, z);
      clump.scale.setScalar(scale);
      enableShadows(clump);
      return clump;
    }

    function createFlower(x: number, z: number, isPink = false) {
      const flower = new THREE.Group();
      const stemGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.32, 6);
      stemGeo.translate(0, 0.16, 0);
      const stem = new THREE.Mesh(stemGeo, grassMat);
      flower.add(stem);

      const center = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 8, 8),
        flowerYellowMat
      );
      center.position.set(0, 0.32, 0);
      flower.add(center);

      const petalMat = isPink ? flowerPinkMat : flowerWhiteMat;
      const petalGeo = new THREE.SphereGeometry(0.04, 6, 6);
      petalGeo.scale(1.5, 0.3, 0.8);
      for (let i = 0; i < 6; i++) {
        const petal = new THREE.Mesh(petalGeo, petalMat);
        const rot = (i / 6) * Math.PI * 2;
        petal.position.set(Math.cos(rot) * 0.085, 0.32, Math.sin(rot) * 0.085);
        petal.rotation.y = -rot;
        flower.add(petal);
      }
      flower.position.set(x, floorY, z);
      enableShadows(flower);
      return flower;
    }

    function createMushroom(x: number, z: number, scale = 1) {
      const shroom = new THREE.Group();
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.16, 0.45, 12),
        mushroomStemMat
      );
      stem.position.y = 0.225;
      shroom.add(stem);

      const cap = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5),
        mushroomCapMat
      );
      cap.scale.set(1, 0.8, 1);
      cap.position.y = 0.42;
      shroom.add(cap);

      const dotGeo = new THREE.SphereGeometry(0.035, 6, 6);
      for (let i = 0; i < 4; i++) {
        const dot = new THREE.Mesh(dotGeo, flowerWhiteMat);
        const angle = (i / 4) * Math.PI * 2;
        dot.position.set(Math.cos(angle) * 0.2, 0.58, Math.sin(angle) * 0.2);
        shroom.add(dot);
      }
      shroom.position.set(x, floorY, z);
      shroom.scale.setScalar(scale);
      enableShadows(shroom);
      return shroom;
    }

    const grassCoords = [
      [-4.6, -1.8, 1.2],
      [-3.6, 0.6, 0.9],
      [-1.9, -2.8, 1.1],
      [1.6, -2.5, 1.3],
      [3.9, -0.8, 1.0],
      [4.6, -2.2, 0.9],
      [-2.6, 1.2, 0.8],
      [2.3, 0.8, 1.1],
      [-0.8, 1.4, 0.9],
      [3.2, -3.2, 1.2],
    ];
    grassCoords.forEach(([x, z, s]) => {
      const g = createGrassClump(x, z, s);
      grassList.push(g);
      playgroundGroup.add(g);
    });

    const flowers = [
      createFlower(-3.8, -1.2, false),
      createFlower(-3.5, -0.9, true),
      createFlower(-1.2, -2.4, false),
      createFlower(2.8, -1.9, true),
      createFlower(3.1, -2.1, false),
      createFlower(4.2, 0.2, false),
    ];
    flowers.forEach((f) => playgroundGroup.add(f));

    const mushrooms = [
      createMushroom(-3.8, -2.5, 1.1),
      createMushroom(-3.5, -2.8, 0.7),
      createMushroom(3.2, -3.5, 1.0),
    ];
    mushrooms.forEach((m) => playgroundGroup.add(m));

    // 7. INTERACTIVE 3D PLAYGROUND TOY BALL
    const ballRadius = 0.34;
    const ballGeo = new THREE.SphereGeometry(ballRadius, 24, 24);
    const ballMesh = new THREE.Mesh(ballGeo, ballMat1);

    const stripeGeo = new THREE.TorusGeometry(ballRadius * 0.99, 0.05, 12, 32);
    const stripeMesh = new THREE.Mesh(stripeGeo, ballMat2);
    stripeMesh.rotation.x = Math.PI / 2;
    ballMesh.add(stripeMesh);

    enableShadows(ballMesh);
    scene.add(ballMesh);

    const ballPhysics = {
      pos: new THREE.Vector3(0, floorY + ballRadius, -0.5),
      vel: new THREE.Vector3(0.018, 0, 0.012),
    };
    ballMesh.position.copy(ballPhysics.pos);

    // 8. CHARACTER 1 (Mochi - Terracotta Bunny)
    function createMochi() {
      const root = new THREE.Group();
      const bodyScale = new THREE.Group();
      root.add(bodyScale);

      const bodyGeo = new THREE.SphereGeometry(0.72, 32, 32);
      bodyGeo.scale(1, 0.96, 0.96);
      const body = new THREE.Mesh(bodyGeo, peachMat);
      body.position.y = 0.7;
      bodyScale.add(body);

      const bellyGeo = new THREE.SphereGeometry(0.48, 24, 24);
      bellyGeo.scale(0.85, 0.9, 0.4);
      const belly = new THREE.Mesh(bellyGeo, creamMat);
      belly.position.set(0, 0.6, 0.52);
      bodyScale.add(belly);

      const headGroup = new THREE.Group();
      headGroup.position.set(0, 1.25, 0);
      bodyScale.add(headGroup);

      const headGeo = new THREE.SphereGeometry(0.68, 32, 32);
      headGeo.scale(1.05, 0.96, 1);
      const head = new THREE.Mesh(headGeo, peachMat);
      headGroup.add(head);

      const earGeo = new THREE.CapsuleGeometry(0.18, 0.46, 8, 16);
      const leftEar = new THREE.Mesh(earGeo, peachMat);
      leftEar.position.set(-0.38, 0.72, -0.05);
      leftEar.rotation.set(-0.15, 0, 0.25);
      headGroup.add(leftEar);

      const rightEar = new THREE.Mesh(earGeo, peachMat);
      rightEar.position.set(0.38, 0.72, -0.05);
      rightEar.rotation.set(-0.15, 0, -0.25);
      headGroup.add(rightEar);

      const eyeGeo = new THREE.SphereGeometry(0.09, 16, 16);
      const pupilGeo = new THREE.SphereGeometry(0.035, 12, 12);

      const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      leftEye.position.set(-0.25, 0.08, 0.62);
      headGroup.add(leftEye);

      const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
      leftPupil.position.set(-0.23, 0.11, 0.69);
      headGroup.add(leftPupil);

      const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
      rightEye.position.set(0.25, 0.08, 0.62);
      headGroup.add(rightEye);

      const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
      rightPupil.position.set(0.27, 0.11, 0.69);
      headGroup.add(rightPupil);

      const blushGeo = new THREE.CircleGeometry(0.11, 16);
      const leftBlush = new THREE.Mesh(blushGeo, blushMat);
      leftBlush.position.set(-0.38, -0.06, 0.6);
      leftBlush.rotation.y = -0.3;
      headGroup.add(leftBlush);

      const rightBlush = new THREE.Mesh(blushGeo, blushMat);
      rightBlush.position.set(0.38, -0.06, 0.6);
      rightBlush.rotation.y = 0.3;
      headGroup.add(rightBlush);

      const snout = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 12, 12),
        eyeMat
      );
      snout.position.set(0, -0.02, 0.69);
      headGroup.add(snout);

      const armGeo = new THREE.SphereGeometry(0.18, 16, 16);
      armGeo.scale(0.85, 1.4, 0.85);

      const leftArm = new THREE.Mesh(armGeo, peachMat);
      leftArm.position.set(-0.62, 0.72, 0.1);
      bodyScale.add(leftArm);

      const rightArm = new THREE.Mesh(armGeo, peachMat);
      rightArm.position.set(0.62, 0.72, 0.1);
      bodyScale.add(rightArm);

      const legGeo = new THREE.SphereGeometry(0.2, 16, 16);
      legGeo.scale(1, 0.7, 1.4);

      const leftLeg = new THREE.Mesh(legGeo, peachMat);
      leftLeg.position.set(-0.35, 0.16, 0.1);
      bodyScale.add(leftLeg);

      const rightLeg = new THREE.Mesh(legGeo, peachMat);
      rightLeg.position.set(0.35, 0.16, 0.1);
      bodyScale.add(rightLeg);

      enableShadows(root);
      root.scale.setScalar(0.72);

      return {
        root,
        bodyScale,
        headGroup,
        leftEar,
        rightEar,
        leftEye,
        rightEye,
        leftPupil,
        rightPupil,
        leftArm,
        rightArm,
        leftLeg,
        rightLeg,
        leftBlush,
        rightBlush,
      };
    }

    // 9. CHARACTER 2 (Pip - Mint Companion Puppy)
    function createPip() {
      const root = new THREE.Group();
      const bodyScale = new THREE.Group();
      root.add(bodyScale);

      const bodyGeo = new THREE.SphereGeometry(0.6, 28, 28);
      const body = new THREE.Mesh(bodyGeo, mintMat);
      body.position.y = 0.6;
      bodyScale.add(body);

      const bellyGeo = new THREE.SphereGeometry(0.4, 20, 20);
      bellyGeo.scale(0.85, 0.85, 0.4);
      const belly = new THREE.Mesh(bellyGeo, creamMat);
      belly.position.set(0, 0.5, 0.45);
      bodyScale.add(belly);

      const headGroup = new THREE.Group();
      headGroup.position.set(0, 1.05, 0);
      bodyScale.add(headGroup);

      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 28, 28),
        mintMat
      );
      headGroup.add(head);

      const earGeo = new THREE.SphereGeometry(0.2, 16, 16);
      earGeo.scale(0.8, 1.2, 0.6);

      const leftEar = new THREE.Mesh(earGeo, mintMat);
      leftEar.position.set(-0.45, 0.42, 0);
      leftEar.rotation.z = 0.4;
      headGroup.add(leftEar);

      const rightEar = new THREE.Mesh(earGeo, mintMat);
      rightEar.position.set(0.45, 0.42, 0);
      rightEar.rotation.z = -0.4;
      headGroup.add(rightEar);

      const eyeGeo = new THREE.SphereGeometry(0.075, 14, 14);
      const pupilGeo = new THREE.SphereGeometry(0.03, 10, 10);

      const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      leftEye.position.set(-0.2, 0.06, 0.5);
      headGroup.add(leftEye);

      const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
      leftPupil.position.set(-0.18, 0.08, 0.56);
      headGroup.add(leftPupil);

      const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
      rightEye.position.set(0.2, 0.06, 0.5);
      headGroup.add(rightEye);

      const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
      rightPupil.position.set(0.22, 0.08, 0.56);
      headGroup.add(rightPupil);

      const tailGeo = new THREE.CapsuleGeometry(0.08, 0.25, 6, 12);
      const tail = new THREE.Mesh(tailGeo, mintMat);
      tail.position.set(0, 0.5, -0.55);
      tail.rotation.x = -0.8;
      bodyScale.add(tail);

      const limbGeo = new THREE.SphereGeometry(0.15, 14, 14);

      const leftArm = new THREE.Mesh(limbGeo, mintMat);
      leftArm.position.set(-0.5, 0.58, 0.08);
      bodyScale.add(leftArm);

      const rightArm = new THREE.Mesh(limbGeo, mintMat);
      rightArm.position.set(0.5, 0.58, 0.08);
      bodyScale.add(rightArm);

      const leftLeg = new THREE.Mesh(limbGeo, mintMat);
      leftLeg.position.set(-0.28, 0.12, 0.05);
      bodyScale.add(leftLeg);

      const rightLeg = new THREE.Mesh(limbGeo, mintMat);
      rightLeg.position.set(0.28, 0.12, 0.05);
      bodyScale.add(rightLeg);

      enableShadows(root);
      root.scale.setScalar(0.58);

      return {
        root,
        bodyScale,
        headGroup,
        leftEar,
        rightEar,
        leftEye,
        rightEye,
        leftPupil,
        rightPupil,
        leftArm,
        rightArm,
        leftLeg,
        rightLeg,
        tail,
      };
    }

    // 10. CHARACTER 3 (Chirp - Tiny Buttercup Chick Mascot)
    function createChirp() {
      const root = new THREE.Group();
      const bodyScale = new THREE.Group();
      root.add(bodyScale);

      // Cute Round Chick Body
      const bodyGeo = new THREE.SphereGeometry(0.38, 20, 20);
      bodyGeo.scale(1, 0.95, 1);
      const body = new THREE.Mesh(bodyGeo, yellowChickMat);
      body.position.y = 0.38;
      bodyScale.add(body);

      // Little Beak
      const beakGeo = new THREE.ConeGeometry(0.065, 0.14, 6);
      beakGeo.rotateX(Math.PI / 2);
      const beak = new THREE.Mesh(beakGeo, beakMat);
      beak.position.set(0, 0.42, 0.38);
      bodyScale.add(beak);

      // Cute Tiny Beady Eyes
      const eyeGeo = new THREE.SphereGeometry(0.045, 10, 10);
      const pupilGeo = new THREE.SphereGeometry(0.02, 8, 8);

      const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      leftEye.position.set(-0.14, 0.46, 0.32);
      bodyScale.add(leftEye);

      const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
      leftPupil.position.set(-0.13, 0.48, 0.36);
      bodyScale.add(leftPupil);

      const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
      rightEye.position.set(0.14, 0.46, 0.32);
      bodyScale.add(rightEye);

      const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
      rightPupil.position.set(0.15, 0.48, 0.36);
      bodyScale.add(rightPupil);

      // Fluttering Little Wings
      const wingGeo = new THREE.SphereGeometry(0.12, 10, 10);
      wingGeo.scale(0.3, 0.8, 1.2);

      const leftWing = new THREE.Mesh(wingGeo, yellowChickMat);
      leftWing.position.set(-0.38, 0.38, 0);
      bodyScale.add(leftWing);

      const rightWing = new THREE.Mesh(wingGeo, yellowChickMat);
      rightWing.position.set(0.38, 0.38, 0);
      bodyScale.add(rightWing);

      // Tiny Feet
      const footGeo = new THREE.BoxGeometry(0.08, 0.04, 0.12);
      const leftFoot = new THREE.Mesh(footGeo, beakMat);
      leftFoot.position.set(-0.12, 0.03, 0.04);
      bodyScale.add(leftFoot);

      const rightFoot = new THREE.Mesh(footGeo, beakMat);
      rightFoot.position.set(0.12, 0.03, 0.04);
      bodyScale.add(rightFoot);

      enableShadows(root);
      root.scale.setScalar(0.48);

      return {
        root,
        bodyScale,
        leftWing,
        rightWing,
        leftEye,
        rightEye,
        leftPupil,
        rightPupil,
      };
    }

    const mochi = createMochi();
    const pip = createPip();
    const chirp = createChirp();

    scene.add(mochi.root);
    scene.add(pip.root);
    scene.add(chirp.root);

    // 11. BUTTERY SMOOTH ROAMING AI CONTROLLERS
    const mochiActor = {
      pos: new THREE.Vector3(-2.8, floorY, 0),
      target: new THREE.Vector3(0, floorY, 0),
      vel: new THREE.Vector3(),
      maxSpeed: 0.046,
      runPhase: 0,
      mode: "PLAYING" as "PLAYING" | "SHY_WAVE" | "HAPPY_JUMP",
      waveTimer: 0,
      nextWaveTimer: 8.5,
      jumpTimer: 0,
      currentAngle: 0,
    };

    const pipActor = {
      pos: new THREE.Vector3(2.8, floorY, -1.0),
      target: new THREE.Vector3(0, floorY, 0),
      vel: new THREE.Vector3(),
      maxSpeed: 0.05,
      runPhase: 0,
      spinPhase: 0,
      currentAngle: 0,
    };

    const chirpActor = {
      pos: new THREE.Vector3(0.5, floorY, -1.8),
      vel: new THREE.Vector3(),
      maxSpeed: 0.054,
      hopPhase: 0,
      wingFlutter: 0,
      currentAngle: 0,
    };

    function pickRandomPlaygroundLocation(): THREE.Vector3 {
      return new THREE.Vector3(
        (Math.random() - 0.5) * 9.5, // X: -4.75 to +4.75
        floorY,
        (Math.random() - 0.5) * 4.8 - 0.8 // Z: -3.2 to +1.6 (full screen depth)
      );
    }

    // Mouse Tracking
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Click anywhere: All 3 characters jump for joy & ball bounces!
    const handleClick = () => {
      if (mochiActor.mode !== "SHY_WAVE") {
        mochiActor.mode = "HAPPY_JUMP";
        mochiActor.jumpTimer = 0;
      }
      ballPhysics.vel.x += mouse.x * 0.07;
      ballPhysics.vel.z -= mouse.y * 0.07;
      ballPhysics.vel.y = 0.17;
    };
    window.addEventListener("pointerdown", handleClick);

    // 12. 60 FPS ULTRA-SMOOTH ANIMATION LOOP
    let animationFrameId: number;
    const clock = new THREE.Clock();

    // Celestial Day/Night Transition variable (0.0 = Day, 1.0 = Night)
    const isInitiallyDark =
      themeRef.current === "dark" ||
      (typeof document !== "undefined" &&
        (document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark"));
    let transitionProgress = isInitiallyDark ? 1 : 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const time = clock.getElapsedTime();

      // ----------------------------------------------------
      // CELESTIAL DAY/NIGHT SMOOTH TRANSITION
      // ----------------------------------------------------
      const isNightNow =
        themeRef.current === "dark" ||
        (typeof document !== "undefined" &&
          (document.documentElement.classList.contains("dark") ||
            document.documentElement.getAttribute("data-theme") === "dark"));
      const targetProgress = isNightNow ? 1 : 0;
      transitionProgress +=
        (targetProgress - transitionProgress) * (1 - Math.exp(-3.2 * delta));

      // A. Sun Orbital Arc (Rises high in Day, Sets smoothly in Night)
      const sunX = THREE.MathUtils.lerp(5.8, 8.5, transitionProgress);
      const sunY =
        THREE.MathUtils.lerp(4.8, -6.5, transitionProgress) -
        Math.sin(transitionProgress * Math.PI) * 0.8;
      sunGroup.position.set(sunX, sunY, -3.8);
      const sunScale = Math.max(0.01, 1 - transitionProgress * 0.5);
      sunGroup.scale.setScalar(sunScale);
      sunRaysGroup.rotation.z += delta * 0.35;
      const sunPulse = 1 + Math.sin(time * 2.0) * 0.04;
      sunGlow.scale.setScalar(sunPulse);

      // B. Moon Orbital Arc (Rises high in Night, Sets smoothly in Day)
      const moonX = THREE.MathUtils.lerp(-8.5, -5.5, transitionProgress);
      const moonY =
        THREE.MathUtils.lerp(-6.5, 4.8, transitionProgress) +
        Math.sin(transitionProgress * Math.PI) * 0.8;
      const moonBob = Math.sin(time * 1.5) * 0.1;
      moonGroup.position.set(
        moonX,
        moonY + (transitionProgress > 0.4 ? moonBob * transitionProgress : 0),
        -3.8
      );
      const moonScale = Math.max(0.01, 0.4 + transitionProgress * 0.6);
      moonGroup.scale.setScalar(moonScale);
      moonGroup.rotation.y = Math.sin(time * 0.4) * 0.15;
      const moonPulse = 1 + Math.sin(time * 1.8) * 0.04;
      moonGlow.scale.setScalar(moonPulse);

      // C. Twinkling Night Stars
      starData.forEach(({ mesh, mat, phase }) => {
        mesh.rotation.z += delta * 0.4;
        const twinkle = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(time * 3.0 + phase));
        mat.opacity = Math.max(0, transitionProgress * twinkle * 0.85);
      });

      // D. Lighting Smooth Color & Intensity Transition
      sunLight.color.lerpColors(
        new THREE.Color(0xfff7ed),
        new THREE.Color(0x9bc2e8),
        transitionProgress
      );
      sunLight.intensity = THREE.MathUtils.lerp(2.5, 1.45, transitionProgress);
      sunLight.position.lerpVectors(
        new THREE.Vector3(7, 15, 10),
        new THREE.Vector3(-6, 14, 8),
        transitionProgress
      );

      ambientLight.color.lerpColors(
        new THREE.Color(0xffffff),
        new THREE.Color(0x3e4f72),
        transitionProgress
      );
      ambientLight.intensity = THREE.MathUtils.lerp(1.3, 0.98, transitionProgress);

      rimLight.color.lerpColors(
        new THREE.Color(0xd97757),
        new THREE.Color(0x60a5fa),
        transitionProgress
      );
      rimLight.intensity = THREE.MathUtils.lerp(1.2, 0.85, transitionProgress);

      groundMat.opacity = THREE.MathUtils.lerp(0.17, 0.28, transitionProgress);

      cloudMat.color.lerpColors(
        new THREE.Color(0xffffff),
        new THREE.Color(0x404e6c),
        transitionProgress
      );
      cloudMat.opacity = THREE.MathUtils.lerp(0.9, 0.6, transitionProgress);

      // Gentle swaying grass & flowers in the breeze
      grassList.forEach((clump, idx) => {
        clump.rotation.z = Math.sin(time * 2.4 + idx) * 0.09;
      });
      flowers.forEach((flower, idx) => {
        flower.rotation.z = Math.sin(time * 2.0 + idx * 0.8) * 0.07;
      });

      // Wooden Swing gentle idle sway
      seatSwingGroup.rotation.x = Math.sin(time * 1.8) * 0.14;

      // Pinwheel spinning in the breeze
      pinwheelBladesGroup.rotation.z += delta * 4.5;

      // Clouds drifting slowly
      clouds.forEach((cloud, idx) => {
        cloud.position.x += delta * (0.08 + idx * 0.03);
        if (cloud.position.x > 8) cloud.position.x = -8;
      });

      // ------------------------------------------
      // A. BALL PHYSICS & PLAYGROUND INTERACTION
      // ------------------------------------------
      ballPhysics.pos.x += ballPhysics.vel.x;
      ballPhysics.pos.z += ballPhysics.vel.z;
      ballPhysics.pos.y += ballPhysics.vel.y;

      if (ballPhysics.pos.y > floorY + ballRadius) {
        ballPhysics.vel.y -= 0.009;
      } else {
        ballPhysics.pos.y = floorY + ballRadius;
        if (Math.abs(ballPhysics.vel.y) > 0.02) {
          ballPhysics.vel.y = -ballPhysics.vel.y * 0.65;
        } else {
          ballPhysics.vel.y = 0;
        }
      }

      ballPhysics.vel.x *= 0.985;
      ballPhysics.vel.z *= 0.985;

      ballMesh.rotation.z -= ballPhysics.vel.x * 2.8;
      ballMesh.rotation.x += ballPhysics.vel.z * 2.8;

      if (ballPhysics.pos.x > 5.0) {
        ballPhysics.pos.x = 5.0;
        ballPhysics.vel.x = -ballPhysics.vel.x * 0.7;
      } else if (ballPhysics.pos.x < -5.0) {
        ballPhysics.pos.x = -5.0;
        ballPhysics.vel.x = -ballPhysics.vel.x * 0.7;
      }
      if (ballPhysics.pos.z > 2.0) {
        ballPhysics.pos.z = 2.0;
        ballPhysics.vel.z = -ballPhysics.vel.z * 0.7;
      } else if (ballPhysics.pos.z < -3.8) {
        ballPhysics.pos.z = -3.8;
        ballPhysics.vel.z = -ballPhysics.vel.z * 0.7;
      }

      ballMesh.position.copy(ballPhysics.pos);

      // ------------------------------------------
      // B. MOCHI (Character 1) Smooth Controller
      // ------------------------------------------
      mochiActor.nextWaveTimer -= delta;

      if (mochiActor.nextWaveTimer <= 0 && mochiActor.mode === "PLAYING") {
        mochiActor.mode = "SHY_WAVE";
        mochiActor.waveTimer = 0;
        mochiActor.nextWaveTimer = 11.0 + Math.random() * 5.0;
      }

      if (mochiActor.mode === "SHY_WAVE") {
        mochiActor.waveTimer += delta;

        const toCamAngle = Math.atan2(
          camera.position.x - mochiActor.pos.x,
          camera.position.z - mochiActor.pos.z
        );
        mochiActor.currentAngle = THREE.MathUtils.lerp(
          mochiActor.currentAngle,
          toCamAngle,
          1 - Math.exp(-6 * delta)
        );
        mochi.root.rotation.y = mochiActor.currentAngle;

        mochi.headGroup.rotation.z = Math.sin(time * 3) * 0.14 + 0.08;
        mochi.headGroup.rotation.x = 0.08;

        mochi.leftArm.position.set(-0.46, 0.95, 0.35);
        mochi.leftArm.rotation.set(-0.4, 0.3, 0.3);

        const wave = Math.sin(mochiActor.waveTimer * 8) * 0.45;
        mochi.rightArm.position.set(0.64, 0.95, 0.25);
        mochi.rightArm.rotation.set(0, 0, 0.75 + wave);

        const blushScale = 1 + Math.sin(time * 6) * 0.18;
        mochi.leftBlush.scale.setScalar(blushScale);
        mochi.rightBlush.scale.setScalar(blushScale);

        mochi.root.position.set(
          mochiActor.pos.x,
          floorY + Math.sin(time * 4) * 0.04,
          mochiActor.pos.z
        );

        if (mochiActor.waveTimer > 2.8) {
          mochiActor.mode = "PLAYING";
          mochi.leftArm.rotation.set(0, 0, 0);
          mochi.rightArm.rotation.set(0, 0, 0);
          mochi.leftArm.position.set(-0.62, 0.72, 0.1);
          mochi.rightArm.position.set(0.62, 0.72, 0.1);
          mochi.headGroup.rotation.set(0, 0, 0);
          mochiActor.target = pickRandomPlaygroundLocation();
        }
      } else if (mochiActor.mode === "HAPPY_JUMP") {
        mochiActor.jumpTimer += delta * 3.2;
        const jumpY = Math.sin(mochiActor.jumpTimer * Math.PI) * 1.6;
        mochi.root.position.set(
          mochiActor.pos.x,
          floorY + Math.max(0, jumpY),
          mochiActor.pos.z
        );
        mochi.root.rotation.y += delta * 10;

        if (mochiActor.jumpTimer >= 1) {
          mochiActor.mode = "PLAYING";
          mochiActor.target = pickRandomPlaygroundLocation();
        }
      } else {
        const aimTarget =
          Math.sin(time * 0.4) > -0.2 ? ballPhysics.pos : mochiActor.target;

        const toTarget = new THREE.Vector3().subVectors(
          aimTarget,
          mochiActor.pos
        );
        toTarget.y = 0;
        const distToTarget = toTarget.length();

        if (distToTarget < 0.6) {
          if (aimTarget === ballPhysics.pos) {
            toTarget.normalize();
            ballPhysics.vel.x += toTarget.x * 0.09 + (Math.random() - 0.5) * 0.04;
            ballPhysics.vel.z += toTarget.z * 0.09 + (Math.random() - 0.5) * 0.04;
            ballPhysics.vel.y = 0.14;
          }
          mochiActor.target = pickRandomPlaygroundLocation();
        }

        toTarget.normalize();
        mochiActor.vel.lerp(
          toTarget.multiplyScalar(mochiActor.maxSpeed),
          1 - Math.exp(-6 * delta)
        );
        mochiActor.pos.add(mochiActor.vel);

        if (mochiActor.vel.lengthSq() > 0.0001) {
          const targetAngle = Math.atan2(mochiActor.vel.x, mochiActor.vel.z);
          let diff = targetAngle - mochiActor.currentAngle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          mochiActor.currentAngle += diff * (1 - Math.exp(-7 * delta));
        }
        mochi.root.rotation.y = mochiActor.currentAngle;

        mochiActor.runPhase += delta * 14;
        const bounceY = Math.abs(Math.sin(mochiActor.runPhase)) * 0.32;
        mochi.root.position.set(
          mochiActor.pos.x,
          floorY + bounceY,
          mochiActor.pos.z
        );

        const stretch = Math.sin(mochiActor.runPhase) * 0.08;
        mochi.bodyScale.scale.set(1 - stretch * 0.5, 1 + stretch, 1 - stretch * 0.5);

        const swing = Math.sin(mochiActor.runPhase) * 0.65;
        mochi.leftLeg.position.z = swing * 0.32;
        mochi.rightLeg.position.z = -swing * 0.32;
        mochi.leftArm.position.z = -swing * 0.28;
        mochi.rightArm.position.z = swing * 0.28;

        const earFlop = Math.cos(mochiActor.runPhase) * 0.14;
        mochi.leftEar.rotation.z = 0.25 + earFlop;
        mochi.rightEar.rotation.z = -0.25 - earFlop;
      }

      // Blink animation
      const blink = Math.sin(time * 1.6);
      if (blink > 0.96) {
        mochi.leftEye.scale.y = 0.1;
        mochi.rightEye.scale.y = 0.1;
        mochi.leftPupil.visible = false;
        mochi.rightPupil.visible = false;
      } else {
        mochi.leftEye.scale.y = 1;
        mochi.rightEye.scale.y = 1;
        mochi.leftPupil.visible = true;
        mochi.rightPupil.visible = true;
      }

      // ------------------------------------------
      // C. PIP (Companion Puppy) Smooth Controller
      // ------------------------------------------
      const pipAim =
        mochiActor.mode === "SHY_WAVE"
          ? new THREE.Vector3(
              mochiActor.pos.x + 1.2,
              floorY,
              mochiActor.pos.z + 0.3
            )
          : ballPhysics.pos;

      const pipToAim = new THREE.Vector3().subVectors(pipAim, pipActor.pos);
      pipToAim.y = 0;
      const pipDist = pipToAim.length();

      if (pipDist < 0.5) {
        pipToAim.normalize();
        ballPhysics.vel.x += pipToAim.x * 0.08 + (Math.random() - 0.5) * 0.03;
        ballPhysics.vel.z += pipToAim.z * 0.08 + (Math.random() - 0.5) * 0.03;
        ballPhysics.vel.y = 0.12;

        pipActor.spinPhase += delta * 6;
        pip.root.rotation.y += delta * 6;
      } else {
        pipToAim.normalize();
        pipActor.vel.lerp(
          pipToAim.multiplyScalar(pipActor.maxSpeed),
          1 - Math.exp(-6 * delta)
        );
        pipActor.pos.add(pipActor.vel);

        if (pipActor.vel.lengthSq() > 0.0001) {
          const pAngle = Math.atan2(pipActor.vel.x, pipActor.vel.z);
          let pDiff = pAngle - pipActor.currentAngle;
          while (pDiff < -Math.PI) pDiff += Math.PI * 2;
          while (pDiff > Math.PI) pDiff -= Math.PI * 2;
          pipActor.currentAngle += pDiff * (1 - Math.exp(-7 * delta));
        }
        pip.root.rotation.y = pipActor.currentAngle;

        pipActor.runPhase += delta * 16;
        const pBounce = Math.abs(Math.sin(pipActor.runPhase)) * 0.28;
        pip.root.position.set(
          pipActor.pos.x,
          floorY + pBounce,
          pipActor.pos.z
        );

        const pStretch = Math.sin(pipActor.runPhase) * 0.07;
        pip.bodyScale.scale.set(1 - pStretch * 0.5, 1 + pStretch, 1 - pStretch * 0.5);

        const pSwing = Math.sin(pipActor.runPhase) * 0.55;
        pip.leftLeg.position.z = pSwing * 0.22;
        pip.rightLeg.position.z = -pSwing * 0.22;
        pip.leftArm.position.z = -pSwing * 0.18;
        pip.rightArm.position.z = pSwing * 0.18;
      }

      pip.tail.rotation.z = Math.sin(time * 16) * 0.5;
      pip.tail.rotation.y = Math.cos(time * 16) * 0.35;

      // ------------------------------------------
      // D. CHIRP (Tiny Yellow Chick) Controller
      // ------------------------------------------
      // Chirp follows Pip or ball enthusiastically!
      const chirpTarget = new THREE.Vector3(
        pipActor.pos.x + Math.sin(time * 2) * 0.8,
        floorY,
        pipActor.pos.z + Math.cos(time * 2) * 0.8
      );

      const chirpToTarget = new THREE.Vector3().subVectors(
        chirpTarget,
        chirpActor.pos
      );
      chirpToTarget.y = 0;
      const cDist = chirpToTarget.length();

      if (cDist > 0.4) {
        chirpToTarget.normalize();
        chirpActor.vel.lerp(
          chirpToTarget.multiplyScalar(chirpActor.maxSpeed),
          1 - Math.exp(-7 * delta)
        );
        chirpActor.pos.add(chirpActor.vel);

        const cAngle = Math.atan2(chirpActor.vel.x, chirpActor.vel.z);
        let cDiff = cAngle - chirpActor.currentAngle;
        while (cDiff < -Math.PI) cDiff += Math.PI * 2;
        while (cDiff > Math.PI) cDiff -= Math.PI * 2;
        chirpActor.currentAngle += cDiff * (1 - Math.exp(-8 * delta));
        chirp.root.rotation.y = chirpActor.currentAngle;

        // Fast cute chick hops!
        chirpActor.hopPhase += delta * 20;
        const cBounce = Math.abs(Math.sin(chirpActor.hopPhase)) * 0.24;
        chirp.root.position.set(
          chirpActor.pos.x,
          floorY + cBounce,
          chirpActor.pos.z
        );

        // Wing flutter while hopping
        const flutter = Math.sin(time * 24) * 0.4;
        chirp.leftWing.rotation.z = 0.4 + flutter;
        chirp.rightWing.rotation.z = -0.4 - flutter;
      } else {
        // Idle happy pecking
        chirp.root.position.set(chirpActor.pos.x, floorY, chirpActor.pos.z);
        chirp.bodyScale.rotation.x = Math.abs(Math.sin(time * 5)) * 0.25;
        chirp.leftWing.rotation.z = 0.2;
        chirp.rightWing.rotation.z = -0.2;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 13. Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;

      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    // 14. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("pointerdown", handleClick);

      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }

      renderer.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      ballGeo.dispose();
      stripeGeo.dispose();
      peachMat.dispose();
      mintMat.dispose();
      yellowChickMat.dispose();
      beakMat.dispose();
      creamMat.dispose();
      eyeMat.dispose();
      pupilMat.dispose();
      blushMat.dispose();
      grassMat.dispose();
      flowerWhiteMat.dispose();
      flowerYellowMat.dispose();
      flowerPinkMat.dispose();
      mushroomCapMat.dispose();
      mushroomStemMat.dispose();
      woodMat.dispose();
      woodDarkMat.dispose();
      slideYellowMat.dispose();
      cloudMat.dispose();
      pinwheelBladeMat.dispose();
      ballMat1.dispose();
      ballMat2.dispose();
      sunCoreGeo.dispose();
      sunCoreMat.dispose();
      sunGlowGeo.dispose();
      sunGlowMat.dispose();
      rayGeo.dispose();
      rayMat.dispose();
      moonGeo.dispose();
      moonMat.dispose();
      moonGlowGeo.dispose();
      moonGlowMat.dispose();
      craterMat.dispose();
      starGeo.dispose();
      starMatList.forEach((m) => m.dispose());
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
