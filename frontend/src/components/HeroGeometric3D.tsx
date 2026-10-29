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

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent canvas
    container.appendChild(renderer.domElement);

    // Group to hold all 3D geometric elements
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Mathematical Geometric Polyhedron (Icosahedron / Risk Manifold)
    const geometry = new THREE.IcosahedronGeometry(2.0, 1);
    
    // Wireframe lattice in clean graphite / slate
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireframeMesh = new THREE.Mesh(geometry, wireframeMat);
    mainGroup.add(wireframeMesh);

    // Inner translucent core with white/emerald glow
    const innerGeo = new THREE.IcosahedronGeometry(1.6, 0);
    const innerMat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0x10b981,
      emissiveIntensity: 0.15,
      transparent: true,
      opacity: 0.25,
      flatShading: true,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerMesh);

    // 2. Vertex Nodes in IMC Colors: Red, Yellow, Green, White
    const nodeColors = [
      0x10b981, // Calming Green (Prime / Approved)
      0xf59e0b, // Warm Yellow (Near-Prime / Warning)
      0xe11d48, // Crimson Red (Subprime / Anomaly)
      0xffffff, // Pure White (Baseline)
    ];

    const posAttr = geometry.attributes.position;
    const vertexCount = posAttr.count;
    const nodeGroup = new THREE.Group();

    for (let i = 0; i < vertexCount; i += 3) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);

      const color = nodeColors[(i / 3) % nodeColors.length];
      const sphereGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.6,
        roughness: 0.2,
      });

      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.position.set(x, y, z);
      nodeGroup.add(sphereMesh);
    }
    mainGroup.add(nodeGroup);

    // 3. Floating Financial Particle Field (Red, Yellow, Green, White)
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cPalette = [
      new THREE.Color(0x10b981), // Green
      new THREE.Color(0xf59e0b), // Yellow
      new THREE.Color(0xe11d48), // Red
      new THREE.Color(0xffffff), // White
      new THREE.Color(0x38bdf8), // Soft Cyan
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.4 + Math.random() * 2.2;
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
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // 4. Orbiting Rings (Risk Boundaries)
    const ringGeo1 = new THREE.TorusGeometry(3.1, 0.015, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.35 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    mainGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(3.6, 0.012, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.3 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    mainGroup.add(ring2);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x10b981, 0.8);
    dirLight2.position.set(-5, -5, -2);
    scene.add(dirLight2);

    // Mouse Interaction
    let targetX = 0;
    let targetY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      targetX = (x / rect.width) * 1.5;
      targetY = (y / rect.height) * 1.5;
    };

    container.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isPlayingRef.current) {
        const delta = clock.getDelta();

        // Smooth rotation
        mainGroup.rotation.y += delta * 0.45;
        mainGroup.rotation.x += delta * 0.2;
        ring1.rotation.z += delta * 0.15;
        ring2.rotation.z -= delta * 0.12;
        particles.rotation.y -= delta * 0.18;

        // Smooth mouse lerp
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;
        mainGroup.position.x = mouseX * 0.5;
        mainGroup.position.y = -mouseY * 0.5;
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
        <span>Three.js Quantitative Risk Manifold</span>
        <button
          onClick={togglePlay}
          className="hero-3d-play-btn"
          title={isPlaying ? 'Pause 3D Rotation' : 'Resume 3D Rotation'}
        >
          {isPlaying ? <Pause size={12} /> : <Play size={12} />}
        </button>
      </div>
      <div className="hero-3d-legend">
        <span className="legend-tag tag-green">● Prime (EL &lt; 2%)</span>
        <span className="legend-tag tag-yellow">● Near-Prime</span>
        <span className="legend-tag tag-red">● Subprime Shock</span>
      </div>
    </div>
  );
};
