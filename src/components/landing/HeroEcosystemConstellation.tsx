'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface NodeData {
  name: string;
  role: string;
  color: number;
  hex: string;
  pos: [number, number, number];
  badge: string;
}

const NODES: NodeData[] = [
  {
    name: 'Street Outreach',
    role: 'Field Triage & Safe Registry',
    color: 0x35a99a,
    hex: '#35A99A',
    pos: [-3.4, 1.8, 1.2],
    badge: 'TRIAGE ACTIVE',
  },
  {
    name: 'Emergency Shelter',
    role: 'Capacity-Aware Bed Allocation',
    color: 0x176b67,
    hex: '#176B67',
    pos: [3.2, 1.9, 0.8],
    badge: '18 BEDS LIVE',
  },
  {
    name: 'Acute Clinical Care',
    role: 'Hospital Triage & Meds',
    color: 0x35a99a,
    hex: '#35A99A',
    pos: [3.6, -1.8, 1.0],
    badge: 'CLINICAL READY',
  },
  {
    name: 'Food & Nutrition Hub',
    role: 'Emergency Daily Rations',
    color: 0xd8b77a,
    hex: '#D8B77A',
    pos: [-3.6, -1.9, 0.6],
    badge: '250 RATIONS',
  },
  {
    name: 'GovTech Verification',
    role: 'Dual-Key Closure Oversight',
    color: 0xd8b77a,
    hex: '#D8B77A',
    pos: [0, 3.2, -0.8],
    badge: '100% AUDITED',
  },
];

