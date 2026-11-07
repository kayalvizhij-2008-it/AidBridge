'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface NetworkNode {
  id: string;
  name: string;
  role: string;
  color: number;
  hex: string;
  position: [number, number, number];
  status: string;
  activeCount: number;
}

const NODES_DATA: NetworkNode[] = [
  {
    id: 'ind',
    name: 'Individuals in Need',
    role: 'Origin of Care & Direct Assistance',
    color: 0xf43f5e,
    hex: '#f43f5e',
    position: [0, 2.5, 0],
    status: '5 Registered Cases',
    activeCount: 142,
  },
  {
    id: 'outreach',
    name: 'Outreach Field Teams',
    role: 'Vulnerability Assessment & Triage',
    color: 0x00f2fe,
    hex: '#00f2fe',
    position: [-3.8, 1.2, 1.2],
    status: 'Real-time GPS Triage',
    activeCount: 28,
  },
  {
    id: 'shelter',
    name: 'Emergency Shelters',
    role: 'Bed Allocation & Overnight Haven',
    color: 0x3b82f6,
    hex: '#3b82f6',
    position: [-2.6, -2.2, 0.8],
    status: '18 Available Beds',
    activeCount: 65,
  },
  {
    id: 'hospital',
    name: 'Clinical Hospitals',
    role: 'Acute Medical Care & Treatment',
    color: 0x14b8a6,
    hex: '#14b8a6',
    position: [2.6, -2.2, -0.8],
    status: 'Triage Desk Online',
    activeCount: 12,
  },
  {
    id: 'ngo',
    name: 'Community NGOs',
    role: 'Food Rations & Mental Health Support',
    color: 0x8b5cf6,
    hex: '#8b5cf6',
    position: [3.8, 1.2, -1.2],
    status: 'Pantry Dispatched',
    activeCount: 84,
  },
  {
    id: 'gov',
    name: 'Government Oversight',
    role: 'Delivery Verification & SLA Audits',
    color: 0xf59e0b,
    hex: '#f59e0b',
    position: [0, -0.5, 2.2],
    status: '100% Audit Stamped',
    activeCount: 9,
  },
];

// Connected pairs representing assistance pathways
const CONNECTIONS: [number, number][] = [
  [0, 1], // Individual -> Outreach
  [1, 2], // Outreach -> Shelter
  [1, 3], // Outreach -> Hospital
  [1, 4], // Outreach -> NGO
  [2, 5], // Shelter -> Gov Verification
  [3, 5], // Hospital -> Gov Verification
  [4, 5], // NGO -> Gov Verification
  [5, 0], // Gov Verification -> Case Closed for Individual
];

export const NetworkScene: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(NODES_DATA[1]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 2, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    container.appendChild(renderer.domElement);

    // Node Meshes
    const nodeSpheres: { mesh: THREE.Mesh; data: NetworkNode; ring: THREE.Line }[] = [];
    const sphereGeo = new THREE.SphereGeometry(0.45, 24, 24);
    const ringGeo = new THREE.RingGeometry(0.55, 0.62, 32);

    NODES_DATA.forEach((node) => {
      const mat = new THREE.MeshBasicMaterial({
        color: node.color,
        wireframe: false,
      });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(...node.position);
      mesh.userData = node;

      // Glow halo ring
      const ringMat = new THREE.MeshBasicMaterial({
        color: node.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(...node.position);
      scene.add(ring);

      scene.add(mesh);
      nodeSpheres.push({ mesh, data: node, ring: ring as any });
    });

    // Connection lines and animated packets
    const linesGroup = new THREE.Group();
    scene.add(linesGroup);

    interface Packet {
      start: THREE.Vector3;
      end: THREE.Vector3;
      progress: number;
      speed: number;
      color: number;
    }
    const packets: Packet[] = [];

    CONNECTIONS.forEach(([startIdx, endIdx]) => {
      const p1 = new THREE.Vector3(...NODES_DATA[startIdx].position);
      const p2 = new THREE.Vector3(...NODES_DATA[endIdx].position);

      const points = [p1, p2];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.25,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      linesGroup.add(line);

      // Packet
      packets.push({
        start: p1,
        end: p2,
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.006,
        color: NODES_DATA[startIdx].color,
      });
    });

    // Packet Particle Geometry
    const packetGeo = new THREE.SphereGeometry(0.09, 8, 8);
    const packetMeshes: THREE.Mesh[] = packets.map((pkt) => {
      const mat = new THREE.MeshBasicMaterial({ color: pkt.color });
      const mesh = new THREE.Mesh(packetGeo, mat);
      scene.add(mesh);
      return mesh;
    });

    // Mouse Parallax & Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = nx * 0.4;
      targetY = ny * 0.3;

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
        setSelectedNode(hit.userData as NetworkNode);
        container.style.cursor = 'pointer';
      } else {
        container.style.cursor = 'default';
      }
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Smooth camera motion
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      camera.position.x = Math.sin(elapsed * 0.15) * 1.5 + mouseX * 2;
      camera.position.y = 2 + mouseY * 1.5;
      camera.position.z = 9.5 + Math.cos(elapsed * 0.1) * 0.8;
      camera.lookAt(0, 0, 0);

      // Rotate node rings
      nodeSpheres.forEach(({ ring, mesh }, idx) => {
        ring.rotation.z += 0.02 * (idx % 2 === 0 ? 1 : -1);
        mesh.rotation.y += 0.01;
      });

      // Animate packets along lines
      packets.forEach((pkt, i) => {
        pkt.progress += pkt.speed;
        if (pkt.progress > 1) pkt.progress = 0;

        const currentPos = new THREE.Vector3().lerpVectors(pkt.start, pkt.end, pkt.progress);
        packetMeshes[i].position.copy(currentPos);
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);

      sphereGeo.dispose();
      ringGeo.dispose();
      packetGeo.dispose();

      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-[520px] rounded-3xl overflow-hidden glass-card ${className}`}>
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Node Inspector Overlay */}
      {selectedNode && (
        <div className="absolute top-6 left-6 z-20 max-w-sm glass-elevated p-5 rounded-2xl border border-white/10 shadow-glass transition-all duration-300">
          <div className="flex items-center space-x-3 mb-2">
            <span
              className="w-3.5 h-3.5 rounded-full animate-ping"
              style={{ backgroundColor: selectedNode.hex }}
            />
            <span
              className="w-3.5 h-3.5 rounded-full -ml-3.5"
              style={{ backgroundColor: selectedNode.hex }}
            />
            <h4 className="text-white font-bold text-base tracking-tight">{selectedNode.name}</h4>
          </div>
          <p className="text-xs text-slate-400 font-mono mb-3">{selectedNode.role}</p>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
            <div>
              <span className="text-slate-500 block uppercase tracking-wider text-[10px]">
                Network Status
              </span>
              <span className="text-cyan-400 font-semibold">{selectedNode.status}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase tracking-wider text-[10px]">
                Verified Nodes
              </span>
              <span className="text-white font-mono font-bold">{selectedNode.activeCount} Live</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Hint */}
      <div className="absolute bottom-4 right-6 z-20 pointer-events-none text-right">
        <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">
          INTERACTIVE PROTOCOL GRAPH • MOVE CURSOR TO INSPECT NODES
        </span>
      </div>
    </div>
  );
};

export default NetworkScene;
