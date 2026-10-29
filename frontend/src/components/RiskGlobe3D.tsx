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

    // Scene, Camera, Renderer
    const width = currentMount.clientWidth || 340;
    const height = 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Color theme based on risk decision
    let primaryColor = 0x10b981; // Green for approved
    if (decision === 'REJECTED' || riskScore > 40) {
      primaryColor = 0xef4444; // Red for rejected
    } else if (decision === 'CONDITIONAL_APPROVAL' || riskScore > 20) {
      primaryColor = 0xf59e0b; // Gold for conditional
    }

    // 1. Central Core Wireframe Sphere
    const sphereGeometry = new THREE.IcosahedronGeometry(1.6, 2);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: primaryColor,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const globe = new THREE.Mesh(sphereGeometry, wireframeMaterial);
    scene.add(globe);

    // 2. Inner Glowing Core
    const coreGeometry = new THREE.SphereGeometry(1.1, 16, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: primaryColor,
      transparent: true,
      opacity: 0.15,
    });
    const innerCore = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(innerCore);

    // 3. Orbiting Multi-Agent Layer Nodes (5 Agents)
    const agentNodesGroup = new THREE.Group();
    const nodeGeometry = new THREE.SphereGeometry(0.12, 8, 8);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const agentLabels = ['KYC', 'ML', 'RAG', 'FAIR', 'COMM'];
    const radius = 2.1;

    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.x = Math.cos(angle) * radius;
      node.position.y = Math.sin(angle) * radius * 0.45;
      node.position.z = Math.sin(angle) * radius * 0.85;
      agentNodesGroup.add(node);
    }
    scene.add(agentNodesGroup);

    // 4. Outer Particle Field
    const particleCount = 80;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2.4 + Math.random() * 0.6;
      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: primaryColor,
      size: 0.045,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      globe.rotation.y += 0.005;
      globe.rotation.x += 0.002;

      innerCore.rotation.y -= 0.003;
      agentNodesGroup.rotation.y += 0.008;
      particles.rotation.y -= 0.002;

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
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sphereGeometry.dispose();
      wireframeMaterial.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, [riskScore, decision]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '300px' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          pointerEvents: 'none',
          fontSize: '0.78rem',
          color: '#94a3b8',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}
      >
        3D Multi-Agent Risk Network • 5 Telemetry Nodes
      </div>
    </div>
  );
};
