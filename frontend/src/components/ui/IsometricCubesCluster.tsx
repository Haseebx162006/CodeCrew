import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const IsometricCubesCluster: React.FC = () => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 30;
    const y = (e.clientY - rect.top - rect.height / 2) / 30;
    setMouseOffset({ x, y });
  };

  return (
    <div className="relative w-full max-w-[560px] aspect-square flex items-center justify-center select-none pointer-events-auto overflow-visible">
      <svg
        viewBox="0 0 600 600"
        className="w-full h-full overflow-visible transition-transform duration-300 ease-out"
        style={{
          transform: `perspective(1000px) rotateX(${-mouseOffset.y}deg) rotateY(${mouseOffset.x}deg)`,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMouseOffset({ x: 0, y: 0 })}
      >
        <defs>
          {/* Subtle soft shadows */}
          <filter id="soft-cube-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#334155" floodOpacity="0.16" />
          </filter>

          {/* Depth of field blur on background cubes */}
          <filter id="dof-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>

          {/* Shading Gradients matching the Dribbble reference */}
          <linearGradient id="facet-obsidian" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <linearGradient id="facet-white-top" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F8FAFC" />
          </linearGradient>

          <linearGradient id="facet-slate-blue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6C84A3" />
            <stop offset="100%" stopColor="#536C8D" />
          </linearGradient>

          <linearGradient id="facet-periwinkle-light" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#96ACCA" />
            <stop offset="100%" stopColor="#7E96B5" />
          </linearGradient>

          <linearGradient id="facet-ice-white" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
        </defs>

        {/* ── Solid Vertical Black Axis Bar (Intersecting the Composition) ── */}
        <line x1="380" y1="-40" x2="380" y2="640" stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" />

        {/* ── Concentric Vector Orbit Rings (Thin geometric guide lines) ── */}
        <g opacity="0.4">
          <circle cx="310" cy="300" r="160" fill="none" stroke="#64748B" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="310" cy="300" r="220" fill="none" stroke="#64748B" strokeWidth="1" />
          <circle cx="310" cy="300" r="280" fill="none" stroke="#64748B" strokeWidth="1" strokeDasharray="6 6" />
          
          {/* Orbital vector dots */}
          <circle cx="90" cy="300" r="3" fill="#64748B" />
          <circle cx="490" cy="200" r="2.5" fill="#0F172A" />
          <circle cx="210" cy="480" r="2" fill="#6C84A3" />
        </g>

        {/* ── Background Blurred Depth Cube ── */}
        <g filter="url(#dof-blur)" opacity="0.35">
          <polygon points="450,330 490,307 450,284 410,307" fill="#96ACCA" />
          <polygon points="410,307 450,330 450,376 410,353" fill="#6C84A3" />
          <polygon points="450,330 490,307 490,353 450,376" fill="#E2E8F0" />
        </g>

        {/* ── Top Floating Cube with Icons (Positioned on top of the vertical axis) ── */}
        <g className="animate-cube-float-1" filter="url(#soft-cube-shadow)">
          <g transform="translate(325, 40)">
            {/* Top face */}
            <polygon points="42,0 84,24 42,48 0,24" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            {/* Left face */}
            <polygon points="0,24 42,48 42,96 0,72" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            {/* Right face */}
            <polygon points="42,48 84,24 84,72 42,96" fill="#EDF2F7" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            
            {/* Sparkle/Star on top face */}
            <g transform="translate(42, 24)">
              <line x1="0" y1="-8" x2="0" y2="8" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="-8" y1="0" x2="8" y2="0" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="0" cy="0" r="2" fill="#0F172A" />
            </g>

            {/* Code bracket </ > on left face */}
            <g transform="translate(20, 58)">
              <path d="M -4,-4 L -8,0 L -4,4" fill="none" stroke="#0F172A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 4,-4 L 8,0 L 4,4" fill="none" stroke="#0F172A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="2" y1="-6" x2="-2" y2="6" stroke="#0F172A" strokeWidth="1.6" strokeLinecap="round" />
            </g>
            
            {/* Database cylinder on right face */}
            <g transform="translate(62, 58)">
              <ellipse cx="0" cy="-6" rx="8" ry="3.5" fill="none" stroke="#0F172A" strokeWidth="1.6" />
              <path d="M -8,-6 v 6 c 0,2 3.6,3.5 8,3.5 s 8,-1.5 8,-3.5 v -6" fill="none" stroke="#0F172A" strokeWidth="1.6" />
              <path d="M -8,0 v 6 c 0,2 3.6,3.5 8,3.5 s 8,-1.5 8,-3.5 v -6" fill="none" stroke="#0F172A" strokeWidth="1.6" />
            </g>
          </g>
        </g>

        {/* ── Main Isometric Cluster (Precision Interlocking 3D Cubes) ── */}
        <g filter="url(#soft-cube-shadow)" transform="translate(10, 10)">
          {/* CUBE A (Top Back Obsidian Cube) */}
          <g transform="translate(338, 177)">
            <polygon points="42,0 84,24 42,48 0,24" fill="url(#facet-obsidian)" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            <polygon points="0,24 42,48 42,96 0,72" fill="url(#facet-slate-blue)" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            <polygon points="42,48 84,24 84,72 42,96" fill="url(#facet-periwinkle-light)" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            {/* Network node link on top face */}
            <g transform="translate(42, 24)">
              <circle cx="-12" cy="-6" r="2.5" fill="#FFFFFF" />
              <circle cx="12" cy="6" r="2.5" fill="#FFFFFF" />
              <line x1="-10" y1="-5" x2="10" y2="5" stroke="#FFFFFF" strokeWidth="1.5" />
            </g>
          </g>

          {/* CUBE B (Top Left Obsidian Cube) */}
          <g transform="translate(296, 201)">
            <polygon points="42,0 84,24 42,48 0,24" fill="url(#facet-obsidian)" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            <polygon points="0,24 42,48 42,96 0,72" fill="#1E293B" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            <polygon points="42,48 84,24 84,72 42,96" fill="url(#facet-slate-blue)" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
          </g>

          {/* CUBE C (Center White Cube with Document/Lines icon) */}
          <g transform="translate(338, 225)">
            <polygon points="42,0 84,24 42,48 0,24" fill="url(#facet-white-top)" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            <polygon points="0,24 42,48 42,96 0,72" fill="url(#facet-slate-blue)" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            <polygon points="42,48 84,24 84,72 42,96" fill="url(#facet-ice-white)" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            {/* Document icon on right face */}
            <g transform="translate(63, 68)">
              <rect x="-6" y="-7" width="12" height="14" rx="1.5" fill="none" stroke="#0F172A" strokeWidth="1.5" />
              <line x1="-3" y1="-3" x2="3" y2="-3" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="-3" y1="1" x2="3" y2="1" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="-3" y1="5" x2="1" y2="5" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </g>

          {/* CUBE D (Mid Left White Cube with Lightbulb/Idea icon) */}
          <g transform="translate(254, 225)">
            <polygon points="42,0 84,24 42,48 0,24" fill="url(#facet-white-top)" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            <polygon points="0,24 42,48 42,96 0,72" fill="url(#facet-slate-blue)" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            <polygon points="42,48 84,24 84,72 42,96" fill="url(#facet-periwinkle-light)" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            {/* Idea lightbulb icon on left face */}
            <g transform="translate(21, 68)">
              <circle cx="0" cy="-3" r="4.5" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
              <line x1="-2.5" y1="3" x2="2.5" y2="3" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="-1.5" y1="5.5" x2="1.5" y2="5.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </g>

          {/* CUBE E (Mid Right Periwinkle Cube with Link Node icon) */}
          <g transform="translate(380, 249)">
            <polygon points="42,0 84,24 42,48 0,24" fill="url(#facet-periwinkle-light)" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            <polygon points="0,24 42,48 42,96 0,72" fill="url(#facet-slate-blue)" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            <polygon points="42,48 84,24 84,72 42,96" fill="#F1F5F9" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            {/* Connected node bar on top face */}
            <g transform="translate(42, 24)">
              <circle cx="-12" cy="-5" r="2.5" fill="#0F172A" />
              <circle cx="12" cy="5" r="2.5" fill="#0F172A" />
              <line x1="-10" y1="-4" x2="10" y2="4" stroke="#0F172A" strokeWidth="1.6" />
            </g>
          </g>

          {/* CUBE F (Front Center White Cube with Green Checkmark) */}
          <g transform="translate(296, 297)">
            <polygon points="42,0 84,24 42,48 0,24" fill="url(#facet-white-top)" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            <polygon points="0,24 42,48 42,96 0,72" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            <polygon points="42,48 84,24 84,72 42,96" fill="url(#facet-ice-white)" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            {/* Green checkmark icon on left face */}
            <path d="M 16,68 L 21,73 L 28,62" fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* CUBE G (Front Right Slate Accent Cube) */}
          <g transform="translate(338, 321)">
            <polygon points="42,0 84,24 42,48 0,24" fill="url(#facet-white-top)" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            <polygon points="0,24 42,48 42,96 0,72" fill="url(#facet-slate-blue)" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            <polygon points="42,48 84,24 84,72 42,96" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
          </g>
        </g>

        {/* ── Floating Lower Left Slate Cube with Zigzag Wave ── */}
        <g className="animate-cube-float-2" filter="url(#soft-cube-shadow)">
          <g transform="translate(230, 365)">
            <polygon points="35,0 70,20 35,40 0,20" fill="#6C84A3" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            <polygon points="0,20 35,40 35,80 0,60" fill="#536C8D" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            <polygon points="35,40 70,20 70,60 35,80" fill="#96ACCA" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            
            {/* White Zigzag Telemetry Wave on Left Face */}
            <path d="M 6,48 L 13,38 L 21,54 L 29,42" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>

        {/* ── Floating Far Right Dark Obsidian Cube ── */}
        <g className="animate-cube-float-1" filter="url(#soft-cube-shadow)">
          <g transform="translate(440, 225)">
            <polygon points="26,0 52,15 26,30 0,15" fill="#1E293B" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            <polygon points="0,15 26,30 26,60 0,45" fill="#0F172A" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            <polygon points="26,30 52,15 52,45 26,60" fill="#6C84A3" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            
            {/* 2 White Alignment Dots on Left Face */}
            <circle cx="13" cy="36" r="2" fill="#FFFFFF" />
            <circle cx="13" cy="44" r="2" fill="#FFFFFF" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default IsometricCubesCluster;
