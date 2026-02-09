import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import ProgressTracker from './components/ProgressTracker';

const HandmadeStar = ({ color, style }) => (
  <svg className="handmade-star" viewBox="0 0 100 100" style={style}>
    <path
      d="M50 12 Q55 15 65 38 Q67 40 92 42 Q94 42 72 58 Q70 60 78 85 Q79 87 52 72 Q50 70 25 85 Q23 87 32 60 Q33 58 10 42 Q8 42 35 40 Q38 38 50 12"
      fill={color}
      stroke="#333"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BackgroundStars = () => {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const containerRef = useRef(null);

  // Generate 36 stars in a 6x6 jittered grid for higher density
  const [stars] = useState(() => {
    const grid = [];
    const rows = 6;
    const cols = 6;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        grid.push({
          id: `${r}-${c}`,
          color: ['#FFAB91', '#8AB1B1', '#FFF59D'][(r + c) % 3],
          // Place in cell (approx 16.6% height, 16.6% width) with random jitter
          top: `${(r * 16.6) + (Math.random() * 12)}%`,
          left: `${(c * 16.6) + (Math.random() * 12)}%`,
          scale: 0.5 + Math.random() * 0.5, // Bigger stars
          rotate: `${Math.random() * 360}deg`,
          delay: `${Math.random() * -20}s`
        });
      }
    }
    return grid;
  });

  useEffect(() => {
    const handleMove = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', () => setMousePos({ x: -1000, y: -1000 }));

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, []);

  return (
    <div className="stars-container" ref={containerRef}>
      {stars.map((star) => {
        // Simple flee logic
        return (
          <InteractiveStar key={star.id} star={star} mousePos={mousePos} />
        );
      })}
    </div>
  );
};

