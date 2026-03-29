import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
//import { Button } from '@/components/ui/button';
import { Moon, Sun, User, ArrowRight, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';

/* ─────────────────────────────────────────────
   Animated SVG Illustrations
───────────────────────────────────────────── */

const FarmerHeroIllustration = () => (
  <svg viewBox="0 0 520 480" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <radialGradient id="groundGrad" cx="50%" cy="100%" r="60%">
        <stop offset="0%" stopColor="#4ade80" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#166534" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f0fdf4" />
        <stop offset="100%" stopColor="#dcfce7" />
      </linearGradient>
      <filter id="softShadow">
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#166534" floodOpacity="0.18" />
      </filter>
    </defs>

    {/* Background landscape */}
    <ellipse cx="260" cy="440" rx="300" ry="60" fill="url(#groundGrad)" />

    {/* Rolling hills */}
    <path d="M0 340 Q130 270 260 310 Q390 350 520 280 L520 480 L0 480 Z" fill="#bbf7d0" opacity="0.5" />
    <path d="M0 370 Q150 320 280 345 Q410 370 520 330 L520 480 L0 480 Z" fill="#86efac" opacity="0.4" />
    <path d="M0 400 Q200 370 340 390 Q450 405 520 380 L520 480 L0 480 Z" fill="#4ade80" opacity="0.3" />

    {/* Coop structure */}
    <rect x="340" y="240" width="130" height="110" rx="4" fill="#d97706" opacity="0.85" />
    <polygon points="330,240 480,240 405,185" fill="#b45309" opacity="0.9" />
    <rect x="375" y="295" width="30" height="55" rx="4" fill="#92400e" />
    <rect x="350" y="260" width="35" height="28" rx="3" fill="#fef3c7" opacity="0.7" />
    <rect x="400" y="260" width="35" height="28" rx="3" fill="#fef3c7" opacity="0.7" />

    {/* Sun */}
    <circle cx="430" cy="80" r="36" fill="#fbbf24" opacity="0.9">
      <animate attributeName="r" values="36;39;36" dur="4s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.9;1;0.9" dur="4s" repeatCount="indefinite" />
    </circle>
    {[0,45,90,135,180,225,270,315].map((angle, i) => (
      <line
        key={i}
        x1={430 + Math.cos(angle * Math.PI / 180) * 42}
        y1={80 + Math.sin(angle * Math.PI / 180) * 42}
        x2={430 + Math.cos(angle * Math.PI / 180) * 55}
        y2={80 + Math.sin(angle * Math.PI / 180) * 55}
        stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" opacity="0.6"
      />
    ))}

    {/* Main farmer */}
    <g filter="url(#softShadow)">
      {/* Body */}
      <rect x="175" y="220" width="52" height="100" rx="14" fill="#15803d" />
      {/* Overalls strap */}
      <rect x="183" y="220" width="12" height="40" rx="4" fill="#166534" />
      <rect x="207" y="220" width="12" height="40" rx="4" fill="#166534" />
      {/* Head */}
      <circle cx="201" cy="202" r="26" fill="#d97706" />
      <circle cx="201" cy="202" r="22" fill="#fde68a" />
      {/* Hat */}
      <ellipse cx="201" cy="180" rx="30" ry="8" fill="#92400e" />
      <rect x="185" y="163" width="32" height="20" rx="4" fill="#b45309" />
      {/* Face */}
      <circle cx="194" cy="200" r="3" fill="#78350f" />
      <circle cx="208" cy="200" r="3" fill="#78350f" />
      <path d="M193 210 Q201 216 209 210" stroke="#78350f" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Left arm — holding basket */}
      <rect x="145" y="228" width="34" height="12" rx="6" fill="#15803d">
        <animateTransform attributeName="transform" type="rotate" values="-8,145,234;5,145,234;-8,145,234" dur="2.5s" repeatCount="indefinite" />
      </rect>
      {/* Right arm — waving */}
      <rect x="225" y="224" width="34" height="12" rx="6" fill="#15803d">
        <animateTransform attributeName="transform" type="rotate" values="10,225,230;-15,225,230;10,225,230" dur="1.8s" repeatCount="indefinite" />
      </rect>
      {/* Legs */}
      <rect x="179" y="315" width="20" height="50" rx="8" fill="#1e3a5f" />
      <rect x="203" y="315" width="20" height="50" rx="8" fill="#1e3a5f" />
      {/* Boots */}
      <rect x="175" y="358" width="28" height="14" rx="5" fill="#1c1917" />
      <rect x="199" y="358" width="28" height="14" rx="5" fill="#1c1917" />
    </g>

    {/* Basket */}
    <ellipse cx="142" cy="262" rx="20" ry="13" fill="#b45309" opacity="0.85" />
    <rect x="122" y="255" width="40" height="22" rx="6" fill="#d97706" />
    {/* Eggs in basket */}
    <ellipse cx="133" cy="255" rx="6" ry="7" fill="#fefce8" />
    <ellipse cx="144" cy="253" rx="6" ry="7" fill="#fefce8" />
    <ellipse cx="155" cy="255" rx="5.5" ry="6.5" fill="#fefce8" />

    {/* Chickens */}
    {/* Chicken 1 */}
    <g>
      <ellipse cx="110" cy="355" rx="22" ry="16" fill="#fbbf24" />
      <circle cx="128" cy="345" r="12" fill="#fbbf24" />
      <polygon points="136,342 144,345 136,348" fill="#f97316" />
      <path d="M126,341 Q130,335 133,341" fill="#ef4444" />
      <circle cx="131" cy="344" r="2" fill="#1c1917" />
      <line x1="110" y1="371" x2="104" y2="386" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
      <line x1="118" y1="371" x2="124" y2="386" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
      <animateTransform attributeName="transform" type="translate" values="0,0;3,0;0,0" dur="2s" repeatCount="indefinite" />
    </g>
    {/* Chicken 2 */}
    <g>
      <ellipse cx="295" cy="370" rx="18" ry="13" fill="#fde68a" />
      <circle cx="310" cy="362" r="10" fill="#fde68a" />
      <polygon points="317,359 323,362 317,365" fill="#f97316" />
      <path d="M308,358 Q312,353 315,358" fill="#ef4444" />
      <circle cx="313" cy="361" r="1.5" fill="#1c1917" />
      <line x1="295" y1="383" x2="289" y2="396" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="302" y1="383" x2="307" y2="396" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
      <animateTransform attributeName="transform" type="translate" values="0,0;-2,1;0,0" dur="1.7s" repeatCount="indefinite" />
    </g>
    {/* Chicken 3 */}
    <g>
      <ellipse cx="76" cy="390" rx="15" ry="11" fill="#d97706" />
      <circle cx="88" cy="383" r="9" fill="#d97706" />
      <polygon points="94,380 100,383 94,386" fill="#f97316" />
      <path d="M86,379 Q90,375 92,379" fill="#ef4444" />
      <circle cx="91" cy="382" r="1.5" fill="#1c1917" />
      <line x1="76" y1="401" x2="71" y2="413" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
      <line x1="82" y1="401" x2="87" y2="413" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
      <animateTransform attributeName="transform" type="translate" values="0,0;2,-1;0,0" dur="2.3s" repeatCount="indefinite" />
    </g>

    {/* Floating eggs / sparkle accents */}
    <circle cx="50" cy="150" r="5" fill="#fbbf24" opacity="0.6">
      <animate attributeName="cy" values="150;140;150" dur="3s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
    </circle>
    <circle cx="470" cy="200" r="4" fill="#4ade80" opacity="0.7">
      <animate attributeName="cy" values="200;190;200" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="80" cy="230" r="3" fill="#f97316" opacity="0.5">
      <animate attributeName="cy" values="230;218;230" dur="4s" repeatCount="indefinite" />
    </circle>

    {/* Grass tufts */}
    {[60,120,180,240,310,370,430,490].map((x, i) => (
      <g key={i}>
        <path d={`M${x} 420 Q${x-5} 408 ${x-2} 415`} stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d={`M${x} 420 Q${x+4} 407 ${x+2} 414`} stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d={`M${x+6} 418 Q${x+10} 406 ${x+8} 414`} stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    ))}
  </svg>
);

