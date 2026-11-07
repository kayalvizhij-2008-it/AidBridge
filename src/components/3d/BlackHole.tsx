'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface BlackHoleProps {
  className?: string;
  particleCount?: number;
  size?: number;
  interactive?: boolean;
  showTelemetry?: boolean;
  accentTitle?: string;
}

// Procedural soft-glow circular particle sprite
function createParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.25, 'rgba(255, 255, 255, 0.85)');
  grad.addColorStop(0.6, 'rgba(255, 255, 255, 0.25)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

export const BlackHole: React.FC<BlackHoleProps> = ({
  className = '',
  particleCount = 3600,
  size = 1,
  interactive = true,
  showTelemetry = false,
  accentTitle = 'CONNECTED CARE GRAVITATIONAL ECOSYSTEM',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
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

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? Math.floor(particleCount * 0.45) : particleCount;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      48,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      120
    );
    camera.position.set(0, 4.5 * size, 11 * size);
    camera.lookAt(0, 0, 0);

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
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);
    } catch {
      setWebglSupported(false);
      return;
    }

    // 1. Dark Event Horizon Sphere (Center Core)
    const coreRadius = 1.45 * size;
    const coreGeo = new THREE.SphereGeometry(coreRadius, 36, 36);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x010308 });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // 2. Luminous Multi-Ring Photon Sphere / Accretion Horizon
    const ringsGroup = new THREE.Group();
    scene.add(ringsGroup);

    // Inner bright aqua ring
    const ring1Geo = new THREE.RingGeometry(coreRadius * 1.02, coreRadius * 1.15, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x35a99a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2;
    ringsGroup.add(ring1);

    // Mid teal glowing rim
    const ring2Geo = new THREE.RingGeometry(coreRadius * 1.15, coreRadius * 1.35, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x176b67,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 2;
    ringsGroup.add(ring2);

    // Outer champagne aura
    const ring3Geo = new THREE.RingGeometry(coreRadius * 1.35, coreRadius * 1.7, 64);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0xd8b77a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = Math.PI / 2;
    ringsGroup.add(ring3);

    // 3. Glowing Orbital Stream Lines (Connecting Agency Arcs)
    const orbitalTrailsGroup = new THREE.Group();
    scene.add(orbitalTrailsGroup);

    const trailRadii = [2.2 * size, 3.6 * size, 5.0 * size, 6.4 * size];
    const trailColors = [0x35a99a, 0x176b67, 0xd8b77a, 0x21845a];
    const trailGeos: THREE.BufferGeometry[] = [];
    const trailMats: THREE.LineBasicMaterial[] = [];

    trailRadii.forEach((r, idx) => {
      const segments = 120;
      const points: THREE.Vector3[] = [];
      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * r, 0, Math.sin(theta) * r));
      }
      const trailGeo = new THREE.BufferGeometry().setFromPoints(points);
      const trailMat = new THREE.LineBasicMaterial({
        color: trailColors[idx],
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
      });
      const trailLine = new THREE.Line(trailGeo, trailMat);
      trailLine.rotation.x = (idx - 1.5) * 0.08;
      trailLine.rotation.z = (idx - 1.5) * 0.05;
      orbitalTrailsGroup.add(trailLine);
      trailGeos.push(trailGeo);
      trailMats.push(trailMat);
    });

    // 4. Vibrant Multi-Strata Swirling Particle Ecosystem
    const particleTexture = createParticleTexture();
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const initialAngles = new Float32Array(count);
    const radii = new Float32Array(count);
    const speeds = new Float32Array(count);
    const heights = new Float32Array(count);

    // Rich AidBridge mandatory palette
    const colorTeal = new THREE.Color('#176B67');
    const colorAqua = new THREE.Color('#35A99A');
    const colorChampagne = new THREE.Color('#D8B77A');
    const colorNavy = new THREE.Color('#101D32');
    const colorSuccess = new THREE.Color('#21845A');
    const colorWarmGold = new THREE.Color('#D49A35');
    const colorIvory = new THREE.Color('#F5F3EC');

    const minRadius = coreRadius * 1.1;
    const maxRadius = 7.6 * size;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Exponential distribution pulling particles densely near the event horizon
      const u = Math.random();
      const r = minRadius + Math.pow(u, 1.9) * (maxRadius - minRadius);
      radii[i] = r;

      const angle = Math.random() * Math.PI * 2;
      initialAngles[i] = angle;

      // Keplerian physics: velocity v = 1 / sqrt(r)
      speeds[i] = (1 / Math.sqrt(r)) * 2.1;

      // Thickness flattens near the core and softly blooms outward
      const maxH = 0.12 + Math.pow(r / maxRadius, 1.2) * 0.65;
      heights[i] = (Math.random() - 0.5) * maxH * size;

      positions[i3] = Math.cos(angle) * r;
      positions[i3 + 1] = heights[i];
      positions[i3 + 2] = Math.sin(angle) * r;

      // Color Stratification:
      // Inner: Brilliant Aqua -> Deep Teal
      // Mid: Deep Teal -> Muted Champagne
      // Outer: Champagne -> Soft Ivory / Success Green
      const norm = (r - minRadius) / (maxRadius - minRadius);
      let pColor = new THREE.Color();

      if (norm < 0.25) {
        pColor.lerpColors(colorAqua, colorTeal, norm / 0.25);
      } else if (norm < 0.6) {
        pColor.lerpColors(colorTeal, colorChampagne, (norm - 0.25) / 0.35);
      } else if (norm < 0.85) {
        pColor.lerpColors(colorChampagne, colorAqua, (norm - 0.6) / 0.25);
      } else {
        pColor.lerpColors(colorAqua, colorSuccess, (norm - 0.85) / 0.15);
      }

      // 8% subtle champagne sparkles for premium depth
      if (Math.random() < 0.08) {
        pColor = Math.random() > 0.5 ? colorChampagne : colorAqua;
      }

      colors[i3] = pColor.r;
      colors[i3 + 1] = pColor.g;
      colors[i3 + 2] = pColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.12 : 0.15,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = normX * 0.45;
      targetY = normY * 0.3;
    };

    if (interactive && !isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Mouse lerp
      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;

      // Camera gently orbits and responds to mouse
      camera.position.x = Math.sin(elapsed * 0.08) * 1.2 + mouseX * 2.8;
      camera.position.y = 4.5 * size + mouseY * 1.8;
      camera.position.z = 11 * size + Math.cos(elapsed * 0.08) * 0.6;
      camera.lookAt(0, 0, 0);

      // Rotate photon rings
      ring1.rotation.z += 0.016;
      ring2.rotation.z -= 0.012;
      ring3.rotation.z += 0.008;

      // Rotate orbital lines gently
      orbitalTrailsGroup.rotation.y = elapsed * 0.04;

      // Orbit particles around the core
      const posArr = particleGeo.attributes.position.array as Float32Array;
      const speedFactor = prefersReducedMotion ? 0.15 : 1.0;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        initialAngles[i] += speeds[i] * delta * 0.85 * speedFactor;
        const currentAngle = initialAngles[i];
        const r = radii[i];

        posArr[i3] = Math.cos(currentAngle) * r;
        posArr[i3 + 1] =
          heights[i] + Math.sin(currentAngle * 2 + elapsed * 1.2) * (0.05 * size);
        posArr[i3 + 2] = Math.sin(currentAngle) * r;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Gentle wave tilt on particle accretion disk
      particleSystem.rotation.z = Math.sin(elapsed * 0.12) * 0.06;
      particleSystem.rotation.x = 0.28 + Math.cos(elapsed * 0.09) * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    // ResizeObserver
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

      coreGeo.dispose();
      coreMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      trailGeos.forEach((g) => g.dispose());
      trailMats.forEach((m) => m.dispose());
      particleGeo.dispose();
      particleMat.dispose();
      particleTexture.dispose();

      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [particleCount, size, interactive]);

  if (!webglSupported) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center bg-navy-950/80 rounded-2xl border border-blue-500/30 p-6 ${className}`}>
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-400 p-[2px] shadow-glow mx-auto mb-3">
            <div className="w-full h-full rounded-full bg-navy-950 flex items-center justify-center text-cyan-400">
              ◎
            </div>
          </div>
          <h4 className="text-white font-bold text-sm">Care Ecosystem Converged</h4>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Closed-loop assistance coordination across 5 municipal stakeholder desks.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Telemetry pill */}
      {showTelemetry && (
        <div className="absolute top-4 right-4 z-20 pointer-events-none">
          <div className="px-3.5 py-1.5 rounded-full glass border border-cyan-400/30 text-[10px] font-mono text-cyan-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>{accentTitle}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlackHole;
