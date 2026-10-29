import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Layers, Activity } from 'lucide-react';

interface RiskSurface3DProps {
  creditScore: number;
  dtiRatio: number;
  pdPercent: number;
}

export const RiskSurface3D: React.FC<RiskSurface3DProps> = ({
  creditScore,
  dtiRatio,
  pdPercent,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4, 3.5, 4.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const surfaceGroup = new THREE.Group();
    scene.add(surfaceGroup);

    // 1. Parametric 3D Risk Surface Grid (24x24 segments)
    const size = 3;
    const segments = 24;
    const planeGeo = new THREE.PlaneGeometry(size, size, segments, segments);
    planeGeo.rotateX(-Math.PI / 2);

    const pos = planeGeo.attributes.position;
    const colors: number[] = [];

    // Calculate height Z based on synthetic non-linear risk model:
    // PD ~ sigmoid(DTI * 5 - CreditScore_normalized * 4)
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i); // represents DTI (normalized -1.5 to +1.5)
      const z = pos.getZ(i); // represents Credit Score (normalized -1.5 to +1.5)

      // Height function: high when DTI is high and Score is low
      const normDTI = (x + 1.5) / 3.0; // 0 to 1
      const normScore = (z + 1.5) / 3.0; // 0 to 1

      // Height represents default risk
      const heightVal = Math.sin(normDTI * Math.PI * 0.8) * 0.9 + Math.pow(1.0 - normScore, 1.8) * 0.9;
      pos.setY(i, heightVal - 0.4);

      // Interpolate Color: Green (Low Risk) -> Yellow (Medium Risk) -> Red (High Risk)
      const riskVal = Math.min(1, Math.max(0, heightVal / 1.5));
      if (riskVal < 0.45) {
        // Green to Yellow
        const t = riskVal / 0.45;
        colors.push(
          0.06 + t * (0.96 - 0.06), // R
          0.72 + t * (0.62 - 0.72), // G
          0.50 - t * 0.45           // B
        );
      } else {
        // Yellow to Red
        const t = (riskVal - 0.45) / 0.55;
        colors.push(
          0.96 - t * 0.08,          // R
          0.62 - t * 0.50,          // G
          0.05 + t * 0.23           // B
        );
      }
    }

    planeGeo.computeVertexNormals();
    planeGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Surface Material
    const surfaceMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.35,
      metalness: 0.1,
      wireframe: false,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.88,
    });
    const surfaceMesh = new THREE.Mesh(planeGeo, surfaceMat);
    surfaceGroup.add(surfaceMesh);

    // Subtle Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const wireMesh = new THREE.Mesh(planeGeo, wireMat);
    surfaceGroup.add(wireMesh);

    // 2. Applicant Position Marker (Sphere)
    // Map actual applicant creditScore (300-850) and dti (0.1 to 0.7) to coordinates
    const appX = ((dtiRatio - 0.1) / 0.6) * 3 - 1.5;
    const appZ = ((creditScore - 300) / 550) * 3 - 1.5;
    const appY = (pdPercent / 40) * 1.2 - 0.2;

    const markerGeo = new THREE.SphereGeometry(0.12, 20, 20);
    const markerColor = pdPercent < 8 ? 0x10b981 : pdPercent < 18 ? 0xf59e0b : 0xe11d48;
    const markerMat = new THREE.MeshStandardMaterial({
      color: markerColor,
      emissive: markerColor,
      emissiveIntensity: 0.8,
    });
    const marker = new THREE.Mesh(markerGeo, markerMat);
    marker.position.set(appX, Math.max(0.1, appY), appZ);
    surfaceGroup.add(marker);

    // Marker Pulse Ring
    const pulseRingGeo = new THREE.RingGeometry(0.14, 0.22, 32);
    pulseRingGeo.rotateX(-Math.PI / 2);
    const pulseRingMat = new THREE.MeshBasicMaterial({
      color: markerColor,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });
    const pulseRing = new THREE.Mesh(pulseRingGeo, pulseRingMat);
    pulseRing.position.copy(marker.position);
    surfaceGroup.add(pulseRing);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(6, 8, 5);
    scene.add(dirLight);

    // Interactive Drag Rotation
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      surfaceGroup.rotation.y += deltaX * 0.01;
      surfaceGroup.rotation.x += deltaY * 0.01;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animationFrameId: number;
    let scalePulse = 1;
    let pulseDirection = 1;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isDragging) {
        surfaceGroup.rotation.y += 0.005; // Slow ambient orbit
      }

      // Marker pulse animation
      scalePulse += 0.015 * pulseDirection;
      if (scalePulse > 1.3) pulseDirection = -1;
      if (scalePulse < 0.9) pulseDirection = 1;
      pulseRing.scale.set(scalePulse, 1, scalePulse);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [creditScore, dtiRatio, pdPercent]);

  return (
    <div className="risk-surface-card">
      <div className="surface-header">
        <div className="surface-badge">
          <Layers size={13} className="text-emerald-500" />
          <span>3D Mathematical Risk Surface Topology</span>
        </div>
        <span className="surface-hint">Drag to rotate 3D mesh</span>
      </div>
      <div className="surface-canvas-wrap" ref={mountRef} />
      <div className="surface-footer-row">
        <span className="coord-pill">
          Score: <b>{creditScore}</b>
        </span>
        <span className="coord-pill">
          DTI: <b>{(dtiRatio * 100).toFixed(0)}%</b>
        </span>
        <span className={`coord-pill ${pdPercent < 10 ? 'text-green' : pdPercent < 20 ? 'text-yellow' : 'text-red'}`}>
          PD: <b>{pdPercent}%</b>
        </span>
      </div>
    </div>
  );
};
