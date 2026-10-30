import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface RiskGlobeProps {
  riskScore: number; // 0 to 100
  decision: string;
  activeLayer?: number;
}

export const RiskGlobe3D: React.FC<RiskGlobeProps> = ({ riskScore, decision }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Dimensions
    const width = currentMount.clientWidth || 340;
    const height = 300;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    currentMount.appendChild(renderer.domElement);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 2. Color Scheme matching website theme
    // Default: Executive Sky Blue & Cyan
    let themePrimary = new THREE.Color(0x0284c7);   // Sky Blue
    let themeGlow = new THREE.Color(0x38bdf8);      // Electric Sky
    let accentColor = new THREE.Color(0x10b981);    // Emerald Approval

    if (decision === 'REJECTED' || riskScore > 40) {
      themePrimary = new THREE.Color(0xe11d48);    // Rose / Crimson
      themeGlow = new THREE.Color(0xf43f5e);
      accentColor = new THREE.Color(0xfb7185);
    } else if (decision === 'CONDITIONAL_APPROVAL' || riskScore > 20) {
      themePrimary = new THREE.Color(0xd97706);    // Caramel Amber
      themeGlow = new THREE.Color(0xfbbf24);
      accentColor = new THREE.Color(0xf59e0b);
    }

    // 3. Lighting Setup for Realistic Glass Refraction & Highlights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Key directional light creating bright specular rim highlight on glass
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.4);
    dirLight.position.set(4, 5, 4);
    scene.add(dirLight);

    // Secondary colored rim light for website theme matching
    const rimLight = new THREE.DirectionalLight(themeGlow, 1.8);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    // Point lights for internal refraction caustics
    const internalPointLight1 = new THREE.PointLight(themeGlow, 2.5, 8);
    internalPointLight1.position.set(0, 0, 0);
    rootGroup.add(internalPointLight1);

    const specularLight = new THREE.PointLight(0xffffff, 1.5, 6);
    specularLight.position.set(2, 2.5, 3);
    scene.add(specularLight);

    // 4. Outer Realistic Glass Orb (MeshPhysicalMaterial)
    const glassGeometry = new THREE.SphereGeometry(1.65, 64, 64);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,             // Ultra-clear glass see-through body
      opacity: 1.0,
      transparent: true,
      roughness: 0.08,                // Glossy polished glass
      metalness: 0.05,
      ior: 1.52,                      // Standard optical glass refractive index
      thickness: 1.4,                 // Volumetric refraction depth
      specularIntensity: 1.0,
      specularColor: 0xffffff,
      clearcoat: 1.0,                 // Pristine glass outer lacquer
      clearcoatRoughness: 0.06,
      attenuationColor: themePrimary, // Tinted glass absorption
      attenuationDistance: 1.8,
    });
    const glassOrb = new THREE.Mesh(glassGeometry, glassMaterial);
    rootGroup.add(glassOrb);

    // 5. Inner Holographic Core Sphere (Nested inside the glass orb)
    const innerCoreGeo = new THREE.IcosahedronGeometry(1.05, 2);
    const innerCoreMat = new THREE.MeshStandardMaterial({
      color: themePrimary,
      emissive: themePrimary,
      emissiveIntensity: 0.45,
      roughness: 0.25,
      metalness: 0.4,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    rootGroup.add(innerCore);

    // 6. Solid Glowing Polyhedral Nucleus
    const nucleusGeo = new THREE.DodecahedronGeometry(0.55, 0);
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: themeGlow,
      emissiveIntensity: 0.85,
      roughness: 0.1,
      metalness: 0.8,
    });
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    rootGroup.add(nucleus);

    // 7. Luminous Orbital Latitude & Gyroscopic Rings
    const ringGroup = new THREE.Group();
    const createRing = (radius: number, tubeRadius: number, rotX: number, rotY: number) => {
      const torusGeo = new THREE.TorusGeometry(radius, tubeRadius, 16, 80);
      const torusMat = new THREE.MeshStandardMaterial({
        color: themeGlow,
        emissive: themeGlow,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.7,
        transparent: true,
        opacity: 0.65,
      });
      const ring = new THREE.Mesh(torusGeo, torusMat);
      ring.rotation.x = rotX;
      ring.rotation.y = rotY;
      return ring;
    };

    const ring1 = createRing(1.95, 0.016, Math.PI / 3, 0);
    const ring2 = createRing(2.15, 0.012, -Math.PI / 4, Math.PI / 6);
    const ring3 = createRing(2.35, 0.009, Math.PI / 2, 0);
    ringGroup.add(ring1);
    ringGroup.add(ring2);
    ringGroup.add(ring3);
    rootGroup.add(ringGroup);

    // 8. 5 Orbiting Autonomous Multi-Agent Telemetry Nodes
    const agentNodesGroup = new THREE.Group();
    const nodeGeometry = new THREE.SphereGeometry(0.12, 24, 24);

    const agentColors = [
      0x0284c7, // Layer 1: KYC (Sky Blue)
      0x38bdf8, // Layer 2: ML Risk (Cyan)
      0x78350f, // Layer 3: RAG (Mocha / Amber)
      0xe11d48, // Layer 4: Stress (Rose)
      0x10b981, // Layer 5: Committee (Emerald)
    ];

    const radius = 2.05;
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const nodeMat = new THREE.MeshStandardMaterial({
        color: agentColors[i],
        emissive: agentColors[i],
        emissiveIntensity: 0.9,
        roughness: 0.15,
        metalness: 0.6,
      });
      const node = new THREE.Mesh(nodeGeometry, nodeMat);
      node.position.x = Math.cos(angle) * radius;
      node.position.y = Math.sin(angle * 1.5) * 0.45;
      node.position.z = Math.sin(angle) * radius;
      agentNodesGroup.add(node);

      // Add a subtle halo ring around each agent node
      const haloGeo = new THREE.RingGeometry(0.16, 0.22, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: agentColors[i],
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.lookAt(0, 0, 0);
      node.add(halo);
    }
    rootGroup.add(agentNodesGroup);

    // 9. Floating Financial Telemetry Particle Cloud
    const particleCount = 120;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2.4 + Math.random() * 0.8;

      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);

      const colorPick = Math.random() > 0.4 ? themeGlow : accentColor;
      pColors[i] = colorPick.r;
      pColors[i + 1] = colorPick.g;
      pColors[i + 2] = colorPick.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    rootGroup.add(particles);

    // 10. Interactive Mouse Parallax
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.5;
      targetRotationX = -y * 0.4;
    };
    currentMount.addEventListener('mousemove', handleMouseMove);

    // 11. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      rootGroup.rotation.y += (targetRotationY - rootGroup.rotation.y) * 0.04;
      rootGroup.rotation.x += (targetRotationX - rootGroup.rotation.x) * 0.04;

      // Internal orbital rotations
      glassOrb.rotation.y += 0.002;
      innerCore.rotation.y -= 0.006;
      innerCore.rotation.x += 0.003;

      nucleus.rotation.y += 0.01;
      nucleus.rotation.z += 0.008;

      ringGroup.rotation.y += 0.004;
      ringGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.12;

      agentNodesGroup.rotation.y += 0.008;
      particles.rotation.y -= 0.0015;

      // Subtle breathing pulse for internal light
      internalPointLight1.intensity = 2.2 + Math.sin(elapsedTime * 2) * 0.6;

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      currentMount.removeEventListener('mousemove', handleMouseMove);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      glassGeometry.dispose();
      glassMaterial.dispose();
      innerCoreGeo.dispose();
      innerCoreMat.dispose();
      nucleusGeo.dispose();
      nucleusMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, [riskScore, decision]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '300px' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          pointerEvents: 'none',
          fontSize: '0.74rem',
          color: '#38bdf8',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 700,
          background: 'rgba(15, 23, 42, 0.7)',
          padding: '4px 12px',
          borderRadius: '999px',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }}></span>
        Realistic Glass Risk Orb • 5 Telemetry Nodes
      </div>
    </div>
  );
};
