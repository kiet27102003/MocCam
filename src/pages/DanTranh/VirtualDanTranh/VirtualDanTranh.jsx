// src/pages/DanTranh/VirtualDanTranh/VirtualDanTranh.jsx
// --- PHẦN 1/2 ---

import React, { useState, useEffect, useRef, useCallback } from 'react';
import './VirtualDanTranh.css';

// --- Hằng số và dữ liệu ---
const FINGER_TIP_LANDMARKS = [4, 8, 12];
const PLUCK_COOLDOWN_MS = 150;
const DAN_TRANH_CONFIG = {
  numStrings: 17, startX: 0.05, endX: 0.95, topY: 0.1, bottomY: 0.9, bridgeWidth: 40,
  stringColors: ['#FFD700', '#FFC700', '#FFB700', '#FFA700', '#FF9700', '#FF8700', '#FF7700', '#FF6700', '#FF5700', '#FF4700', '#FF3700', '#FF2700', '#FF1700', '#FF0700', '#F70000', '#E70000', '#D70000'],
  backgroundColor: '#8B4513',
  rhythmGame: { hitZoneXPercent: 0.74, noteRadius: 10, hitZoneColor: 'rgba(0, 255, 255, 0.7)', noteColor: 'rgba(255, 255, 255, 0.9)' },
};
const NOTE_NAMES = [
  'sounds/1_G.wav', 'sounds/1_A.wav', 'sounds/1_C.wav', 'sounds/1_D.wav', 'sounds/1_E.wav',
  'sounds/2_G.wav', 'sounds/2_A.wav', 'sounds/2_C.wav', 'sounds/2_D.wav', 'sounds/2_E.wav',
  'sounds/3_G.wav', 'sounds/3_A.wav', 'sounds/3_C.wav', 'sounds/3_D.wav', 'sounds/3_E.wav',
  'sounds/4_G.wav', 'sounds/4_A.wav'
];
const NOTE_FILES = NOTE_NAMES.map(relativePath => new URL(relativePath, window.location.origin).href);
const SONGS = {
  trongcom: {
    name: "Trống Cơm (Nâng cao)", speed: 80,
    notes: [
      { time: 1000, string: 5 }, { time: 1400, string: 6 }, { time: 1800, string: 7 }, { time: 2200, string: 5 },
      { time: 3200, string: 0 }, { time: 3600, string: 0 }, { time: 4000, string: 2 }, { time: 4400, string: 2 }, { time: 4800, string: 3 }, { time: 5000, string: 2 }, { time: 5400, string: 0 },
      { time: 6400, string: 5 }, { time: 6800, string: 4 }, { time: 7000, string: 5 }, { time: 7400, string: 7 }, { time: 7800, string: 5 }, { time: 8000, string: 7 },
      { time: 9000, string: 2 }, { time: 9400, string: 2 }, { time: 9800, string: 0 }, { time: 10200, string: 4 }, { time: 10600, string: 5 }, { time: 11000, string: 5 },
      { time: 12000, string: 2 }, { time: 12400, string: 2 }, { time: 12800, string: 0 }, { time: 13200, string: 4 }, { time: 13600, string: 5 }, { time: 14000, string: 5 },
      { time: 15200, string: 2 }, { time: 15600, string: 2 }, { time: 16000, string: 3 }, { time: 16200, string: 2 }, { time: 16600, string: 3 }, { time: 17000, string: 4 },
      { time: 17800, string: 2 }, { time: 18200, string: 2 }, { time: 18600, string: 3 }, { time: 19000, string: 2 }, { time: 19400, string: 3 }, { time: 19800, string: 4 },
      { time: 20800, string: 4 }, { time: 21200, string: 4 }, { time: 21600, string: 5 }, { time: 22000, string: 6 }, { time: 22200, string: 5 }, { time: 22600, string: 6 }, { time: 22800, string: 5 }, { time: 23200, string: 6 }, { time: 23600, string: 7 },
      { time: 24600, string: 2 }, { time: 25000, string: 2 }, { time: 25400, string: 1 }, { time: 25600, string: 0 }, { time: 26000, string: 1 }, { time: 26400, string: 2 }, { time: 26600, string: 0 }, { time: 27000, string: 1 }, { time: 27400, string: 2 }, { time: 27800, string: 1 }, { time: 28200, string: 0 },
      { time: 29400, string: 0 }, { time: 29800, string: 0 }, { time: 30200, string: 2 }, { time: 30600, string: 2 }, { time: 31000, string: 0 }, { time: 31200, string: 1 }, { time: 31600, string: 0 }, { time: 31800, string: 1 }, { time: 32200, string: 2 },
      { time: 33200, string: 0 }, { time: 33600, string: 0 }, { time: 34000, string: 2 }, { time: 34400, string: 2 }, { time: 34800, string: 0 }, { time: 35000, string: 1 }, { time: 35400, string: 0 }, { time: 35600, string: 1 }, { time: 36000, string: 2 },
      { time: 37200, string: 2 }, { time: 37600, string: 2 }, { time: 38000, string: 3 }, { time: 38200, string: 2 }, { time: 38600, string: 3 }, { time: 39000, string: 0 },
      { time: 40000, string: 10 }, { time: 40800, string: 6 }, { time: 41200, string: 5 }, { time: 41600, string: 5 }, { time: 42000, string: 4 }, { time: 42400, string: 5 }, { time: 42800, string: 4 }, { time: 43000, string: 3 }, { time: 43200, string: 4 },
      { time: 44200, string: 4 }, { time: 44600, string: 4 }, { time: 45000, string: 5 }, { time: 45400, string: 5 }, { time: 45800, string: 4 }, { time: 46200, string: 3 }, { time: 46400, string: 2 }, { time: 46800, string: 1 }, { time: 47200, string: 2 }, { time: 47600, string: 1 }, { time: 48000, string: 0 },
      { time: 49200, string: 6 }, { time: 49500, string: 5 }, { time: 50000, string: 4 }, { time: 50400, string: 5 }, { time: 50800, string: 4 }, { time: 51200, string: 5 }, { time: 51600, string: 4 }, { time: 51800, string: 3 }, { time: 52200, string: 2 },
      { time: 53200, string: 0 }, { time: 54000, string: 2 },
    ]
  }
};

