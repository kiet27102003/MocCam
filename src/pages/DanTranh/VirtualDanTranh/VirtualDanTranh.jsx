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

  const [showDanTranh, setShowDanTranh] = useState(true);
  const [showHands, setShowHands] = useState(true);
  const [frameCount, setFrameCount] = useState(0);
  const [lastTime, setLastTime] = useState(Date.now());
  const [currentFps, setCurrentFps] = useState(0);
  const [currentStream, setCurrentStream] = useState(null);
  const [currentCamera, setCurrentCamera] = useState(null);
  const [hands, setHands] = useState(null);
  const [cameraInstance, setCameraInstance] = useState(null);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [isSwitching, setIsSwitching] = useState(false);

  // Canvas đệm
  const staticCanvasRef = useRef(null);
  
  // Biến cho audio
  const [audioContext, setAudioContext] = useState(null);
  const [audioBuffers, setAudioBuffers] = useState([]);
  
  // Biến State cho logic gảy dây
  const [danTranhStrings, setDanTranhStrings] = useState([]);
  const [stringStates, setStringStates] = useState(new Array(17).fill(0));
  const FINGER_TIP_LANDMARKS = [4, 8, 12];
  
  let previousTouching = new Array(17).fill(false);
  let previousHandLandmarks = [];

  const DAN_TRANH_CONFIG = {
    numStrings: 17,
    startX: 0.05, 
    endX: 0.95,   
    topY: 0.1,    
    bottomY: 0.9, 
    bridgeWidth: 40, 
    stringColors: [
      '#FFD700', '#FFC700', '#FFB700', '#FFA700',
      '#FF9700', '#FF8700', '#FF7700', '#FF6700',
      '#FF5700', '#FF4700', '#FF3700', '#FF2700',
      '#FF1700', '#FF0700', '#F70000', '#E70000',
      '#D70000'
    ],
    backgroundColor: '#8B4513',
    rhythmGame: {
      hitZoneXPercent: 0.74,
      noteRadius: 10,
      hitZoneColor: 'rgba(0, 255, 255, 0.7)',
      noteColor: 'rgba(255, 255, 255, 0.9)'
    }
  };

  const NOTE_FILES = [
    'sounds/1_G.wav', 'sounds/1_A.wav', 'sounds/1_C.wav', 'sounds/1_D.wav', 'sounds/1_E.wav',
    'sounds/2_G.wav', 'sounds/2_A.wav', 'sounds/2_C.wav', 'sounds/2_D.wav', 'sounds/2_E.wav',
    'sounds/3_G.wav', 'sounds/3_A.wav', 'sounds/3_C.wav', 'sounds/3_D.wav', 'sounds/3_E.wav',
    'sounds/4_G.wav', 'sounds/4_A.wav'
  ];

  const DAN_TRANH_HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [5, 6], [6, 7], [7, 8],
    [0, 9], [9, 10], [10, 11], [11, 12],
    [5, 9]
  ];

  // Hàm vẽ đàn tranh
  const drawDanTranh = (ctx, width, height) => {
    if (showDanTranh) {
      ctx.fillStyle = DAN_TRANH_CONFIG.backgroundColor;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
      return; 
    }

    if (danTranhStrings.length === 0) return; 

    const startX = danTranhStrings[0].startX;
    const endX = danTranhStrings[0].endX;
    const topY = danTranhStrings[0].y;
    const bottomY = danTranhStrings[danTranhStrings.length - 1].y;
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
    danTranhStrings.forEach((string, i) => {
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

      // Viền sáng cho dây
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

  // Hàm vẽ rhythm elements
  const drawRhythmElements = (ctx, width, height) => {
    if (danTranhStrings.length === 0) return;

    const config = DAN_TRANH_CONFIG.rhythmGame;
    const hitZoneX = width * config.hitZoneXPercent;

    // Vẽ vạch gảy
    ctx.strokeStyle = config.hitZoneColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    const topStringY = danTranhStrings[0].y;
    const bottomStringY = danTranhStrings[danTranhStrings.length - 1].y;
    ctx.moveTo(hitZoneX, topStringY - config.noteRadius * 2);
    ctx.lineTo(hitZoneX, bottomStringY + config.noteRadius * 2);
    ctx.stroke();
    
    // Vẽ nốt đích
    danTranhStrings.forEach(string => {
      ctx.fillStyle = config.noteColor;
      ctx.beginPath();
      ctx.arc(hitZoneX, string.y, config.noteRadius, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  // Hàm tải âm thanh
  const loadAudioFiles = async () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(audioCtx);
      
      const loadPromises = NOTE_FILES.map(async (filePath) => {
        const response = await fetch(filePath);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        return audioBuffer;
      });
      
      const buffers = await Promise.all(loadPromises);
      setAudioBuffers(buffers);
      console.log('Tải xong 17 file âm thanh!');

    } catch (err) {
      console.error('Lỗi khi tải file âm thanh:', err);
      showError('Không thể tải file âm thanh. Vui lòng kiểm tra đường dẫn và console.');
    }
  };

  // Hàm phát âm thanh
  const playNote = (stringIndex) => {
    if (stringIndex < 0 || stringIndex >= audioBuffers.length) return;

    const audioBuffer = audioBuffers[stringIndex];
    if (!audioBuffer || !audioContext) return;

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
  };

  const showError = (msg) => {
    if (errorMessageRef.current) {
      errorMessageRef.current.textContent = msg;
    }
    if (errorOverlayRef.current) {
      errorOverlayRef.current.classList.add('show');
    }
    if (loadingOverlayRef.current) {
      loadingOverlayRef.current.classList.add('hidden');
    }
    if (statusTextRef.current) {
      statusTextRef.current.textContent = 'Lỗi';
      statusTextRef.current.className = 'value status-loading';
    }
  };

  // Hàm onResults
  const onResults = (results) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!canvas || !ctx) return;

    // Xóa canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ nền đàn tranh
    if (showDanTranh && staticCanvasRef.current) {
      ctx.drawImage(staticCanvasRef.current, 0, 0);
    }

    // Cập nhật số tay
    const handCount = results.multiHandLandmarks ? results.multiHandLandmarks.length : 0;
    if (handCountRef.current) {
      handCountRef.current.textContent = handCount;
    }

    // Vẽ tay
    if (showHands && results.multiHandLandmarks) {
      for (let i = 0; i < results.multiHandLandmarks.length; i++) {
        const landmarks = results.multiHandLandmarks[i];
        const handedness = results.multiHandedness[i];
        
        drawConnections(ctx, landmarks);
        drawLandmarks(ctx, landmarks);
        
        const wrist = landmarks[0];
        const x = (1 - wrist.x) * canvas.width;
        const y = wrist.y * canvas.height;
        
        ctx.fillStyle = '#00ff00';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(
          handedness.label === 'Left' ? 'Trái' : 'Phải',
          x - 30,
          y - 20
        );
      }
    }
    
    // Logic gảy dây
    const pluckToleranceY = 15;
    const pluckVelocityThreshold = 5;
    let currentlyTouching = new Array(DAN_TRANH_CONFIG.numStrings).fill(false);

    if (results.multiHandLandmarks && previousHandLandmarks.length === results.multiHandLandmarks.length) {
      for (let handIndex = 0; handIndex < results.multiHandLandmarks.length; handIndex++) {
        const currentLandmarks = results.multiHandLandmarks[handIndex];
        const prevLandmarks = previousHandLandmarks[handIndex];

        for (const landmarkIndex of FINGER_TIP_LANDMARKS) {
          const currentTip = currentLandmarks[landmarkIndex];
          const prevTip = prevLandmarks[landmarkIndex];
          if (!currentTip || !prevTip) continue;

          const currentTipX = (1 - currentTip.x) * canvas.width;
          const currentTipY = currentTip.y * canvas.height;
          const prevTipY = prevTip.y * canvas.height;

          const velocityY = currentTipY - prevTipY;

          for (const string of danTranhStrings) {
            const isOverStringX = currentTipX > string.startX && currentTipX < string.endX;
            
            const crossedString = (prevTipY < string.y && currentTipY >= string.y) || 
                                (prevTipY > string.y && currentTipY <= string.y);

            const isNearStringY = Math.abs(currentTipY - string.y) < pluckToleranceY;
            if (isOverStringX && isNearStringY) {
              currentlyTouching[string.id] = true;
            }

            if (isOverStringX && crossedString && Math.abs(velocityY) > pluckVelocityThreshold && stringStates[string.id] === 0) {
              console.log(`GẢY DÂY SỐ ${string.id + 1} (Velocity: ${velocityY.toFixed(2)})`);
              const newStringStates = [...stringStates];
              newStringStates[string.id] = 10;
              setStringStates(newStringStates);
              playNote(string.id); 
              break; 
            }
          }
        }
      }
    }

    // Xử lý hiệu ứng rung
    const newStringStates = [...stringStates];
    for (let i = 0; i < DAN_TRANH_CONFIG.numStrings; i++) {
      const string = danTranhStrings[i];
      if (newStringStates[i] > 0) {
        const intensity = newStringStates[i] / 10.0;
        ctx.strokeStyle = `rgba(255, 255, 255, ${intensity})`;
        ctx.lineWidth = 5; 
        ctx.beginPath();
        ctx.moveTo(string.startX, string.y);
        ctx.lineTo(string.endX, string.y);
        ctx.stroke();
        newStringStates[i]--;
      }
    }
    setStringStates(newStringStates);

    // Tính FPS
    setFrameCount(prev => {
      const newCount = prev + 1;
      const now = Date.now();
      if (now - lastTime >= 1000) {
        setCurrentFps(newCount);
        setLastTime(now);
        if (fpsCountRef.current) {
          fpsCountRef.current.textContent = newCount;
        }
        return 0;
      }
      return newCount;
    });

    previousTouching = [...currentlyTouching];
    previousHandLandmarks = results.multiHandLandmarks ? JSON.parse(JSON.stringify(results.multiHandLandmarks)) : [];
  };

  // Hàm vẽ đường nối
  const drawConnections = (ctx, landmarks) => {
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;

    DAN_TRANH_HAND_CONNECTIONS.forEach(([start, end]) => {
      const startPoint = landmarks[start];
      const endPoint = landmarks[end];
      
      ctx.beginPath();
      ctx.moveTo(
        (1 - startPoint.x) * canvasRef.current.width,
        startPoint.y * canvasRef.current.height
      );
      ctx.lineTo(
        (1 - endPoint.x) * canvasRef.current.width,
        endPoint.y * canvasRef.current.height
      );
      ctx.stroke();
    });
  };

  // Hàm vẽ điểm
  const drawLandmarks = (ctx, landmarks) => {
    const relevantLandmarks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    landmarks.forEach((landmark, index) => {
      if (!relevantLandmarks.includes(index)) {
        return;
      }
      
      const x = (1 - landmark.x) * canvasRef.current.width;
      const y = landmark.y * canvasRef.current.height;
      
      ctx.fillStyle = index === 0 ? '#ff0000' : '#00ff00';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  };

  // Hàm lấy danh sách camera
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

        if (switchCameraBtnRef.current) {
          switchCameraBtnRef.current.disabled = false;
        }
      }
    } catch (err) {
      console.error('Error getting camera list:', err);
      if (cameraSelectRef.current) {
        cameraSelectRef.current.innerHTML = '<option value="">Lỗi khi tải camera</option>';
      }
      showError('Không thể lấy danh sách camera. Vui lòng cấp quyền truy cập camera và tải lại trang.');
    }
  };

  // Hàm dừng camera hiện tại
  const stopCurrentCamera = async () => {
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
      setCurrentStream(null);
    }
    if (cameraInstance) {
      cameraInstance.stop();
      setCameraInstance(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Hàm khởi động camera
  const startCamera = async (deviceId) => {
    if (isSwitching) {
      console.log('Already switching camera, please wait...');
      return;
    }

    try {
      setIsSwitching(true);
      if (switchCameraBtnRef.current) {
        switchCameraBtnRef.current.disabled = true;
        switchCameraBtnRef.current.textContent = 'Đang đổi...';
      }
      
      if (loadingOverlayRef.current) {
        loadingOverlayRef.current.classList.remove('hidden');
      }
      if (errorOverlayRef.current) {
        errorOverlayRef.current.classList.remove('show');
      }
      
      await stopCurrentCamera();
      await new Promise(resolve => setTimeout(resolve, 500));

      const constraints = {
        video: {
          width: 1280,
          height: 720,
          deviceId: deviceId ? { exact: deviceId } : undefined
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCurrentStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      await new Promise((resolve) => {
        if (videoRef.current) {
          videoRef.current.onloadedmetadata = resolve;
        }
      });

      if (videoRef.current) {
        await videoRef.current.play();
      }
      
      const width = videoRef.current.videoWidth;
      const height = videoRef.current.videoHeight;

      if (canvasRef.current) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }

      // Tính toán tọa độ dây đàn
      if (staticCanvasRef.current) {
        staticCanvasRef.current.width = width;
        staticCanvasRef.current.height = height;
      }

      const newDanTranhStrings = [];
      setStringStates(new Array(17).fill(0));

      const { startX, endX, topY, bottomY, numStrings } = DAN_TRANH_CONFIG;
      const stringSpacing = (height * bottomY - height * topY) / (numStrings - 1);

      for (let i = 0; i < numStrings; i++) {
        const y = height * topY + i * stringSpacing;
        newDanTranhStrings.push({
          id: i,
          y: y,
          startX: width * startX,
          endX: width * endX
        });
      }
      setDanTranhStrings(newDanTranhStrings);

      // Vẽ đàn tranh lên canvas đệm
      if (staticCanvasRef.current) {
        const staticCtx = staticCanvasRef.current.getContext('2d');
        drawDanTranh(staticCtx, width, height);
        drawRhythmElements(staticCtx, width, height);
      }

      if (loadingOverlayRef.current) {
        loadingOverlayRef.current.classList.add('hidden');
      }
      if (statusTextRef.current) {
        statusTextRef.current.textContent = 'Đang phát hiện';
        statusTextRef.current.className = 'value status-detecting';
      }

      const processVideoFrame = async () => {
        if (videoRef.current && videoRef.current.readyState >= 2 && hands) {
          await hands.send({ image: videoRef.current });
        }
        if (currentStream) {
          requestAnimationFrame(processVideoFrame);
        }
      };
      requestAnimationFrame(processVideoFrame);

      setCurrentCamera(deviceId);
      if (cameraSelectRef.current) {
        cameraSelectRef.current.value = deviceId;
      }
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

  // Khởi tạo ứng dụng
  const initializeApp = async () => {
    try {
      // Load MediaPipe scripts
      if (!window.Hands) {
        const script1 = document.createElement('script');
        script1.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
        document.head.appendChild(script1);
        
        const script2 = document.createElement('script');
        script2.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
        document.head.appendChild(script2);
        
        await new Promise(resolve => {
          script2.onload = resolve;
        });
      }

      const handsInstance = new window.Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
      });

      handsInstance.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      handsInstance.onResults(onResults);
      setHands(handsInstance);

      await loadAudioFiles();
      await getCameraList();
      
      const defaultCamera = availableCameras.length > 0 ? availableCameras[0].deviceId : null;
      if (defaultCamera) {
        if (cameraSelectRef.current) {
          cameraSelectRef.current.value = defaultCamera;
        }
        await startCamera(defaultCamera);
      } else if (availableCameras.length === 0 && errorOverlayRef.current && !errorOverlayRef.current.classList.contains('show')) {
        showError('Không tìm thấy camera nào trên thiết bị');
      }

    } catch (err) {
      showError('Lỗi khởi tạo: ' + err.message);
    }
  };

  // Event handlers
  const handleSwitchCamera = async () => {
    const selectedCamera = cameraSelectRef.current?.value;
    if (selectedCamera && selectedCamera !== currentCamera && !isSwitching) {
      await startCamera(selectedCamera);
    }
  };

  const handleShowDanTranhChange = (e) => {
    setShowDanTranh(e.target.checked);
    
    if (staticCanvasRef.current) {
      const staticCtx = staticCanvasRef.current.getContext('2d');
      staticCtx.clearRect(0, 0, staticCanvasRef.current.width, staticCanvasRef.current.height);
      
      const { startX, endX, topY, bottomY, numStrings } = DAN_TRANH_CONFIG;
      const stringSpacing = (staticCanvasRef.current.height * bottomY - staticCanvasRef.current.height * topY) / (numStrings - 1);
      
      const newDanTranhStrings = [];
      for (let i = 0; i < numStrings; i++) {
        const y = staticCanvasRef.current.height * topY + i * stringSpacing;
        newDanTranhStrings.push({
          id: i,
          y: y,
          startX: staticCanvasRef.current.width * startX,
          endX: staticCanvasRef.current.width * endX
        });
      }
      setDanTranhStrings(newDanTranhStrings);
      drawDanTranh(staticCtx, staticCanvasRef.current.width, staticCanvasRef.current.height);
      drawRhythmElements(staticCtx, staticCanvasRef.current.width, staticCanvasRef.current.height);
    }
  };

  const handleShowHandsChange = (e) => {
    setShowHands(e.target.checked);
  };

  useEffect(() => {
    initializeApp();

    return () => {
      stopCurrentCamera();
    };
  }, []);

  useEffect(() => {
    if (fpsCountRef.current) {
      fpsCountRef.current.textContent = currentFps;
    }
  }, [currentFps]);

  return (
    <div className="virtual-dantranh-container">
      <div className="container">
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
            <button ref={switchCameraBtnRef} onClick={handleSwitchCamera} disabled>
              Đổi Camera
            </button>
          </div>
          <div className="control-group">
            <label>
              <input 
                type="checkbox" 
                ref={showDanTranhToggleRef}
                checked={showDanTranh}
                onChange={handleShowDanTranhChange}
              />
              Hiển thị Đàn Tranh
            </label>
            <label>
              <input 
                type="checkbox" 
                ref={showHandsToggleRef}
                checked={showHands}
                onChange={handleShowHandsChange}
              />
              Hiển thị Tracking Tay
            </label>
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
          <canvas ref={staticCanvasRef} style={{ display: 'none' }}></canvas>
          
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
            <li>• Sử dụng 3 ngón: <strong>Cái, Trỏ, Giữa</strong> để gảy</li>
            <li>• Dây đàn sẽ sáng lên khi bạn gảy trúng</li>
          </ul>
        </div>

        <div className="footer">
          <p>Công nghệ: MediaPipe Hands | Đàn Tranh 17 dây | Real-time Hand Tracking</p>
        </div>
      </div>
    </div>
  );
};

export default VirtualDanTranh;
