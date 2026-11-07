'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const PILLARS = [
  { name: 'Public Governance & Audits', desc: '100% immutable audit stamps preventing unverified case resolutions.', color: 0xd8b77a, hex: '#D8B77A', pos: [0, 2.5, 0] },
  { name: 'Street Level Outreach', desc: 'Minimal-barrier street intake prioritizing vulnerability and verbal consent.', color: 0x35a99a, hex: '#35A99A', pos: [-3, 0.5, 1.2] },
  { name: 'Emergency Sanctuary Systems', desc: 'Live bed census integration eliminating turn-away blindspots.', color: 0x176b67, hex: '#176B67', pos: [3, 0.5, 1.2] },
  { name: 'Acute Clinical Care', desc: 'Immediate medical stabilization and trauma-informed health services.', color: 0x35a99a, hex: '#35A99A', pos: [-2, -2.0, -1.0] },
  { name: 'Dual-Key Case Verification', desc: 'Supervisory sign-off mandating physical delivery evidence.', color: 0x21845a, hex: '#21845A', pos: [2, -2.0, -1.0] },
];

export function AboutEcosystem3D({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPillar, setSelectedPillar] = useState(PILLARS[0]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      100
    );
    camera.position.set(0, 0, 9.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 2));
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // 1. Central Core Sphere: Individual at the Heart of Care
    const coreGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x101d32 });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    const coreWireGeo = new THREE.IcosahedronGeometry(1.15, 2);
    const coreWireMat = new THREE.MeshBasicMaterial({
      color: 0x35a99a,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const coreWire = new THREE.Mesh(coreWireGeo, coreWireMat);
    scene.add(coreWire);

    // 2. Concentric Gyroscope Rings in Champagne & Teal
    const gyroGroup = new THREE.Group();
    scene.add(gyroGroup);

    const r1Geo = new THREE.RingGeometry(1.6, 1.66, 64);
    const r1Mat = new THREE.MeshBasicMaterial({ color: 0xd8b77a, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    const r1 = new THREE.Mesh(r1Geo, r1Mat);
    r1.rotation.x = Math.PI / 4;
    gyroGroup.add(r1);

    const r2Geo = new THREE.RingGeometry(2.4, 2.46, 64);
    const r2Mat = new THREE.MeshBasicMaterial({ color: 0x176b67, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
    const r2 = new THREE.Mesh(r2Geo, r2Mat);
    r2.rotation.y = Math.PI / 3;
    gyroGroup.add(r2);

    const r3Geo = new THREE.RingGeometry(3.2, 3.26, 64);
    const r3Mat = new THREE.MeshBasicMaterial({ color: 0x35a99a, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
    const r3 = new THREE.Mesh(r3Geo, r3Mat);
    r3.rotation.z = Math.PI / 6;
    gyroGroup.add(r3);

    // 3. Five Pillar Nodes
    const pillarMeshes: THREE.Mesh[] = [];
    const pGeo = new THREE.SphereGeometry(0.32, 24, 24);

    PILLARS.forEach((pillar) => {
      const mat = new THREE.MeshBasicMaterial({ color: pillar.color });
      const mesh = new THREE.Mesh(pGeo, mat);
      mesh.position.set(...(pillar.pos as [number, number, number]));
      mesh.userData = pillar;
      scene.add(mesh);
      pillarMeshes.push(mesh);

      // Connecting line from core to pillar
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(...(pillar.pos as [number, number, number])),
      ]);
      const lineMat = new THREE.LineBasicMaterial({ color: pillar.color, transparent: true, opacity: 0.35 });
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);
    });

    // Mouse Interaction
    let targetX = 0;
    let targetY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = nx * 0.4;
      targetY = ny * 0.3;

      const mouseVec = new THREE.Vector2(nx, ny);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouseVec, camera);
      const hits = raycaster.intersectObjects(pillarMeshes);
      if (hits.length > 0) {
        container.style.cursor = 'pointer';
        setSelectedPillar(hits[0].object.userData as any);
      } else {
        container.style.cursor = 'default';
      }
    };

    container.addEventListener('mousemove', handleMouseMove);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      camera.position.x = mouseX * 1.5;
      camera.position.y = mouseY * 1.2;
      camera.lookAt(0, 0, 0);

      // Gentle rotation
      coreWire.rotation.y += 0.008;
      coreWire.rotation.x += 0.005;

      r1.rotation.z += 0.006;
      r2.rotation.x += 0.005;
      r3.rotation.y += 0.004;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / Math.max(container.clientHeight, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-[420px] lg:h-[480px] rounded-3xl overflow-hidden bg-[#101D32] border border-[#E4E8E5]/20 shadow-xl ${className}`}>
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Floating Active Pillar Badge */}
      <div className="absolute top-6 left-6 z-20 max-w-sm bg-[#101D32]/95 backdrop-blur-md p-4 rounded-2xl border border-white/15 shadow-xl transition-all">
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: selectedPillar.hex }}
          />
          <h4 className="text-white font-bold text-sm tracking-tight">{selectedPillar.name}</h4>
        </div>
        <p className="text-xs text-[#F5F3EC]/80 leading-relaxed">{selectedPillar.desc}</p>
      </div>

      <div className="absolute bottom-4 right-6 z-20 pointer-events-none text-right hidden sm:block">
        <span className="text-[10px] font-mono text-[#D8B77A] uppercase tracking-widest">
          3D ECOSYSTEM ARCHITECTURE • HOVER NODES TO INSPECT
        </span>
      </div>
    </div>
  );
}

export default AboutEcosystem3D;
