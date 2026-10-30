import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Layers, RotateCcw, Info, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

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
  const [viewWireframe, setViewWireframe] = useState(false);
  const surfaceGroupRef = useRef<THREE.Group | null>(null);

  // Helper to determine risk zone in plain English
  const getRiskZone = (pd: number) => {
    if (pd < 10) {
      return {
        label: 'Safe Green Valley',
        color: '#10b981',
        desc: 'High credit score + low debt burden. Best interest rates & instant approval.',
        icon: <CheckCircle2 size={16} className="text-emerald" />,
      };
    } else if (pd < 22) {
      return {
        label: 'Caution Amber Slope',
        color: '#f59e0b',
        desc: 'Moderate risk. Qualified for conditional approval with standard rates.',
        icon: <AlertTriangle size={16} className="text-amber" />,
      };
    } else {
      return {
        label: 'High-Risk Crimson Peak',
        color: '#e11d48',
        desc: 'Elevated debt or subprime score. Remedial actions suggested in Counterfactual tab.',
        icon: <ShieldAlert size={16} className="text-rose" />,
      };
    }
  };

  const currentZone = getRiskZone(pdPercent);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 420;
    const height = 300;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(4.5, 3.8, 5.0);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const surfaceGroup = new THREE.Group();
    surfaceGroupRef.current = surfaceGroup;
    scene.add(surfaceGroup);

    // 2. Base Grid Reference Floor
    const gridHelper = new THREE.GridHelper(3.4, 12, 0x38bdf8, 0x1e293b);
    gridHelper.position.y = -0.55;
    surfaceGroup.add(gridHelper);

    // 3. Parametric 3D Risk Surface Grid (32x32 high-resolution mesh)
    const size = 3.2;
    const segments = 32;
    const planeGeo = new THREE.PlaneGeometry(size, size, segments, segments);
    planeGeo.rotateX(-Math.PI / 2);

    const pos = planeGeo.attributes.position;
    const colors: number[] = [];

    // Calculate height Z based on financial risk manifold:
    // Low score & high DTI = steep crimson mountain
    // High score & low DTI = deep green valley
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i); // represents DTI (normalized -1.6 to +1.6)
      const z = pos.getZ(i); // represents Credit Score (normalized -1.6 to +1.6)

      const normDTI = (x + 1.6) / 3.2;    // 0 = low DTI, 1 = high DTI
      const normScore = (z + 1.6) / 3.2;  // 0 = low FICO, 1 = high FICO

      // Height represents default probability (mountain peak = high risk)
      const debtImpact = Math.pow(normDTI, 1.4) * 1.1;
      const scoreProtection = Math.pow(normScore, 1.8) * 1.1;
      const heightVal = Math.max(0, debtImpact + (1.0 - normScore) * 0.9 - scoreProtection * 0.4);
      
      pos.setY(i, heightVal - 0.48);

      // Color mapping:
      // Emerald Green (<0.35) -> Amber Yellow (0.35 to 0.7) -> Crimson Red (>0.7)
      const riskVal = Math.min(1, Math.max(0, heightVal / 1.4));
      if (riskVal < 0.35) {
        // Deep Green to Luminous Emerald
        const t = riskVal / 0.35;
        colors.push(
          0.06 + t * 0.20,
          0.75 + t * 0.15,
          0.45 - t * 0.10
        );
      } else if (riskVal < 0.65) {
        // Emerald to Warm Amber/Gold
        const t = (riskVal - 0.35) / 0.30;
        colors.push(
          0.26 + t * 0.70,
          0.90 - t * 0.25,
          0.35 - t * 0.30
        );
      } else {
        // Amber to Ruby Crimson Peak
        const t = (riskVal - 0.65) / 0.35;
        colors.push(
          0.96 - t * 0.05,
          0.65 - t * 0.50,
          0.05 + t * 0.22
        );
      }
    }

    planeGeo.computeVertexNormals();
    planeGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Surface Material: Semi-translucent with subtle metallic sheen
    const surfaceMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.28,
      metalness: 0.18,
      wireframe: viewWireframe,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.92,
    });
    const surfaceMesh = new THREE.Mesh(planeGeo, surfaceMat);
    surfaceGroup.add(surfaceMesh);

    // Subtle fine wireframe overlay for contour visibility
    if (!viewWireframe) {
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.14,
      });
      const wireMesh = new THREE.Mesh(planeGeo, wireMat);
      surfaceGroup.add(wireMesh);
    }

    // 4. Labeled 3D Axis Beams
    const createAxisLine = (start: THREE.Vector3, end: THREE.Vector3, color: number) => {
      const geom = new THREE.BufferGeometry().setFromPoints([start, end]);
      const mat = new THREE.LineBasicMaterial({ color, linewidth: 2, transparent: true, opacity: 0.7 });
      return new THREE.Line(geom, mat);
    };

    // DTI Axis (X)
    surfaceGroup.add(createAxisLine(new THREE.Vector3(-1.6, -0.55, 1.6), new THREE.Vector3(1.6, -0.55, 1.6), 0x38bdf8));
    // Score Axis (Z)
    surfaceGroup.add(createAxisLine(new THREE.Vector3(-1.6, -0.55, -1.6), new THREE.Vector3(-1.6, -0.55, 1.6), 0x10b981));
    // Risk Height Axis (Y)
    surfaceGroup.add(createAxisLine(new THREE.Vector3(-1.6, -0.55, 1.6), new THREE.Vector3(-1.6, 1.1, 1.6), 0xe11d48));

    // 5. Applicant Position Beacon Pin
    // Map actual applicant creditScore (300-850) and dti (0.1 to 0.7) to coordinates
    const clampedDTI = Math.max(0.1, Math.min(0.7, dtiRatio));
    const clampedScore = Math.max(300, Math.min(850, creditScore));

    const appX = ((clampedDTI - 0.1) / 0.6) * 3.2 - 1.6;
    const appZ = ((clampedScore - 300) / 550) * 3.2 - 1.6;
    
    // Calculate precise height at this point
    const normAppDTI = (appX + 1.6) / 3.2;
    const normAppScore = (appZ + 1.6) / 3.2;
    const appHeightVal = Math.max(0, Math.pow(normAppDTI, 1.4) * 1.1 + (1.0 - normAppScore) * 0.9 - Math.pow(normAppScore, 1.8) * 0.44);
    const appY = appHeightVal - 0.42;

    const beaconGroup = new THREE.Group();
    beaconGroup.position.set(appX, appY, appZ);

    // Glowing Sphere Pin
    const markerColor = pdPercent < 10 ? 0x10b981 : pdPercent < 22 ? 0xf59e0b : 0xe11d48;
    const markerGeo = new THREE.SphereGeometry(0.11, 24, 24);
    const markerMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: markerColor,
      emissiveIntensity: 1.2,
      roughness: 0.1,
      metalness: 0.9,
    });
    const marker = new THREE.Mesh(markerGeo, markerMat);
    beaconGroup.add(marker);

    // Vertical Tether Beam down to floor
    const tetherGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -0.55 - appY, 0),
    ]);
    const tetherMat = new THREE.LineDashedMaterial({
      color: markerColor,
      dashSize: 0.08,
      gapSize: 0.05,
      transparent: true,
      opacity: 0.8,
    });
    const tether = new THREE.Line(tetherGeom, tetherMat);
    tether.computeLineDistances();
    beaconGroup.add(tether);

    // Pulsing Target Ring
    const pulseRingGeo = new THREE.RingGeometry(0.14, 0.22, 32);
    pulseRingGeo.rotateX(-Math.PI / 2);
    const pulseRingMat = new THREE.MeshBasicMaterial({
      color: markerColor,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
    });
    const pulseRing = new THREE.Mesh(pulseRingGeo, pulseRingMat);
    beaconGroup.add(pulseRing);

    surfaceGroup.add(beaconGroup);

    // 6. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(6, 9, 6);
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(-6, -2, -4);
    scene.add(rimLight);

    // 7. Interactive Mouse / Touch Drag Rotation
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
      surfaceGroup.rotation.x = Math.max(-0.5, Math.min(0.6, surfaceGroup.rotation.x + deltaY * 0.01));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 8. Animation Loop
    let animationFrameId: number;
    let scalePulse = 1;
    let pulseDirection = 1;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isDragging) {
        surfaceGroup.rotation.y += 0.0035; // Gentle ambient rotation
      }

      // Marker pulse animation
      scalePulse += 0.018 * pulseDirection;
      if (scalePulse > 1.45) pulseDirection = -1;
      if (scalePulse < 0.85) pulseDirection = 1;
      pulseRing.scale.set(scalePulse, 1, scalePulse);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
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
      planeGeo.dispose();
      surfaceMat.dispose();
      gridHelper.dispose();
    };
  }, [creditScore, dtiRatio, pdPercent, viewWireframe]);

  const handleResetCamera = () => {
    if (surfaceGroupRef.current) {
      surfaceGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  return (
    <div className="risk-surface-card-enhanced">
      {/* Top Header Bar */}
      <div className="surface-header-enhanced">
        <div className="surface-title-wrap">
          <div className="surface-badge-pill">
            <Layers size={14} className="text-sky-light" />
            <span>3D Risk Landscape Model</span>
          </div>
          <h4>Mathematical Default Risk Surface</h4>
        </div>

        <div className="surface-actions-wrap">
          <button
            onClick={() => setViewWireframe(!viewWireframe)}
            className="surface-ctrl-btn"
            title="Toggle Wireframe Grid"
          >
            {viewWireframe ? 'Solid View' : 'Wireframe'}
          </button>
          <button
            onClick={handleResetCamera}
            className="surface-ctrl-btn"
            title="Reset 3D Rotation"
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>

      {/* Plain-English Explainer Strip for Common Users */}
      <div className="plain-english-explainer">
        <div className="explainer-item">
          <span className="dot-valley"></span>
          <div>
            <b>Green Valley</b>
            <span>Safe zone: high score + low debt</span>
          </div>
        </div>
        <div className="explainer-item">
          <span className="dot-slope"></span>
          <div>
            <b>Yellow Slope</b>
            <span>Caution: average credit or rising debt</span>
          </div>
        </div>
        <div className="explainer-item">
          <span className="dot-peak"></span>
          <div>
            <b>Red Peak</b>
            <span>High danger: heavy debt + low score</span>
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div className="surface-canvas-container" ref={mountRef} />

      {/* Live Applicant Location Status Banner */}
      <div className="applicant-position-banner">
        <div className="pos-left">
          {currentZone.icon}
          <div>
            <span className="pos-label">Your Current Pin Position:</span>
            <span className="pos-zone" style={{ color: currentZone.color }}>
              {currentZone.label} ({pdPercent}% Default Risk)
            </span>
          </div>
        </div>
        <div className="pos-coords">
          <span className="coord-chip">FICO: <b>{creditScore}</b></span>
          <span className="coord-chip">DTI: <b>{(dtiRatio * 100).toFixed(0)}%</b></span>
        </div>
      </div>

      {/* Interactive Micro-Hint */}
      <div className="surface-help-hint">
        <Info size={13} className="text-muted" />
        <span>Click & drag to rotate the 3D surface. The lower your pin sits in the green valley, the lower your loan interest rate.</span>
      </div>
    </div>
  );
};
