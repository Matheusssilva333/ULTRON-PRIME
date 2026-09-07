import { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  AudioWaveform,
  BookOpen,
  Bot,
  BrainCircuit,
  CalendarDays,
  Check,
  ChevronRight,
  Circle,
  Code2,
  Command,
  Cpu,
  Gauge,
  GitBranch,
  Headphones,
  LayoutDashboard,
  ListChecks,
  Menu,
  Mic,
  MicOff,
  MoreHorizontal,
  Network,
  Pause,
  Play,
  Plus,
  Radio,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  SquareTerminal,
  Timer,
  TrendingUp,
  UserRound,
  Volume2,
  Workflow,
  Wrench,
  X,
} from "lucide-react";

type Panel = "Visão geral" | "Estudos" | "Engenharia" | "Rotinas" | "Projetos";
type Message = { role: "assistant" | "user"; text: string; time: string };

const navItems: { label: Panel; icon: typeof LayoutDashboard; detail: string }[] = [
  { label: "Visão geral", icon: LayoutDashboard, detail: "Cockpit" },
  { label: "Estudos", icon: BookOpen, detail: "Transpetro + Petrobras" },
  { label: "Engenharia", icon: Wrench, detail: "Projetos e cálculo" },
  { label: "Rotinas", icon: ListChecks, detail: "Hábitos e foco" },
  { label: "Projetos", icon: GitBranch, detail: "Código e automação" },
];

const suggestedPrompts = [
  "Organizar meu bloco de estudos de hoje",
  "Criar um plano de manutenção preventiva",
  "Explicar redes Linux para a prova",
];

const initialMessages: Message[] = [
  {
    role: "assistant",
    text: "Bom dia, Matheus. Todos os sistemas estão operacionais. Posso organizar seu turno, revisar um conceito de infraestrutura ou transformar uma ideia em um plano executável.",
    time: "08:42",
  },
  {
    role: "user",
    text: "Qual é a prioridade para hoje?",
    time: "08:43",
  },
  {
    role: "assistant",
    text: "Prioridade recomendada: 90 min de Redes e Segurança para o ciclo Transpetro, depois o checklist da automação do painel de utilidades. Seu hábito de leitura está em dia — 4 dias consecutivos.",
    time: "08:43",
  },
];

const studyModules = [
  { name: "Redes e Segurança", progress: 72, color: "cyan", meta: "12 de 16 sessões" },
  { name: "Linux e Servidores", progress: 58, color: "violet", meta: "7 de 12 sessões" },
  { name: "Governança de TI", progress: 41, color: "amber", meta: "5 de 12 sessões" },
];