const InteractiveStar = ({ star, mousePos }) => {
  const starRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!starRef.current) return;
    const rect = starRef.current.getBoundingClientRect();
    const starX = rect.left + rect.width / 2;
    const starY = rect.top + rect.height / 2;

    const dx = starX - mousePos.x;
    const dy = starY - mousePos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const radius = 150;

    if (distance < radius) {
      const power = (radius - distance) / radius;
      setOffset({
        x: (dx / distance) * power * 50,
        y: (dy / distance) * power * 50
      });
    } else {
      setOffset({ x: 0, y: 0 });
    }
  }, [mousePos]);

  return (
    <div
      ref={starRef}
      style={{
        position: 'absolute',
        top: star.top,
        left: star.left,
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${star.scale}) rotate(${star.rotate})`,
        transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
        animationDelay: star.delay
      }}
    >
      <HandmadeStar color={star.color} />
    </div>
  );
};

const StrawberryMascot = ({ isRunning }) => (
  <div className={`strawberry-mascot ${isRunning ? 'dancing' : 'idle'}`}>
    <div className="mascot-label">{isRunning ? "you're doing great!" : "time for a fresh start?"}</div>

    <div className="mascot-body-container">
      <svg width="120" height="130" viewBox="0 0 200 240">
        {/* Longer Dainty Arms */}
        <path className="arm arm-left" d="M45 110 Q10 120 25 145" stroke="#CF6B7F" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path className="arm arm-right" d="M155 110 Q190 120 175 145" stroke="#CF6B7F" strokeWidth="8" fill="none" strokeLinecap="round" />

        {/* Squishy Mochi Body */}
        <path d="M100 185 C150 185 180 145 180 95 C180 55 145 25 100 25 C55 25 20 55 20 95 C20 145 50 185 100 185 Z" fill="#CF6B7F" />

        {/* Matching Thick Dainty Legs */}
        <path className="leg leg-left" d="M75 180 L65 205" stroke="#CF6B7F" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path className="leg leg-right" d="M125 180 L135 205" stroke="#CF6B7F" strokeWidth="8" fill="none" strokeLinecap="round" />

        {/* Cuter Leaves */}
        <path d="M100 35 L120 10 L100 20 L80 10 Z" fill="#4B8B3B" />
        <path d="M100 35 L145 20 L115 40 Z" fill="#4B8B3B" />
        <path d="M100 35 L55 20 L85 40 Z" fill="#4B8B3B" />

        {/* SHIMMERING KAWAII Eyes */}
        <circle cx="65" cy="90" r="16" fill="#FFF" />
        <circle cx="135" cy="90" r="16" fill="#FFF" />
        <circle cx="65" cy="90" r="9" fill="#000" />
        <circle cx="135" cy="90" r="9" fill="#000" />
        <circle cx="69" cy="85" r="4" fill="#FFF" />
        <circle cx="139" cy="85" r="4" fill="#FFF" />
        <circle cx="60" cy="95" r="2" fill="#FFF" />
        <circle cx="130" cy="95" r="2" fill="#FFF" />

        {/* Soft Blush */}
        <circle cx="45" cy="115" r="9" fill="#FFB6C1" opacity="0.8" />
        <circle cx="155" cy="115" r="9" fill="#FFB6C1" opacity="0.8" />

        {/* Kawaii 'w' Mouth */}
        <path d="M85 130 Q92 138 100 130 Q108 138 115 130" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />

        {/* Small Scattered Seeds */}
        <circle cx="55" cy="65" r="2" fill="#FAD02E" />
        <circle cx="145" cy="65" r="2" fill="#FAD02E" />
        <circle cx="100" cy="155" r="2" fill="#FAD02E" />
        <circle cx="150" cy="100" r="2" fill="#FAD02E" opacity="0.4" />
        <circle cx="50" cy="100" r="2" fill="#FAD02E" opacity="0.4" />
      </svg>
    </div>
  </div>
);

function App() {
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);

  const [workDuration, setWorkDuration] = useState('25');
  const [shortBreakDuration, setShortBreakDuration] = useState('5');
  const [longBreakDuration, setLongBreakDuration] = useState('15');

  const [timeLeft, setTimeLeft] = useState(parseInt(workDuration) * 60);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Progress tracking state
  const [showProgress, setShowProgress] = useState(false);
  const [progressData, setProgressData] = useState({});

  const timerRef = useRef(null);
  const audioRef = useRef(new Audio('https://www.soundjay.com/buttons/beep-01a.mp3'));

  // Load progress data from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('pomodoro_history');
    if (savedProgress) {
      setProgressData(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress to localStorage whenever it changes
  const saveProgress = (count) => {
    const today = new Date().toISOString().split('T')[0];
    const newProgressData = { ...progressData, [today]: (progressData[today] || 0) + count };
    setProgressData(newProgressData);
    localStorage.setItem('pomodoro_history', JSON.stringify(newProgressData));
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      handleTimerComplete();
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    setIsRunning(false);

    if (isWorkTime) {
      const completed = pomodorosCompleted + 1;
      setPomodorosCompleted(completed);
      saveProgress(1); // Save to progress tracker
      const isLongBreak = completed % 4 === 0;

      if (window.confirm(isLongBreak ? "Break Time 🍹! Take a long break 🧘?" : "Break Time 🧁! Take a short break ☕?")) {
        startBreak(isLongBreak);
      }
    } else {
      if (window.confirm("Work Time 💼! Back to work! 💻?")) {
        startWork();
      }
    }
  };

  const startBreak = (isLong) => {
    setIsWorkTime(false);
    setTimeLeft(parseInt(isLong ? longBreakDuration : shortBreakDuration) * 60);
    setIsRunning(true);
  };

  const startWork = () => {
    setIsWorkTime(true);
    setTimeLeft(parseInt(workDuration) * 60);
    setIsRunning(true);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsWorkTime(true);
    setPomodorosCompleted(0);
    setTimeLeft(parseInt(workDuration) * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <BackgroundStars />
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>
      <div className="blob blob-4"></div>

      <button className="theme-toggle" onClick={toggleTheme}>
        {isDarkMode ? <span className="moon-icon">🌙</span> : <span className="sun-icon">☀️</span>}
      </button>

      <button className="progress-toggle" onClick={() => setShowProgress(true)}>
        <span className="chart-icon">📊</span>
      </button>

      <div className="glass-card">
        <StrawberryMascot isRunning={isRunning} />

        <div className="timer-section">
          <h1 className="timer-display">{formatTime(timeLeft)}</h1>
          <p className="status-text">{isWorkTime ? "🍓 focus time" : "🍹 break time"}</p>
        </div>

        <div className="settings-section">
          <div className="setting-group">
            <label>work</label>
            <input
              type="number"
              value={workDuration}
              onChange={(e) => setWorkDuration(e.target.value)}
              onBlur={() => !isRunning && isWorkTime && setTimeLeft(parseInt(workDuration) * 60)}
            />
          </div>
          <div className="setting-group">
            <label>short</label>
            <input
              type="number"
              value={shortBreakDuration}
              onChange={(e) => setShortBreakDuration(e.target.value)}
            />
          </div>
          <div className="setting-group">
            <label>long</label>
            <input
              type="number"
              value={longBreakDuration}
              onChange={(e) => setLongBreakDuration(e.target.value)}
            />
          </div>
        </div>

        <div className="controls-section">
          <button className="primary-button" onClick={toggleTimer}>
            {isRunning ? "stop" : (isWorkTime ? "start focus" : "start break")}
          </button>
          <button className="secondary-button" onClick={resetTimer}>
            reset
          </button>
        </div>

        <div className="stats-section">
          <p>completed cycles: {pomodorosCompleted}</p>
        </div>
      </div>

      <ProgressTracker
        show={showProgress}
        onClose={() => setShowProgress(false)}
        progressData={progressData}
      />
    </div >
  );
}

export default App;