// --- Helper Drawing Functions ---
function drawConnections(ctx, landmarks, width, height) {
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
    ctx.lineWidth = 2;
    const connections = window.Hands.HAND_CONNECTIONS;
    if (connections) {
        ctx.beginPath();
        for (const conn of connections) {
            const a = landmarks[conn[0]];
            const b = landmarks[conn[1]];
            if (a && b) {
                ctx.moveTo(a.x * width, a.y * height);
                ctx.lineTo(b.x * width, b.y * height);
            }
        }
        ctx.stroke();
    }
}

function drawLandmarks(ctx, landmarks, width, height) {
    const fingerColors = ['#ff4444', '#44ff44', '#4444ff', '#ffbb33', '#aa44ff'];
    const fingers = [ [0, 1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16], [17, 18, 19, 20] ];
    for (let f = 0; f < fingers.length; f++) {
        ctx.fillStyle = fingerColors[f];
        ctx.beginPath();
        for (const i of fingers[f]) {
            const lm = landmarks[i];
            if (lm) {
                const x = lm.x * width;
                const y = lm.y * height;
                ctx.moveTo(x, y);
                ctx.arc(x, y, 5, 0, 2 * Math.PI);
            }
        }
        ctx.fill();
    }
}

function VirtualDanTranh() {
    // Refs
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const staticCanvasRef = useRef(document.createElement('canvas'));
    const handsRef = useRef(null);
    const cameraInstanceRef = useRef(null);
    const audioContextRef = useRef(null);
    const audioBuffersRef = useRef([]);
    const danTranhStringsRef = useRef([]);
    const stringStatesRef = useRef([]);
    const lastPluckTimeRef = useRef([]);
    const prevHandsRef = useRef([]);
    const lastFrameTimeRef = useRef(performance.now());
    const onResultsRef = useRef();
    const frameCountRef = useRef(0);
    const lastFpsTimeRef = useRef(Date.now());

    // State
    const [statusText, setStatusText] = useState('Đang tải...');
    const [statusClass, setStatusClass] = useState('status-loading');
    const [handCount, setHandCount] = useState(0);
    const [fps, setFps] = useState(0);
    const [availableCameras, setAvailableCameras] = useState([]);
    const [currentCamera, setCurrentCamera] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDanTranh, setShowDanTranh] = useState(true);
    const [showHands, setShowHands] = useState(true);
    const [songSelect, setSongSelect] = useState('');
    const [isPlayingSong, setIsPlayingSong] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [songStartTime, setSongStartTime] = useState(0);
    const [fallingNotes, setFallingNotes] = useState([]);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);

    const playNote = useCallback(async (stringIndex) => {
        if (!audioContextRef.current || !audioBuffersRef.current[stringIndex]) return;
        if (audioContextRef.current.state === 'suspended') await audioContextRef.current.resume();
        const buffer = audioBuffersRef.current[stringIndex];
        const src = audioContextRef.current.createBufferSource();
        src.buffer = buffer;
        src.connect(audioContextRef.current.destination);
        src.start(0);
    }, []);

    const handlePluck = useCallback((stringIndex) => {
        if (!isPlayingSong || isGameOver) return;
        const elapsed = performance.now() - songStartTime;
        const width = canvasRef.current.width;
        const speedX = width * 0.00025;
        const hitZoneX = width * DAN_TRANH_CONFIG.rhythmGame.hitZoneXPercent;
        let bestNote = null;
        let bestDiff = Infinity;
        
        const remainingNotes = [];
        let noteHit = false;

        for (const note of fallingNotes) {
            if (note.string === stringIndex && !noteHit) {
                const noteX = width * 0.1 + (elapsed - note.time) * speedX;
                const diff = Math.abs(noteX - hitZoneX);
                if (diff < bestDiff && diff < 40) { // Only consider notes within hit range
                    bestDiff = diff;
                    bestNote = note;
                }
            }
        }

        if (bestNote) {
            setScore(s => s + Math.max(0, 100 - Math.floor(bestDiff * 2)));
            setCombo(c => {
                const newCombo = c + 1;
                setMaxCombo(mc => Math.max(mc, newCombo));
                return newCombo;
            });
            // Filter out the hit note
            setFallingNotes(notes => notes.filter(n => n !== bestNote));
        } else {
            setCombo(0);
        }
    }, [isPlayingSong, isGameOver, songStartTime, fallingNotes]);

    const drawDanTranh = useCallback((ctx, width, height) => {
        if (showDanTranh) {
            ctx.fillStyle = DAN_TRANH_CONFIG.backgroundColor;
            ctx.fillRect(0, 0, width, height);
        } else {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, width, height);
            return;
        }
        if (danTranhStringsRef.current.length === 0) return;

        const startX = danTranhStringsRef.current[0].startX;
        const endX = danTranhStringsRef.current[0].endX;
        const topY = danTranhStringsRef.current[0].y;
        const bottomY = danTranhStringsRef.current[danTranhStringsRef.current.length - 1].y;
        
        danTranhStringsRef.current.forEach((string, i) => {
            // ... (Full drawing logic for each string)
            const y = string.y;
            const bridgeX = string.startX + (string.endX - string.startX) * 0.7;
            const bridgeWidth = DAN_TRANH_CONFIG.bridgeWidth;
            const bridgeGradient = ctx.createLinearGradient(bridgeX, y - 8, bridgeX, y + 8);
            bridgeGradient.addColorStop(0, 'rgba(160, 82, 45, 0.6)');
            bridgeGradient.addColorStop(0.5, 'rgba(205, 133, 63, 0.8)');
            bridgeGradient.addColorStop(1, 'rgba(160, 82, 45, 0.6)');
            ctx.fillStyle = bridgeGradient;
            ctx.beginPath();
            ctx.moveTo(bridgeX, y);
            ctx.lineTo(bridgeX + bridgeWidth, y - 8);
            ctx.lineTo(bridgeX + bridgeWidth, y + 8);
            ctx.closePath();
            ctx.fill();
            
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(string.startX, y + 2);
            ctx.lineTo(string.endX, y + 2);
            ctx.stroke();

            const color = DAN_TRANH_CONFIG.stringColors[i] || '#FFD700';
            const stringGradient = ctx.createLinearGradient(string.startX, y, string.endX, y);
            stringGradient.addColorStop(0, color);
            stringGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
            stringGradient.addColorStop(1, color);
            ctx.strokeStyle = stringGradient;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(string.startX, y);
            ctx.lineTo(string.endX, y);
            ctx.stroke();

            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(i + 1, string.startX - 30, y + 5);
        });
    }, [showDanTranh]);

    const drawRhythmElements = useCallback((ctx, width, height) => {
        if (danTranhStringsRef.current.length === 0) return;
        const config = DAN_TRANH_CONFIG.rhythmGame;
        const hitZoneX = width * config.hitZoneXPercent;
        ctx.strokeStyle = config.hitZoneColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(hitZoneX, danTranhStringsRef.current[0].y - 20);
        ctx.lineTo(hitZoneX, danTranhStringsRef.current[danTranhStringsRef.current.length - 1].y + 20);
        ctx.stroke();
        danTranhStringsRef.current.forEach(string => {
            ctx.beginPath();
            ctx.arc(hitZoneX, string.y, config.noteRadius, 0, 2 * Math.PI);
            ctx.fillStyle = config.noteColor;
            ctx.fill();
        });
    }, []);

