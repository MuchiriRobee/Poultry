import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../features/authSlice';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

/* ── Animated side panel illustration ── */
const LoginIllustration = () => (
  <svg viewBox="0 0 480 520" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm mx-auto">
    <defs>
      <radialGradient id="glowA" cx="50%" cy="60%" r="55%">
        <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#15803d" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Soft glow circle */}
    <ellipse cx="240" cy="310" rx="200" ry="140" fill="url(#glowA)" />

    {/* Rolling hills */}
    <path d="M0 340 Q120 295 240 315 Q360 335 480 290 L480 520 L0 520Z" fill="#bbf7d0" opacity="0.4"/>
    <path d="M0 370 Q140 340 260 355 Q380 370 480 340 L480 520 L0 520Z" fill="#86efac" opacity="0.35"/>
    <path d="M0 400 Q180 375 300 390 Q420 405 480 378 L480 520 L0 520Z" fill="#4ade80" opacity="0.3"/>

    {/* Morning sun */}
    <circle cx="390" cy="95" r="42" fill="#fbbf24" opacity="0.88">
      <animate attributeName="r" values="42;46;42" dur="5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.88;1;0.88" dur="5s" repeatCount="indefinite"/>
    </circle>
    {[0,40,80,120,160,200,240,280,320].map((a,i)=>(
      <line key={i}
        x1={390+Math.cos(a*Math.PI/180)*49} y1={95+Math.sin(a*Math.PI/180)*49}
        x2={390+Math.cos(a*Math.PI/180)*63} y2={95+Math.sin(a*Math.PI/180)*63}
        stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
    ))}

    {/* Farm house */}
    <rect x="295" y="255" width="148" height="120" rx="4" fill="#b91c1c" opacity="0.82"/>
    <polygon points="282,255 456,255 369,198" fill="#991b1b" opacity="0.9"/>
    <rect x="336" y="315" width="38" height="60" rx="4" fill="#7f1d1d"/>
    <rect x="302" y="272" width="44" height="33" rx="3" fill="#fef9c3" opacity="0.6"/>
    <rect x="362" y="272" width="44" height="33" rx="3" fill="#fef9c3" opacity="0.6"/>

    {/* Fence row */}
    {[20,50,80,110,140,170,200,230].map((x,i)=>(
      <g key={i}>
        <rect x={x} y="370" width="7" height="42" rx="3" fill="#d97706" opacity="0.65"/>
      </g>
    ))}
    <rect x="20" y="377" width="224" height="9" rx="4" fill="#b45309" opacity="0.55"/>
    <rect x="20" y="394" width="224" height="9" rx="4" fill="#b45309" opacity="0.55"/>

    {/* Farmer — welcoming pose */}
    <g>
      {/* shadow */}
      <ellipse cx="175" cy="418" rx="36" ry="9" fill="#15803d" opacity="0.15"/>
      {/* legs */}
      <rect x="158" y="338" width="18" height="52" rx="7" fill="#1e3a5f"/>
      <rect x="180" y="338" width="18" height="52" rx="7" fill="#1e3a5f"/>
      {/* boots */}
      <rect x="154" y="383" width="26" height="13" rx="5" fill="#1c1917"/>
      <rect x="176" y="383" width="26" height="13" rx="5" fill="#1c1917"/>
      {/* body */}
      <rect x="154" y="248" width="50" height="95" rx="13" fill="#15803d"/>
      {/* pocket detail */}
      <rect x="163" y="268" width="14" height="16" rx="4" fill="#166534"/>
      {/* left arm — raised welcome */}
      <rect x="108" y="246" width="50" height="13" rx="6.5" fill="#15803d">
        <animateTransform attributeName="transform" type="rotate" values="-25,108,252;-10,108,252;-25,108,252" dur="2s" repeatCount="indefinite"/>
      </rect>
      {/* right arm — down */}
      <rect x="202" y="258" width="44" height="13" rx="6.5" fill="#15803d">
        <animateTransform attributeName="transform" type="rotate" values="10,202,264;20,202,264;10,202,264" dur="3s" repeatCount="indefinite"/>
      </rect>
      {/* neck */}
      <rect x="171" y="228" width="16" height="24" rx="6" fill="#fde68a"/>
      {/* head */}
      <circle cx="179" cy="215" r="26" fill="#fde68a"/>
      {/* hat brim */}
      <ellipse cx="179" cy="193" rx="33" ry="9" fill="#92400e"/>
      {/* hat top */}
      <rect x="163" y="173" width="32" height="22" rx="5" fill="#b45309"/>
      {/* hat band */}
      <rect x="163" y="188" width="32" height="6" rx="2" fill="#15803d"/>
      {/* face */}
      <circle cx="172" cy="213" r="3" fill="#78350f"/>
      <circle cx="187" cy="213" r="3" fill="#78350f"/>
      <path d="M171 224 Q179 230 187 224" stroke="#78350f" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </g>

    {/* Egg basket */}
    <rect x="100" y="270" width="38" height="30" rx="6" fill="#d97706"/>
    <path d="M100 270 Q119 258 138 270" stroke="#b45309" strokeWidth="2.5" fill="none"/>
    <ellipse cx="110" cy="269" rx="6" ry="7" fill="#fefce8"/>
    <ellipse cx="121" cy="266" rx="6" ry="7" fill="#fefce8"/>
    <ellipse cx="132" cy="268" rx="5.5" ry="6.5" fill="#fefce8"/>

    {/* Chickens */}
    {[[60,400],[90,412],[118,404]].map(([cx,cy],i)=>(
      <g key={i}>
        <ellipse cx={cx} cy={cy} rx={14-i} ry={10-i*0.5} fill={['#fbbf24','#fde68a','#d97706'][i]}/>
        <circle cx={cx+10} cy={cy-6} r={8-i} fill={['#fbbf24','#fde68a','#d97706'][i]}/>
        <polygon points={`${cx+16},${cy-7} ${cx+22},${cy-4} ${cx+16},${cy-1}`} fill="#f97316"/>
        <path d={`M${cx+8},${cy-10} Q${cx+13},${cy-17} ${cx+16},${cy-10}`} fill="#ef4444"/>
        <circle cx={cx+13} cy={cy-7} r="1.8" fill="#1c1917"/>
        <line x1={cx} y1={cy+10} x2={cx-3} y2={cy+22} stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
        <line x1={cx+5} y1={cy+10} x2={cx+8} y2={cy+22} stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
        <animateTransform attributeName="transform" type="translate"
          values={`0,0;${i%2===0?2:-2},${i===1?1:0};0,0`} dur={`${1.6+i*0.4}s`} repeatCount="indefinite"/>
      </g>
    ))}

    {/* Floating sparkles */}
    {[[50,160,4,'#fbbf24'],[420,180,3,'#4ade80'],[340,280,3.5,'#f97316'],[60,280,2.5,'#fde68a']].map(([x,y,r,c],i)=>(
      <circle key={i} cx={x} cy={y} r={r} fill={c as string} opacity="0.7">
        <animate attributeName="cy" values={`${y};${(y as number)-12};${y}`} dur={`${2.5+i*0.5}s`} repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.7;1;0.7" dur={`${2.5+i*0.5}s`} repeatCount="indefinite"/>
      </circle>
    ))}

    {/* Grass tufts */}
    {[30,80,130,200,260,310,360,420,465].map((x,i)=>(
      <g key={i}>
        <path d={`M${x} 430 Q${x-5} 418 ${x-2} 425`} stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d={`M${x} 430 Q${x+5} 416 ${x+2} 424`} stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d={`M${x+8} 428 Q${x+12} 415 ${x+10} 422`} stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </g>
    ))}
  </svg>
);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await dispatch(loginUser(data) as any).unwrap();
      toast.success("Welcome back!", { description: "Redirecting to your dashboard…" });
      navigate('/dashboard');
    } catch (error: any) {
      toast.error("Login failed", { description: error.message || "Invalid email or password" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');

        .font-display  { font-family: 'Playfair Display', Georgia, serif; }
        .font-body     { font-family: 'DM Sans', system-ui, sans-serif; }

        @keyframes slideUp   { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideLeft { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
        @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
        @keyframes floatY    { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
        @keyframes pulseGlow { 0%,100% { box-shadow:0 0 0 0 rgba(21,128,61,0.3); } 50% { box-shadow:0 0 0 14px rgba(21,128,61,0); } }

        .anim-1 { animation: slideUp 0.75s cubic-bezier(.22,1,.36,1) 0.05s both; }
        .anim-2 { animation: slideUp 0.75s cubic-bezier(.22,1,.36,1) 0.18s both; }
        .anim-3 { animation: slideUp 0.75s cubic-bezier(.22,1,.36,1) 0.30s both; }
        .anim-4 { animation: slideUp 0.75s cubic-bezier(.22,1,.36,1) 0.42s both; }
        .anim-5 { animation: slideUp 0.75s cubic-bezier(.22,1,.36,1) 0.54s both; }
        .anim-6 { animation: slideUp 0.75s cubic-bezier(.22,1,.36,1) 0.64s both; }
        .panel-anim { animation: slideLeft 0.9s cubic-bezier(.22,1,.36,1) 0.1s both; }
        .logo-pulse { animation: pulseGlow 2.8s ease-in-out infinite; }
        .float-el { animation: floatY 4s ease-in-out infinite; }

        .pp-input {
          width: 100%;
          padding: 13px 16px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 15px;
          color: #0f172a;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none;
          box-sizing: border-box;
        }
        .pp-input:focus {
          border-color: #15803d;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(21,128,61,0.08);
        }
        .pp-input::placeholder { color: #94a3b8; }
        .dark .pp-input {
          background: #1e293b;
          border-color: #334155;
          color: #f1f5f9;
        }
        .dark .pp-input:focus {
          border-color: #4ade80;
          background: #0f172a;
          box-shadow: 0 0 0 4px rgba(74,222,128,0.1);
        }

        .pp-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 7px;
          letter-spacing: 0.02em;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .dark .pp-label { color: #94a3b8; }

        .submit-btn {
          width: 100%;
          padding: 15px;
          border-radius: 14px;
          background: #15803d;
          color: white;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 16px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 20px rgba(21,128,61,0.28);
        }
        .submit-btn:hover:not(:disabled) {
          background: #166534;
          box-shadow: 0 6px 28px rgba(21,128,61,0.38);
          transform: translateY(-1px);
        }
        .submit-btn:active:not(:disabled) { transform: scale(0.98); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .grain-tex {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .divider-line {
          height: 1px;
          background: linear-gradient(to right, transparent, #e2e8f0, transparent);
          margin: 28px 0;
        }
        .dark .divider-line { background: linear-gradient(to right, transparent, #334155, transparent); }

        .error-msg {
          font-size: 12px;
          color: #ef4444;
          margin-top: 5px;
          font-family: 'DM Sans', system-ui, sans-serif;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .trusted-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 12px;
          background: rgba(21,128,61,0.08);
          border: 1px solid rgba(21,128,61,0.15);
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #64748b;
          transition: color 0.2s, gap 0.2s;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .back-btn:hover { color: #15803d; gap: 12px; }
      `}</style>

      <div className="font-body min-h-screen flex bg-white dark:bg-slate-950 overflow-hidden">

        {/* ── LEFT: Form side ── */}
        <div className="flex-1 flex flex-col justify-center px-8 py-12 lg:px-16 relative z-10">
          {/* Top bar */}
          <div className="absolute top-8 left-8 lg:left-16 right-8 flex items-center justify-between">
            <div className="anim-1 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center text-lg logo-pulse">🐔</div>
              <span className="font-display font-700 text-lg text-slate-800 dark:text-slate-100">PoultryPro</span>
            </div>
            <button onClick={() => navigate('/')} className="back-btn anim-1">
              <ArrowLeft className="w-4 h-4"/>
              Back to Home
            </button>
          </div>

          <div className="w-full max-w-[420px] mx-auto mt-16 lg:mt-0">
            {/* Header */}
            <div className="mb-10">
              <p className="anim-2 text-xs font-semibold tracking-widest uppercase text-emerald-600 dark:text-emerald-400 mb-3">Welcome back</p>
              <h1 className="anim-3 font-display text-[42px] leading-tight font-700 text-slate-900 dark:text-slate-50 mb-3">
                Sign in to your<br />
                <em className="not-italic text-emerald-600 dark:text-emerald-400">farm dashboard</em>
              </h1>
              <p className="anim-4 text-slate-500 dark:text-slate-400 text-[15px] font-light leading-relaxed">
                Track your flocks, monitor production and grow with confidence.
              </p>
            </div>

            {/* Trusted badge */}
            <div className="anim-4 trusted-badge mb-8">
              <div className="flex -space-x-1.5">
                {['🧑🏿‍🌾','👩🏾‍🌾','👨🏽‍🌾'].map((e,i)=>(
                  <div key={i} className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900 border-2 border-white dark:border-slate-900 flex items-center justify-center text-sm">{e}</div>
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">200+ farmers</span> trust PoultryPro daily
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div className="anim-4">
                <label className="pp-label">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="pp-input"
                    {...register('email')}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base">✉️</span>
                </div>
                {errors.email && <p className="error-msg">⚠ {errors.email.message}</p>}
              </div>

              <div className="anim-5">
                <label className="pp-label">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pp-input"
                    style={{paddingRight: '48px'}}
                    {...register('password')}
                  />
                  <button type="button" onClick={()=>setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors p-1">
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
                {errors.password && <p className="error-msg">⚠ {errors.password.message}</p>}
                <div className="flex justify-end mt-2">
                  <Link to="#" className="text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 transition-colors">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div className="anim-6 pt-2">
                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Signing in…
                    </>
                  ) : (
                    <>Sign In <ArrowRight className="h-4 w-4"/></>
                  )}
                </button>
              </div>
            </form>

            <div className="divider-line"/>

            <p className="anim-6 text-center text-[14px] text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 underline underline-offset-2 decoration-dotted">
                Create one free →
              </Link>
            </p>
          </div>
        </div>

        {/* ── RIGHT: Illustrated panel ── */}
        <div className="panel-anim hidden lg:flex flex-1 relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900 overflow-hidden items-center justify-center">
          {/* Grain */}
          <div className="grain-tex absolute inset-0 z-0"/>
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.07]"
            style={{backgroundImage:'radial-gradient(circle at 1.5px 1.5px, white 1.5px, transparent 0)', backgroundSize:'28px 28px'}}/>
          {/* Diagonal decorative stripe */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 blur-3xl"/>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl"/>

          {/* Floating stats cards 
          <div className="float-el absolute top-12 right-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-4 text-white">
            <div className="text-xs text-white/60 mb-1 font-medium">Live Egg Count</div>
            <div className="font-display text-2xl font-bold">1,240 🥚</div>
          </div>
          <div className="float-el absolute bottom-20 left-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-4 text-white" style={{animationDelay:'1.8s'}}>
            <div className="text-xs text-white/60 mb-1 font-medium">Monthly Revenue</div>
            <div className="font-display text-2xl font-bold">KES 84k 💰</div>
          </div>*/}

          {/* Centre content */}
          <div className="relative z-10 flex flex-col items-center px-10 text-white text-center">
            <div className="w-full max-w-sm">
              <LoginIllustration/>
            </div>
            <h2 className="font-display text-3xl font-700 mt-6 mb-3 leading-tight">
              Your Farm,<br /><em className="not-italic text-emerald-300">Always in View</em>
            </h2>
            <p className="text-white/70 text-[15px] font-light max-w-xs leading-relaxed">
              Real-time dashboards, health records, and sales tracking — all in one place.
            </p>

            {/* Feature chips */}
            <div className="flex flex-wrap gap-2 justify-center mt-6">
              {['📊 Real-time Data','🐔 Flock Management','💰 Sales Tracking','🩺 Health Records'].map((f,i)=>(
                <span key={i} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-white/80">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Login;