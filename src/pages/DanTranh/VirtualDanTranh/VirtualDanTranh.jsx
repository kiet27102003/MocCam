import React, { useEffect, useRef, useState } from 'react';
import './VirtualDanTranh.css';

const VirtualDanTranh = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const loadingOverlayRef = useRef(null);
  const errorOverlayRef = useRef(null);
  const errorMessageRef = useRef(null);
  const statusTextRef = useRef(null);
  const handCountRef = useRef(null);
  const fpsCountRef = useRef(null);
  const cameraSelectRef = useRef(null);
  const switchCameraBtnRef = useRef(null);
  const showDanTranhToggleRef = useRef(null);
  const showHandsToggleRef = useRef(null);
  const songSelectRef = useRef(null);
  const startSongBtnRef = useRef(null);
  const stopSongBtnRef = useRef(null);
  const scoreTextRef = useRef(null);
  const comboTextRef = useRef(null);

  // State variables
  const [showDanTranh, setShowDanTranh] = useState(true);
  const [showHands, setShowHands] = useState(true);
  const [_frameCount, setFrameCount] = useState(0);
  const [lastTime, setLastTime] = useState(Date.now());
  const [currentFps, setCurrentFps] = useState(0);
  const [currentStream, setCurrentStream] = useState(null);
  const [currentCamera, setCurrentCamera] = useState(null);
  const [hands, setHands] = useState(null);
  const [cameraInstance, setCameraInstance] = useState(null);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [isSwitching, setIsSwitching] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);

  // Refs for complex objects
  const staticCanvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioBuffersRef = useRef([]);
  const danTranhStringsRef = useRef([]);
  const stringStatesRef = useRef(new Array(17).fill(0));
  const previousTouchingRef = useRef(new Array(17).fill(false));
  const previousHandLandmarksRef = useRef([]);
  const currentSongRef = useRef(null);
  const isPlayingSongRef = useRef(false);
  const songStartTimeRef = useRef(0);
  const fallingNotesRef = useRef([]);
  const maxComboRef = useRef(0);
  const accuracyListRef = useRef([]);
  const lastPluckTimeRef = useRef(new Array(17).fill(0));
  const prevHandsRef = useRef([]);
  const lastFrameTimeRef = useRef(performance.now());

  // Constants
  const FINGER_TIP_LANDMARKS = [4, 8, 12]; // Chỉ số landmark của 3 đầu ngón: Cái, Trỏ, Giữa
  const PLUCK_COOLDOWN_MS = 150;

  const DAN_TRANH_CONFIG = {
    numStrings: 17,
    startX: 0.05, 
    endX: 0.95,   
    topY: 0.1,    
    bottomY: 0.9, 
    bridgeWidth: 40, 
    stringColors: [
      '#FFD700', '#FFC700', '#FFB700', '#FFA700', // Vàng (trầm) - 4
      '#FF9700', '#FF8700', '#FF7700', '#FF6700', // Cam (trung) - 8
      '#FF5700', '#FF4700', '#FF3700', '#FF2700', // Cam-đỏ - 12
      '#FF1700', '#FF0700', '#F70000', '#E70000', // Đỏ (bổng) - 16
      '#D70000'                                   // MÀU THỨ 17 (Thêm vào) 
    ],
    backgroundColor: '#8B4513',
    rhythmGame: {
      hitZoneXPercent: 0.74, // Vạch gảy ở 25% từ trái sang
      noteRadius: 10,       // Bán kính nốt nhạc (hình tròn)
      hitZoneColor: 'rgba(0, 255, 255, 0.7)', // Màu Vạch Gảy (Cyan trong suốt)
      noteColor: 'rgba(255, 255, 255, 0.9)'  // Màu Nốt Đích (Trắng gần đục)
    }
  };

        const SONGS = {
            "trongcom": {
                name: "Trống Cơm",
      speed: 120,
                notes: [
                    // --- Intro (Nhạc dạo ngắn) ---
                    { time: 500,  string: 0 }, // Sol
                    { time: 1000, string: 1 }, // La
                    { time: 1500, string: 2 }, // Đô
                    { time: 2000, string: 1 }, // La

                    // --- Verse 1 ---
                    // "Tình bằng có cái trống cơm," (Sol Sol La La Đô Đô)
                    { time: 3000, string: 0 },
                    { time: 3500, string: 0 },
                    { time: 4000, string: 1 },
                    { time: 4500, string: 1 },
                    { time: 5000, string: 2 },
                    { time: 5500, string: 2 },
                    // "khen ai khéo vỗ" (Rê Mi Rê Đô)
                    { time: 6000, string: 3 },
                    { time: 6500, string: 4 },
                    { time: 7000, string: 3 },
                    { time: 7500, string: 2 },
                    // "ớ mấy bông mà lên bông," (La Sol La Đô La Sol)
                    { time: 8000, string: 1 },
                    { time: 8500, string: 0 },
                    { time: 9000, string: 1 },
                    { time: 9500, string: 2 },
                    { time: 10000, string: 1 },
                    { time: 10500, string: 0 },
                    // "ớ mấy bông mà lên bông." (La Sol La Đô La Sol)
                    { time: 11000, string: 1 },
                    { time: 11500, string: 0 },
                    { time: 12000, string: 1 },
                    { time: 12500, string: 2 },
                    { time: 13000, string: 1 },
                    { time: 13500, string: 0 },
      ]
    }
  };

        const NOTE_NAMES = [
            'sounds/1_G.wav',  // Dây 1: G (trầm)
            'sounds/1_A.wav',  // Dây 2: A
            'sounds/1_C.wav',  // Dây 3: C
            'sounds/1_D.wav',  // Dây 4: D
            'sounds/1_E.wav',  // Dây 5: E
            'sounds/2_G.wav',  // Dây 6: G
            'sounds/2_A.wav',  // Dây 7: A
            'sounds/2_C.wav',  // Dây 8: C
            'sounds/2_D.wav',  // Dây 9: D
            'sounds/2_E.wav',  // Dây 10: E
            'sounds/3_G.wav',  // Dây 11: G
            'sounds/3_A.wav',  // Dây 12: A
            'sounds/3_C.wav',  // Dây 13: C
            'sounds/3_D.wav',  // Dây 14: D
            'sounds/3_E.wav',  // Dây 15: E
            'sounds/4_G.wav',  // Dây 16: G
            'sounds/4_A.wav'   // Dây 17: A (cao nhất)
        ];

        const NOTE_FILES = NOTE_NAMES.map(relativePath => {
            return new URL(relativePath, window.location.href).href;
        });

        const DAN_TRANH_HAND_CONNECTIONS = [
            [0, 1], [1, 2], [2, 3], [3, 4], // Ngón cái (Thumb)
            [0, 5], [5, 6], [6, 7], [7, 8], // Ngón trỏ (Index)
            [0, 9], [9, 10], [10, 11], [11, 12], // Ngón giữa (Middle)
            [5, 9] // Nối lòng bàn tay (từ trỏ sang giữa)
        ];

  // Helper functions
  const showError = (msg) => {
    if (errorMessageRef.current) errorMessageRef.current.textContent = msg;
    if (errorOverlayRef.current) errorOverlayRef.current.classList.add('show');
    if (loadingOverlayRef.current) loadingOverlayRef.current.classList.add('hidden');
    if (statusTextRef.current) {
      statusTextRef.current.textContent = 'Lỗi';
      statusTextRef.current.className = 'value status-loading';
    }
  };

  const loadAudioFiles = async () => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const loadPromises = NOTE_FILES.map(async (filePath) => {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error("Không thể tải " + filePath);
        const buffer = await response.arrayBuffer();
        return await audioContextRef.current.decodeAudioData(buffer);
      });
      audioBuffersRef.current = await Promise.all(loadPromises);
      console.log("Đã tải âm thanh thành công");
    } catch (err) {
      console.error(err);
      showError("Lỗi tải âm thanh: " + err.message);
    }
  };

  const ensureAudioContextRunning = async () => {
    if (!audioContextRef.current)
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContextRef.current.state === "suspended") {
      try {
        await audioContextRef.current.resume();
      } catch (e) {
        console.warn("Không thể resume AudioContext", e);
      }
    }
  };

  const playNote = async (stringIndex) => {
    if (stringIndex < 0 || stringIndex >= audioBuffersRef.current.length) return;
    await ensureAudioContextRunning();
    const buffer = audioBuffersRef.current[stringIndex];
    if (!buffer) return;
    const src = audioContextRef.current.createBufferSource();
    src.buffer = buffer;
    src.connect(audioContextRef.current.destination);
    src.start(0);
  };

  const drawDanTranh = (ctx, width, height) => {
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
            const bridgeWidth = DAN_TRANH_CONFIG.bridgeWidth;

    // Vẽ khung đàn
            const frameGradientLeft = ctx.createLinearGradient(startX - 20, topY, startX + 10, topY);
            frameGradientLeft.addColorStop(0, 'rgba(101, 67, 33, 0.8)');
            frameGradientLeft.addColorStop(1, 'rgba(139, 90, 43, 0.8)');
            ctx.fillStyle = frameGradientLeft;
    ctx.fillRect(startX - 20, topY - 10, 30, bottomY - topY + 20);

            const frameGradientRight = ctx.createLinearGradient(endX - 10, topY, endX + 20, topY);
            frameGradientRight.addColorStop(0, 'rgba(139, 90, 43, 0.8)');
            frameGradientRight.addColorStop(1, 'rgba(101, 67, 33, 0.8)');
            ctx.fillStyle = frameGradientRight;
    ctx.fillRect(endX - 10, topY - 10, 30, bottomY - topY + 20);

    // Vẽ dây đàn
    danTranhStringsRef.current.forEach((string, i) => {
                const y = string.y;
                const stringWidth = string.endX - string.startX;
                
      // Vẽ con nhạn
                const bridgeX = string.startX + (stringWidth * 0.7); 
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

                // Vẽ bóng dây đàn
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(string.startX, y + 2);
                ctx.lineTo(string.endX, y + 2);
                ctx.stroke();

      // Vẽ dây đàn chính
                const stringGradient = ctx.createLinearGradient(string.startX, y, string.endX, y);
                stringGradient.addColorStop(0, DAN_TRANH_CONFIG.stringColors[i]);
                stringGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
                stringGradient.addColorStop(1, DAN_TRANH_CONFIG.stringColors[i]);
                
                ctx.strokeStyle = stringGradient;
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(string.startX, y);
                ctx.lineTo(string.endX, y);
                ctx.stroke();

      // Thêm viền sáng
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(string.startX, y - 1);
                ctx.lineTo(string.endX, y - 1);
                ctx.stroke();

      // Vẽ số thứ tự dây
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'right';
                ctx.fillText(i + 1, string.startX - 30, y + 5);
            });
  };

  const drawRhythmElements = (ctx, width) => {
    if (danTranhStringsRef.current.length === 0) return;
            const config = DAN_TRANH_CONFIG.rhythmGame;
            const hitZoneX = width * config.hitZoneXPercent;

    // Vạch Gảy thẳng đứng
            ctx.strokeStyle = config.hitZoneColor;
            ctx.lineWidth = 4;
            ctx.beginPath();
    ctx.moveTo(hitZoneX, danTranhStringsRef.current[0].y - 20);
    ctx.lineTo(hitZoneX, danTranhStringsRef.current[danTranhStringsRef.current.length - 1].y + 20);
            ctx.stroke();

    // Vẽ nốt đích tĩnh
    danTranhStringsRef.current.forEach(string => {
                ctx.beginPath();
                ctx.arc(hitZoneX, string.y, config.noteRadius, 0, 2 * Math.PI);
                ctx.fillStyle = config.noteColor;
                ctx.fill();
            });
  };

  const drawConnections = (ctx, landmarks) => {
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
    ctx.lineWidth = 2;

    const fingers = [
      [0, 1, 2, 3, 4],    // Thumb
      [0, 5, 6, 7, 8],    // Index
      [0, 9, 10, 11, 12], // Middle
      [0, 13, 14, 15, 16],// Ring
      [0, 17, 18, 19, 20] // Pinky
    ];

    ctx.beginPath();
    for (const finger of fingers) {
      for (let i = 0; i < finger.length - 1; i++) {
        const a = landmarks[finger[i]];
        const b = landmarks[finger[i + 1]];
        ctx.moveTo(a.x * canvasRef.current.width, a.y * canvasRef.current.height);
        ctx.lineTo(b.x * canvasRef.current.width, b.y * canvasRef.current.height);
      }
    }
    ctx.stroke();
  };

  const drawLandmarks = (ctx, landmarks) => {
    const fingerColors = ['#ff4444', '#44ff44', '#4444ff', '#ffbb33', '#aa44ff'];
    const fingers = [
      [0, 1, 2, 3, 4], [5, 6, 7, 8],
      [9, 10, 11, 12], [13, 14, 15, 16],
      [17, 18, 19, 20]
    ];

    for (let f = 0; f < fingers.length; f++) {
                    ctx.beginPath();
      for (const i of fingers[f]) {
        const lm = landmarks[i];
        const x = lm.x * canvasRef.current.width;
        const y = lm.y * canvasRef.current.height;
        ctx.moveTo(x, y);
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
      }
      ctx.fillStyle = fingerColors[f];
                    ctx.fill();
                }
  };

  const handlePluck = (stringIndex) => {
    if (!isPlayingSongRef.current) return;
    const elapsed = performance.now() - songStartTimeRef.current;

    const width = canvasRef.current.width;
            const speedX = width * 0.00025;
            const hitZoneX = width * DAN_TRANH_CONFIG.rhythmGame.hitZoneXPercent;

            let bestNote = null;
            let bestDiff = Infinity;

    for (const note of fallingNotesRef.current) {
                if (note.string === stringIndex) {
                const noteX = (width * 0.1) + (elapsed - note.time) * speedX;
                const diff = Math.abs(noteX - hitZoneX);
                if (diff < bestDiff) {
                    bestDiff = diff;
                    bestNote = note;
                }
                }
            }

            if (bestNote && bestDiff < 40) {
      setScore(prev => prev + Math.max(0, 100 - bestDiff * 2));
      setCombo(prev => prev + 1);
      maxComboRef.current = Math.max(maxComboRef.current, combo + 1);
      accuracyListRef.current.push(bestDiff);
      fallingNotesRef.current = fallingNotesRef.current.filter(n => n !== bestNote);
            } else {
      setCombo(0);
    }
  };

  const drawFallingNotes = (ctx, width) => {
    if (!isPlayingSongRef.current) return;
    const elapsed = performance.now() - songStartTimeRef.current;
    const speedX = width * 0.00025;

    fallingNotesRef.current.forEach(note => {
      const targetString = danTranhStringsRef.current[note.string];
      if (!targetString) return;

      const t = (elapsed - note.time);
      const x = (width * 0.1) + t * speedX;
      const y = targetString.y;

      if (x > 0 && x < width) {
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.fill();

        const glow = ctx.createRadialGradient(x, y, 0, x, y, 20);
        glow.addColorStop(0, 'rgba(255,255,255,0.6)');
        glow.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    fallingNotesRef.current = fallingNotesRef.current.filter(n => (elapsed - n.time) < 7000);
  };

  const onResults = (results) => {
    const canvasCtx = canvasRef.current.getContext('2d');
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            if (showDanTranh) {
      canvasCtx.drawImage(staticCanvasRef.current, 0, 0);
            }

            const handCount = results.multiHandLandmarks ? results.multiHandLandmarks.length : 0;
    if (handCountRef.current) handCountRef.current.textContent = handCount;

            if (showHands && results.multiHandLandmarks) {
                for (let i = 0; i < results.multiHandLandmarks.length; i++) {
                    const landmarks = results.multiHandLandmarks[i];
                    // const handedness = results.multiHandedness[i];

                    drawConnections(canvasCtx, landmarks);
                    drawLandmarks(canvasCtx, landmarks);

                    // const wrist = landmarks[0];
        // const x = wrist.x * canvasRef.current.width;
        // const y = wrist.y * canvasRef.current.height;

                    canvasCtx.fillStyle = '#00ff00';
                    canvasCtx.font = 'bold 24px Arial';
                }
            }

    // Logic gảy dây
            const now = performance.now();
    const dt = Math.max(1, now - lastFrameTimeRef.current);
    lastFrameTimeRef.current = now;

    const pluckToleranceY = 15;
    const velocityThreshold = 0.05;
    const accelThreshold = 0.02;
    const crossingMinDelta = 3;
            const currentlyTouching = new Array(DAN_TRANH_CONFIG.numStrings).fill(false);

            const currentHands = [];
            if (results.multiHandLandmarks) {
                for (let i = 0; i < results.multiHandLandmarks.length; i++) {
                    const label = results.multiHandedness[i]?.label || ('hand' + i);
                    currentHands.push({ label, landmarks: results.multiHandLandmarks[i] });
                }
            }

            for (const hand of currentHands) {
      const prev = prevHandsRef.current.find(h => h.label === hand.label);
                for (const idx of FINGER_TIP_LANDMARKS) {
                    const cur = hand.landmarks[idx];
                    const prevTip = prev ? prev.landmarks[idx] : null;
                    if (!cur) continue;

        const curX = (1 - cur.x) * canvasRef.current.width;
        const curY = cur.y * canvasRef.current.height;
        const prevY = prevTip ? prevTip.y * canvasRef.current.height : curY;
                    const velY = (curY - prevY) / dt;

                    const prevVelY = prevTip ? (prevTip._velY || 0) : 0;
                    const accelY = velY - prevVelY;
        if (cur) cur._velY = velY;

        for (const string of danTranhStringsRef.current) {
                        const overX = curX > string.startX && curX < string.endX;
                        const near = Math.abs(curY - string.y) < pluckToleranceY;

                        const crossed = (
                            (prevY < string.y && curY - string.y > crossingMinDelta) ||
                            (prevY > string.y && string.y - curY > crossingMinDelta)
                        );

                        if (overX && near) currentlyTouching[string.id] = true;

                        if (
                            overX &&
                            crossed &&
                            Math.abs(velY) > velocityThreshold &&
                            Math.abs(accelY) > accelThreshold &&
            stringStatesRef.current[string.id] === 0
                        ) {
                            const nowMs = performance.now();
            if (nowMs - lastPluckTimeRef.current[string.id] >= PLUCK_COOLDOWN_MS) {
              lastPluckTimeRef.current[string.id] = nowMs;
              stringStatesRef.current[string.id] = 10;
                                playNote(string.id);
                                handlePluck(string.id);
                                console.log(`Gảy dây ${string.id + 1} (ngón ${idx}, vel=${velY.toFixed(3)}, acc=${accelY.toFixed(3)})`);
                                break;
                            }
                        }
                    }
                }
            }

    prevHandsRef.current = currentHands.map(h => ({
                label: h.label,
                landmarks: JSON.parse(JSON.stringify(h.landmarks))
            }));

    // Hiệu ứng rung dây
            for (let i = 0; i < DAN_TRANH_CONFIG.numStrings; i++) {
      const string = danTranhStringsRef.current[i];
      if (stringStatesRef.current[i] > 0) stringStatesRef.current[i]--;

      const amp = Math.sin(now / 30) * stringStatesRef.current[i] * 0.4;
                const gradient = canvasCtx.createLinearGradient(string.startX, string.y, string.endX, string.y);
                gradient.addColorStop(0, "#ffb347");
                gradient.addColorStop(1, "#ffd700");
                canvasCtx.strokeStyle = gradient;
                canvasCtx.lineWidth = 2;
                canvasCtx.beginPath();
                const wave = Math.sin(now / 25) * 0.2;
                const midY = string.y + amp * Math.sin((i * 0.5 + now / 120) % Math.PI);
                canvasCtx.moveTo(string.startX, midY - wave);
                canvasCtx.lineTo(string.endX, midY + wave);
                canvasCtx.stroke();
            }

    // Tính FPS
    setFrameCount(prev => {
      const newCount = prev + 1;
            const nowTime = Date.now();
            if (nowTime - lastTime >= 1000) {
        setCurrentFps(newCount);
        setLastTime(nowTime);
        return 0;
      }
      return newCount;
    });

    if (fpsCountRef.current) fpsCountRef.current.textContent = currentFps;

    previousTouchingRef.current = [...currentlyTouching];
    previousHandLandmarksRef.current = results.multiHandLandmarks ? JSON.parse(JSON.stringify(results.multiHandLandmarks)) : [];
    
    if (scoreTextRef.current) scoreTextRef.current.textContent = Math.round(score);
    if (comboTextRef.current) comboTextRef.current.textContent = combo;

    drawFallingNotes(canvasCtx, canvasRef.current.width, canvasRef.current.height);
  };

  const getCameraList = async () => {
            try {
                const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
                tempStream.getTracks().forEach(track => track.stop());

                const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(cameras);
                
      if (cameraSelectRef.current) {
        cameraSelectRef.current.innerHTML = '';
                
        if (cameras.length === 0) {
          cameraSelectRef.current.innerHTML = '<option value="">Không tìm thấy camera</option>';
                    return;
                }

        cameras.forEach((camera, index) => {
                    const option = document.createElement('option');
                    option.value = camera.deviceId;
                    option.textContent = camera.label || `Camera ${index + 1}`;
          cameraSelectRef.current.appendChild(option);
                });
      }

      if (switchCameraBtnRef.current) switchCameraBtnRef.current.disabled = false;
            } catch (err) {
                console.error('Error getting camera list:', err);
      if (cameraSelectRef.current) cameraSelectRef.current.innerHTML = '<option value="">Lỗi khi tải camera</option>';
                showError('Không thể lấy danh sách camera. Vui lòng cấp quyền truy cập camera và tải lại trang.');
            }
  };

  const stopCurrentCamera = async () => {
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
      setCurrentStream(null);
            }
            if (cameraInstance) {
                cameraInstance.stop();
      setCameraInstance(null);
            }
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const startCamera = async (deviceId) => {
        if (isSwitching) return;

        try {
      setIsSwitching(true);
      if (switchCameraBtnRef.current) {
        switchCameraBtnRef.current.disabled = true;
        switchCameraBtnRef.current.textContent = 'Đang đổi...';
      }
      if (loadingOverlayRef.current) loadingOverlayRef.current.classList.remove('hidden');
      if (errorOverlayRef.current) errorOverlayRef.current.classList.remove('show');

            await stopCurrentCamera();
            await new Promise((resolve) => setTimeout(resolve, 500));

            const constraints = {
            video: {
                width: 1280,
                height: 720,
                deviceId: deviceId ? { exact: deviceId } : undefined,
            },
            };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCurrentStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;

      await new Promise((resolve) => (videoRef.current.onloadedmetadata = resolve));
      await videoRef.current.play();

      const width = videoRef.current.videoWidth;
      const height = videoRef.current.videoHeight;
      canvasRef.current.width = width;
      canvasRef.current.height = height;

      // Tính toán dây đàn
      staticCanvasRef.current.width = width;
      staticCanvasRef.current.height = height;
      danTranhStringsRef.current = [];
      stringStatesRef.current.fill(0);

            const { startX, endX, topY, bottomY, numStrings } = DAN_TRANH_CONFIG;
            const stringSpacing = (height * bottomY - height * topY) / (numStrings - 1);
            for (let i = 0; i < numStrings; i++) {
            const y = height * topY + i * stringSpacing;
        danTranhStringsRef.current.push({
                id: i,
                y,
                startX: width * startX,
                endX: width * endX,
            });
            }

      const staticCtx = staticCanvasRef.current.getContext('2d');
            drawDanTranh(staticCtx, width, height);
            drawRhythmElements(staticCtx, width, height);

      // Dùng Camera của MediaPipe
      const cameraInst = new window.Camera(videoRef.current, {
            onFrame: async () => {
          await hands.send({ image: videoRef.current });
            },
            width: 1280,
            height: 720,
            });
      cameraInst.start();
      setCameraInstance(cameraInst);

      if (loadingOverlayRef.current) loadingOverlayRef.current.classList.add('hidden');
      if (statusTextRef.current) {
        statusTextRef.current.textContent = 'Đang phát hiện';
        statusTextRef.current.className = 'value status-detecting';
      }

      setCurrentCamera(deviceId);
      if (cameraSelectRef.current) cameraSelectRef.current.value = deviceId;
      if (switchCameraBtnRef.current) {
        switchCameraBtnRef.current.disabled = false;
        switchCameraBtnRef.current.textContent = 'Đổi Camera';
      }
      setIsSwitching(false);
        } catch (err) {
      setIsSwitching(false);
      if (switchCameraBtnRef.current) {
        switchCameraBtnRef.current.disabled = false;
        switchCameraBtnRef.current.textContent = 'Đổi Camera';
      }
            showError('Không thể truy cập camera: ' + err.message);
        }
  };

  const initializeApp = async () => {
    try {
      // Wait for MediaPipe scripts to load
      if (!window.Hands) {
        await new Promise((resolve) => {
          const checkHands = () => {
            if (window.Hands) {
              resolve();
            } else {
              setTimeout(checkHands, 100);
            }
          };
          checkHands();
        });
      }

      const handsInstance = new window.Hands({
                    locateFile: (file) => {
                        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                    }
                });

      handsInstance.setOptions({
                    selfieMode: true,
                    maxNumHands: 2,
                    modelComplexity: 0,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5
                });

      handsInstance.onResults(onResults);
      setHands(handsInstance);

      await loadAudioFiles();
                await getCameraList();
                
                const defaultCamera = availableCameras.length > 0 ? availableCameras[0].deviceId : null;
                if (defaultCamera) {
        if (cameraSelectRef.current) cameraSelectRef.current.value = defaultCamera;
                    await startCamera(defaultCamera);
      } else if (availableCameras.length === 0 && errorOverlayRef.current && !errorOverlayRef.current.classList.contains('show')) {
                    showError('Không tìm thấy camera nào trên thiết bị');
                }

            } catch (err) {
                showError('Lỗi khởi tạo: ' + err.message);
            }
  };

  const startSong = (songId) => {
    if (!SONGS[songId]) return;
    currentSongRef.current = SONGS[songId];
    isPlayingSongRef.current = true;
    setScore(0);
    setCombo(0);
    maxComboRef.current = 0;
    accuracyListRef.current = [];
    fallingNotesRef.current = JSON.parse(JSON.stringify(currentSongRef.current.notes));
    songStartTimeRef.current = performance.now();

    // Thu gọn còn 5 dây và phóng to
    DAN_TRANH_CONFIG.numStrings = 5;
    const startIndex = 6;
    danTranhStringsRef.current = danTranhStringsRef.current.slice(startIndex, startIndex + 5);

    const height = staticCanvasRef.current.height;
    const zoomFactor = 1.5;
    const centerY = height / 2;
    danTranhStringsRef.current.forEach(s => {
      s.y = centerY + (s.y - centerY) * zoomFactor;
    });

    stringStatesRef.current = new Array(5).fill(0);
    danTranhStringsRef.current.forEach((s, i) => s.id = i);

    const staticCtx = staticCanvasRef.current.getContext('2d');
    staticCtx.clearRect(0, 0, staticCanvasRef.current.width, staticCanvasRef.current.height);
    drawDanTranh(staticCtx, staticCanvasRef.current.width, staticCanvasRef.current.height);
    drawRhythmElements(staticCtx, staticCanvasRef.current.width, staticCanvasRef.current.height);
  };

  const stopSong = () => {
    isPlayingSongRef.current = false;
    DAN_TRANH_CONFIG.numStrings = 17;
    initializeApp();
  };

  useEffect(() => {
    // Initialize static canvas
    staticCanvasRef.current = document.createElement('canvas');
    
    const handleSwitchCamera = async () => {
      const selectedCamera = cameraSelectRef.current?.value;
           if (selectedCamera && selectedCamera !== currentCamera && !isSwitching) {
               await startCamera(selectedCamera);
           }
    };

    const handleShowDanTranhChange = (e) => {
      setShowDanTranh(e.target.checked);
      
      const staticCtx = staticCanvasRef.current.getContext('2d');
      staticCtx.clearRect(0, 0, staticCanvasRef.current.width, staticCanvasRef.current.height);
      
            const { startX, endX, topY, bottomY, numStrings } = DAN_TRANH_CONFIG;
      const stringSpacing = (staticCanvasRef.current.height * bottomY - staticCanvasRef.current.height * topY) / (numStrings - 1);
            
      danTranhStringsRef.current = [];
            for (let i = 0; i < numStrings; i++) {
        const y = staticCanvasRef.current.height * topY + i * stringSpacing;
        danTranhStringsRef.current.push({
                    id: i,
                    y: y,
          startX: staticCanvasRef.current.width * startX,
          endX: staticCanvasRef.current.width * endX
        });
      }
      drawDanTranh(staticCtx, staticCanvasRef.current.width, staticCanvasRef.current.height);
      drawRhythmElements(staticCtx, staticCanvasRef.current.width, staticCanvasRef.current.height);
    };

    const handleShowHandsChange = (e) => {
      setShowHands(e.target.checked);
    };

    const handleStartSong = () => {
      const songId = songSelectRef.current?.value;
            if (!songId) {
                alert("Vui lòng chọn bài hát!");
                return;
            }
            startSong(songId);
      if (startSongBtnRef.current) startSongBtnRef.current.disabled = true;
      if (stopSongBtnRef.current) stopSongBtnRef.current.disabled = false;
    };

    const handleStopSong = () => {
            stopSong();
      if (startSongBtnRef.current) startSongBtnRef.current.disabled = false;
      if (stopSongBtnRef.current) stopSongBtnRef.current.disabled = true;
    };

    // Add event listeners
    const switchBtn = switchCameraBtnRef.current;
    const danTranhToggle = showDanTranhToggleRef.current;
    const handsToggle = showHandsToggleRef.current;
    const startBtn = startSongBtnRef.current;
    const stopBtn = stopSongBtnRef.current;
    
    if (switchBtn) {
      switchBtn.addEventListener('click', handleSwitchCamera);
    }
    if (danTranhToggle) {
      danTranhToggle.addEventListener('change', handleShowDanTranhChange);
    }
    if (handsToggle) {
      handsToggle.addEventListener('change', handleShowHandsChange);
    }
    if (startBtn) {
      startBtn.addEventListener('click', handleStartSong);
    }
    if (stopBtn) {
      stopBtn.addEventListener('click', handleStopSong);
    }

    // Initialize app
    initializeApp();

    // Cleanup
    return () => {
            stopCurrentCamera();
      if (switchBtn) {
        switchBtn.removeEventListener('click', handleSwitchCamera);
      }
      if (danTranhToggle) {
        danTranhToggle.removeEventListener('change', handleShowDanTranhChange);
      }
      if (handsToggle) {
        handsToggle.removeEventListener('change', handleShowHandsChange);
      }
      if (startBtn) {
        startBtn.removeEventListener('click', handleStartSong);
      }
      if (stopBtn) {
        stopBtn.removeEventListener('click', handleStopSong);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="virtual-dan-tranh-container">
      <div className="header">
        <h1>
          <span>🎵</span>
          Đàn Tranh Ảo - Mộc Cầm
        </h1>
        <p>Sử dụng MediaPipe Hands để chơi đàn tranh ảo</p>
      </div>

      <div className="controls">
        <div className="control-group">
          <label>
            📹 Chọn Camera:
          </label>
          <select ref={cameraSelectRef}>
            <option value="">Đang tải danh sách camera...</option>
          </select>
          <button ref={switchCameraBtnRef} disabled>Đổi Camera</button>
        </div>
        <div className="control-group">
          <label>
            <input 
              ref={showDanTranhToggleRef}
              type="checkbox" 
              checked={showDanTranh}
              onChange={(e) => setShowDanTranh(e.target.checked)}
            />
            Hiển thị Đàn Tranh
          </label>
          <label>
            <input 
              ref={showHandsToggleRef}
              type="checkbox" 
              checked={showHands}
              onChange={(e) => setShowHands(e.target.checked)}
            />
            Hiển thị Tracking Tay
          </label>
        </div>
        <div className="control-group">
          <label>🎶 Chọn bài hát:</label>
          <select ref={songSelectRef}>
            <option value="">-- Chọn bài --</option>
            <option value="trongcom">Trống Cơm</option>
          </select>
          <button ref={startSongBtnRef}>▶️ Bắt đầu</button>
          <button ref={stopSongBtnRef} disabled>⏹ Dừng</button>
        </div>
      </div>

      <div className="status-bar">
        <div className="status-card">
          <span className="label">📹 Trạng thái:</span>
          <span ref={statusTextRef} className="value status-loading">Đang tải...</span>
        </div>
        <div className="status-card">
          <span className="label">👋 Số bàn tay:</span>
          <span ref={handCountRef} className="value hand-count">0</span>
        </div>
        <div className="status-card">
          <span className="label">⚡ FPS:</span>
          <span ref={fpsCountRef} className="value fps-count">0</span>
        </div>
      </div>

      <div className="camera-container">
        <video ref={videoRef} playsInline style={{ display: 'none' }}></video>
        <canvas ref={canvasRef}></canvas>
        
        <div ref={loadingOverlayRef} className="loading-overlay">
          <div className="spinner"></div>
          <p style={{ fontSize: '1.2em' }}>Đang khởi động camera và MediaPipe...</p>
        </div>
        
        <div ref={errorOverlayRef} className="error-overlay">
          <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Lỗi:</p>
          <p ref={errorMessageRef}></p>
        </div>
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

      <div className="status-card" id="hudScore" style={{ textAlign: 'center', marginBottom: '20px', color: 'white' }}>
        <p>⭐ <b>Điểm:</b> <span ref={scoreTextRef}>0</span></p>
        <p>🔥 <b>Combo:</b> <span ref={comboTextRef}>0</span></p>
      </div>

      <div className="footer">
        <p>Công nghệ: MediaPipe Hands | Đàn Tranh 17 dây | Real-time Hand Tracking</p>
      </div>
    </div>
  );
};

export default VirtualDanTranh;