const FarmSceneIllustration = () => (
  <svg viewBox="0 0 560 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="skyGrad2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f0fdf4" />
        <stop offset="100%" stopColor="#d1fae5" />
      </linearGradient>
    </defs>
    <rect width="560" height="400" fill="url(#skyGrad2)" rx="24" />

    {/* Ground */}
    <path d="M0 280 Q140 250 280 265 Q420 280 560 255 L560 400 L0 400 Z" fill="#86efac" opacity="0.5" />
    <path d="M0 300 Q160 275 300 290 Q440 305 560 278 L560 400 L0 400 Z" fill="#4ade80" opacity="0.45" />
    <path d="M0 330 Q200 310 350 320 Q470 328 560 305 L560 400 L0 400 Z" fill="#22c55e" opacity="0.35" />

    {/* Barn */}
    <rect x="380" y="180" width="150" height="130" rx="4" fill="#b91c1c" opacity="0.88" />
    <polygon points="365,180 545,180 455,120" fill="#991b1b" />
    <rect x="425" y="255" width="40" height="55" rx="4" fill="#7f1d1d" />
    <rect x="388" y="200" width="45" height="35" rx="3" fill="#fef3c7" opacity="0.65" />
    <rect x="447" y="200" width="45" height="35" rx="3" fill="#fef3c7" opacity="0.65" />
    <line x1="455" y1="120" x2="455" y2="115" stroke="#fbbf24" strokeWidth="3" />
    <circle cx="455" cy="112" r="5" fill="#fbbf24" />

    {/* Fence */}
    {[30,60,90,120,150,180,210,240,270,300,330].map((x,i) => (
      <rect key={i} x={x} y="310" width="8" height="50" rx="3" fill="#d97706" opacity="0.7" />
    ))}
    <rect x="30" y="318" width="314" height="10" rx="4" fill="#b45309" opacity="0.6" />
    <rect x="30" y="338" width="314" height="10" rx="4" fill="#b45309" opacity="0.6" />

    {/* Second farmer - female */}
    <g>
      {/* Body */}
      <rect x="88" y="215" width="46" height="95" rx="12" fill="#7c3aed" />
      {/* Apron */}
      <rect x="98" y="230" width="26" height="65" rx="8" fill="#ddd6fe" opacity="0.7" />
      {/* Head */}
      <circle cx="111" cy="198" r="22" fill="#fde68a" />
      {/* Hair */}
      <path d="M89 192 Q91 173 111 175 Q131 173 133 192" fill="#78350f" />
      <path d="M89 192 Q83 205 91 215" fill="#78350f" />
      {/* Scarf/headband */}
      <rect x="90" y="188" width="42" height="9" rx="4" fill="#f97316" opacity="0.7" />
      {/* Face */}
      <circle cx="104" cy="197" r="2.5" fill="#78350f" />
      <circle cx="118" cy="197" r="2.5" fill="#78350f" />
      <path d="M103 207 Q111 212 119 207" stroke="#78350f" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Arms */}
      <rect x="50" y="222" width="42" height="11" rx="5.5" fill="#7c3aed">
        <animateTransform attributeName="transform" type="rotate" values="5,50,227;-10,50,227;5,50,227" dur="2.2s" repeatCount="indefinite" />
      </rect>
      <rect x="134" y="222" width="38" height="11" rx="5.5" fill="#7c3aed" />
      {/* Legs */}
      <rect x="92" y="305" width="18" height="50" rx="7" fill="#1e3a5f" />
      <rect x="114" y="305" width="18" height="50" rx="7" fill="#1e3a5f" />
      <rect x="88" y="348" width="26" height="12" rx="5" fill="#1c1917" />
      <rect x="110" y="348" width="26" height="12" rx="5" fill="#1c1917" />
    </g>

    {/* Feed bucket */}
    <rect x="50" y="255" width="30" height="28" rx="4" fill="#b45309" />
    <path d="M50 255 Q65 245 80 255" stroke="#78350f" strokeWidth="2.5" fill="none" />

    {/* Rooster on fence post */}
    <g>
      <ellipse cx="255" cy="296" rx="16" ry="12" fill="#dc2626" />
      <circle cx="268" cy="288" r="9" fill="#dc2626" />
      <polygon points="274,286 282,288 274,291" fill="#f97316" />
      <path d="M255,283 Q263,272 268,284" fill="#991b1b" opacity="0.7" />
      <circle cx="271" cy="287" r="2" fill="#1c1917" />
      {/* Tail feathers */}
      <path d="M239 294 Q228 280 236 296" fill="#7c3aed" opacity="0.6" />
      <path d="M239 296 Q225 286 237 298" fill="#4ade80" opacity="0.6" />
      <path d="M240 299 Q226 294 238 302" fill="#fbbf24" opacity="0.7" />
    </g>

    {/* Chicks walking */}
    {[[160,340],[180,348],[140,352]].map(([cx,cy], i) => (
      <g key={i}>
        <ellipse cx={cx} cy={cy} rx="9" ry="7" fill="#fde68a" />
        <circle cx={cx+8} cy={cy-5} r="6" fill="#fde68a" />
        <polygon points={`${cx+13},${cy-6} ${cx+18},${cy-4} ${cx+13},${cy-2}`} fill="#f97316" />
        <circle cx={cx+10} cy={cy-6} r="1.5" fill="#1c1917" />
        <line x1={cx} y1={cy+7} x2={cx-3} y2={cy+16} stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
        <line x1={cx+4} y1={cy+7} x2={cx+7} y2={cy+16} stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
        <animateTransform attributeName="transform" type="translate"
          values={`0,0;${i%2===0?2:-2},0;0,0`} dur={`${1.5+i*0.3}s`} repeatCount="indefinite" />
      </g>
    ))}

    {/* Clouds */}
    <g opacity="0.7">
      <ellipse cx="80" cy="60" rx="40" ry="18" fill="white" />
      <ellipse cx="105" cy="52" rx="28" ry="16" fill="white" />
      <ellipse cx="58" cy="55" rx="22" ry="13" fill="white" />
      <animateTransform attributeName="transform" type="translate" values="0,0;6,0;0,0" dur="8s" repeatCount="indefinite" />
    </g>
    <g opacity="0.6">
      <ellipse cx="300" cy="45" rx="35" ry="15" fill="white" />
      <ellipse cx="325" cy="38" rx="24" ry="13" fill="white" />
      <ellipse cx="280" cy="40" rx="18" ry="11" fill="white" />
      <animateTransform attributeName="transform" type="translate" values="0,0;-8,0;0,0" dur="10s" repeatCount="indefinite" />
    </g>
  </svg>
);