export const HeroEcosystemConstellation: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeNode, setActiveNode] = useState<NodeData | null>(NODES[0]);

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
    camera.position.set(0, 0, 11);
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
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // Central Core: Individual in Need (Pulsing Shield Sphere)
    const centerCoreGeo = new THREE.SphereGeometry(1.0, 32, 32);
    const centerCoreMat = new THREE.MeshBasicMaterial({
      color: 0x101d32,
      transparent: true,
      opacity: 0.95,
    });
    const centerCore = new THREE.Mesh(centerCoreGeo, centerCoreMat);
    scene.add(centerCore);

    // Ethereal outer wireframe shield
    const shieldGeo = new THREE.IcosahedronGeometry(1.35, 2);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x35a99a,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    scene.add(shieldMesh);

    // Halo Rings around center
    const haloGeo = new THREE.RingGeometry(1.5, 1.58, 48);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xd8b77a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.rotation.x = Math.PI / 3;
    scene.add(haloMesh);

    // Create 5 Stakeholder Constellation Nodes
    const nodeSpheres: { mesh: THREE.Mesh; halo: THREE.Mesh; data: NodeData }[] = [];
    const sphereGeo = new THREE.SphereGeometry(0.38, 24, 24);
    const nodeHaloGeo = new THREE.RingGeometry(0.48, 0.54, 32);

    NODES.forEach((n) => {
      const mat = new THREE.MeshBasicMaterial({ color: n.color });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(...n.pos);
      mesh.userData = n;

      const nhMat = new THREE.MeshBasicMaterial({
        color: n.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
      });
      const halo = new THREE.Mesh(nodeHaloGeo, nhMat);
      halo.position.set(...n.pos);
      scene.add(halo);

      scene.add(mesh);
      nodeSpheres.push({ mesh, halo, data: n });
    });

    // Luminous Connecting Energy Streams (Curves with moving packets)
    const curvePoints: THREE.CatmullRomCurve3[] = [];
    const packetMeshes: THREE.Mesh[] = [];
    const packetProgress: number[] = [];
    const packetSpeeds: number[] = [];

    const packetGeo = new THREE.SphereGeometry(0.08, 12, 12);

    NODES.forEach((n) => {
      const start = new THREE.Vector3(0, 0, 0);
      const end = new THREE.Vector3(...n.pos);
      // Create smooth arc via a midpoint
      const mid = new THREE.Vector3()
        .addVectors(start, end)
        .multiplyScalar(0.5)
        .add(new THREE.Vector3((Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8, 1.2));

      const curve = new THREE.CatmullRomCurve3([start, mid, end]);
      curvePoints.push(curve);

      const tubePoints = curve.getPoints(50);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(tubePoints);
      const lineMat = new THREE.LineBasicMaterial({
        color: n.color,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);

      // Traveling data packet
      const pMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        blending: THREE.AdditiveBlending,
      });
      const pMesh = new THREE.Mesh(packetGeo, pMat);
      scene.add(pMesh);
      packetMeshes.push(pMesh);
      packetProgress.push(Math.random());
      packetSpeeds.push(0.007 + Math.random() * 0.006);
    });

    // Cross-links between adjacent nodes for network resilience
    for (let i = 0; i < NODES.length; i++) {
      const nextIdx = (i + 1) % NODES.length;
      const p1 = new THREE.Vector3(...NODES[i].pos);
      const p2 = new THREE.Vector3(...NODES[nextIdx].pos);
      const edgeGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const edgeMat = new THREE.LineBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.16,
      });
      const edgeLine = new THREE.Line(edgeGeo, edgeMat);
      scene.add(edgeLine);
    }

    // Ambient floating dust particles
    const dustCount = isMobile ? 120 : 300;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPositions[i] = (Math.random() - 0.5) * 16;
      dustPositions[i + 1] = (Math.random() - 0.5) * 12;
      dustPositions[i + 2] = (Math.random() - 0.5) * 8;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = nx * 0.45;
      targetY = ny * 0.35;

      // Raycasting
      const mouseVec = new THREE.Vector2(nx, ny);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouseVec, camera);

      const intersects = raycaster.intersectObjects(
        nodeSpheres.map((n) => n.mesh),
        false
      );

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        setActiveNode(hit.userData as NodeData);
        container.style.cursor = 'pointer';
      } else {
        container.style.cursor = 'default';
      }
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Mouse lerp
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      camera.position.x = Math.sin(elapsed * 0.15) * 0.8 + mouseX * 2.2;
      camera.position.y = mouseY * 1.5;
      camera.position.z = 11 + Math.cos(elapsed * 0.12) * 0.5;
      camera.lookAt(0, 0, 0);

      // Rotate shields and halos
      shieldMesh.rotation.y = elapsed * 0.25;
      shieldMesh.rotation.x = elapsed * 0.15;
      haloMesh.rotation.z = elapsed * 0.3;

      // Rotate node halos
      nodeSpheres.forEach((n, idx) => {
        n.halo.rotation.z += 0.02 * (idx % 2 === 0 ? 1 : -1);
        n.mesh.position.y = n.data.pos[1] + Math.sin(elapsed * 1.5 + idx) * 0.08;
        n.halo.position.y = n.mesh.position.y;
      });

      // Animate packet along curves
      packetMeshes.forEach((pMesh, i) => {
        packetProgress[i] += packetSpeeds[i];
        if (packetProgress[i] > 1) packetProgress[i] = 0;
        const pt = curvePoints[i].getPoint(packetProgress[i]);
        pMesh.position.copy(pt);
      });

      // Drift dust
      dust.rotation.y = elapsed * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);

      centerCoreGeo.dispose();
      centerCoreMat.dispose();
      shieldGeo.dispose();
      shieldMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      sphereGeo.dispose();
      nodeHaloGeo.dispose();
      packetGeo.dispose();
      dustGeo.dispose();
      dustMat.dispose();

      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-[520px] lg:h-[620px] rounded-3xl overflow-hidden bg-[#101D32] border border-[#E4E8E5]/20 shadow-xl ${className}`}>
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Center Label: Individual in Need */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center z-10">
        <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#101D32]/95 border border-[#35A99A]/50 text-[10px] font-mono text-[#35A99A] font-bold shadow-md tracking-wider">
          PROTECTED CARE CORE
        </span>
      </div>

      {/* Floating Node Telemetry Card */}
      {activeNode && (
        <div className="absolute top-6 left-6 z-20 max-w-xs bg-[#101D32]/95 backdrop-blur-md p-4 rounded-2xl border border-white/15 shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-2.5 mb-1.5">
            <span
              className="w-3 h-3 rounded-full animate-ping"
              style={{ backgroundColor: activeNode.hex }}
            />
            <span
              className="w-3 h-3 rounded-full -ml-3"
              style={{ backgroundColor: activeNode.hex }}
            />
            <h4 className="text-white font-bold text-sm tracking-tight">{activeNode.name}</h4>
          </div>
          <p className="text-xs text-[#F5F3EC]/80 font-medium mb-3">{activeNode.role}</p>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#F5F3EC]/60 uppercase tracking-wider">Status</span>
            <span className="text-[#D8B77A] font-bold">{activeNode.badge}</span>
          </div>
        </div>
      )}

      {/* Bottom Hint */}
      <div className="absolute bottom-4 right-6 z-20 pointer-events-none text-right hidden sm:block">
        <span className="text-[10px] font-mono text-[#F5F3EC]/50 uppercase tracking-widest">
          INTERACTIVE CARE CONSTELLATION • HOVER NODES TO INSPECT
        </span>
      </div>
    </div>
  );
};

export default HeroEcosystemConstellation;
