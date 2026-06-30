import { createHash } from 'node:crypto';
import http from 'node:http';

const PORT = Number(process.env.MOCK_BACKEND_PORT ?? 8001);
const INTERVAL_MS = Number(process.env.MOCK_BACKEND_INTERVAL_MS ?? 5000);
const STATION_ID = 'STATION-01';

const measurementClients = new Set();
const stationHealthClients = new Set();
const measurements = [];
let sequence = 1;
let latestStationHealth = createStationHealth(sequence);

function createMeasurement(id) {
  const now = new Date();
  const length = 1100 + (id % 5) * 25;
  const width = 760 + (id % 4) * 20;
  const height = 920 + (id % 6) * 18;
  const volumeCm3 = (length * width * height) / 1000;
  const paletteId = `PLT-DEMO-${String(id).padStart(4, '0')}`;
  const ocrImagePath = `/mock-images/ocr/${id}.svg`;
  const depthImagePath = `/mock-images/depth/${id}.svg`;

  return {
    id,
    palette_id: paletteId,
    measurement_result: volumeCm3,
    scanner_id: 1,
    scanner_name: 'ST-01',
    length,
    width,
    height,
    images: [
      {
        id: id * 2,
        path: ocrImagePath,
        image_type: 'OCR',
        created_at: now.toISOString(),
      },
      {
        id: id * 2 + 1,
        path: depthImagePath,
        image_type: 'Depth',
        created_at: now.toISOString(),
      },
    ],
    created_at: now.toISOString(),
  };
}

function createStationHealth(id) {
  const now = new Date().toISOString();
  const isDemoIssue = id % 5 === 0;
  const cameraStatus = isDemoIssue ? 'down' : 'up';

  return {
    id,
    station_id: STATION_ID,
    rgb_camera_1_status: 'up',
    rgb_camera_2_status: cameraStatus,
    rgb_camera_3_status: 'up',
    rgb_camera_4_status: 'up',
    rgb_camera_5_status: 'up',
    rgb_camera_6_status: 'up',
    rgb_camera_7_status: 'up',
    rgb_camera_8_status: 'up',
    depth_camera_status: 'up',
    ocr_camera_status: 'up',
    trigger_sensor_1_status: 'up',
    trigger_sensor_2_status: 'up',
    trigger_sensor_3_status: cameraStatus,
    database_status: 'up',
    log_type: 'periodic',
    description: isDemoIssue ? 'demo camera/sensor status change' : 'all monitored devices are up',
    captured_at: now,
    created_at: now,
  };
}

function sendJson(response, status, data) {
  response.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Content-Type': 'application/json',
  });
  response.end(JSON.stringify(data));
}

function sendSvg(response, svg) {
  response.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store',
    'Content-Type': 'image/svg+xml',
  });
  response.end(svg);
}

function colorForScan(id, offset = 0) {
  const hue = (id * 47 + offset) % 360;
  return `hsl(${hue} 76% 48%)`;
}