function HologramFace({ listening }: { listening: boolean }) {
  return (
    <div className={`hologram ${listening ? "hologram--listening" : ""}`} aria-label="Avatar holográfico do Ultron Prime">
      <div className="hologram__rings" />
      <div className="hologram__halo hologram__halo--one" />
      <div className="hologram__halo hologram__halo--two" />
      <div className="hologram__scan" />
      <svg className="hologram__face" viewBox="0 0 260 300" role="img" aria-label="Rosto digital geométrico">
        <defs>
          <linearGradient id="faceStroke" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#9cf4ff" />
            <stop offset="0.45" stopColor="#4dd9ee" />
            <stop offset="1" stopColor="#7f63ff" />
          </linearGradient>
          <linearGradient id="faceFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#8eefff" stopOpacity=".18" />
            <stop offset="1" stopColor="#6762ff" stopOpacity=".04" />
          </linearGradient>
          <filter id="faceGlow">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d="M130 18 C78 18 43 62 43 125 v50 c0 61 38 96 87 107 49-11 87-46 87-107v-50C217 62 182 18 130 18Z" fill="url(#faceFill)" stroke="url(#faceStroke)" strokeWidth="2" filter="url(#faceGlow)" />
        <path d="M53 97 L28 123 M207 97 L232 123 M74 48 L59 28 M186 48 L201 28" stroke="#79ecff" strokeWidth="2" opacity=".8" />
        <path d="M72 106 L101 92 L130 103 L159 92 L188 106 L179 169 L157 206 L130 219 L103 206 L81 169Z" fill="#60dded" fillOpacity=".06" stroke="#62e5f4" strokeWidth="1.5" />
        <path d="M72 110 L99 103 M188 110 L161 103 M82 159 L104 166 L130 169 L156 166 L178 159" fill="none" stroke="#8ef2ff" strokeWidth="2" strokeLinecap="round" />
        <path d="M94 128 L116 122 L122 132 L102 137Z M166 128 L144 122 L138 132 L158 137Z" fill="#b6f8ff" fillOpacity=".2" stroke="#a3f5ff" strokeWidth="1.7" />
        <path d="M130 104 L130 169 M116 184 L130 191 L144 184 M101 205 L130 224 L159 205" fill="none" stroke="#7deefa" strokeWidth="1.6" />
        <path d="M91 230 L78 253 M169 230 L182 253 M115 239 L108 270 M145 239 L152 270" fill="none" stroke="#685fff" strokeWidth="2" opacity=".75" />
        <path d="M29 150 H64 M196 150 H231" stroke="#67e7f4" strokeWidth="1.3" opacity=".65" />
      </svg>
      <div className="hologram__label"><span className="hologram__dot" /> avatar prime / online</div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, detail, tone = "cyan" }: { icon: typeof Activity; label: string; value: string; detail: string; tone?: string }) {
  return (
    <div className={`metric-card metric-card--${tone}`}>
      <div className="metric-card__top"><span className="metric-card__icon"><Icon size={15} /></span><span className="eyebrow">{label}</span><MoreHorizontal size={15} className="ml-auto text-slate-600" /></div>
      <div className="metric-card__value">{value}</div>
      <div className="metric-card__detail">{detail}</div>
    </div>
  );
}

function PanelHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="section-kicker">{eyebrow}</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-.045em] text-white md:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{description}</p>
      </div>
      {action && <button className="button-secondary hidden shrink-0 md:inline-flex"><Settings2 size={14} /> {action}</button>}
    </div>
  );
}