/* ─────────────────────────────────────────────
   useInView Hook
───────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const Home = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, 5000); // 5s auto-slide

  return () => clearInterval(interval);
}, []);

const nextSlide = () => {
  setCurrentSlide((prev) => (prev + 1) % slides.length);
};

const prevSlide = () => {
  setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
};

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const importanceSection = useInView();
  const productSection = useInView();
  const guideSection = useInView();
  const trendsSection = useInView();

  const features = [
    { emoji: "📊", title: "Real-time Dashboard", desc: "Bird count, egg production rate, mortality trends and beautiful charts all in one view." },
    { emoji: "🐔", title: "Flock & Batch Management", desc: "Track multiple batches with age, health status and full performance history." },
    { emoji: "🥚", title: "Daily Production Logging", desc: "Quick entry of eggs, hatch rate, feed & water consumption — done in seconds." },
    { emoji: "🩺", title: "Health & Mortality", desc: "Record vaccinations, treatments and causes of loss with structured health records." },
    { emoji: "💰", title: "Sales & Revenue", desc: "Track egg and bird sales with payment records, ready for M-Pesa integration." },
    { emoji: "🔄", title: "Multi-Farm Support", desc: "Manage several farms with ease and switch between them seamlessly." }
  ];

  const steps = [
    { num: "01", title: "Create Your Account", desc: "Register with your name, email and a strong password. Less than 60 seconds." },
    { num: "02", title: "Set Up Your Farm", desc: "Create your first farm profile with name, location and basic details." },
    { num: "03", title: "Add Your First Flock", desc: "Create a batch, enter initial bird count and start logging daily production." },
    { num: "04", title: "Track & Grow", desc: "Use the dashboard daily. View analytics, log sales, monitor health and make smarter decisions." }
  ];

  const news = [
    { title: "Kenya Aims to Triple Poultry Production", desc: "A Government and World Bank partnership targets expansion to 240,000 birds, focusing on local feed production and improved indigenous breeds.", date: "March 2026", tag: "Policy" },
    { title: "Automation & Smart Sensors on the Rise", desc: "Farmers in Nakuru and Kiambu are adopting IoT for temperature, humidity and automatic feeding to reduce labour and losses.", date: "February 2026", tag: "Technology" },
    { title: "Digital Records Now Required for SACCO Loans", desc: "Banks and SACCOs now prefer digital records for loan approvals. PoultryPro generates professional reports instantly.", date: "January 2026", tag: "Finance" },
    { title: "Precision Vaccination & Biosecurity", desc: "With rising disease pressure, farmers are moving to precision vaccination and strict biosecurity protocols to protect flocks.", date: "December 2025", tag: "Health" }
  ];

  const slides = [
  {
    image: '/src/assets/images/carousel/farm1.jpg',
    title: 'Modern Poultry Housing',
    desc: 'Well-ventilated housing improves bird health and maximizes productivity.'
  },
  {
    image: '/src/assets/images/carousel/farm2.jpg',
    title: 'Layer Farming',
    desc: 'Efficient egg production systems for consistent daily output.'
  },
  {
    image: '/src/assets/images/carousel/farm3.jpg',
    title: 'Broiler Production',
    desc: 'Fast-growing birds optimized for meat production cycles.'
  },
  {
    image: '/src/assets/images/carousel/farm4.jpg',
    title: 'Feeding Systems',
    desc: 'Automated feeders reduce waste and improve feed conversion ratio.'
  },
  {
    image: '/src/assets/images/carousel/farm5.jpg',
    title: 'Clean Water Supply',
    desc: 'Reliable hydration is critical for poultry growth and egg production.'
  },
  {
    image: '/src/assets/images/carousel/farm6.jpg',
    title: 'Healthy Chicks',
    desc: 'Strong early-stage management ensures high survival rates.'
  },
  {
    image: '/src/assets/images/carousel/farm7.jpg',
    title: 'Egg Collection',
    desc: 'Proper handling maintains egg quality and market value.'
  },
  {
    image: '/src/assets/images/carousel/farm8.jpg',
    title: 'Biosecurity Practices',
    desc: 'Strict hygiene prevents disease outbreaks and losses.'
  }
];

  return (
    <>
      {/* ── Google Fonts injection ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');

        :root {
          --pp-green: #15803d;
          --pp-green-light: #22c55e;
          --pp-green-pale: #dcfce7;
          --pp-earth: #b45309;
          --pp-cream: #fefce8;
          --pp-dark: #0a1f0f;
        }

        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'DM Sans', system-ui, sans-serif; }
        .font-serif-display { font-family: 'DM Serif Display', Georgia, serif; }

        .reveal-up {
          opacity: 0;
          transform: translateY(36px);
          transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1);
        }
        .reveal-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-up:nth-child(1) { transition-delay: 0ms; }
        .reveal-up:nth-child(2) { transition-delay: 100ms; }
        .reveal-up:nth-child(3) { transition-delay: 190ms; }
        .reveal-up:nth-child(4) { transition-delay: 270ms; }
        .reveal-up:nth-child(5) { transition-delay: 340ms; }
        .reveal-up:nth-child(6) { transition-delay: 400ms; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-32px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeInRight { from { opacity: 0; transform: translateX(32px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes floatBadge { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-10px) rotate(-2deg); } }
        @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse-ring { 0%,100% { box-shadow: 0 0 0 0 rgba(21,128,61,0.35); } 50% { box-shadow: 0 0 0 18px rgba(21,128,61,0); } }
        @keyframes slowZoom { from { transform: scale(1); } to { transform: scale(1.08); } }

        .hero-text-1 { animation: fadeIn 0.9s cubic-bezier(.22,1,.36,1) 0.1s both; }
        .hero-text-2 { animation: fadeIn 0.9s cubic-bezier(.22,1,.36,1) 0.3s both; }
        .hero-text-3 { animation: fadeIn 0.9s cubic-bezier(.22,1,.36,1) 0.5s both; }
        .hero-text-4 { animation: fadeIn 0.9s cubic-bezier(.22,1,.36,1) 0.7s both; }
        .hero-img { animation: fadeInRight 1s cubic-bezier(.22,1,.36,1) 0.4s both; }

        .float-badge { animation: floatBadge 4s ease-in-out infinite; }
        .spin-slow { animation: spin-slow 18s linear infinite; }
        .pulse-ring { animation: pulse-ring 2.4s ease-in-out infinite; }

        .nav-pill {
          position: relative;
          transition: color 0.2s;
        }
        .nav-pill::after {
          content: '';
          position: absolute;
          bottom: -3px; left: 50%;
          width: 0; height: 2px;
          background: var(--pp-green);
          border-radius: 2px;
          transition: width 0.3s cubic-bezier(.22,1,.36,1), left 0.3s cubic-bezier(.22,1,.36,1);
        }
        .nav-pill:hover::after { width: 100%; left: 0; }

        .feature-card {
          position: relative;
          overflow: hidden;
          transition: transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(21,128,61,0.06) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.35s;
        }
        .feature-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(15,60,25,0.13); }
        .feature-card:hover::before { opacity: 1; }

        .step-line {
          position: absolute;
          left: 23px; top: 56px;
          width: 2px; height: calc(100% - 56px);
          background: linear-gradient(to bottom, #15803d, transparent);
        }

        .tag-pill {
          display: inline-flex;
          align-items: center;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 999px;
          background: rgba(21,128,61,0.12);
          color: #15803d;
        }
        .dark .tag-pill { background: rgba(74,222,128,0.15); color: #4ade80; }

        .grain-overlay {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .hero-decoration {
          background: conic-gradient(from 180deg at 50% 50%, #15803d 0deg, #22c55e 72deg, #4ade80 144deg, #86efac 216deg, #15803d 288deg, #15803d 360deg);
          border-radius: 50%;
          opacity: 0.08;
          filter: blur(60px);
        }
      `}</style>

      <div className="font-body min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden">

        {/* ── Floating grain texture ── */}
        <div className="grain-overlay fixed inset-0 z-0 pointer-events-none" />

        {/* ════════════════ NAV ════════════════ */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/92 dark:bg-slate-950/92 backdrop-blur-xl shadow-[0_2px_30px_rgba(0,0,0,0.06)] border-b border-slate-100 dark:border-slate-800'
            : 'bg-transparent'
        }`}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('home')}>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center text-xl shadow-md shadow-emerald-200 dark:shadow-emerald-900/50 pulse-ring">
                🐔
              </div>
              <div>
                <div className="font-display font-700 text-xl leading-none tracking-tight">PoultryPro</div>
                <div className="text-[10px] font-medium text-emerald-600 tracking-widest uppercase mt-0.5">Farm Management</div>
              </div>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8 text-[14px] font-medium text-slate-600 dark:text-slate-400">
              {['home','product','guide','trends'].map(id => (
                <button key={id} onClick={() => scrollTo(id)}
                  className="nav-pill capitalize hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {id === 'guide' ? 'How to Use' : id === 'trends' ? 'Trends' : id.charAt(0).toUpperCase() + id.slice(1)}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
              </button>

              <button
                onClick={() => navigate('/login')}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-sm font-medium hover:border-emerald-500 hover:text-emerald-600 dark:hover:border-emerald-500 dark:hover:text-emerald-400 transition-all"
              >
                <User className="h-4 w-4" />
                Login
              </button>

              <button
                onClick={() => navigate('/register')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all shadow-md shadow-emerald-200 dark:shadow-emerald-900/40 hover:shadow-lg hover:shadow-emerald-300/40 active:scale-95"
              >
                Get Started
              </button>
            </div>
          </div>
        </nav>

        {/* ════════════════ HERO ════════════════ */}
        <section id="home" className="relative pt-32 pb-0 min-h-screen flex items-center overflow-hidden">
          {/* Background decoration */}
          <div className="hero-decoration absolute -top-20 -right-40 w-[600px] h-[600px]" />
          <div className="absolute top-40 -left-20 w-72 h-72 rounded-full bg-amber-400/6 blur-3xl" />

          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(#15803d 1px, transparent 1px), linear-gradient(90deg, #15803d 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

          <div className="relative max-w-7xl mx-auto px-6 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center pb-20">
              {/* Left */}
              <div className="space-y-8">
                <div className="hero-text-1">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Built for Kenyan Farmers
                  </span>
                </div>

                <h1 className="hero-text-2 font-display text-[56px] md:text-[68px] font-800 leading-[1.04] tracking-tight">
                  Turning Poultry<br />
                  into a{' '}
                  <span className="relative italic">
                    <span className="relative z-10 text-emerald-600 dark:text-emerald-400">Profitable</span>
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 14" fill="none">
                      <path d="M4 10 Q75 3 150 8 Q225 13 296 6" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.5" />
                    </svg>
                  </span>
                  <br />Business
                </h1>

                <p className="hero-text-3 text-lg text-slate-500 dark:text-slate-400 max-w-md leading-relaxed font-light">
                  The modern farm management system designed for Kenyan poultry farmers.
                  Track production, reduce losses, and grow your income — with confidence.
                </p>

                <div className="hero-text-4 flex items-center gap-4 flex-wrap">
                  <button
                    onClick={() => navigate('/register')}
                    className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base transition-all shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50 hover:shadow-xl hover:shadow-emerald-300/50 active:scale-[0.97]"
                  >
                    Start Free Today
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => scrollTo('product')}
                    className="flex items-center gap-2 px-6 py-4 rounded-2xl text-slate-600 dark:text-slate-400 font-medium text-base hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
                  >
                    See Features
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>

                {/* Social proof */}
                <div className="hero-text-4 flex items-center gap-6 pt-2">
                  <div className="flex -space-x-2">
                    {['🧑🏿‍🌾','👩🏾‍🌾','👨🏽‍🌾','🧑🏿‍🌾'].map((emoji, i) => (
                      <div key={i} className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/40 border-2 border-white dark:border-slate-950 flex items-center justify-center text-lg">
                        {emoji}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">200+ farmers</div>
                    <div className="text-xs text-slate-500">already growing with PoultryPro</div>
                  </div>
                </div>
              </div>

              {/* Right — Hero Illustration */}
              <div className="hero-img relative">
                {/* Floating card 1 
                <div className="float-badge absolute -top-6 -left-4 z-10 bg-white dark:bg-slate-800 rounded-2xl shadow-xl px-4 py-3 border border-slate-100 dark:border-slate-700">
                  <div className="text-xs text-slate-500 mb-1 font-medium">Today's Production</div>
                  <div className="text-2xl font-display font-bold text-emerald-600">1,240 🥚</div>
                </div>*/}

                {/* Floating card 2 
                <div className="float-badge absolute -bottom-2 -right-4 z-10 bg-white dark:bg-slate-800 rounded-2xl shadow-xl px-4 py-3 border border-slate-100 dark:border-slate-700" style={{animationDelay:'1.5s'}}>
                  <div className="text-xs text-slate-500 mb-1 font-medium">Mortality Rate</div>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-display font-bold text-emerald-600">↓ 25%</div>
                    <span className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded-full">this month</span>
                  </div>
                </div>*/}

                {/* Illustration container */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/30 dark:to-slate-900 border border-emerald-100 dark:border-emerald-900/50 shadow-2xl p-4" style={{minHeight: 440}}>
                  {/* Decorative dots */}
                  <div className="absolute top-4 right-4 w-20 h-20 opacity-20">
                    {Array.from({length: 9}).map((_,i) => (
                      <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-emerald-600"
                        style={{top: `${Math.floor(i/3)*33}%`, left: `${(i%3)*33}%`}} />
                    ))}
                  </div>
                  <FarmerHeroIllustration />
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 animate-bounce">
            <span className="text-xs tracking-widest uppercase font-medium">Scroll</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </section>

        {/* ════════════════ IMPORTANCE ════════════════ */}
        <section className="py-28 bg-slate-50 dark:bg-slate-900/50">
          <div ref={importanceSection.ref} className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className={`reveal-up ${importanceSection.visible ? 'visible' : ''}`}>
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-green-100 to-emerald-50 dark:from-emerald-950/30 dark:to-slate-900 border border-emerald-100 dark:border-emerald-900/50 shadow-xl p-6" style={{minHeight: 380}}>
                <FarmSceneIllustration />
              </div>
            </div>
            <div className={`reveal-up ${importanceSection.visible ? 'visible' : ''} space-y-6`} style={{transitionDelay:'100ms'}}>
              <div className="tag-pill">Why It Matters</div>
              <h2 className="font-display text-4xl md:text-5xl font-700 leading-tight">
                Why Every Kenyan Poultry Farmer Needs <em className="not-italic text-emerald-600">This System</em>
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                Manual record-keeping leads to invisible losses — poor mortality tracking, feed waste, and missed sales windows.
                PoultryPro gives you real-time insights so every decision you make is backed by data.
              </p>
              <div className="grid grid-cols-2 gap-5 pt-2">
                {[
                  { val: '25%', label: 'Average mortality reduction' },
                  { val: '3×', label: 'Faster loan approvals' },
                  { val: '40%', label: 'Less feed waste reported' },
                  { val: '99%', label: 'Uptime, available daily' },
                ].map((s, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="font-display text-3xl font-bold text-emerald-600">{s.val}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════ PRODUCT ════════════════ */}
        <section id="product" className="py-28 bg-white dark:bg-slate-950">
          <div ref={productSection.ref} className="max-w-7xl mx-auto px-6">
            <div className={`text-center mb-18 reveal-up ${productSection.visible ? 'visible' : ''}`}>
              <div className="tag-pill mb-5">The Platform</div>
              <h2 className="font-display text-4xl md:text-5xl font-700 leading-tight mb-4">
                Your Complete Farm<br /><em className="not-italic text-emerald-600">Command Center</em>
              </h2>
              <p className="text-xl text-slate-500 dark:text-slate-400 font-light mx-auto">
                One dashboard. Everything you need to run a profitable poultry operation.
              </p>
            </div>

            {/* Dashboard mockup */}
            <div className={`mb-18 reveal-up ${productSection.visible ? 'visible' : ''}`} style={{transitionDelay:'150ms'}}>
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden bg-slate-50 dark:bg-slate-900">
                {/* Fake browser bar */}
                <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="ml-4 flex-1 max-w-sm rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-1.5 text-xs text-slate-400 font-mono">
                    The Dashboard
                  </div>
                </div>
                {/* Mock dashboard content */}
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Birds', val: '4,250', emoji: '🐔', trend: '+120 this week', color: 'emerald' },
                    { label: "Today's Eggs", val: '1,240', emoji: '🥚', trend: '+8% vs yesterday', color: 'amber' },
                    { label: 'Revenue (KES)', val: '84,000', emoji: '💰', trend: 'This month', color: 'blue' },
                    { label: 'Mortality Rate', val: '0.8%', emoji: '🩺', trend: '↓ from 1.2%', color: 'purple' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
                      <div className="text-2xl mb-2">{s.emoji}</div>
                      <div className="text-xl font-display font-bold text-slate-800 dark:text-slate-100">{s.val}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</div>
                      <div className="text-xs text-emerald-600 mt-2 font-medium">{s.trend}</div>
                    </div>
                  ))}
                </div>
                {/* Bar chart mockup */}
                <div className="px-6 pb-6">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
                    <div className="text-sm font-semibold mb-4 text-slate-700 dark:text-slate-300">Weekly Egg Production</div>
                    <div className="flex items-end gap-2 h-20">
                      {[65,72,68,80,75,90,85].map((h,i) => (
                        <div key={i} className="flex-1 rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 opacity-90 transition-all"
                          style={{height: `${h}%`, transitionDelay: `${i*80}ms`}} />
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                        <div key={d} className="flex-1 text-center text-xs text-slate-400">{d}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((item, i) => (
                <div key={i} className={`feature-card reveal-up ${productSection.visible ? 'visible' : ''} bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-100 dark:border-slate-800 shadow-sm`}>
                  <div className="text-4xl mb-5">{item.emoji}</div>
                  <h3 className="font-display text-xl font-600 mb-3 text-slate-800 dark:text-slate-100">{item.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-light">{item.desc}</p>
                  <div className="mt-5 flex items-center gap-1 text-emerald-600 text-sm font-semibold">
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ HOW TO USE ════════════════ */}
        <section id="guide" className="py-28 bg-slate-50 dark:bg-slate-900/40">
          <div ref={guideSection.ref} className="max-w-5xl mx-auto px-6">
            <div className={`text-center mb-18 reveal-up ${guideSection.visible ? 'visible' : ''}`}>
              <div className="tag-pill mb-5">Get Started</div>
              <h2 className="font-display text-4xl md:text-5xl font-700 leading-tight">
                Up and running in<br /><em className="not-italic text-emerald-600">4 simple steps</em>
              </h2>
            </div>

            <div className="space-y-6">
              {steps.map((step, i) => (
                <div key={i} className={`reveal-up ${guideSection.visible ? 'visible' : ''} flex gap-8 items-start bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all group`}>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center font-display font-bold text-emerald-600 text-lg flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-600 mb-2 text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{step.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed font-light">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`reveal-up ${guideSection.visible ? 'visible' : ''} text-center mt-14`}>
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg transition-all shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50 hover:shadow-xl active:scale-[0.97]"
              >
                Create Your Free Account
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>

        {/* ════════════════ TRENDS ════════════════ */}
        <section id="trends" className="py-28 bg-white dark:bg-slate-950">
          <div ref={trendsSection.ref} className="max-w-7xl mx-auto px-6">
            <div className={`mb-18 reveal-up ${trendsSection.visible ? 'visible' : ''}`}>
              <div className="tag-pill mb-5">Trends & Insights</div>
              <div className="flex flex-col  md:items-center justify-between gap-6">
                <h2 className="font-display text-4xl md:text-5xl font-700 leading-tight ">
                  Kenyan Poultry<br /><em className="not-italic text-emerald-600">News & Trends</em>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  Stay ahead of the market with the latest developments in Kenyan poultry farming.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-7">
              {news.map((item, i) => (
                <div key={i} className={`reveal-up ${trendsSection.visible ? 'visible' : ''} group bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-lg transition-all cursor-pointer`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="tag-pill">{item.tag}</span>
                    <span className="text-xs text-slate-400 font-medium">{item.date}</span>
                  </div>
                  <h3 className="font-display text-xl font-600 mb-3 text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">{item.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm font-light">{item.desc}</p>
                  <div className="mt-5 flex items-center gap-1 text-emerald-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1 group-hover:translate-y-0 duration-200">
                    Read more <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

{/* ════════════════ CAROUSEL SHOWCASE ════════════════ */}
<section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">

  <div className="max-w-6xl mx-auto px-6">

    {/* Header */}
    <div className="text-center mb-14">
      <div className="tag-pill mb-4">Poultry Farming</div>
      <h2 className="font-display text-4xl md:text-5xl text-white">
        Real Farm <span className="text-emerald-400">Insights</span>
      </h2>
      <p className="text-slate-400 mt-4 mx-auto">
        Explore real poultry farming practices that drive productivity and profitability.
      </p>
    </div>

    {/* Carousel */}
    <div className="w-full h-full object-cover">

      {/* Slides */}
      <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-2xl">

        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover scale-105"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* Text */}
            <div className="absolute bottom-10 left-10 right-10 text-white">
              <h3 className="text-2xl md:text-3xl max-w-md font-display mb-2 animate-[fadeIn_1s]">
                {slide.title}
              </h3>
              <p className="text-sm md:text-base text-slate-200 dark:text-slate-300 max-w-md animate-[fadeIn_1.3s]">
                {slide.desc}
              </p>
            </div>
          </div>
        ))}

      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 -translate-y-1/2 left-4 w-11 h-11 rounded-full bg-black/10 hover:bg-black/20 text-slate-800 dark:bg-white/30 dark:hover:bg-white/40 dark:text-white backdrop-blur flex items-center justify-center transition"
      >
        ‹
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 -translate-y-1/2 right-4 w-11 h-11 rounded-full bg-black/10 hover:bg-black/20 text-slate-800 dark:bg-white/30 dark:hover:bg-white/40 dark:text-white backdrop-blur flex items-center justify-center transition"
      >
        ›
      </button>

      {/* Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {slides.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${currentSlide === i
                        ? 'bg-emerald-500 w-6'
                        : 'bg-slate-300 dark:bg-white/30'
                      }`}
                  />
                ))}
              </div>

    </div>
  </div>
