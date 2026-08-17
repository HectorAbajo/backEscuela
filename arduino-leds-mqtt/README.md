# Arduino LEDs MQTT

Control de 3 LEDs con Arduino (Ethernet Shield) + Broker MQTT + App Web Node.js.

## Arquitectura

```
[Arduino + Ethernet Shield] <--MQTT--> [Mosquitto (PC)] <--MQTT--> [App Node.js]
```

## Requisitos

### Hardware
- Arduino Uno o Mega
- Ethernet Shield (W5100/W5500)
- 3 LEDs con resistencias (pines 5, 6, 7)
- Cable de red

### Software
- [Mosquitto MQTT Broker](https://mosquitto.org/download/)
- Node.js
- Arduino IDE con librería **PubSubClient**

## Configuración

### 1. Mosquitto
Instalar y ejecutar:
```bash
mosquitto -v
```

### 2. Arduino
- Editar `arduino/control_leds/control_leds.ino`
- Cambiar `ip` por la IP fija que quieras asignarle al Arduino
- Cambiar `brokerIP` por la IP de tu PC
- Subir el sketch

### 3. App Web
```bash
cd app-web
npm install
node server.js
```
Abrir en navegador: `http://localhost:3000`

Desde celular (misma red): `http://<IP-de-tu-PC>:3000`

## Tópicos MQTT

| Tópico | Dirección | Descripción |
|--------|-----------|-------------|
| `leds/1` | App → Arduino | Control LED 1 (ON/OFF) |
| `leds/2` | App → Arduino | Control LED 2 (ON/OFF) |
| `leds/3` | App → Arduino | Control LED 3 (ON/OFF) |
| `leds/estado` | Arduino → App | Estado actual de los 3 LEDs (JSON) |