export default function Home() {
  const [activePanel, setActivePanel] = useState<Panel>("Visão geral");
  const [mobileNav, setMobileNav] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [tasks, setTasks] = useState([false, true, false]);
  const [focusMode, setFocusMode] = useState(false);
  const [liveState, setLiveState] = useState("sistema estável");
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    return () => recognitionRef.current?.stop?.();
  }, []);

  const sendMessage = (preset?: string) => {
    const text = (preset ?? input).trim();
    if (!text) return;
    const now = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    setMessages((current) => [...current, { role: "user", text, time: now }]);
    setInput("");
    window.setTimeout(() => {
      const reply = text.toLowerCase().includes("estud")
        ? "Entendido. Vou priorizar um bloco de 50 minutos, com revisão ativa e 10 questões ao final. Sugestão: comece por Redes, subtema Segurança e protocolos."
        : text.toLowerCase().includes("manuten")
          ? "Plano estruturado: separar ativos críticos, definir periodicidade, registrar condição atual e criar uma janela de execução segura. Posso detalhar o checklist em seguida."
          : "Comando recebido. Estou em modo cockpit local: posso decompor a tarefa, estimar esforço e transformar o próximo passo em uma ação objetiva.";
      setMessages((current) => [...current, {
        role: "assistant",
        text: reply,
        time: now,
      }]);
    }, 550);
  };

  const toggleVoice = () => {
    if (listening) {
      recognitionRef.current?.stop?.();
      setListening(false);
      setLiveState("sistema estável");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setLiveState("voz indisponível neste navegador");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onstart = () => { setListening(true); setLiveState("escutando você"); };
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results).map((result: any) => result[0].transcript).join("");
      setInput(transcript);
    };
    recognition.onerror = () => { setListening(false); setLiveState("não consegui ouvir — tente novamente"); };
    recognition.onend = () => { setListening(false); setLiveState("sistema estável"); };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const openChat = () => {
    document.getElementById("chat-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
    inputRef.current?.focus();
  };

  const panelContent = () => {
    if (activePanel === "Estudos") {
      return <StudyPanel />;
    }
    if (activePanel === "Engenharia") {
      return <EngineeringPanel />;
    }
    if (activePanel === "Rotinas") {
      return <RoutinePanel tasks={tasks} setTasks={setTasks} focusMode={focusMode} setFocusMode={setFocusMode} />;
    }
    if (activePanel === "Projetos") {
      return <ProjectsPanel />;
    }
    return (
      <>
        <div className="metrics-grid">
          <MetricCard icon={Gauge} label="foco do dia" value="68%" detail="+14% contra ontem" />
          <MetricCard icon={BookOpen} label="ciclo de estudos" value="04h 20m" detail="meta diária: 05h" tone="violet" />
          <MetricCard icon={Workflow} label="automações" value="12" detail="3 executando agora" tone="amber" />
          <MetricCard icon={ShieldCheck} label="saúde do sistema" value="99.8%" detail="todos os serviços online" tone="green" />
        </div>
        <div className="overview-grid">
          <section className="panel panel--chat" id="chat-panel">
            <div className="panel-header">
              <div><div className="eyebrow">canal primário / inteligência</div><h2 className="panel-title">Converse com seu sistema</h2></div>
              <div className="status-chip"><span className="pulse-dot" /> contexto ativo</div>
            </div>
            <div className="chat-body">
              {messages.map((message, index) => (
                <div className={`message-row ${message.role === "user" ? "message-row--user" : ""}`} key={`${message.time}-${index}`}>
                  {message.role === "assistant" && <div className="message-avatar"><Bot size={15} /></div>}
                  <div className={`message-bubble ${message.role === "user" ? "message-bubble--user" : ""}`}><p>{message.text}</p><span>{message.time}</span></div>
                  {message.role === "user" && <div className="message-avatar message-avatar--user"><UserRound size={15} /></div>}
                </div>
              ))}
            </div>
            <div className="prompt-row">{suggestedPrompts.map((prompt) => <button key={prompt} onClick={() => sendMessage(prompt)} className="prompt-chip">{prompt}<ArrowUpRight size={12} /></button>)}</div>
            <div className="chat-input-wrap">
              <button className={`icon-button ${listening ? "icon-button--active" : ""}`} onClick={toggleVoice} aria-label={listening ? "Parar captura de voz" : "Usar voz"}>{listening ? <MicOff size={18} /> : <Mic size={18} />}</button>
              <input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }} placeholder={listening ? "Estou ouvindo..." : "Digite um comando ou uma pergunta..."} />
              <button className="send-button" onClick={() => sendMessage()} aria-label="Enviar mensagem"><Send size={16} /></button>
            </div>
          </section>
          <section className="panel panel--study">
            <div className="panel-header"><div><div className="eyebrow">missão atual / concurso</div><h2 className="panel-title">Rota de aprovação</h2></div><button className="round-action" onClick={() => setActivePanel("Estudos")} aria-label="Abrir estudos"><ChevronRight size={17} /></button></div>
            <div className="study-score"><div><span className="eyebrow">progresso geral</span><strong>61<span>%</span></strong></div><div className="score-ring"><span>+8%</span><small>semana</small></div></div>
            <div className="study-list">{studyModules.map((module) => <div className="study-item" key={module.name}><div className="study-item__top"><span>{module.name}</span><strong>{module.progress}%</strong></div><div className="progress-track"><div className={`progress-fill progress-fill--${module.color}`} style={{ width: `${module.progress}%` }} /></div><div className="study-item__meta">{module.meta}<span>{module.progress >= 60 ? "ritmo forte" : "em construção"}</span></div></div>)}</div>
            <button className="wide-action" onClick={() => setActivePanel("Estudos")}><Play size={14} fill="currentColor" /> iniciar sessão guiada <ChevronRight size={14} className="ml-auto" /></button>
          </section>
        </div>
      </>
    );
  };

  return (
    <main className="app-shell">
      <div className="ambient ambient--one" /><div className="ambient ambient--two" />
      <aside className={`sidebar ${mobileNav ? "sidebar--open" : ""}`}>
        <div className="brand"><div className="brand-mark"><span /><span /><span /></div><div><strong>ULTRON<span>PRIME</span></strong><small>personal intelligence system</small></div><button className="mobile-close" onClick={() => setMobileNav(false)}><X size={18} /></button></div>
        <div className="user-card"><div className="user-avatar">MS</div><div><strong>Matheus Silva</strong><span>engenharia / sistemas</span></div><span className="user-live" /></div>
        <nav className="nav-stack"><div className="nav-label">command center</div>{navItems.map((item) => { const Icon = item.icon; return <button key={item.label} className={`nav-item ${activePanel === item.label ? "nav-item--active" : ""}`} onClick={() => { setActivePanel(item.label); setMobileNav(false); }}><Icon size={17} /><span><strong>{item.label}</strong><small>{item.detail}</small></span>{activePanel === item.label && <span className="nav-active-line" />}</button>; })}</nav>
        <div className="sidebar-bottom"><div className="system-card"><div className="system-card__top"><span className="eyebrow">prime core</span><span className="system-badge">v0.1</span></div><div className="system-state"><span className="pulse-dot" /> online e protegido</div><div className="system-bars"><i /><i /><i /><i /><i /><i /><i /></div><span className="system-foot">última sincronização há 2 min</span></div><button className="settings-link"><Settings2 size={15} /> preferências do sistema</button></div>
      </aside>
      {mobileNav && <button className="mobile-backdrop" onClick={() => setMobileNav(false)} aria-label="Fechar menu" />}
      <section className="main-column">
        <header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(true)}><Menu size={20} /></button><div className="breadcrumb"><span>cockpit</span><ChevronRight size={14} /><strong>{activePanel.toLowerCase()}</strong></div><div className="topbar-actions"><div className="topbar-search"><Search size={15} /><input placeholder="Buscar comando" /><kbd>⌘ K</kbd></div><button className="top-icon"><CalendarDays size={17} /></button><button className="top-icon"><Radio size={17} /><span className="notification-dot" /></button></div></header>
        <div className="content-area">
          <div className="hero-row"><div><div className="eyebrow hero-eyebrow"><span className="pulse-dot" /> segunda-feira / 07 setembro 2026</div><h1 className="hero-title">Bom dia, <em>Matheus.</em></h1><p className="hero-copy">Seu cockpit pessoal para pensar melhor, executar com precisão e manter o próximo passo visível.</p></div><div className="hero-actions"><div className="clock-card"><span className="eyebrow">hora local</span><strong>08:46<span>32</span></strong><small>Brasília / UTC−03</small></div><button className="button-primary" onClick={openChat}><Sparkles size={15} /> falar com prime</button></div></div>
          <div className="live-strip"><div className="live-strip__left"><AudioWaveform size={16} /><span>prime live</span><strong>{liveState}</strong></div><div className="live-strip__right"><span><Circle size={7} fill="currentColor" /> 4 rotinas em execução</span><span className="divider-dot" /><span>latência 42 ms</span></div></div>
          <div className="workspace-heading"><div><div className="eyebrow">workspace / {activePanel.toLowerCase()}</div></div><div className="workspace-tools"><button className="tool-button" onClick={() => setFocusMode(!focusMode)}><Timer size={14} /> {focusMode ? "foco ativo" : "modo foco"}</button><button className="tool-button tool-button--icon"><MoreHorizontal size={16} /></button></div></div>
          {panelContent()}
        </div>
      </section>
      <aside className="right-rail">
        <div className="rail-head"><div><div className="eyebrow">visual interface</div><h2>Prime avatar</h2></div><button className="round-action"><MoreHorizontal size={17} /></button></div>
        <div className="avatar-stage"><HologramFace listening={listening} /><div className="avatar-stage__grid" /><div className="avatar-stage__corner avatar-stage__corner--tl" /><div className="avatar-stage__corner avatar-stage__corner--br" /></div>
        <div className="avatar-meta"><div><span className="eyebrow">status cognitivo</span><strong>{listening ? "processando voz" : "pronto para agir"}</strong></div><div className="voice-wave"><i /><i /><i /><i /><i /><i /><i /></div></div>
        <div className="rail-divider" />
        <section className="activity-section"><div className="rail-section-head"><div><div className="eyebrow">activity feed</div><h3>Em execução</h3></div><button className="text-button">ver tudo <ArrowUpRight size={12} /></button></div><div className="activity-list"><ActivityItem icon={Network} title="Monitoramento de rede" detail="interface eth0 / saudável" tone="cyan" /><ActivityItem icon={SquareTerminal} title="Backup incremental" detail="servidor de estudos / 68%" tone="violet" /><ActivityItem icon={BrainCircuit} title="Revisão espaçada" detail="próxima sessão em 23 min" tone="amber" /></div></section>
        <section className="quick-panel"><div className="rail-section-head"><div><div className="eyebrow">quick actions</div><h3>Atalhos operacionais</h3></div></div><div className="quick-grid"><button onClick={() => setActivePanel("Engenharia")}><Code2 size={16} /><span>gerar script</span></button><button onClick={() => setActivePanel("Rotinas")}><ListChecks size={16} /><span>nova tarefa</span></button><button onClick={() => setActivePanel("Estudos")}><BookOpen size={16} /><span>revisar tema</span></button><button onClick={toggleVoice}><Headphones size={16} /><span>modo voz</span></button></div></section>
        <div className="rail-footer"><span><ShieldCheck size={13} /> seus dados ficam neste dispositivo</span><button><Command size={13} /> atalhos</button></div>
      </aside>
    </main>
  );
}

