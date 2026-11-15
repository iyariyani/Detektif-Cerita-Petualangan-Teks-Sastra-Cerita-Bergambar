import React from 'react';

interface StoryPanelIllustrationProps {
  sceneKey: string;
  className?: string;
}

const Person: React.FC<{
  x: number;
  y: number;
  shirt: string;
  pants?: string;
  hair?: string;
  skin?: string;
  mood?: 'happy' | 'sad' | 'worried' | 'angry' | 'calm';
  hijab?: string;
  scale?: number;
}> = ({
  x,
  y,
  shirt,
  pants = '#B91C1C',
  hair = '#1E293B',
  skin = '#F4C7A1',
  mood = 'happy',
  hijab,
  scale = 1,
}) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    {/* Legs */}
    <rect x="-8" y="34" width="6" height="16" rx="2" fill={skin} />
    <rect x="2" y="34" width="6" height="16" rx="2" fill={skin} />
    <rect x="-9" y="48" width="8" height="5" rx="2" fill="#1E293B" />
    <rect x="1" y="48" width="8" height="5" rx="2" fill="#1E293B" />
    {/* Skirt or Shorts */}
    <rect x="-11" y="22" width="22" height="15" rx="3" fill={pants} />
    {/* Torso */}
    <rect x="-12" y="2" width="24" height="22" rx="6" fill={shirt} />
    {/* Necktie for SD uniform */}
    {shirt === '#FFFFFF' && <polygon points="-2,4 2,4 3,16 0,20 -3,16" fill="#DC2626" />}
    {/* Arms */}
    <rect x="-17" y="4" width="6" height="16" rx="3" fill={shirt} />
    <rect x="11" y="4" width="6" height="16" rx="3" fill={shirt} />
    {/* Head */}
    {hijab && <circle cx="0" cy="-12" r="15" fill={hijab} />}
    <circle cx="0" cy="-12" r="12" fill={skin} />
    {!hijab && <path d="M-12,-14 C-12,-26 12,-26 12,-14 C8,-20 -8,-20 -12,-14 Z" fill={hair} />}
    {hijab && <path d="M-12,-4 Q0,8 12,-4 L14,12 Q0,16 -14,12 Z" fill={hijab} />}
    {/* Eyes */}
    <circle cx="-4" cy="-13" r="1.6" fill="#0F172A" />
    <circle cx="4" cy="-13" r="1.6" fill="#0F172A" />
    {/* Eyebrows / Mood */}
    {mood === 'angry' && (
      <>
        <line x1="-7" y1="-18" x2="-2" y2="-16" stroke="#0F172A" strokeWidth="1.6" />
        <line x1="7" y1="-18" x2="2" y2="-16" stroke="#0F172A" strokeWidth="1.6" />
      </>
    )}
    {mood === 'worried' || mood === 'sad' ? (
      <path d="M-4,-6 Q0,-9 4,-6" fill="none" stroke="#7C2D12" strokeWidth="1.5" strokeLinecap="round" />
    ) : mood === 'angry' ? (
      <path d="M-4,-6 Q0,-8 4,-6" fill="none" stroke="#7C2D12" strokeWidth="1.6" strokeLinecap="round" />
    ) : mood === 'calm' ? (
      <line x1="-3" y1="-7" x2="3" y2="-7" stroke="#7C2D12" strokeWidth="1.5" strokeLinecap="round" />
    ) : (
      <path d="M-4,-8 Q0,-4 4,-8" fill="none" stroke="#7C2D12" strokeWidth="1.6" strokeLinecap="round" />
    )}
  </g>
);

