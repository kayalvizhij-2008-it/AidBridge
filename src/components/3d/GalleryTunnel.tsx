'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface GalleryTunnelProps {
  className?: string;
  speedMultiplier?: number;
  interactive?: boolean;
  onPanelSelect?: (category: string) => void;
  variant?: 'corridor' | 'compact' | 'hero';
}

interface AssistanceDomain {
  name: string;
  subtext: string;
  code: string;
  gradient: [string, string, string];
  edgeColor: number;
  edgeHex: string;
  glyph: 'shield' | 'pulse' | 'radar' | 'cross' | 'network' | 'vault' | 'anchor' | 'beacon' | 'waveform';
}

const DOMAINS: AssistanceDomain[] = [
  {
    name: 'Field Outreach',
    subtext: 'Street Triage & Safe Intake',
    code: 'SEC-TRIAGE-01',
    gradient: ['#101D32', '#176B67', '#35A99A'],
    edgeColor: 0x35a99a,
    edgeHex: '#35A99A',
    glyph: 'radar',
  },
  {
    name: 'Emergency Sanctuary',
    subtext: 'Live Bed Allocation Sync',
    code: 'SANCTUARY-02',
    gradient: ['#101D32', '#135855', '#D8B77A'],
    edgeColor: 0xd8b77a,
    edgeHex: '#D8B77A',
    glyph: 'shield',
  },
  {
    name: 'Acute Clinical Care',
    subtext: 'Hospital Triage & Meds',
    code: 'CLINICAL-MED-03',
    gradient: ['#0C2524', '#176B67', '#35A99A'],
    edgeColor: 0x35a99a,
    edgeHex: '#35A99A',
    glyph: 'pulse',
  },
  {
    name: 'Nutrition & Food Rations',
    subtext: 'Verified Caloric Bundles',
    code: 'RATION-SUPPLY-04',
    gradient: ['#101D32', '#2B3F5E', '#D8B77A'],
    edgeColor: 0xd8b77a,
    edgeHex: '#D8B77A',
    glyph: 'waveform',
  },
  {
    name: 'Child Safeguarding',
    subtext: 'Juvenile Welfare Protection',
    code: 'SAFEGUARD-05',
    gradient: ['#101D32', '#1E4E4B', '#35A99A'],
    edgeColor: 0x35a99a,
    edgeHex: '#35A99A',
    glyph: 'vault',
  },
  {
    name: 'Urgent Care Stabilization',
    subtext: 'Immediate Crisis De-escalation',
    code: 'CRISIS-RESP-06',
    gradient: ['#2A1A1A', '#522A2A', '#C94C4C'],
    edgeColor: 0xc94c4c,
    edgeHex: '#C94C4C',
    glyph: 'cross',
  },
  {
    name: 'Geriatric Inclusion',
    subtext: 'Homeless Senior Respite',
    code: 'GERIATRIC-07',
    gradient: ['#281E10', '#6A4F20', '#D49A35'],
    edgeColor: 0xd49a35,
    edgeHex: '#D49A35',
    glyph: 'anchor',
  },
  {
    name: 'Social Inclusion & Housing',
    subtext: 'Permanent Housing Relays',
    code: 'HOUSING-AID-08',
    gradient: ['#0A261D', '#176B67', '#21845A'],
    edgeColor: 0x21845a,
    edgeHex: '#21845A',
    glyph: 'network',
  },
  {
    name: 'Delivery Verification',
    subtext: 'Dual-Key Case Closure Audit',
    code: 'AUDIT-SIGN-09',
    gradient: ['#101D32', '#176B67', '#D8B77A'],
    edgeColor: 0xd8b77a,
    edgeHex: '#D8B77A',
    glyph: 'beacon',
  },
];