function ActivityItem({ icon: Icon, title, detail, tone }: { icon: typeof Activity; title: string; detail: string; tone: string }) {
  return <div className="activity-item"><span className={`activity-icon activity-icon--${tone}`}><Icon size={15} /></span><span><strong>{title}</strong><small>{detail}</small></span><span className="activity-check"><Check size={12} /></span></div>;
}

function StudyPanel() {
  return <div className="detail-grid"><section className="panel detail-panel detail-panel--wide"><PanelHeading eyebrow="trilha de aprovação" title="Estudos Transpetro + Petrobras" description="Um plano adaptativo para Analista de Sistemas — Infraestrutura, com foco em constância, revisão e questões." action="ajustar trilha" /><div className="study-hero-card"><div><span className="eyebrow">próxima sessão recomendada</span><h2>Redes: segmentação e hardening</h2><p>50 min de teoria aplicada + 10 questões comentadas</p><button className="button-primary"><Play size={14} fill="currentColor" /> começar agora</button></div><div className="study-hero-number"><strong>07</strong><span>setembro<br />segunda</span></div></div><div className="detail-section-title"><h3>Mapa de domínio</h3><span>61% concluído</span></div><div className="domain-grid">{studyModules.map((module) => <div className="domain-card" key={module.name}><div className={`domain-card__icon domain-card__icon--${module.color}`}><BrainCircuit size={17} /></div><strong>{module.name}</strong><span>{module.meta}</span><div className="progress-track"><div className={`progress-fill progress-fill--${module.color}`} style={{ width: `${module.progress}%` }} /></div></div>)}</div></section><section className="panel detail-panel"><div className="panel-header"><div><div className="eyebrow">ritmo semanal</div><h2 className="panel-title">Consistência</h2></div><TrendingUp size={18} className="text-cyan-300" /></div><div className="consistency-number">4 <span>dias seguidos</span></div><div className="week-grid">{["S", "T", "Q", "Q", "S", "S", "D"].map((day, index) => <div className={`week-day ${index < 4 ? "week-day--done" : index === 4 ? "week-day--today" : ""}`} key={`${day}-${index}`}><span>{day}</span><i>{index < 4 ? <Check size={11} /> : index === 4 ? <Circle size={8} fill="currentColor" /> : ""}</i></div>)}</div><div className="streak-note"><Sparkles size={14} /><span>Mais 3 sessões para desbloquear o próximo marco.</span></div></section></div>;
}