export const StoryPanelIllustration: React.FC<StoryPanelIllustrationProps> = ({
  sceneKey,
  className = '',
}) => {
  const renderScene = () => {
    switch (sceneKey) {
      // CERITA 1: Rahasia Bekal di Bangku Taman
      case 'c1-p1':
        return (
          <>
            <rect width="320" height="200" fill="#E0F2FE" />
            <circle cx="275" cy="34" r="18" fill="#FDE047" />
            <rect x="0" y="138" width="320" height="62" fill="#86EFAC" />
            {/* School wall & clock 09:30 */}
            <rect x="18" y="28" width="90" height="110" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
            <circle cx="63" cy="58" r="18" fill="#FFFFFF" stroke="#334155" strokeWidth="2" />
            <line x1="63" y1="58" x2="53" y2="52" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="63" y1="58" x2="63" y2="71" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" />
            <text x="63" y="88" fontSize="9" textAnchor="middle" fill="#78350F" fontWeight="700">09:30</text>
            {/* Garden Bench & Blue Lunch Bag with star */}
            <rect x="155" y="118" width="110" height="12" rx="2" fill="#B45309" />
            <rect x="165" y="130" width="8" height="22" fill="#78350F" />
            <rect x="247" y="130" width="8" height="22" fill="#78350F" />
            <rect x="225" y="99" width="24" height="19" rx="4" fill="#0284C7" />
            <polygon points="237,103 239,107 243,107 240,110 241,114 237,111 233,114 234,110 231,107 235,107" fill="#FDE047" />
            <Person x={182} y={102} shirt="#FFFFFF" mood="happy" />
            <rect x="172" y="106" width="16" height="11" rx="1" fill="#F8FAFC" stroke="#64748B" />
          </>
        );
      case 'c1-p2':
        return (
          <>
            <rect width="320" height="200" fill="#E0F2FE" />
            <rect x="0" y="138" width="320" height="62" fill="#86EFAC" />
            {/* Bench with plain blue bag without star */}
            <rect x="120" y="118" width="130" height="12" rx="2" fill="#B45309" />
            <rect x="132" y="130" width="8" height="22" fill="#78350F" />
            <rect x="230" y="130" width="8" height="22" fill="#78350F" />
            <rect x="215" y="100" width="22" height="18" rx="4" fill="#38BDF8" stroke="#0369A1" strokeWidth="1.2" />
            <Person x={145} y={102} shirt="#FFFFFF" mood="worried" />
            <text x="168" y="76" fontSize="18" fill="#DC2626" fontWeight="700">?!</text>
            <Person x={275} y={95} shirt="#FFFFFF" scale={0.75} mood="calm" />
          </>
        );
      case 'c1-p3':
        return (
          <>
            <rect width="320" height="200" fill="#EFF6FF" />
            <rect x="0" y="140" width="320" height="60" fill="#86EFAC" />
            <rect x="130" y="120" width="110" height="12" rx="2" fill="#B45309" />
            <Person x={110} y={104} shirt="#FFFFFF" mood="angry" />
            <Person x={175} y={104} shirt="#FFFFFF" mood="calm" />
            {/* Speech emphasis */}
            <path d="M88,65 L128,65 L128,85 L112,85 L105,92 L104,85 L88,85 Z" fill="#FEE2E2" stroke="#EF4444" />
            <text x="108" y="78" fontSize="9" textAnchor="middle" fill="#991B1B" fontWeight="700">Hilang!</text>
            <path d="M168,62 L222,62 L222,84 L190,84 L182,91 L182,84 L168,84 Z" fill="#E0F2FE" stroke="#0284C7" />
            <text x="195" y="76" fontSize="9" textAnchor="middle" fill="#075985" fontWeight="700">Cek dulu</text>
          </>
        );
      case 'c1-p4':
        return (
          <>
            <rect width="320" height="200" fill="#F0FDF4" />
            <rect x="0" y="140" width="320" height="60" fill="#BBF7D0" />
            {/* Mini library shelf */}
            <rect x="210" y="55" width="76" height="90" rx="3" fill="#D97706" />
            <rect x="218" y="65" width="60" height="28" fill="#FEF3C7" />
            <rect x="218" y="102" width="60" height="32" fill="#FEF3C7" />
            <rect x="224" y="71" width="9" height="22" fill="#0284C7" />
            <rect x="236" y="73" width="9" height="20" fill="#DC2626" />
            <rect x="248" y="70" width="9" height="23" fill="#059669" />
            {/* Magnifying glass inspecting label */}
            <rect x="115" y="114" width="34" height="26" rx="4" fill="#38BDF8" />
            <rect x="122" y="122" width="20" height="10" fill="#FFFFFF" />
            <text x="132" y="130" fontSize="6" textAnchor="middle" fill="#0F172A" fontWeight="700">Siti 6B</text>
            <circle cx="132" cy="126" r="18" fill="none" stroke="#D97706" strokeWidth="3.5" />
            <line x1="145" y1="139" x2="160" y2="154" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
            <Person x={72} y={102} shirt="#FFFFFF" mood="calm" />
          </>
        );
      case 'c1-p5':
        return (
          <>
            <rect width="320" height="200" fill="#ECFDF5" />
            <rect x="0" y="140" width="320" height="60" fill="#86EFAC" />
            {/* Library shelf with blue star bag inside bottom shelf */}
            <rect x="200" y="55" width="84" height="92" rx="3" fill="#B45309" />
            <rect x="210" y="65" width="64" height="30" fill="#FEF3C7" />
            <rect x="210" y="104" width="64" height="34" fill="#FEF3C7" />
            <rect x="228" y="113" width="28" height="22" rx="4" fill="#0284C7" />
            <polygon points="242,117 244,121 248,121 245,124 246,128 242,125 238,128 239,124 236,121 240,121" fill="#FDE047" />
            <Person x={95} y={102} shirt="#FFFFFF" mood="happy" />
            <Person x={150} y={102} shirt="#FFFFFF" hijab="#F8FAFC" mood="happy" />
          </>
        );
      case 'c1-p6':
        return (
          <>
            <rect width="320" height="200" fill="#FEFCE8" />
            <circle cx="270" cy="36" r="18" fill="#FDE047" />
            <rect x="0" y="140" width="320" height="60" fill="#86EFAC" />
            <rect x="85" y="122" width="150" height="12" rx="2" fill="#B45309" />
            <Person x={125} y={102} shirt="#FFFFFF" mood="happy" />
            <Person x={195} y={102} shirt="#FFFFFF" mood="happy" />
            <rect x="150" y="109" width="20" height="13" rx="2" fill="#F97316" />
          </>
        );

      // CERITA 2: Misteri Bibit Cabai di Kebun Kelas
      case 'c2-p1':
        return (
          <>
            <rect width="320" height="200" fill="#E0F2FE" />
            <circle cx="52" cy="36" r="18" fill="#FDE047" />
            <rect x="0" y="142" width="320" height="58" fill="#4ADE80" />
            {/* 3 intact chili pots */}
            {[115, 175, 235].map((px, i) => (
              <g key={i} transform={`translate(${px}, 115)`}>
                <polygon points="-14,0 14,0 10,28 -10,28" fill="#EA580C" />
                <line x1="0" y1="0" x2="0" y2="-28" stroke="#15803D" strokeWidth="3" />
                <ellipse cx="-8" cy="-16" rx="7" ry="4" fill="#16A34A" />
                <ellipse cx="8" cy="-22" rx="7" ry="4" fill="#16A34A" />
                <circle cx="-4" cy="-10" r="3" fill="#DC2626" />
              </g>
            ))}
            <Person x={65} y={104} shirt="#FFFFFF" hijab="#FFFFFF" mood="happy" />
            {/* Green watering can */}
            <rect x="78" y="108" width="16" height="12" rx="2" fill="#16A34A" />
            <line x1="94" y1="112" x2="104" y2="105" stroke="#16A34A" strokeWidth="3" />
          </>
        );
      case 'c2-p2':
        return (
          <>
            <rect width="320" height="200" fill="#E0F2FE" />
            <rect x="0" y="142" width="320" height="58" fill="#4ADE80" />
            {/* Intact pots 1 & 2, falling pot 3 */}
            {[175, 220].map((px, i) => (
              <g key={i} transform={`translate(${px}, 115)`}>
                <polygon points="-12,0 12,0 9,26 -9,26" fill="#EA580C" />
                <line x1="0" y1="0" x2="0" y2="-24" stroke="#15803D" strokeWidth="3" />
              </g>
            ))}
            <g transform="translate(268, 128) rotate(68)">
              <polygon points="-12,0 12,0 9,26 -9,26" fill="#EA580C" />
              <line x1="0" y1="0" x2="0" y2="-24" stroke="#15803D" strokeWidth="3" />
            </g>
            <circle cx="290" cy="128" r="12" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
            <Person x={115} y={102} shirt="#FFFFFF" mood="worried" />
            <line x1="65" y1="115" x2="90" y2="115" stroke="#64748B" strokeWidth="2" strokeDasharray="4 3" />
          </>
        );
      case 'c2-p3':
        return (
          <>
            <rect width="320" height="200" fill="#F1F5F9" />
            <rect x="0" y="142" width="320" height="58" fill="#86EFAC" />
            {/* Mango tree hiding Bagas */}
            <rect x="255" y="75" width="18" height="75" fill="#78350F" />
            <circle cx="264" cy="58" r="38" fill="#16A34A" />
            <Person x={242} y={108} shirt="#FFFFFF" mood="worried" scale={0.85} />
            {/* Broken pot & soil */}
            <ellipse cx="165" cy="148" rx="34" ry="8" fill="#78350F" />
            <polygon points="150,132 174,142 168,150 144,140" fill="#C2410C" />
            <Person x={95} y={104} shirt="#FFFFFF" hijab="#FFFFFF" mood="sad" />
          </>
        );
      case 'c2-p4':
        return (
          <>
            <rect width="320" height="200" fill="#EFF6FF" />
            <rect x="0" y="142" width="320" height="58" fill="#86EFAC" />
            <Person x={90} y={104} shirt="#FFFFFF" hijab="#FFFFFF" mood="calm" />
            <Person x={155} y={104} shirt="#FFFFFF" mood="worried" />
            {/* Bu Dewi */}
            <Person x={235} y={96} shirt="#0284C7" pants="#1E3A8A" hijab="#FDE68A" mood="calm" scale={1.12} />
            <path d="M128,64 L188,64 L188,84 L164,84 L156,92 L156,84 L128,84 Z" fill="#FEF3C7" stroke="#D97706" />
            <text x="158" y="77" fontSize="8" textAnchor="middle" fill="#92400E" fontWeight="700">Maaf, aku jujur</text>
          </>
        );
      case 'c2-p5':
        return (
          <>
            <rect width="320" height="200" fill="#ECFDF5" />
            <rect x="0" y="142" width="320" height="58" fill="#4ADE80" />
            <Person x={95} y={104} shirt="#FFFFFF" hijab="#FFFFFF" mood="happy" />
            <Person x={225} y={104} shirt="#FFFFFF" mood="happy" />
            {/* Replanting pot with bamboo stake */}
            <g transform="translate(160, 118)">
              <polygon points="-18,0 18,0 13,30 -13,30" fill="#EA580C" />
              <line x1="-6" y1="4" x2="-6" y2="-38" stroke="#CA8A04" strokeWidth="4" />
              <line x1="2" y1="0" x2="2" y2="-30" stroke="#15803D" strokeWidth="3" />
              <ellipse cx="9" cy="-18" rx="7" ry="4" fill="#16A34A" />
            </g>
          </>
        );
      case 'c2-p6':
        return (
          <>
            <rect width="320" height="200" fill="#FEFCE8" />
            <circle cx="275" cy="34" r="18" fill="#FDE047" />
            <rect x="0" y="142" width="320" height="58" fill="#4ADE80" />
            {[140, 185, 230].map((px, i) => (
              <g key={i} transform={`translate(${px}, 115)`}>
                <polygon points="-13,0 13,0 10,27 -10,27" fill="#EA580C" />
                <line x1="-4" y1="0" x2="-4" y2="-30" stroke="#CA8A04" strokeWidth="2.5" />
                <line x1="2" y1="0" x2="2" y2="-28" stroke="#15803D" strokeWidth="3" />
                <circle cx="5" cy="-14" r="3" fill="#DC2626" />
              </g>
            ))}
            <Person x={60} y={96} shirt="#0284C7" pants="#1E3A8A" hijab="#FDE68A" mood="happy" scale={1.1} />
            <Person x={102} y={104} shirt="#FFFFFF" hijab="#FFFFFF" mood="happy" />
            <Person x={274} y={104} shirt="#FFFFFF" mood="happy" />
          </>
        );

      // CERITA 3: Lentera Hujan di Pos Ronda
      case 'c3-p1':
        return (
          <>
            <rect width="320" height="200" fill="#CBD5E1" />
            {/* Dusk cloudy sky */}
            <ellipse cx="90" cy="40" rx="45" ry="18" fill="#64748B" />
            <ellipse cx="220" cy="35" rx="55" ry="20" fill="#475569" />
            <rect x="0" y="142" width="320" height="58" fill="#94A3B8" />
            {/* House porch & clock 17:45 */}
            <rect x="20" y="55" width="130" height="90" fill="#FEF3C7" stroke="#78350F" strokeWidth="2" />
            <text x="50" y="75" fontSize="9" fill="#475569" fontWeight="700">17:45</text>
            <Person x={105} y={104} shirt="#38BDF8" pants="#1E293B" mood="calm" />
            {/* Gamepad */}
            <rect x="115" y="110" width="16" height="9" rx="3" fill="#0F172A" />
            {/* Dad holding yellow raincoat & lantern */}
            <Person x={200} y={95} shirt="#0F766E" pants="#334155" mood="calm" scale={1.15} />
            <rect x="166" y="102" width="14" height="20" rx="2" fill="#FACC15" />
            <rect x="220" y="114" width="12" height="16" rx="2" fill="#F59E0B" />
          </>
        );
      case 'c3-p2':
        return (
          <>
            <rect width="320" height="200" fill="#1E293B" />
            {/* Heavy rain lines */}
            {[30, 70, 110, 150, 190, 230, 270, 300].map((rx, i) => (
              <line key={i} x1={rx} y1="10" x2={rx - 14} y2="120" stroke="#94A3B8" strokeWidth="1.4" strokeDasharray="6 6" />
            ))}
            {/* Streetlamp OFF */}
            <rect x="260" y="35" width="6" height="115" fill="#475569" />
            <circle cx="255" cy="38" r="7" fill="#334155" />
            {/* Flooded path near small bridge */}
            <rect x="0" y="140" width="320" height="60" fill="#334155" />
            <path d="M0,156 Q80,148 160,158 T320,156 L320,200 L0,200 Z" fill="#0284C7" opacity="0.7" />
            {/* Dimas in yellow raincoat with glowing lantern */}
            <Person x={115} y={102} shirt="#FACC15" pants="#1E293B" mood="worried" />
            <circle cx="138" cy="118" r="22" fill="#FDE047" opacity="0.28" />
            <rect x="132" y="110" width="12" height="16" rx="2" fill="#F59E0B" />
          </>
        );
      case 'c3-p3':
        return (
          <>
            <rect width="320" height="200" fill="#0F172A" />
            {[40, 95, 165, 225, 285].map((rx, i) => (
              <line key={i} x1={rx} y1="12" x2={rx - 12} y2="130" stroke="#64748B" strokeWidth="1.3" strokeDasharray="5 6" />
            ))}
            <rect x="0" y="142" width="320" height="58" fill="#1E293B" />
            <ellipse cx="155" cy="166" rx="26" ry="7" fill="#64748B" />
            <Person x={145} y={105} shirt="#FACC15" pants="#1E293B" mood="worried" />
            {/* Glowing lantern & ankle pain spark */}
            <circle cx="170" cy="115" r="28" fill="#FBBF24" opacity="0.32" />
            <rect x="164" y="107" width="12" height="16" rx="2" fill="#F59E0B" />
            <text x="120" y="152" fontSize="11" fill="#F87171" fontWeight="700">Aduh!</text>
          </>
        );
      case 'c3-p4':
        return (
          <>
            <rect width="320" height="200" fill="#0F172A" />
            <rect x="0" y="144" width="320" height="56" fill="#0369A1" opacity="0.75" />
            {/* Small wooden bridge */}
            <path d="M135,146 Q190,130 245,146" fill="none" stroke="#92400E" strokeWidth="10" />
            <line x1="145" y1="142" x2="145" y2="128" stroke="#78350F" strokeWidth="4" />
            <line x1="235" y1="142" x2="235" y2="128" stroke="#78350F" strokeWidth="4" />
            {/* Bamboo tree */}
            <line x1="45" y1="20" x2="45" y2="150" stroke="#15803D" strokeWidth="6" />
            <line x1="56" y1="25" x2="56" y2="150" stroke="#16A34A" strokeWidth="5" />
            {/* Nenek Sari with cane & dead flashlight */}
            <Person x={95} y={102} shirt="#7C2D12" pants="#92400E" hair="#E2E8F0" mood="worried" />
            <line x1="76" y1="115" x2="72" y2="154" stroke="#B45309" strokeWidth="3.5" />
            <rect x="110" y="114" width="12" height="6" rx="1" fill="#475569" />
            {/* Dimas approaching with lantern light */}
            <Person x={265} y={102} shirt="#FACC15" pants="#1E293B" mood="calm" />
            <circle cx="242" cy="116" r="26" fill="#FDE047" opacity="0.3" />
          </>
        );
      case 'c3-p5':
        return (
          <>
            <rect width="320" height="200" fill="#1E293B" />
            <rect x="0" y="144" width="320" height="56" fill="#0284C7" opacity="0.65" />
            <path d="M80,148 Q160,128 240,148" fill="none" stroke="#B45309" strokeWidth="12" />
            {/* Umbrella & Bright Lantern */}
            <path d="M118,74 Q162,40 206,74 Z" fill="#10B981" />
            <line x1="162" y1="74" x2="162" y2="112" stroke="#0F172A" strokeWidth="2.5" />
            <Person x={142} y={100} shirt="#FACC15" pants="#1E293B" mood="happy" />
            <Person x={182} y={100} shirt="#7C2D12" pants="#92400E" hair="#E2E8F0" mood="calm" />
            <circle cx="118" cy="110" r="34" fill="#FDE047" opacity="0.35" />
            <rect x="112" y="102" width="12" height="16" rx="2" fill="#F59E0B" />
          </>
        );
      case 'c3-p6':
        return (
          <>
            <rect width="320" height="200" fill="#1E293B" />
            {/* Warm Pos Ronda wooden hut */}
            <rect x="50" y="55" width="220" height="105" rx="4" fill="#FEF3C7" stroke="#92400E" strokeWidth="3" />
            <polygon points="38,58 160,22 282,58" fill="#B45309" />
            <circle cx="160" cy="70" r="14" fill="#FDE047" opacity="0.7" />
            <text x="160" y="47" fontSize="9" textAnchor="middle" fill="#FEF3C7" fontWeight="700">POS RONDA MELATI</text>
            <Person x={100} y={104} shirt="#0F766E" pants="#334155" mood="happy" scale={1.1} />
            <Person x={158} y={106} shirt="#FACC15" pants="#1E293B" mood="happy" />
            <Person x={218} y={106} shirt="#7C2D12" pants="#92400E" hair="#E2E8F0" mood="happy" />
          </>
        );

      // CERITA 4: Payung Biru untuk Kiko
      case 'c4-p1':
        return (
          <>
            <rect width="320" height="200" fill="#CBD5E1" />
            {[45, 95, 145, 195, 255].map((rx, i) => (
              <line key={i} x1={rx} y1="15" x2={rx - 8} y2="115" stroke="#64748B" strokeWidth="1.5" strokeDasharray="5 5" />
            ))}
            <rect x="0" y="140" width="320" height="60" fill="#94A3B8" />
            <polygon points="70,65 250,65 235,45 85,45" fill="#B45309" />
            <rect x="85" y="65" width="8" height="80" fill="#78350F" />
            <rect x="227" y="65" width="8" height="80" fill="#78350F" />
            <text x="160" y="58" fontSize="8" textAnchor="middle" fill="#FEF3C7" fontWeight="700">HALTE SEKOLAH · 13:00</text>
            <Person x={135} y={102} shirt="#FFFFFF" hijab="#FFFFFF" mood="calm" />
            <Person x={185} y={102} shirt="#FFFFFF" mood="calm" />
          </>
        );
      case 'c4-p2':
        return (
          <>
            <rect width="320" height="200" fill="#CBD5E1" />
            <rect x="0" y="140" width="320" height="60" fill="#94A3B8" />
            <Person x={155} y={102} shirt="#FFFFFF" mood="worried" />
            <rect x="172" y="110" width="22" height="24" rx="4" fill="#16A34A" />
            <text x="184" y="96" fontSize="14" fill="#DC2626" fontWeight="700">?</text>
          </>
        );
      case 'c4-p3':
        return (
          <>
            <rect width="320" height="200" fill="#E0F2FE" />
            <rect x="0" y="140" width="320" height="60" fill="#94A3B8" />
            <path d="M85,78 Q135,38 185,78 Z" fill="#0284C7" />
            <line x1="135" y1="78" x2="135" y2="115" stroke="#0F172A" strokeWidth="2.5" />
            <Person x={120} y={102} shirt="#FFFFFF" hijab="#FFFFFF" mood="happy" />
            <Person x={190} y={102} shirt="#FFFFFF" mood="happy" />
          </>
        );
      case 'c4-p4':
        return (
          <>
            <rect width="320" height="200" fill="#E0F2FE" />
            {[45, 90, 230, 275].map((rx, i) => (
              <line key={i} x1={rx} y1="15" x2={rx - 8} y2="120" stroke="#64748B" strokeWidth="1.4" strokeDasharray="5 5" />
            ))}
            <rect x="0" y="140" width="320" height="60" fill="#CBD5E1" />
            <path d="M105,74 Q160,34 215,74 Z" fill="#0284C7" />
            <line x1="160" y1="74" x2="160" y2="112" stroke="#0F172A" strokeWidth="2.5" />
            <Person x={140} y={102} shirt="#FFFFFF" hijab="#FFFFFF" mood="happy" />
            <Person x={180} y={102} shirt="#FFFFFF" mood="happy" />
          </>
        );
      case 'c4-p5':
        return (
          <>
            <rect width="320" height="200" fill="#FEFCE8" />
            <rect x="0" y="140" width="320" height="60" fill="#86EFAC" />
            <rect x="200" y="65" width="90" height="78" fill="#FEF3C7" stroke="#B45309" strokeWidth="2" />
            <polygon points="190,65 245,35 300,65" fill="#EA580C" />
            <Person x={100} y={102} shirt="#FFFFFF" hijab="#FFFFFF" mood="happy" />
            <Person x={175} y={102} shirt="#FFFFFF" mood="happy" />
          </>
        );

      // CERITA 5: Jejak Misterius di Ruang Musik
      case 'c5-p1':
        return (
          <>
            <rect width="320" height="200" fill="#FEF3C7" />
            <rect x="0" y="144" width="320" height="56" fill="#D97706" opacity="0.35" />
            {/* Board with Pentas Seni Jumat */}
            <rect x="40" y="25" width="140" height="55" rx="3" fill="#1E293B" stroke="#78350F" strokeWidth="3" />
            <text x="110" y="50" fontSize="10" textAnchor="middle" fill="#FDE047" fontWeight="700">PENTAS SENI JUMAT</text>
            {/* Angklung rack */}
            <rect x="205" y="45" width="85" height="98" fill="none" stroke="#92400E" strokeWidth="4" />
            {[216, 232, 248, 264, 278].map((ax, i) => (
              <rect key={i} x={ax} y={55 + i * 3} width="7" height={58 - i * 4} rx="2" fill="#CA8A04" />
            ))}
            <Person x={95} y={104} shirt="#FFFFFF" mood="happy" />
          </>
        );
      case 'c5-p2':
        return (
          <>
            <rect width="320" height="200" fill="#FDE68A" />
            <rect x="0" y="144" width="320" height="56" fill="#B45309" opacity="0.3" />
            <text x="52" y="34" fontSize="10" fill="#92400E" fontWeight="700">Rabu · 15:30</text>
            <Person x={110} y={102} shirt="#FFFFFF" mood="calm" />
            {/* Wooden storage chest with note */}
            <rect x="195" y="96" width="82" height="50" rx="3" fill="#B45309" stroke="#78350F" strokeWidth="2" />
            <rect x="218" y="88" width="34" height="12" fill="#FEF9C3" stroke="#CA8A04" />
            <rect x="128" y="96" width="10" height="34" rx="2" fill="#CA8A04" />
          </>
        );
      case 'c5-p3':
        return (
          <>
            <rect width="320" height="200" fill="#FEF3C7" />
            <rect x="0" y="144" width="320" height="56" fill="#D97706" opacity="0.35" />
            {/* Rack with empty first slot */}
            <rect x="175" y="45" width="110" height="98" fill="none" stroke="#92400E" strokeWidth="4" />
            <rect x="188" y="55" width="10" height="58" stroke="#DC2626" strokeDasharray="3 2" fill="none" />
            {[210, 228, 246, 264].map((ax, i) => (
              <rect key={i} x={ax} y={58 + i * 3} width="8" height={54 - i * 4} rx="2" fill="#CA8A04" />
            ))}
            <Person x={95} y={104} shirt="#FFFFFF" mood="worried" />
            <text x="193" y="40" fontSize="12" fill="#DC2626" fontWeight="700">Kosong!</text>
          </>
        );
      case 'c5-p4':
        return (
          <>
            <rect width="320" height="200" fill="#FEE2E2" />
            <rect x="0" y="144" width="320" height="56" fill="#FECACA" />
            <Person x={105} y={104} shirt="#FFFFFF" mood="angry" />
            <Person x={205} y={104} shirt="#FFFFFF" mood="worried" />
            <line x1="126" y1="106" x2="175" y2="106" stroke="#DC2626" strokeWidth="2.5" />
          </>
        );
      case 'c5-p5':
        return (
          <>
            <rect width="320" height="200" fill="#ECFDF5" />
            <rect x="0" y="144" width="320" height="56" fill="#BBF7D0" />
            <Person x={95} y={104} shirt="#FFFFFF" mood="happy" />
            {/* Wooden chest with legible note */}
            <rect x="185" y="94" width="90" height="52" rx="3" fill="#B45309" stroke="#78350F" strokeWidth="2" />
            <rect x="195" y="76" width="70" height="18" rx="2" fill="#FEF9C3" stroke="#059669" strokeWidth="1.5" />
            <text x="230" y="88" fontSize="7" textAnchor="middle" fill="#065F46" fontWeight="700">Sedang Diperbaiki</text>
          </>
        );
      case 'c5-p6':
        return (
          <>
            <rect width="320" height="200" fill="#EFF6FF" />
            <rect x="0" y="144" width="320" height="56" fill="#DBEAFE" />
            <Person x={75} y={96} shirt="#0284C7" pants="#1E293B" mood="happy" scale={1.12} />
            {/* Open wooden chest revealing wrapped repaired angklung */}
            <rect x="135" y="102" width="90" height="44" rx="3" fill="#B45309" />
            <rect x="155" y="82" width="12" height="36" rx="2" fill="#EAB308" />
            <Person x={255} y={104} shirt="#FFFFFF" mood="calm" />
          </>
        );
      case 'c5-p7':
        return (
          <>
            <rect width="320" height="200" fill="#FEFCE8" />
            <rect x="0" y="144" width="320" height="56" fill="#FDE68A" />
            <Person x={75} y={104} shirt="#FFFFFF" mood="happy" />
            <Person x={135} y={104} shirt="#FFFFFF" mood="happy" />
            <Person x={195} y={104} shirt="#FFFFFF" mood="happy" />
            <Person x={255} y={96} shirt="#0284C7" pants="#1E293B" mood="happy" scale={1.1} />
            {/* Musical notes */}
            <text x="155" y="54" fontSize="16" fill="#D97706" fontWeight="700">♪ ♫ ♪</text>
          </>
        );

      default:
        return (
          <>
            <rect width="320" height="200" fill="#F1F5F9" />
            <Person x={160} y={102} shirt="#FFFFFF" mood="happy" />
          </>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 320 200"
      className={`w-full h-auto block select-none ${className}`}
      role="img"
      aria-label={`Ilustrasi panel ${sceneKey}`}
    >
      {renderScene()}
    </svg>
  );
};