// Procedurally generate crisp futuristic abstract panel graphics
function createAbstractPanelTexture(domain: AssistanceDomain): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep dark gradient background
  const bgGrad = ctx.createLinearGradient(0, 0, 640, 400);
  bgGrad.addColorStop(0, domain.gradient[0]);
  bgGrad.addColorStop(0.65, domain.gradient[1]);
  bgGrad.addColorStop(1, '#02050e');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 640, 400);

  // Geometric grid overlay
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  const step = 40;
  for (let x = 0; x < 640; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 400);
    ctx.stroke();
  }
  for (let y = 0; y < 400; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(640, y);
    ctx.stroke();
  }

  // Neon glowing perimeter border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(16, 16, 608, 368);

  // Neon tech corner brackets
  ctx.strokeStyle = domain.edgeHex;
  ctx.lineWidth = 3.5;
  const bracketSize = 38;

  // Top-left
  ctx.beginPath();
  ctx.moveTo(16, 16 + bracketSize);
  ctx.lineTo(16, 16);
  ctx.lineTo(16 + bracketSize, 16);
  ctx.stroke();

  // Top-right
  ctx.beginPath();
  ctx.moveTo(624 - bracketSize, 16);
  ctx.lineTo(624, 16);
  ctx.lineTo(624, 16 + bracketSize);
  ctx.stroke();

  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(16, 384 - bracketSize);
  ctx.lineTo(16, 384);
  ctx.lineTo(16 + bracketSize, 384);
  ctx.stroke();

  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(624 - bracketSize, 384);
  ctx.lineTo(624, 384);
  ctx.lineTo(624, 384 - bracketSize);
  ctx.stroke();

  // Central Hologram / Abstract Diagram
  const centerX = 320;
  const centerY = 160;

  // Outer radial gradient glow
  const radialGlow = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 110);
  radialGlow.addColorStop(0, `${domain.edgeHex}44`);
  radialGlow.addColorStop(0.5, `${domain.edgeHex}15`);
  radialGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = radialGlow;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 110, 0, Math.PI * 2);
  ctx.fill();

  // Concentric abstract rings
  ctx.strokeStyle = `${domain.edgeHex}55`;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.arc(centerX, centerY, 75, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = domain.edgeHex;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 52, 0, Math.PI * 2);
  ctx.stroke();

  // Hexagonal core wireframe
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const hx = centerX + Math.cos(angle) * 32;
    const hy = centerY + Math.sin(angle) * 32;
    if (i === 0) ctx.moveTo(hx, hy);
    else ctx.lineTo(hx, hy);
  }
  ctx.closePath();
  ctx.stroke();

  // Glowing center luminary core
  ctx.fillStyle = domain.edgeHex;
  ctx.shadowColor = domain.edgeHex;
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Horizontal telemetry lines
  ctx.strokeStyle = `${domain.edgeHex}33`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, centerY);
  ctx.lineTo(centerX - 90, centerY);
  ctx.moveTo(centerX + 90, centerY);
  ctx.lineTo(580, centerY);
  ctx.stroke();

  // Header code tag
  ctx.fillStyle = domain.edgeHex;
  ctx.font = '700 11px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.letterSpacing = '1px';
  ctx.fillText(`• ${domain.code} // GOVTECH DIRECTIVE`, 36, 44);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '10px monospace';
  ctx.textAlign = 'right';
  ctx.fillText('STATUS: VERIFIED ACTIVE', 604, 44);

  // Main Category Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 8;
  ctx.fillText(domain.name.toUpperCase(), centerX, 280);
  ctx.shadowBlur = 0;

  // Subtext / description
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '500 14px "Inter", sans-serif';
  ctx.fillText(domain.subtext, centerX, 310);

  // Bottom audit hash and verification marker
  ctx.fillStyle = `${domain.edgeHex}bb`;
  ctx.font = '600 11px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('ENCRYPTED AUDIT: HASH-SHA256: 0x9b4f..3a1c', 36, 362);

  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillText('AIDBRIDGE PROTOCOL v4.2', 604, 362);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