function EngineeringPanel() {
  return <div className="detail-grid"><section className="panel detail-panel detail-panel--wide"><PanelHeading eyebrow="engineering desk" title="Engenharia & automação" description="Centralize cálculos, checklists, scripts e decisões técnicas em um fluxo assistido." action="novo workspace" /><div className="engineering-cards"><div className="engineering-card engineering-card--primary"><div className="engineering-card__icon"><Cpu size={21} /></div><span className="eyebrow">em destaque</span><h3>Planejamento de manutenção</h3><p>Estruture criticidade, periodicidade, recursos e janela de execução para o painel de utilidades.</p><div className="engineering-card__footer"><span>última edição / hoje, 08:12</span><ArrowUpRight size={14} /></div></div><div className="engineering-card"><div className="engineering-card__icon engineering-card__icon--violet"><SquareTerminal size={20} /></div><span className="eyebrow">programação</span><h3>Gerador de scripts</h3><p>Shell, Python e automações para tarefas repetitivas de infraestrutura.</p><div className="engineering-card__footer"><span>8 templates salvos</span><ArrowUpRight size={14} /></div></div><div className="engineering-card"><div className="engineering-card__icon engineering-card__icon--amber"><Gauge size={20} /></div><span className="eyebrow">análise</span><h3>Calculadora operacional</h3><p>Transforme premissas em estimativas, indicadores e cenários comparáveis.</p><div className="engineering-card__footer"><span>3 modelos recentes</span><ArrowUpRight size={14} /></div></div></div></section><section className="panel detail-panel"><div className="panel-header"><div><div className="eyebrow">processos</div><h2 className="panel-title">Automação ativa</h2></div><Workflow size={18} className="text-amber-300" /></div><div className="automation-list"><AutomationItem title="Checklist diário de servidores" meta="executa às 07:30" /><AutomationItem title="Resumo de estudos" meta="executa às 20:00" /><AutomationItem title="Sincronizar prioridades" meta="a cada 4 horas" /></div><button className="wide-action"><Plus size={14} /> criar automação <ChevronRight size={14} className="ml-auto" /></button></section></div>;
}