// src/pages/DanTranh/VirtualDanTranh/VirtualDanTranh.jsx
// --- PHẦN 2/2 ---

    const initializeAppDanTranh = useCallback(() => {
        const video = videoRef.current;
        if (!video || !video.videoWidth) return;
        
        const staticCanvas = staticCanvasRef.current;
        const width = video.videoWidth;
        const height = video.videoHeight;
        staticCanvas.width = width;
        staticCanvas.height = height;

        const newStrings = [];
        const { startX, endX, topY, bottomY, numStrings } = DAN_TRANH_CONFIG;
        const spacingDivisor = numStrings > 1 ? numStrings - 1 : 1;
        const stringSpacing = (height * bottomY - height * topY) / spacingDivisor;

        for (let i = 0; i < numStrings; i++) {
            newStrings.push({
                id: i, y: height * topY + i * stringSpacing,
                startX: width * startX, endX: width * endX,
            });
        }
        danTranhStringsRef.current = newStrings;
        stringStatesRef.current = new Array(numStrings).fill(0);
        lastPluckTimeRef.current = new Array(numStrings).fill(0);

        const staticCtx = staticCanvas.getContext('2d');
        staticCtx.clearRect(0, 0, width, height);
        drawDanTranh(staticCtx, width, height);
    }, [drawDanTranh]);
    
    onResultsRef.current = useCallback((results) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const canvasCtx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const now = performance.now();

        canvasCtx.clearRect(0, 0, width, height);
        
        // Background drawing
        if (showDanTranh) {
            canvasCtx.drawImage(staticCanvasRef.current, 0, 0);
        } else {
            canvasCtx.save();
            canvasCtx.scale(-1, 1);
            canvasCtx.translate(-width, 0);
            canvasCtx.drawImage(videoRef.current, 0, 0, width, height);
            canvasCtx.restore();
        }

        setHandCount(results.multiHandLandmarks ? results.multiHandLandmarks.length : 0);

        if (showHands && results.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
                // Selfie mode flips the landmarks, so we draw them directly
                drawConnections(canvasCtx, landmarks, width, height);
                drawLandmarks(canvasCtx, landmarks, width, height);
            }
        }
        
        // Plucking Logic
        if (!isGameOver) {
            const dt = Math.max(1, now - lastFrameTimeRef.current);
            lastFrameTimeRef.current = now;
            const currentHands = [];
            if (results.multiHandLandmarks) {
                for (let i = 0; i < results.multiHandLandmarks.length; i++) {
                    const label = results.multiHandedness[i]?.label || 'hand' + i;
                    currentHands.push({ label, landmarks: results.multiHandLandmarks[i] });
                }
            }
        
            for (const hand of currentHands) {
                const prev = prevHandsRef.current.find(h => h.label === hand.label);
                for (const idx of FINGER_TIP_LANDMARKS) {
                    const cur = hand.landmarks[idx];
                    const prevTip = prev ? prev.landmarks[idx] : null;
                    if (!cur || !prevTip) continue;

                    const curX = cur.x * width;
                    const curY = cur.y * height;
                    const prevY = prevTip.y * height;
                    const velY = (curY - prevY) / dt;
                    
                    for (const string of danTranhStringsRef.current) {
                        const overX = curX > string.startX && curX < string.endX;
                        const crossed = (prevY < string.y && curY >= string.y) || (prevY > string.y && curY <= string.y);

                        if (overX && crossed && Math.abs(velY) > 0.05) {
                            const nowMs = performance.now();
                            if (nowMs - lastPluckTimeRef.current[string.id] >= PLUCK_COOLDOWN_MS) {
                                lastPluckTimeRef.current[string.id] = nowMs;
                                stringStatesRef.current[string.id] = 10;
                                playNote(string.id);
                                if (isPlayingSong) handlePluck(string.id);
                                break;
                            }
                        }
                    }
                }
            }
            prevHandsRef.current = currentHands.map(h => ({ label: h.label, landmarks: JSON.parse(JSON.stringify(h.landmarks)) }));
        }

        // String vibration effect
        for (let i = 0; i < danTranhStringsRef.current.length; i++) {
            const string = danTranhStringsRef.current[i];
            if (!string) continue;
            if (stringStatesRef.current[i] > 0) stringStatesRef.current[i]--;
            if (stringStatesRef.current[i] > 0) {
                 const amp = Math.sin(now / 30) * stringStatesRef.current[i] * 0.4;
                 const gradient = canvasCtx.createLinearGradient(string.startX, string.y, string.endX, string.y);
                 gradient.addColorStop(0, "#ffb347"); gradient.addColorStop(1, "#ffd700");
                 canvasCtx.strokeStyle = gradient; canvasCtx.lineWidth = 2; canvasCtx.beginPath();
                 const midY = string.y + amp * Math.sin((i * 0.5 + now / 120) % Math.PI);
                 canvasCtx.moveTo(string.startX, midY - Math.sin(now/25));
                 canvasCtx.lineTo(string.endX, midY + Math.sin(now/25));
                 canvasCtx.stroke();
            }
        }

        // FPS Calculation
        const frameCount = frameCountRef.current + 1;
        frameCountRef.current = frameCount;
        const nowTime = Date.now();
        if (nowTime - lastFpsTimeRef.current >= 1000) {
            setFps(frameCount);
            frameCountRef.current = 0;
            lastFpsTimeRef.current = nowTime;
        }

        // Game Logic
        if (isPlayingSong) {
            const elapsed = now - songStartTime;
            const speedX = width * 0.00025;

            // Draw and update falling notes
            const updatedFallingNotes = [];
            for (const note of fallingNotes) {
                const targetString = danTranhStringsRef.current[note.string];
                if (!targetString) continue;

                const t = elapsed - note.time;
                const x = width * 0.1 + t * speedX;

                if (x < width * 1.1) { // Keep drawing until slightly off-screen
                    if (x > -20) {
                        const y = targetString.y;
                        canvasCtx.beginPath();
                        canvasCtx.arc(x, y, 12, 0, Math.PI * 2);
                        canvasCtx.fillStyle = 'rgba(255,255,255,0.9)';
                        canvasCtx.fill();
                    }
                    updatedFallingNotes.push(note);
                } else {
                    setCombo(0); // Note missed
                }
            }
            if (updatedFallingNotes.length !== fallingNotes.length) {
                setFallingNotes(updatedFallingNotes);
            }
        }

        // Game Over check
        if (isPlayingSong && fallingNotes.length === 0) {
            setIsPlayingSong(false);
            setIsGameOver(true);
        }

        if (isGameOver) {
            // Draw game over screen logic
        }

    }, [handlePluck, isGameOver, isPlayingSong, playNote, showDanTranh, showHands, songStartTime, fallingNotes]);

    useEffect(() => {
        let isMounted = true;
        async function setup() {
            try {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                const buffers = await Promise.all(NOTE_FILES.map(async (filePath) => {
                    const response = await fetch(filePath);
                    if (!response.ok) throw new Error(`Không thể tải ${filePath}`);
                    const buffer = await response.arrayBuffer();
                    return await audioContextRef.current.decodeAudioData(buffer);
                }));
                audioBuffersRef.current = buffers;

                const hands = new window.Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
                hands.setOptions({ selfieMode: true, maxNumHands: 2, modelComplexity: 0, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
                hands.onResults((results) => onResultsRef.current?.(results));
                handsRef.current = hands;

                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(d => d.kind === 'videoinput');
                if (isMounted) {
                    setAvailableCameras(videoDevices);
                    if (videoDevices.length > 0) setCurrentCamera(videoDevices[0].deviceId);
                    else throw new Error('Không tìm thấy camera nào.');
                }
            } catch (err) {
                if (isMounted) setError(err.message);
            }
        }
        setup();
        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        if (!currentCamera || !handsRef.current) return;

        let isCancelled = false;
        const startCamera = async () => {
            setIsLoading(true); setError(null);
            if (cameraInstanceRef.current) cameraInstanceRef.current.stop();
            const video = videoRef.current;
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: currentCamera }, width: 1280, height: 720 } });
                if (isCancelled) { stream.getTracks().forEach(t => t.stop()); return; }
                video.srcObject = stream;
                await new Promise(resolve => { video.onloadedmetadata = resolve; });
                if (isCancelled) return;
                
                video.play();
                canvasRef.current.width = video.videoWidth;
                canvasRef.current.height = video.videoHeight;
                initializeAppDanTranh();

                const camera = new window.Camera(video, {
                    onFrame: async () => await handsRef.current.send({ image: video }),
                    width: 1280, height: 720
                });
                camera.start();
                cameraInstanceRef.current = camera;
                
                setStatusText('Đang phát hiện'); setStatusClass('status-detecting'); setIsLoading(false);
            } catch (err) {
                setError(`Không thể truy cập camera: ${err.message}`); setIsLoading(false);
            }
        };
        startCamera();
        return () => {
            isCancelled = true;
            cameraInstanceRef.current?.stop();
            videoRef.current?.srcObject?.getTracks().forEach(t => t.stop());
        };
    }, [currentCamera, initializeAppDanTranh]);

    const handleStartSong = () => {
        if (!songSelect) return alert('Vui lòng chọn bài hát!');
        const songData = SONGS[songSelect];
        setIsPlayingSong(true); setIsGameOver(false);
        setScore(0); setCombo(0); setMaxCombo(0);
        setFallingNotes(JSON.parse(JSON.stringify(songData.notes)));
        setSongStartTime(performance.now());
        const staticCtx = staticCanvasRef.current.getContext('2d');
        staticCtx.clearRect(0, 0, staticCanvasRef.current.width, staticCanvasRef.current.height);
        drawDanTranh(staticCtx, staticCanvasRef.current.width, staticCanvasRef.current.height);
        drawRhythmElements(staticCtx, staticCanvasRef.current.width, staticCanvasRef.current.height);
    };

    const handleStopSong = () => {
        setIsPlayingSong(false); setIsGameOver(false);
        setFallingNotes([]);
        const staticCtx = staticCanvasRef.current.getContext('2d');
        staticCtx.clearRect(0, 0, staticCanvasRef.current.width, staticCanvasRef.current.height);
        drawDanTranh(staticCtx, staticCanvasRef.current.width, staticCanvasRef.current.height);
    };

    return (
        <div className="container">
            <div className="header">
                <h1><span>🎵</span> Đàn Tranh Ảo - Mộc Cầm</h1>
                <p>Sử dụng MediaPipe Hands để chơi đàn tranh ảo</p>
            </div>

            <div className="controls">
                <div className="control-group">
                    <label>📹 Chọn Camera:</label>
                    <select value={currentCamera} onChange={(e) => setCurrentCamera(e.target.value)} disabled={isLoading}>
                        {availableCameras.length === 0 && <option>Đang tải camera...</option>}
                        {availableCameras.map(camera => (
                            <option key={camera.deviceId} value={camera.deviceId}>{camera.label || `Camera ${camera.deviceId.slice(0, 8)}`}</option>
                        ))}
                    </select>
                </div>
                <div className="control-group">
                    <label><input type="checkbox" checked={showDanTranh} onChange={() => setShowDanTranh(p => !p)} /> Hiển thị Đàn Tranh</label>
                    <label><input type="checkbox" checked={showHands} onChange={() => setShowHands(p => !p)} /> Hiển thị Tracking Tay</label>
                </div>
                <div className="control-group">
                    <label>🎶 Chọn bài hát:</label>
                    <select value={songSelect} onChange={(e) => setSongSelect(e.target.value)}>
                        <option value="">-- Chọn bài --</option>
                        <option value="trongcom">Trống Cơm</option>
                    </select>
                    <button onClick={handleStartSong} disabled={!songSelect || isPlayingSong}>▶️ Bắt đầu</button>
                    <button onClick={handleStopSong} disabled={!isPlayingSong && !isGameOver}>
                        {isGameOver ? '🎵 Chơi lại' : '⏹ Dừng'}
                    </button>
                </div>
            </div>

            <div className="status-bar">
                <div className="status-card">
                    <span className="label">📹 Trạng thái:</span>
                    <span className={`value ${statusClass}`}>{statusText}</span>
                </div>
                <div className="status-card">
                    <span className="label">👋 Số bàn tay:</span>
                    <span className="value hand-count">{handCount}</span>
                </div>
                <div className="status-card">
                    <span className="label">⚡ FPS:</span>
                    <span className="value fps-count">{fps}</span>
                </div>
            </div>

            <div className="camera-container">
                <video ref={videoRef} style={{ display: 'none' }} playsInline />
                <canvas ref={canvasRef} />
                {isLoading && (
                    <div className="loading-overlay">
                        <div className="spinner"></div>
                        <p style={{ fontSize: '1.2em' }}>Đang khởi động camera và MediaPipe...</p>
                    </div>
                )}
                {error && (
                    <div className="error-overlay show">
                        <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Lỗi:</p>
                        <p>{error}</p>
                    </div>
                )}
            </div>

            <div className="instructions">
                <h3>📋 Hướng dẫn sử dụng</h3>
                <ul>
                    <li>• Chọn camera từ dropdown phía trên</li>
                    <li>• Đưa bàn tay vào trước camera, đặt tay phía trên các dây đàn</li>
                    <li>• Đàn tranh có 17 dây được hiển thị trên màn hình</li>
                    <li>• Sử dụng 3 ngón: **Cái, Trỏ, Giữa** để gảy</li>
                    <li>• Dây đàn sẽ sáng lên khi bạn gảy trúng</li>
                </ul>
            </div>

            <div className="status-card" style={{ textAlign:'center', marginBottom:'20px', color:'white' }}>
                <p>⭐ <b>Điểm:</b> <span>{Math.round(score)}</span></p>
                <p>🔥 <b>Combo:</b> <span>{combo}</span></p>
            </div>

            <div className="footer">
                <p>Công nghệ: MediaPipe Hands | Đàn Tranh 17 dây | Real-time Hand Tracking</p>
            </div>
        </div>
    );
}

export default VirtualDanTranh;