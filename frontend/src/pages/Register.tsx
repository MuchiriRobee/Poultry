import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../features/authSlice';
import { toast } from 'sonner';

const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

/* ── Illustrated panel for Register ── */
const RegisterIllustration = () => (
  <svg viewBox="0 0 460 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm mx-auto">
    <defs>
      <radialGradient id="glowB" cx="50%" cy="65%" r="55%">
        <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.3"/>
        <stop offset="100%" stopColor="#15803d" stopOpacity="0"/>
      </radialGradient>
    </defs>

    <ellipse cx="230" cy="320" rx="195" ry="130" fill="url(#glowB)"/>

    {/* Sky tones */}
    <path d="M0 330 Q115 285 230 305 Q345 325 460 282 L460 500 L0 500Z" fill="#bbf7d0" opacity="0.4"/>
    <path d="M0 358 Q135 328 250 344 Q370 360 460 330 L460 500 L0 500Z" fill="#86efac" opacity="0.35"/>
    <path d="M0 388 Q175 364 290 378 Q405 392 460 368 L460 500 L0 500Z" fill="#4ade80" opacity="0.28"/>

    {/* Sun */}
    <circle cx="370" cy="82" r="38" fill="#fbbf24" opacity="0.9">
      <animate attributeName="r" values="38;42;38" dur="4.5s" repeatCount="indefinite"/>
    </circle>
    {[0,45,90,135,180,225,270,315].map((a,i)=>(
      <line key={i}
        x1={370+Math.cos(a*Math.PI/180)*45} y1={82+Math.sin(a*Math.PI/180)*45}
        x2={370+Math.cos(a*Math.PI/180)*58} y2={82+Math.sin(a*Math.PI/180)*58}
        stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
    ))}

    {/* Coop */}
    <rect x="298" y="240" width="140" height="118" rx="4" fill="#d97706" opacity="0.82"/>
    <polygon points="284,240 452,240 368,180" fill="#b45309" opacity="0.9"/>
    <rect x="337" y="302" width="36" height="56" rx="4" fill="#92400e"/>
    <rect x="304" y="258" width="42" height="33" rx="3" fill="#fef9c3" opacity="0.6"/>
    <rect x="360" y="258" width="42" height="33" rx="3" fill="#fef9c3" opacity="0.6"/>

    {/* Female farmer — primary */}
    <g>
      <ellipse cx="143" cy="410" rx="34" ry="9" fill="#15803d" opacity="0.12"/>
      {/* legs */}
      <rect x="126" y="330" width="17" height="54" rx="7" fill="#1e3a5f"/>
      <rect x="147" y="330" width="17" height="54" rx="7" fill="#1e3a5f"/>
      {/* boots */}
      <rect x="122" y="376" width="25" height="13" rx="5" fill="#1c1917"/>
      <rect x="143" y="376" width="25" height="13" rx="5" fill="#1c1917"/>
      {/* dress/body */}
      <rect x="122" y="240" width="48" height="95" rx="13" fill="#7c3aed"/>
      {/* apron */}
      <rect x="131" y="256" width="28" height="64" rx="8" fill="#ddd6fe" opacity="0.65"/>
      {/* right arm — raised with seedling */}
      <rect x="88" y="250" width="38" height="12" rx="6" fill="#7c3aed">
        <animateTransform attributeName="transform" type="rotate" values="-20,88,256;-5,88,256;-20,88,256" dur="2.2s" repeatCount="indefinite"/>
      </rect>
      {/* left arm — down naturally */}
      <rect x="170" y="258" width="38" height="12" rx="6" fill="#7c3aed">
        <animateTransform attributeName="transform" type="rotate" values="8,170,264;18,170,264;8,170,264" dur="3s" repeatCount="indefinite"/>
      </rect>
      {/* neck */}
      <rect x="140" y="222" width="14" height="22" rx="5" fill="#fde68a"/>
      {/* head */}
      <circle cx="147" cy="209" r="25" fill="#fde68a"/>
      {/* hair */}
      <path d="M122 200 Q124 181 147 182 Q170 181 172 200" fill="#7c2d12"/>
      <path d="M122 200 Q116 213 124 224" fill="#7c2d12"/>
      <path d="M172 200 Q178 213 170 224" fill="#7c2d12"/>
      {/* headscarf */}
      <rect x="123" y="196" width="48" height="10" rx="5" fill="#f97316" opacity="0.75"/>
      {/* face */}
      <circle cx="140" cy="207" r="2.5" fill="#78350f"/>
      <circle cx="154" cy="207" r="2.5" fill="#78350f"/>
      <path d="M139 218 Q147 223 155 218" stroke="#78350f" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </g>

    {/* Seedling tray in raised hand */}
    <rect x="62" y="258" width="30" height="16" rx="4" fill="#92400e"/>
    {[68,76,84].map((x,i)=>(
      <g key={i}>
        <rect x={x} y={244+i%2*3} width="4" height={12-i} rx="2" fill="#15803d"/>
        <path d={`M${x+2} ${244+i%2*3} Q${x-3} ${238+i%2*3} ${x+2} ${240+i%2*3}`} fill="#22c55e" opacity="0.8"/>
      </g>
    ))}

    {/* Second farmer - male, background */}
    <g opacity="0.85">
      <rect x="218" y="278" width="38" height="78" rx="10" fill="#0369a1"/>
      <rect x="200" y="288" width="22" height="10" rx="5" fill="#0369a1">
        <animateTransform attributeName="transform" type="rotate" values="5,200,293;-8,200,293;5,200,293" dur="2s" repeatCount="indefinite"/>
      </rect>
      <rect x="256" y="285" width="22" height="10" rx="5" fill="#0369a1"/>
      <rect x="221" y="350" width="14" height="40" rx="6" fill="#1e3a5f"/>
      <rect x="238" y="350" width="14" height="40" rx="6" fill="#1e3a5f"/>
      <rect x="218" y="382" width="21" height="12" rx="4" fill="#1c1917"/>
      <rect x="235" y="382" width="21" height="12" rx="4" fill="#1c1917"/>
      <rect x="224" y="264" width="10" height="18" rx="5" fill="#fde68a"/>
      <circle cx="229" cy="258" r="20" fill="#fde68a"/>
      <ellipse cx="229" cy="241" rx="27" ry="8" fill="#92400e"/>
      <rect x="215" y="233" width="28" height="17" rx="4" fill="#b45309"/>
      <circle cx="223" cy="256" r="2.5" fill="#78350f"/>
      <circle cx="236" cy="256" r="2.5" fill="#78350f"/>
      <path d="M222 266 Q229 271 236 266" stroke="#78350f" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    </g>

    {/* Chickens */}
    {([
      [42, 400, 14, 10, '#fbbf24'],
      [75, 412, 12,  9, '#fde68a'],
      [104,405, 11,  8, '#d97706'],
      [270,395, 13,  9, '#fbbf24'],
    ] as [number,number,number,number,string][]).map(([cx, cy, rx2, ry2, fill], i) => (
      <g key={i}>
        <ellipse cx={cx} cy={cy} rx={rx2} ry={ry2} fill={fill}/>
        <circle cx={cx+9} cy={cy-6} r={ry2} fill={fill}/>
        <polygon points={`${cx+15},${cy-7} ${cx+21},${cy-4} ${cx+15},${cy-1}`} fill="#f97316"/>
        <path d={`M${cx+7},${cy-10} Q${cx+12},${cy-17} ${cx+15},${cy-10}`} fill="#ef4444"/>
        <circle cx={cx+12} cy={cy-7} r="1.6" fill="#1c1917"/>
        <line x1={cx} y1={cy+ry2} x2={cx-3} y2={cy+ry2+13} stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
        <line x1={cx+5} y1={cy+ry2} x2={cx+8} y2={cy+ry2+13} stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
        <animateTransform attributeName="transform" type="translate"
          values={`0,0;${i%2===0?2:-2},0;0,0`} dur={`${1.4+i*0.35}s`} repeatCount="indefinite"/>
      </g>
    ))}

    {/* Sparkles */}
    {[[30,150,4,'#fbbf24'],[400,165,3,'#4ade80'],[320,270,3,'#f97316'],[50,270,2.5,'#c084fc']].map(([x,y,r,c],i)=>(
      <circle key={i} cx={x} cy={y} r={r} fill={c as string} opacity="0.7">
        <animate attributeName="cy" values={`${y};${(y as number)-14};${y}`} dur={`${2.2+i*0.6}s`} repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.7;1;0.7" dur={`${2.2+i*0.6}s`} repeatCount="indefinite"/>
      </circle>
    ))}

    {/* Grass */}
    {[20,65,110,165,215,265,320,375,420].map((x,i)=>(
      <g key={i}>
        <path d={`M${x} 428 Q${x-5} 415 ${x-2} 422`} stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d={`M${x} 428 Q${x+5} 414 ${x+2} 421`} stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d={`M${x+8} 425 Q${x+13} 412 ${x+10} 420`} stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </g>
    ))}
  </svg>
);