function AutomationItem({ title, meta }: { title: string; meta: string }) {
  const [enabled, setEnabled] = useState(true);
  return <div className="automation-item"><span className={`automation-status ${enabled ? "automation-status--on" : ""}`}><Radio size={13} /></span><span><strong>{title}</strong><small>{meta}</small></span><button className={`toggle ${enabled ? "toggle--on" : ""}`} onClick={() => setEnabled(!enabled)} aria-label={`Alternar ${title}`}><span /></button></div>;
}

function RoutinePanel({ tasks, setTasks, focusMode, setFocusMode }: { tasks: boolean[]; setTasks: (value: boolean[]) => void; focusMode: boolean; setFocusMode: (value: boolean) => void }) {
  const routineItems = ["Revisar prioridades do dia", "Sessão de estudo — Redes", "Caminhada de 30 minutos"];
  return <div className="detail-grid"><section className="panel detail-panel detail-panel--wide"><PanelHeading eyebrow="personal operating system" title="Rotinas e hábitos" description="Pequenas ações visíveis, organizadas para sustentar energia, foco e consistência." action="configurar hábitos" /><div className="routine-summary"><div><span className="eyebrow">sequência atual</span><strong>04 <small>dias</small></strong><span className="summary-caption">seu melhor: 12 dias</span></div><div className="routine-orbit"><div><Check size={17} /><span>em ritmo</span></div></div><div><span className="eyebrow">tempo em foco</span><strong>02:40 <small>hoje</small></strong><span className="summary-caption">meta: 04:00</span></div></div><div className="detail-section-title"><h3>Plano de hoje</h3><button className="text-button"><Plus size={12} /> adicionar</button></div><div className="routine-list">{routineItems.map((item, index) => <button className={`routine-item ${tasks[index] ? "routine-item--done" : ""}`} key={item} onClick={() => setTasks(tasks.map((value, taskIndex) => taskIndex === index ? !value : value))}><span className="routine-check">{tasks[index] && <Check size={13} />}</span><span><strong>{item}</strong><small>{index === 0 ? "08:30 / planejamento" : index === 1 ? "09:00 / 50 minutos" : "18:30 / recuperação"}</small></span><span className="routine-time">{tasks[index] ? "concluído" : "próximo"}</span></button>)}</div></section><section className="panel detail-panel focus-card"><div className="focus-card__glow" /><div className="eyebrow">modo foco</div><h2>{focusMode ? "Foco ativo." : "Uma coisa de cada vez."}</h2><p>{focusMode ? "Notificações reduzidas. Prime está monitorando o tempo e protegendo sua atenção." : "Ative uma sessão de 50 minutos para reduzir ruído e trabalhar no que importa."}</p><div className="focus-timer">{focusMode ? "49:32" : "50:00"}</div><button className={`wide-action ${focusMode ? "wide-action--active" : ""}`} onClick={() => setFocusMode(!focusMode)}>{focusMode ? <Pause size={14} /> : <Play size={14} fill="currentColor" />} {focusMode ? "pausar sessão" : "iniciar foco"}</button></section></div>;
}

