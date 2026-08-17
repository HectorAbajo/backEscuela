#include <Ethernet.h>
#include <PubSubClient.h>

// =============================================
// CONFIGURACION - Editar estos valores
// =============================================
byte mac[]      = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
IPAddress ip(192, 168, 1, 100);       // IP fija del Arduino
IPAddress brokerIP(192, 168, 1, 10);  // IP de tu PC con Mosquitto
// =============================================

#define LED1 5
#define LED2 6
#define LED3 7

EthernetClient ethClient;
PubSubClient client(ethClient);

String obtenerEstado() {
  return "{\"led1\":" + String(digitalRead(LED1)) +
         ",\"led2\":" + String(digitalRead(LED2)) +
         ",\"led3\":" + String(digitalRead(LED3)) + "}";
}

void callback(char* topic, byte* payload, unsigned int length) {
  String msg = "";
  for (unsigned int i = 0; i < length; i++) {
    msg += (char)payload[i];
  }

  if (String(topic) == "leds/1") digitalWrite(LED1, msg == "ON" ? HIGH : LOW);
  if (String(topic) == "leds/2") digitalWrite(LED2, msg == "ON" ? HIGH : LOW);
  if (String(topic) == "leds/3") digitalWrite(LED3, msg == "ON" ? HIGH : LOW);

  client.publish("leds/estado", obtenerEstado().c_str());
}

void reconnect() {
  while (!client.connected()) {
    Serial.println("Conectando al broker MQTT...");
    if (client.connect("ArduinoClient")) {
      Serial.println("Conectado!");
      client.subscribe("leds/1");
      client.subscribe("leds/2");
      client.subscribe("leds/3");
      client.publish("leds/estado", obtenerEstado().c_str());
    } else {
      Serial.print("Fallo, rc=");
      Serial.println(client.state());
      delay(3000);
    }
  }
}

void setup() {
  Serial.begin(9600);
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);

  Ethernet.begin(mac, ip);
  delay(1000);
  Serial.print("Arduino IP: ");
  Serial.println(Ethernet.localIP());

  client.setServer(brokerIP, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}