/* ── Password strength indicator ── */
const PasswordStrength = ({ password }: { password: string }) => {
  const checks = [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'Contains a number', ok: /\d/.test(password) },
    { label: 'Contains uppercase', ok: /[A-Z]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ['#ef4444','#f97316','#22c55e'];
  const strengthLabels = ['Weak','Fair','Strong'];
  if (!password) return null;
  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5 flex-1">
          {[0,1,2].map(i => (
            <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{background: i < score ? colors[score-1] : '#e2e8f0'}}/>
          ))}
        </div>
        <span className="text-[11px] font-semibold" style={{color: score > 0 ? colors[score-1] : '#94a3b8'}}>
          {score > 0 ? strengthLabels[score-1] : ''}
        </span>
      </div>
      <div className="flex gap-3 flex-wrap">
        {checks.map((c,i) => (
          <span key={i} className="flex items-center gap-1 text-[11px]" style={{color: c.ok ? '#22c55e' : '#94a3b8'}}>
            <span>{c.ok ? '✓' : '○'}</span> {c.label}
          </span>
        ))}
      </div>
    </div>
  );
};

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVal, setPasswordVal] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await dispatch(registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      }) as any).unwrap();
      toast.success("Account created!", { description: "You can now sign in to your account." });
      navigate('/login');
    } catch (error: any) {
      toast.error("Registration failed", { description: error.message || "Something went wrong" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

        .font-display  { font-family: 'Playfair Display', Georgia, serif; }
        .font-body     { font-family: 'DM Sans', system-ui, sans-serif; }

        @keyframes slideUp    { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideRight { from { opacity:0; transform:translateX(-40px); } to { opacity:1; transform:translateX(0); } }
        @keyframes floatY     { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
        @keyframes pulseGlow  { 0%,100% { box-shadow:0 0 0 0 rgba(21,128,61,0.3); } 50% { box-shadow:0 0 0 14px rgba(21,128,61,0); } }

        .r-anim-1 { animation: slideUp 0.75s cubic-bezier(.22,1,.36,1) 0.05s both; }
        .r-anim-2 { animation: slideUp 0.75s cubic-bezier(.22,1,.36,1) 0.15s both; }
        .r-anim-3 { animation: slideUp 0.75s cubic-bezier(.22,1,.36,1) 0.25s both; }
        .r-anim-4 { animation: slideUp 0.75s cubic-bezier(.22,1,.36,1) 0.34s both; }
        .r-anim-5 { animation: slideUp 0.75s cubic-bezier(.22,1,.36,1) 0.43s both; }
        .r-anim-6 { animation: slideUp 0.75s cubic-bezier(.22,1,.36,1) 0.52s both; }
        .r-anim-7 { animation: slideUp 0.75s cubic-bezier(.22,1,.36,1) 0.60s both; }
        .r-panel  { animation: slideRight 0.9s cubic-bezier(.22,1,.36,1) 0.1s both; }
        .logo-pulse { animation: pulseGlow 2.8s ease-in-out infinite; }
        .float-el   { animation: floatY 4s ease-in-out infinite; }

        .rr-input {
          width: 100%;
          padding: 12px 15px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 14.5px;
          color: #0f172a;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none;
          box-sizing: border-box;
        }
        .rr-input:focus {
          border-color: #15803d;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(21,128,61,0.08);
        }
        .rr-input::placeholder { color: #94a3b8; }
        .dark .rr-input { background:#1e293b; border-color:#334155; color:#f1f5f9; }
        .dark .rr-input:focus { border-color:#4ade80; background:#0f172a; box-shadow:0 0 0 4px rgba(74,222,128,0.1); }

        .rr-label {
          display:block; font-size:12.5px; font-weight:600; color:#475569;
          margin-bottom:6px; letter-spacing:0.02em;
          font-family:'DM Sans',system-ui,sans-serif;
        }
        .dark .rr-label { color:#94a3b8; }

        .rr-submit {
          width:100%; padding:14px;
          border-radius:14px; background:#15803d;
          color:white; font-family:'DM Sans',system-ui,sans-serif;
          font-size:15.5px; font-weight:600; border:none; cursor:pointer;
          transition:background 0.2s,transform 0.15s,box-shadow 0.2s;
          display:flex; align-items:center; justify-content:center; gap:10px;
          box-shadow:0 4px 20px rgba(21,128,61,0.28);
        }
        .rr-submit:hover:not(:disabled) { background:#166534; box-shadow:0 6px 28px rgba(21,128,61,0.38); transform:translateY(-1px); }
        .rr-submit:active:not(:disabled) { transform:scale(0.98); }
        .rr-submit:disabled { opacity:0.65; cursor:not-allowed; }

        .rr-error { font-size:11.5px; color:#ef4444; margin-top:5px; font-family:'DM Sans',system-ui,sans-serif; }

        .grain-tex {
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events:none;
        }

        .divider-line {
          height:1px;
          background:linear-gradient(to right,transparent,#e2e8f0,transparent);
          margin:22px 0;
        }
        .dark .divider-line { background:linear-gradient(to right,transparent,#334155,transparent); }

        .back-btn {
          display:inline-flex; align-items:center; gap:8px;
          font-size:13px; font-weight:500; color:#64748b;
          transition:color 0.2s, gap 0.2s;
          background:none; border:none; cursor:pointer; padding:0;
          font-family:'DM Sans',system-ui,sans-serif;
        }
        .back-btn:hover { color:#15803d; gap:12px; }

        .benefit-row {
          display:flex; align-items:center; gap:10px;
          font-size:13px; color:rgba(255,255,255,0.75);
          font-family:'DM Sans',system-ui,sans-serif;
        }
        .benefit-dot {
          width:22px; height:22px; border-radius:50%;
          background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.25);
          display:flex; align-items:center; justify-content:center;
          flex-shrink:0; font-size:11px; color:white;
        }
      `}</style>

      <div className="font-body min-h-screen flex bg-white dark:bg-slate-950 overflow-hidden">

        {/* ── LEFT: Illustrated panel ── */}
        <div className="r-panel hidden lg:flex flex-col flex-1 relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 overflow-hidden items-center justify-center py-16">
          <div className="grain-tex absolute inset-0 z-0"/>
          <div className="absolute inset-0 opacity-[0.06]"
            style={{backgroundImage:'radial-gradient(circle at 1.5px 1.5px, white 1.5px, transparent 0)', backgroundSize:'28px 28px'}}/>
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-emerald-400/10 blur-3xl"/>
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white/5 blur-3xl"/>

          {/* Floating badges 
          <div className="float-el absolute top-14 left-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 text-white">
            <div className="text-xs text-white/60 mb-1">Avg. mortality reduction</div>
            <div className="font-display text-xl font-bold">↓ 25% 📉</div>
          </div>
          <div className="float-el absolute bottom-24 right-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 text-white" style={{animationDelay:'2s'}}>
            <div className="text-xs text-white/60 mb-1">Setup time</div>
            <div className="font-display text-xl font-bold">Under 60s ⚡</div>
          </div>*/}

          <div className="relative z-10 flex flex-col items-center px-10 text-white text-center">
            <RegisterIllustration/>

            <h2 className="font-display text-3xl font-700 mt-4 mb-3 leading-tight">
              Join Kenya's<br /><em className="not-italic text-emerald-300">Growing Farmers</em>
            </h2>
            <p className="text-white/65 text-[14px] font-light max-w-xs mb-7 leading-relaxed">
              Set up your farm, add your first flock, and start seeing insights in under 5 minutes.
            </p>

            <div className="w-full max-w-xs space-y-3 text-left">
              {[
                ['✓','Free to get started, no credit card'],
                ['✓','Real-time egg & mortality tracking'],
                ['✓','Generate reports for SACCO loans'],
                ['✓','Works on any phone or computer'],
              ].map(([icon, text],i)=>(
                <div key={i} className="benefit-row">
                  <div className="benefit-dot">{icon}</div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Form side ── */}
        <div className="flex-1 flex flex-col justify-start lg:justify-center px-8 py-10 lg:px-14 overflow-y-auto relative z-10">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-10 r-anim-1">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center text-lg logo-pulse">🐔</div>
              <span className="font-display font-700 text-lg text-slate-800 dark:text-slate-100">PoultryPro</span>
            </div>
            <button onClick={() => navigate('/')} className="back-btn">
              <ArrowLeft className="w-4 h-4"/> Back to Home
            </button>
          </div>

          <div className="w-full max-w-[420px] mx-auto lg:mx-0">
            {/* Header */}
            <div className="mb-8">
              <p className="r-anim-2 text-xs font-semibold tracking-widest uppercase text-emerald-600 dark:text-emerald-400 mb-3">New Account</p>
              <h1 className="r-anim-3 font-display text-[38px] leading-tight font-700 text-slate-900 dark:text-slate-50 mb-2">
                Start your poultry<br />
                <em className="not-italic text-emerald-600 dark:text-emerald-400">journey today</em>
              </h1>
              <p className="r-anim-4 text-slate-500 dark:text-slate-400 text-[14px] font-light">
                Create your free account in under a minute.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Name row */}
              <div className="r-anim-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="rr-label">First Name</label>
                  <input className="rr-input" placeholder="James" {...register('firstName')}/>
                  {errors.firstName && <p className="rr-error">⚠ {errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="rr-label">Last Name</label>
                  <input className="rr-input" placeholder="Mwangi" {...register('lastName')}/>
                  {errors.lastName && <p className="rr-error">⚠ {errors.lastName.message}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="r-anim-5">
                <label className="rr-label">Email Address</label>
                <div className="relative">
                  <input type="email" className="rr-input" placeholder="you@example.com" {...register('email')}/>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm">✉️</span>
                </div>
                {errors.email && <p className="rr-error">⚠ {errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="r-anim-5">
                <label className="rr-label">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="rr-input" placeholder="••••••••"
                    style={{paddingRight:'46px'}}
                    {...register('password', {
                      onChange: (e) => setPasswordVal(e.target.value)
                    })}
                  />
                  <button type="button" onClick={()=>setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors p-1">
                    {showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}
                  </button>
                </div>
                {errors.password && <p className="rr-error">⚠ {errors.password.message}</p>}
                <PasswordStrength password={passwordVal}/>
              </div>

              {/* Confirm Password */}
              <div className="r-anim-6">
                <label className="rr-label">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    className="rr-input" placeholder="••••••••"
                    style={{paddingRight:'46px'}}
                    {...register('confirmPassword')}
                  />
                  <button type="button" onClick={()=>setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors p-1">
                    {showConfirm ? <EyeOff size={17}/> : <Eye size={17}/>}
                  </button>
                </div>
                {errors.confirmPassword && <p className="rr-error">⚠ {errors.confirmPassword.message}</p>}
              </div>

              {/* Terms note */}
              <p className="r-anim-6 text-[11.5px] text-slate-400 dark:text-slate-500 leading-relaxed">
                By creating an account you agree to our{' '}
                <span className="text-emerald-600 cursor-pointer hover:underline">Terms of Service</span>{' '}and{' '}
                <span className="text-emerald-600 cursor-pointer hover:underline">Privacy Policy</span>.
              </p>

              <div className="r-anim-7 pt-1">
                <button type="submit" className="rr-submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Creating Account…
                    </>
                  ) : (
                    <>Create Free Account <ArrowRight className="h-4 w-4"/></>
                  )}
                </button>
              </div>
            </form>

            <div className="divider-line"/>

            <p className="r-anim-7 text-center text-[13.5px] text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 underline underline-offset-2 decoration-dotted">
                Sign in here →
              </Link>
            </p>
          </div>
        </div>

      </div>
    </>
  );
};

export default Register;