function ProjectsPanel() {
  return <div className="detail-grid"><section className="panel detail-panel detail-panel--wide"><PanelHeading eyebrow="project systems" title="Projetos e código" description="Acompanhe frentes técnicas, próximos passos e blocos de execução sem perder o contexto." action="novo projeto" /><div className="project-list"><ProjectItem icon={Code2} title="Ultron Prime" detail="interface e capacidades do assistente" progress="em construção" tone="cyan" /><ProjectItem icon={Network} title="Infra Lab" detail="laboratório de redes e observabilidade" progress="planejamento" tone="violet" /><ProjectItem icon={Workflow} title="Automação de utilidades" detail="checklists e indicadores operacionais" progress="em execução" tone="amber" /></div></section><section className="panel detail-panel"><div className="panel-header"><div><div className="eyebrow">atividade recente</div><h2 className="panel-title">Linha do tempo</h2></div><GitBranch size={18} className="text-violet-300" /></div><div className="timeline"><div><span>08:12</span><p>Atualizou o plano de manutenção</p></div><div><span>07:45</span><p>Concluiu revisão de Linux</p></div><div><span>ontem</span><p>Criou o workspace Ultron Prime</p></div></div></section></div>;
}

function ProjectItem({ icon: Icon, title, detail, progress, tone }: { icon: typeof Code2; title: string; detail: string; progress: string; tone: string }) {
  return <div className="project-item"><span className={`project-icon project-icon--${tone}`}><Icon size={17} /></span><span className="project-copy"><strong>{title}</strong><small>{detail}</small></span><span className="project-progress"><i className={`progress-dot progress-dot--${tone}`} />{progress}</span><ChevronRight size={16} className="text-slate-600" /></div>;
}

export { HologramFace };
