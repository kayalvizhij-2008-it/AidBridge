'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const STAGES = [
  { step: '01', name: 'Intake & Registration', desc: 'Minimal consent-driven street registration with zero documentation barrier.', color: 0x35a99a, hex: '#35A99A', pos: [-5, 1.2, 0] },
  { step: '02', name: 'Needs Assessment', desc: 'Diagnostic evaluation of urgency, clinical safety, shelter, and caloric deficit.', color: 0x176b67, hex: '#176B67', pos: [-3, -1.0, 0.5] },
  { step: '03', name: 'Capacity Referral', desc: 'Live capacity matching to verified shelters, emergency wards, and food banks.', color: 0xd8b77a, hex: '#D8B77A', pos: [-1, 1.5, -0.4] },
  { step: '04', name: 'Service Delivery', desc: 'Tangible aid handover recorded with mandatory physical intake evidence notes.', color: 0x35a99a, hex: '#35A99A', pos: [1, -1.2, 0.4] },
  { step: '05', name: 'Dual-Key Verification', desc: 'Independent case manager review and certification. No closure without proof.', color: 0xd8b77a, hex: '#D8B77A', pos: [3, 1.3, -0.2] },
  { step: '06', name: 'Follow-Up Touchpoint', desc: 'Structured 14-day and 30-day monitoring to guarantee long-term stability.', color: 0x21845a, hex: '#21845A', pos: [5, -0.8, 0] },
];

export function Journey3D({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(STAGES[0]);

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

    // 1. Spline Curve connecting the stages
    const curvePoints = STAGES.map((s) => new THREE.Vector3(...(s.pos as [number, number, number])));
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeo = new THREE.TubeGeometry(curve, 100, 0.05, 12, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0x176b67,
      transparent: true,
      opacity: 0.4,
    });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(tube);

    // 2. Stage Waypoint Spheres
    const waypointMeshes: THREE.Mesh[] = [];
    const sphereGeo = new THREE.SphereGeometry(0.32, 24, 24);
    const ringGeo = new THREE.RingGeometry(0.42, 0.48, 32);

    STAGES.forEach((stage, idx) => {
      const mat = new THREE.MeshBasicMaterial({ color: stage.color });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(...(stage.pos as [number, number, number]));
      mesh.userData = stage;
      scene.add(mesh);
      waypointMeshes.push(mesh);

      // Rotating ring halo
      const rMat = new THREE.MeshBasicMaterial({
        color: stage.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65,
      });
      const ring = new THREE.Mesh(ringGeo, rMat);
      ring.position.copy(mesh.position);
      scene.add(ring);
    });

    // 3. Traveling Light Pulse along the Curve
    const pulseGeo = new THREE.SphereGeometry(0.16, 16, 16);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: 0xd8b77a,
    });
    const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
    scene.add(pulseMesh);

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
      const hits = raycaster.intersectObjects(waypointMeshes);
      if (hits.length > 0) {
        container.style.cursor = 'pointer';
        setActiveStage(hits[0].object.userData as any);
      } else {
        container.style.cursor = 'default';
      }
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animId: number;
    let progress = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth camera parallax
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      camera.position.x = mouseX * 1.5;
      camera.position.y = mouseY * 1.0;
      camera.lookAt(0, 0, 0);

      // Advance pulse along curve
      progress += 0.0035;
      if (progress > 1) progress = 0;
      const pt = curve.getPointAt(progress);
      pulseMesh.position.copy(pt);

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
    <div className={`relative w-full h-[400px] lg:h-[460px] rounded-3xl overflow-hidden bg-[#101D32] border border-[#E4E8E5]/20 shadow-xl ${className}`}>
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Floating Active Stage Badge */}
      <div className="absolute top-6 left-6 z-20 max-w-sm bg-[#101D32]/95 backdrop-blur-md p-4 rounded-2xl border border-white/15 shadow-xl transition-all">
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="flex items-center justify-center h-6 w-6 rounded-lg bg-[#176B67] text-white text-xs font-mono font-bold">
            {activeStage.step}
          </span>
          <h4 className="text-white font-bold text-sm tracking-tight">{activeStage.name}</h4>
        </div>
        <p className="text-xs text-[#F5F3EC]/80 leading-relaxed">{activeStage.desc}</p>
      </div>

      <div className="absolute bottom-4 right-6 z-20 pointer-events-none text-right hidden sm:block">
        <span className="text-[10px] font-mono text-[#D8B77A] uppercase tracking-widest">
          3D LIFECYCLE TRAJECTORY • MOVE CURSOR TO INSPECT STAGES
        </span>
      </div>
    </div>
  );
}

export default Journey3D;