function createDepthSvg(id) {
  const measurement = createMeasurement(id);
  const primary = colorForScan(id, 0);
  const secondary = colorForScan(id, 110);
  const accent = colorForScan(id, 220);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" role="img">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#101827"/>
        <stop offset="0.52" stop-color="${primary}"/>
        <stop offset="1" stop-color="${accent}"/>
      </linearGradient>
      <linearGradient id="box" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${secondary}"/>
        <stop offset="1" stop-color="#f6d96a"/>
      </linearGradient>
    </defs>
    <rect width="1280" height="720" fill="url(#bg)"/>
    <g opacity="0.22" stroke="#fff" stroke-width="2">
      <path d="M0 120H1280M0 240H1280M0 360H1280M0 480H1280M0 600H1280"/>
      <path d="M160 0V720M320 0V720M480 0V720M640 0V720M800 0V720M960 0V720M1120 0V720"/>
    </g>
    <g transform="translate(${260 + (id % 5) * 10} ${150 + (id % 4) * 12})">
      <polygon points="230,120 560,44 800,178 448,282" fill="#06111d" opacity="0.4"/>
      <polygon points="230,110 560,34 800,170 448,272" fill="url(#box)"/>
      <polygon points="230,110 448,272 448,500 230,326" fill="${primary}"/>
      <polygon points="448,272 800,170 800,404 448,500" fill="${accent}"/>
      <g fill="none" stroke="#fff" stroke-width="8" opacity="0.82">
        <path d="M286 154 452 262 452 458"/>
        <path d="M560 78 728 172"/>
        <path d="M534 294 740 236"/>
      </g>
    </g>
    <g fill="#fff" font-family="Inter, Arial, sans-serif">
      <text x="58" y="74" font-size="32" font-weight="700">Measurement Device Feed</text>
      <text x="58" y="118" font-size="22" opacity="0.78">Depth image scan #${id}</text>
      <text x="58" y="660" font-size="22" opacity="0.86">L ${measurement.length} mm / W ${measurement.width} mm / H ${measurement.height} mm</text>
    </g>
  </svg>`;
}

function createOcrSvg(id) {
  const measurement = createMeasurement(id);
  const primary = colorForScan(id, 80);
  const accent = colorForScan(id, 190);
  const bars = Array.from({ length: 18 }, (_, index) => {
    const width = 10 + ((id + index * 7) % 5) * 8;
    const x = 52 + index * 42;
    return `<rect x="${x}" y="218" width="${width}" height="82"/>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" role="img">
    <rect width="1280" height="720" fill="#17202a"/>
    <rect x="86" y="78" width="1108" height="564" rx="18" fill="${primary}"/>
    <rect x="126" y="118" width="1028" height="484" rx="10" fill="#e8edf3"/>
    <g transform="translate(${210 + (id % 4) * 12} ${180 + (id % 3) * 18})">
      <rect x="0" y="0" width="860" height="352" rx="18" fill="#fff"/>
      <text x="48" y="84" fill="#1a1a1a" font-family="Inter, Arial, sans-serif" font-size="42" font-weight="700">PALLET ID</text>
      <text x="48" y="154" fill="${accent}" font-family="Inter, Arial, sans-serif" font-size="56" font-weight="800">${measurement.palette_id}</text>
      <g fill="#111827">${bars}</g>
      <text x="48" y="330" fill="#6c757d" font-family="Inter, Arial, sans-serif" font-size="20">OCR image scan #${id}</text>
    </g>
    <g fill="none" stroke="#28a745" stroke-width="8" opacity="0.9">
      <path d="M172 150h120M172 150v90"/>
      <path d="M1108 150h-120M1108 150v90"/>
      <path d="M172 570h120M172 570v-90"/>
      <path d="M1108 570h-120M1108 570v-90"/>
    </g>
  </svg>`;
}

function parseBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    request.on('error', reject);
  });
}

function frameWebSocketMessage(data) {
  const payload = Buffer.from(JSON.stringify(data));
  const headerLength = payload.length < 126 ? 2 : payload.length < 65536 ? 4 : 10;
  const frame = Buffer.alloc(headerLength + payload.length);

  frame[0] = 0x81;
  if (payload.length < 126) {
    frame[1] = payload.length;
    payload.copy(frame, 2);
  } else if (payload.length < 65536) {
    frame[1] = 126;
    frame.writeUInt16BE(payload.length, 2);
    payload.copy(frame, 4);
  } else {
    frame[1] = 127;
    frame.writeBigUInt64BE(BigInt(payload.length), 2);
    payload.copy(frame, 10);
  }

  return frame;
}

function broadcast(clients, event) {
  const frame = frameWebSocketMessage(event);
  for (const socket of clients) {
    if (!socket.destroyed) {
      socket.write(frame);
    }
  }
}

function acceptWebSocket(request, socket, clients) {
  const key = request.headers['sec-websocket-key'];
  if (!key) {
    socket.destroy();
    return;
  }

  const accept = createHash('sha1')
    .update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`)
    .digest('base64');

  socket.write(
    [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${accept}`,
      '',
      '',
    ].join('\r\n'),
  );

  clients.add(socket);
  socket.on('close', () => clients.delete(socket));
  socket.on('error', () => clients.delete(socket));
}

function publishNext() {
  const measurement = createMeasurement(sequence);
  latestStationHealth = createStationHealth(sequence);
  measurements.unshift(measurement);
  measurements.splice(50);

  broadcast(measurementClients, {
    type: 'measurement.created',
    measurement,
  });
  broadcast(stationHealthClients, {
    type: 'station_health.changed',
    station_health: latestStationHealth,
  });

  console.log(
    `[mock-backend] ${measurement.palette_id} ${measurement.length}x${measurement.width}x${measurement.height} ${measurement.measurement_result.toFixed(2)} cm3`,
  );
  sequence += 1;
}

for (let i = 0; i < 20; i += 1) {
  measurements.unshift(createMeasurement(sequence));
  latestStationHealth = createStationHealth(sequence);
  sequence += 1;
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host}`);

  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {});
    return;
  }

  if (request.method === 'GET' && url.pathname === '/health') {
    sendJson(response, 200, { status: 'healthy', database: 'mock' });
    return;
  }

  if (request.method === 'GET' && url.pathname === '/measurements/recent') {
    const limit = Number(url.searchParams.get('limit') ?? 20);
    sendJson(response, 200, measurements.slice(0, limit));
    return;
  }

  const imageMatch = url.pathname.match(/^\/mock-images\/(ocr|depth)\/(\d+)\.svg$/);
  if (request.method === 'GET' && imageMatch) {
    const [, type, rawId] = imageMatch;
    const id = Number(rawId);
    sendSvg(response, type === 'ocr' ? createOcrSvg(id) : createDepthSvg(id));
    return;
  }

  if (request.method === 'POST' && url.pathname === '/measurements') {
    try {
      const body = await parseBody(request);
      const measurement = {
        ...createMeasurement(sequence),
        palette_id: body.palette_id || `PLT-DEMO-${String(sequence).padStart(4, '0')}`,
        measurement_result: Number(body.measurement_result ?? body.volume ?? body.actual_volume ?? 0),
        scanner_id: Number(body.scanner_id ?? 1),
      };
      measurements.unshift(measurement);
      measurements.splice(50);
      sequence += 1;
      broadcast(measurementClients, { type: 'measurement.created', measurement });
      sendJson(response, 201, measurement);
    } catch {
      sendJson(response, 400, { detail: 'Invalid JSON body' });
    }
    return;
  }

  if (request.method === 'GET' && url.pathname === '/station-health/current') {
    sendJson(response, 200, [latestStationHealth]);
    return;
  }

  if (request.method === 'POST' && url.pathname === '/station-health') {
    try {
      const body = await parseBody(request);
      latestStationHealth = {
        ...createStationHealth(sequence),
        ...body,
        id: sequence,
        station_id: body.station_id || STATION_ID,
        captured_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      sequence += 1;
      broadcast(stationHealthClients, {
        type: 'station_health.changed',
        station_health: latestStationHealth,
      });
      sendJson(response, 201, latestStationHealth);
    } catch {
      sendJson(response, 400, { detail: 'Invalid JSON body' });
    }
    return;
  }

  sendJson(response, 404, { detail: 'Not found' });
});

server.on('upgrade', (request, socket) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host}`);

  if (url.pathname === '/ws/measurements') {
    acceptWebSocket(request, socket, measurementClients);
    return;
  }

  if (url.pathname === '/ws/station-health') {
    acceptWebSocket(request, socket, stationHealthClients);
    return;
  }

  socket.destroy();
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[mock-backend] listening on http://localhost:${PORT}`);
  console.log(`[mock-backend] websocket measurements: ws://localhost:${PORT}/ws/measurements`);
  console.log(`[mock-backend] websocket station health: ws://localhost:${PORT}/ws/station-health`);
  console.log(`[mock-backend] publishing every ${INTERVAL_MS / 1000}s`);
});

setInterval(publishNext, INTERVAL_MS);
