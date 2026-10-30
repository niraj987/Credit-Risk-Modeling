import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause, RotateCcw } from 'lucide-react';

export const HeroGeometric3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isPlayingRef = useRef<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 480;
    const height = container.clientHeight || 360;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Group to hold all 3D geometric elements
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 2. Multi-point Studio Lighting for Realistic Glass Caustics & Specular Shine
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Bright Key Light for Specular Glass Glint
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(5, 6, 5);
    scene.add(keyLight);

    // Website Sky Blue Rim Light
    const skyRimLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    skyRimLight.position.set(-6, -3, -4);
    scene.add(skyRimLight);

    // Internal Glow PointLight (Sky Blue)
    const internalGlowLight = new THREE.PointLight(0x0284c7, 3.2, 9);
    internalGlowLight.position.set(0, 0, 0);
    mainGroup.add(internalGlowLight);

    // 3. Realistic Glass Outer Shell (MeshPhysicalMaterial)
    const glassSphereGeo = new THREE.SphereGeometry(2.35, 64, 64);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.93,               // Realistic optical glass transparency
      opacity: 1.0,
      transparent: true,
      roughness: 0.07,                  // Crystal smooth polish
      metalness: 0.04,
      ior: 1.52,                        // Glass refraction index
      thickness: 1.6,                   // Volumetric depth
      specularIntensity: 1.0,
      specularColor: 0xffffff,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      attenuationColor: new THREE.Color(0x0284c7), // Tinted sky blue absorption
      attenuationDistance: 2.2,
    });
    const glassSphere = new THREE.Mesh(glassSphereGeo, glassMaterial);
    mainGroup.add(glassSphere);

    // 4. Central Mathematical Geodesic Manifold (Nested Inside Glass Orb)
    const icosaGeometry = new THREE.IcosahedronGeometry(1.7, 1);
    
    // Sleek electric sky wireframe lattice
    const wireframeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
      roughness: 0.2,
      metalness: 0.8,
    });
    const wireframeMesh = new THREE.Mesh(icosaGeometry, wireframeMat);
    mainGroup.add(wireframeMesh);

    // Inner Faceted Core with Dynamic Emissive Shading
    const innerGeo = new THREE.IcosahedronGeometry(1.2, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.45,
      flatShading: true,
      roughness: 0.3,
      metalness: 0.6,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerMesh);

    // 5. Vertex Nodes in Institutional Financial Tiers (Green, Amber, Red, Sky Blue)
    const nodeColors = [
      0x10b981, // Prime / Approval Green
      0x0284c7, // Executive Sky Blue
      0xf59e0b, // Warm Amber / Near-Prime
      0xe11d48, // Alert / Subprime Shock
    ];

    const posAttr = icosaGeometry.attributes.position;
    const vertexCount = posAttr.count;
    const nodeGroup = new THREE.Group();

    for (let i = 0; i < vertexCount; i += 3) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);

      const color = nodeColors[(i / 3) % nodeColors.length];
      const sphereGeo = new THREE.SphereGeometry(0.1, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.8,
        roughness: 0.15,
        metalness: 0.7,
      });

      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.position.set(x, y, z);
      nodeGroup.add(sphereMesh);
    }
    mainGroup.add(nodeGroup);

    // 6. Floating Financial Particle Field with Brand Gradient
    const particleCount = 160;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cPalette = [
      new THREE.Color(0x38bdf8), // Electric Sky
      new THREE.Color(0x0284c7), // Sky Blue
      new THREE.Color(0x10b981), // Emerald
      new THREE.Color(0xfbbf24), // Caramel
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.7 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      const chosenColor = cPalette[i % cPalette.length];
      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // 7. Luminous Gyroscopic Rings (Risk Boundaries)
    const ringGeo1 = new THREE.TorusGeometry(2.95, 0.016, 16, 100);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.7,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.55,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    mainGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(3.35, 0.012, 16, 100);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.45,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    mainGroup.add(ring2);

    // 8. Mouse Interaction with Smooth Easing
    let targetX = 0;
    let targetY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      targetX = (x / rect.width) * 1.6;
      targetY = (y / rect.height) * 1.6;
    };

    container.addEventListener('mousemove', onMouseMove);

    // 9. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isPlayingRef.current) {
        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();

        // Smooth continuous rotation
        mainGroup.rotation.y += delta * 0.35;
        mainGroup.rotation.x += delta * 0.15;
        ring1.rotation.z += delta * 0.2;
        ring2.rotation.z -= delta * 0.15;
        particles.rotation.y -= delta * 0.12;

        // Counter-rotating inner components for visual depth
        innerMesh.rotation.y -= delta * 0.4;
        wireframeMesh.rotation.y += delta * 0.2;

        // Subtle breathing light
        internalGlowLight.intensity = 2.8 + Math.sin(elapsedTime * 2.5) * 0.7;

        // Smooth mouse lerp
        mouseX += (targetX - mouseX) * 0.06;
        mouseY += (targetY - mouseY) * 0.06;
        mainGroup.position.x = mouseX * 0.4;
        mainGroup.position.y = -mouseY * 0.4;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      glassSphereGeo.dispose();
      glassMaterial.dispose();
      icosaGeometry.dispose();
      wireframeMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
    };
  }, []);

  const togglePlay = () => {
    isPlayingRef.current = !isPlayingRef.current;
    setIsPlaying(isPlayingRef.current);
  };

  return (
    <div className="hero-3d-wrapper">
      <div className="hero-3d-canvas-container" ref={mountRef} />
      <div className="hero-3d-overlay-badge">
        <span className="dot-live-green"></span>
        <span>Realistic Glass Risk Orb • Live Telemetry</span>
        <button
          onClick={togglePlay}
          className="hero-3d-play-btn"
          title={isPlaying ? 'Pause 3D Rotation' : 'Resume 3D Rotation'}
        >
          {isPlaying ? <Pause size={12} /> : <Play size={12} />}
        </button>
      </div>
      <div className="hero-3d-legend">
        <span className="legend-tag tag-green">● Prime Tier (EL &lt; 2%)</span>
        <span className="legend-tag tag-blue">● Sky Blue (Refraction)</span>
        <span className="legend-tag tag-yellow">● Near-Prime</span>
        <span className="legend-tag tag-red">● Subprime</span>
      </div>
    </div>
  );
};