export const GalleryTunnel: React.FC<GalleryTunnelProps> = ({
  className = '',
  speedMultiplier = 1,
  interactive = true,
  onPanelSelect,
  variant = 'corridor',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability safely
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02050f, variant === 'compact' ? 0.03 : 0.018);

    const camera = new THREE.PerspectiveCamera(
      65,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      250
    );
    camera.position.set(0, 0, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      container.appendChild(renderer.domElement);
    } catch {
      setWebglSupported(false);
      return;
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f2fe, 4.5, 60);
    cyanLight.position.set(0, 1.5, -12);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight(0x8b5cf6, 5.0, 90);
    violetLight.position.set(0, -1.5, -45);
    scene.add(violetLight);

    const magentaLight = new THREE.PointLight(0xd946ef, 3.5, 70);
    magentaLight.position.set(0, 0, -80);
    scene.add(magentaLight);

    // Tunnel Dimensions
    const rings = isMobile ? 8 : variant === 'compact' ? 10 : 16;
    const panelsPerRing = 6;
    const tunnelRadius = variant === 'compact' ? 4.8 : 5.8;
    const ringSpacing = 7.5;
    const tunnelDepth = rings * ringSpacing;

    const panelWidth = variant === 'compact' ? 2.8 : 3.4;
    const panelHeight = variant === 'compact' ? 1.75 : 2.15;
    const panelGeometry = new THREE.PlaneGeometry(panelWidth, panelHeight);
    const edgeGeometry = new THREE.EdgesGeometry(panelGeometry);

    const panels: {
      mesh: THREE.Mesh;
      wireframe: THREE.LineSegments;
      domain: AssistanceDomain;
      baseZ: number;
    }[] = [];

    // Pre-create textures to avoid re-allocations
    const textureMap = DOMAINS.map((d) => createAbstractPanelTexture(d));

    for (let r = 0; r < rings; r++) {
      const z = -r * ringSpacing - 4;

      for (let p = 0; p < panelsPerRing; p++) {
        const domainIndex = (r * panelsPerRing + p) % DOMAINS.length;
        const domain = DOMAINS[domainIndex];
        const texture = textureMap[domainIndex];

        // Stagger rotation on alternating rings for visual rhythm
        const angle =
          (p / panelsPerRing) * Math.PI * 2 + (r % 2 === 0 ? 0 : Math.PI / panelsPerRing);
        const x = Math.cos(angle) * tunnelRadius;
        const y = Math.sin(angle) * tunnelRadius;

        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.94,
        });

        const mesh = new THREE.Mesh(panelGeometry, material);
        mesh.position.set(x, y, z);
        mesh.lookAt(0, 0, z);
        mesh.rotateY(Math.PI);

        // Glowing edge geometry
        const edgeMaterial = new THREE.LineBasicMaterial({
          color: domain.edgeColor,
          transparent: true,
          opacity: 0.8,
          linewidth: 1.5,
        });
        const wireframe = new THREE.LineSegments(edgeGeometry, edgeMaterial);
        mesh.add(wireframe);

        mesh.userData = { domain: domain.name, colorHex: domain.edgeHex };

        scene.add(mesh);
        panels.push({ mesh, wireframe, domain, baseZ: z });
      }
    }

    // Floating particle dust inside tunnel
    const particleCount = isMobile ? 220 : 550;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorSwatches = [
      new THREE.Color('#00f2fe'),
      new THREE.Color('#3b82f6'),
      new THREE.Color('#8b5cf6'),
      new THREE.Color('#d946ef'),
      new THREE.Color('#10b981'),
      new THREE.Color('#f43f5e'),
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * (tunnelRadius - 0.6);
      particlePositions[i3] = Math.cos(angle) * dist;
      particlePositions[i3 + 1] = Math.sin(angle) * dist;
      particlePositions[i3 + 2] = -Math.random() * tunnelDepth;

      const swatch = colorSwatches[Math.floor(Math.random() * colorSwatches.length)];
      particleColors[i3] = swatch.r;
      particleColors[i3 + 1] = swatch.g;
      particleColors[i3 + 2] = swatch.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Parallax & Raycasting
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = normX * 0.4;
      targetY = normY * 0.3;
    };

    if (interactive && !isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();
    let hoveredMesh: THREE.Mesh | null = null;

    const handlePointerHover = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouseVector, camera);
      const meshesToTest = panels.map((p) => p.mesh);
      const intersects = raycaster.intersectObjects(meshesToTest, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        if (hoveredMesh !== hit) {
          if (hoveredMesh) hoveredMesh.scale.set(1, 1, 1);
          hoveredMesh = hit;
          hit.scale.set(1.09, 1.09, 1.09);
          setActiveDomain(hit.userData.domain);
        }
      } else {
        if (hoveredMesh) {
          hoveredMesh.scale.set(1, 1, 1);
          hoveredMesh = null;
          setActiveDomain(null);
        }
      }
    };

    const handleClick = () => {
      if (hoveredMesh && onPanelSelect) {
        onPanelSelect(hoveredMesh.userData.domain);
      }
    };

    if (interactive) {
      container.addEventListener('mousemove', handlePointerHover);
      container.addEventListener('click', handleClick);
    }

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    const baseSpeed = prefersReducedMotion ? 0.02 : 0.09 * speedMultiplier;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const moveStep = baseSpeed * (delta * 60);

      // Camera lerp
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      camera.position.x = mouseX * 1.3;
      camera.position.y = mouseY * 1.3;
      camera.rotation.z = -mouseX * 0.12;

      // Move panels forward
      panels.forEach((p) => {
        p.mesh.position.z += moveStep;
        if (p.mesh.position.z > 3) {
          p.mesh.position.z -= tunnelDepth;
        }
        p.mesh.lookAt(0, 0, p.mesh.position.z);
        p.mesh.rotateY(Math.PI);
      });

      // Move particle dust
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3 + 2;
        positions[i3] += moveStep * 0.85;
        if (positions[i3] > 2) {
          positions[i3] -= tunnelDepth;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Pulse dynamic tunnel lights
      const time = clock.getElapsedTime();
      cyanLight.intensity = 3.5 + Math.sin(time * 2.2) * 1.2;
      violetLight.intensity = 4.2 + Math.cos(time * 1.8) * 1.4;
      magentaLight.intensity = 3.0 + Math.sin(time * 1.4) * 0.9;

      renderer.render(scene, camera);
    };

    animate();

    // ResizeObserver for reliable containment
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    // Cleanup resources
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousemove', handlePointerHover);
      container.removeEventListener('click', handleClick);

      panelGeometry.dispose();
      edgeGeometry.dispose();
      particleGeo.dispose();
      particleMat.dispose();

      textureMap.forEach((t) => t.dispose());

      panels.forEach((p) => {
        const mat = p.mesh.material;
        if (mat instanceof THREE.Material) mat.dispose();
        if (p.wireframe.material instanceof THREE.Material) p.wireframe.material.dispose();
        scene.remove(p.mesh);
      });

      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [speedMultiplier, interactive, onPanelSelect, variant]);

  if (!webglSupported) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center bg-navy-950/80 rounded-2xl border border-cyan-500/30 p-6 ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/40 mx-auto flex items-center justify-center text-cyan-400 mb-3">
            ❖
          </div>
          <h4 className="text-white font-bold text-sm">Assistance Corridor Active</h4>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Encrypted GovTech verification protocols streaming across 9 municipal wards.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Domain inspection telemetry badge */}
      {activeDomain && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all duration-300">
          <div className="px-5 py-2.5 rounded-full glass-elevated border border-cyan-400/50 shadow-glow-cyan flex items-center space-x-3 text-xs font-mono text-cyan-300">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-slate-400">INSPECTING PROTOCOL:</span>
            <span className="text-white font-bold tracking-wider">{activeDomain}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryTunnel;
