'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type NodeKind = 'individual' | 'outreach' | 'hospital' | 'shelter' | 'verifier';

export const NODE_CONFIG: Record<NodeKind, { label: string; color: string; hex: number }> = {
  verifier: { label: 'Verification Authority', color: '#f59e0b', hex: 0xf59e0b },
  outreach: { label: 'Outreach Worker', color: '#14b8a6', hex: 0x14b8a6 },
  shelter: { label: 'Emergency Shelter', color: '#22c55e', hex: 0x22c55e },
  hospital: { label: 'Healthcare Clinic', color: '#38bdf8', hex: 0x38bdf8 },
  individual: { label: 'Vulnerable Individual', color: '#818cf8', hex: 0x818cf8 },
};

interface NetworkNode {
  id: number;
  kind: NodeKind;
  pos: [number, number, number];
  name: string;
  desc: string;
}

export function Heliovis({ height = 500 }: { width?: number; height?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTooltip, setActiveTooltip] = useState<{ name: string; label: string; desc: string; x: number; y: number } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 600;
    const h = height;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070e1c, 0.05);

    const camera = new THREE.PerspectiveCamera(45, width / h, 0.1, 100);
    camera.position.set(0, 1.5, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x070e1c, 0);
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x14b8a6, 0.8);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    // Nodes Data
    const rawNodes: NetworkNode[] = [
      { id: 0, kind: 'verifier', pos: [0, 0.3, 0], name: 'AidBridge Verification Hub', desc: 'Enforces mandatory service delivery verification before closure' },
      { id: 1, kind: 'outreach', pos: [-2.2, 1.2, 0.8], name: 'Metro Street Outreach', desc: 'Field triage, consent capture, and referral dispatch' },
      { id: 2, kind: 'outreach', pos: [2.1, 1.0, -0.6], name: 'Transit Corridor Team', desc: 'Active nighttime engagement with homeless youth' },
      { id: 3, kind: 'shelter', pos: [-1.8, -1.3, 1.4], name: 'Hope Haven Shelter', desc: '40-bed sanctuary with intake and admission logs' },
      { id: 4, kind: 'shelter', pos: [1.9, -1.4, -1.2], name: 'Civic Family Center', desc: 'Dedicated family suites and pediatric nutrition' },
      { id: 5, kind: 'hospital', pos: [2.4, 0.2, 1.5], name: 'St. Jude Health Clinic', desc: 'Emergency triage and clinical stabilization' },
      { id: 6, kind: 'hospital', pos: [-2.4, -0.1, -1.5], name: 'Regional Urgent Care', desc: 'Wound care, pharmacy supplies, and acute triage' },
      { id: 7, kind: 'individual', pos: [-3.4, 2.1, 0.4], name: 'David K. (Elderly)', desc: 'Referred to Hope Haven; verified shelter placement' },
      { id: 8, kind: 'individual', pos: [-3.0, -2.0, 1.2], name: 'Maya S. & Infant', desc: 'Pending verification for family shelter suite' },
      { id: 9, kind: 'individual', pos: [3.3, 1.8, -0.8], name: 'Arthur B. (Adult)', desc: 'Medical assistance in progress at St. Jude Clinic' },
      { id: 10, kind: 'individual', pos: [3.2, -1.8, 1.1], name: 'Liam R. (Youth)', desc: 'Unaccompanied minor with safeguarding priority' },
      { id: 11, kind: 'individual', pos: [0.1, 2.5, -1.5], name: 'Helen G. (Elderly)', desc: 'Assessed for nutrition stipend and public welfare' },
    ];

    const group = new THREE.Group();
    scene.add(group);

    // Node Meshes
    const nodeMeshes: THREE.Mesh[] = [];
    const sphereGeo = new THREE.SphereGeometry(1, 24, 24);

    rawNodes.forEach((node) => {
      const radius = node.kind === 'verifier' ? 0.38 : node.kind === 'individual' ? 0.22 : 0.3;
      const mat = new THREE.MeshStandardMaterial({
        color: NODE_CONFIG[node.kind].hex,
        emissive: NODE_CONFIG[node.kind].hex,
        emissiveIntensity: 0.45,
        roughness: 0.2,
        metalness: 0.5,
      });

      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(...node.pos);
      mesh.scale.setScalar(radius);
      mesh.userData = node;
      group.add(mesh);
      nodeMeshes.push(mesh);
    });

    // Connecting Lines
    const connections: [number, number][] = [
      [7, 1], [8, 1], [9, 2], [10, 2], [11, 1], // individuals to outreach
      [1, 3], [1, 6], [2, 4], [2, 5],           // outreach to providers
      [3, 0], [4, 0], [5, 0], [6, 0],           // providers to verifier
    ];

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.3,
      linewidth: 1,
    });

    connections.forEach(([fromIdx, toIdx]) => {
      const p1 = new THREE.Vector3(...rawNodes[fromIdx].pos);
      const p2 = new THREE.Vector3(...rawNodes[toIdx].pos);
      const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const line = new THREE.Line(lineGeo, lineMat);
      group.add(line);
    });

    // Raycasting for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Mouse drag interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let autoRotate = true;

    const onPointerDown = (e: MouseEvent) => {
      isDragging = true;
      autoRotate = false;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / h) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        group.rotation.y += deltaX * 0.005;
        group.rotation.x += deltaY * 0.005;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else {
        // Hover raycasting
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(nodeMeshes);
        if (intersects.length > 0) {
          const hovered = intersects[0].object.userData as NetworkNode;
          container.style.cursor = 'pointer';
          setActiveTooltip({
            name: hovered.name,
            label: NODE_CONFIG[hovered.kind].label,
            desc: hovered.desc,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
        } else {
          container.style.cursor = 'default';
          setActiveTooltip(null);
        }
      }
    };

    const onPointerUp = () => {
      isDragging = false;
      setTimeout(() => { autoRotate = true; }, 3000);
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (autoRotate) {
        group.rotation.y += delta * 0.15;
      }

      // Gentle floating oscillation
      nodeMeshes.forEach((mesh, idx) => {
        mesh.position.y = rawNodes[idx].pos[1] + Math.sin(time * 1.5 + idx) * 0.04;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      camera.aspect = newWidth / h;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [height]);

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className="relative w-full overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-b from-[#091326] via-[#0b1730] to-[#070e1c] shadow-2xl"
    >
      {/* Interactive Tooltip */}
      {activeTooltip && (
        <div
          style={{ left: Math.min(activeTooltip.x + 12, 380), top: Math.max(activeTooltip.y - 60, 10) }}
          className="pointer-events-none absolute z-20 rounded-xl border border-border/90 bg-background/95 px-3.5 py-2 shadow-2xl backdrop-blur-md transition-all"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">{activeTooltip.name}</span>
            <span className="text-[10px] text-brand-300 font-semibold">{activeTooltip.label}</span>
          </div>
          <p className="mt-1 text-[11px] leading-tight text-muted-foreground">{activeTooltip.desc}</p>
        </div>
      )}

      {/* Network Legend Overlay */}
      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/85 px-4 py-2.5 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {Object.entries(NODE_CONFIG).map(([kind, info]) => (
            <div key={kind} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: info.color }} />
              <span className="text-[11px] font-medium text-foreground/80">{info.label}</span>
            </div>
          ))}
        </div>
        <div className="text-[11px] text-muted-foreground hidden sm:block">
          Interactive: Drag to rotate · Hover node to inspect
        </div>
      </div>
    </div>
  );
}

export default Heliovis;