</section>

        {/* ════════════════ CTA ════════════════ */}
        <section className="py-28 bg-slate-50 dark:bg-slate-900/40">
          <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
            <div className="tag-pill">Free to Start</div>
            <h2 className="font-display text-4xl md:text-5xl font-700 leading-tight">
              Ready to grow your<br /><em className="not-italic text-emerald-600">poultry business?</em>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-light mx-auto">
              Join hundreds of Kenyan farmers already making smarter decisions with PoultryPro.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => navigate('/register')}
                className="group flex items-center gap-3 px-9 py-4.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base transition-all shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50 hover:shadow-xl active:scale-[0.97]"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-8 py-4.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium text-base hover:border-emerald-500 hover:text-emerald-600 dark:hover:border-emerald-500 dark:hover:text-emerald-400 transition-all"
              >
                <User className="h-4 w-4" />
                Login to Account
              </button>
            </div>
          </div>
        </section>

        {/* ════════════════ FOOTER ════════════════ */}
        <footer className="bg-slate-900 dark:bg-black text-slate-400 pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-12 pb-16 border-b border-slate-800">
              {/* Brand */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center text-xl">🐔</div>
                  <div>
                    <div className="font-display text-xl font-700 text-white">PoultryPro</div>
                    <div className="text-[10px] text-emerald-500 tracking-widest uppercase mt-0.5">Farm Management</div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed max-w-xs font-light">
                  Modern farm management software built for Kenyan poultry farmers. Track, grow, and profit.
                </p>
                <div className="mt-6 text-sm text-slate-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  All systems operational
                </div>
              </div>

              {/* Links */}
              <div>
                <h4 className="text-white font-semibold mb-5 text-sm tracking-wide uppercase">Product</h4>
                <ul className="space-y-3 text-sm">
                  {[['home','Home'],['product','Features'],['guide','How it Works'],['trends','Trends']].map(([id, label]) => (
                    <li key={id}>
                      <button onClick={() => scrollTo(id)} className="hover:text-emerald-400 transition-colors">{label}</button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-5 text-sm tracking-wide uppercase">Contact</h4>
                <ul className="space-y-3 text-sm font-light">
                  <li>Nairobi, Kenya</li>
                  <li className="hover:text-emerald-400 transition-colors cursor-pointer">hello@poultrypro.co.ke</li>
                  <li className="hover:text-emerald-400 transition-colors cursor-pointer">+254 700 000 000</li>
                </ul>
                <div className="mt-8 flex gap-3">
                  {['𝕏','in','f'].map((icon, i) => (
                    <div key={i} className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-emerald-600 flex items-center justify-center text-sm font-bold cursor-pointer transition-all hover:scale-110 text-slate-400 hover:text-white">
                      {icon}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 text-xs text-slate-600">
              <span>© 2026 PoultryPro · Made for Kenyan Farmers with ❤️</span>
              <div className="flex gap-6">
                <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
                <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
};

export default Home;