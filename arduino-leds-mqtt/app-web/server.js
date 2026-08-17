const express = require('express');
const mqtt = require('mqtt');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Conectar al broker MQTT local
const mqttClient = mqtt.connect('mqtt://localhost:1883');

let estadoLeds = { led1: 0, led2: 0, led3: 0 };

mqttClient.on('connect', () => {
  console.log('Conectado al broker MQTT');
  mqttClient.subscribe('leds/estado');
});

mqttClient.on('message', (topic, message) => {
  if (topic === 'leds/estado') {
    try {
      estadoLeds = JSON.parse(message.toString());
    } catch (e) {
      console.error('Error parseando estado:', e.message);
    }
  }
});

// Controlar un LED: POST /led/1 { "estado": "ON" }
app.post('/led/:num', (req, res) => {
  const num = req.params.num;
  const { estado } = req.body;

  if (!['1', '2', '3'].includes(num)) {
    return res.status(400).json({ error: 'LED invalido, usar 1, 2 o 3' });
  }
  if (!['ON', 'OFF'].includes(estado)) {
    return res.status(400).json({ error: 'Estado invalido, usar ON u OFF' });
  }

  mqttClient.publish(`leds/${num}`, estado);
  res.json({ ok: true, led: num, estado });
});

// Obtener estado actual de los LEDs
app.get('/estado', (req, res) => {
  res.json(estadoLeds);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App corriendo en http://localhost:${PORT}`);
  console.log('Desde celular (misma red): http://<IP-de-tu-PC>:3000');
});
