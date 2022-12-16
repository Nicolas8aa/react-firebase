# Iot expanded esp32 module app

This project was created intended to expande available capabilites of esp32 using a custom pcb created and a dashboard app to control sensors, actuactors, and more to achieve that goal 

## Complete application
### [Esp32 Dashboard](https://cdio-iot.web.app/)

## Arduino libraries used
* [Firebase_ESP_Client]()
* [Adafruit_Sensor]()
* [Adafruit_BME280]()
* [Wire]()
* [WiFi]()


## Usage example code

```arduino
#include <Arduino.h>
#if defined(ESP32)
  #include <WiFi.h>
#elif defined(ESP8266)
  #include <ESP8266WiFi.h>
#endif
#include <Firebase_ESP_Client.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
//#include <Adafruit_BME280.h>

// Provide the token generation process info.
#include "addons/TokenHelper.h"
// Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"

// Insert your network credentials
#define WIFI_SSID "Your SSID"
#define WIFI_PASSWORD "Your red password"

// Insert Firebase project API Key
#define API_KEY "Firebase api key"

// Insert Authorized Email and Corresponding Password
#define USER_EMAIL "example@email.com"
#define USER_PASSWORD "123456"

// Insert RTDB URLefine the RTDB URL
#define DATABASE_URL "https://cdio-iot-default-rtdb.firebaseio.com/"

// Define pins of esp

int ldrpin = 33;
int lm35 = 34;

int alarmPin = 32;
// lightPin is for the moc
int lightPin = 23;

// RGB variables
unsigned char rgbPins[3] = {25, 26, 27};
unsigned char stateOn[3] = {HIGH, HIGH, LOW};
unsigned char stateOff[3] = {LOW, HIGH, HIGH};
unsigned char stateGreen[3] = {HIGH, LOW, HIGH};
unsigned char state[3] = {HIGH, HIGH, HIGH};

bool turnOn;
bool lastTurn = false;
int distanceLimit;
int ldrLimit;
int tempLimit;

// Define Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Variable to save USER UID
String uid;
int read_data;

// Variables to save database paths

String userPath;
String databasePath;
String tempPath;
String distancePath;
String ldrPath;


// BME280 sensor
//Adafruit_BME280 bme; // I2C
float temperature;
float distance;
float ldrVolts;

float lastTemp = 0;
float lastDistance = 0;
float lastLdr = 0;

float ldrThreshold = 0.5;
float tempThreshold = 1;
float distanceThreshold = 2;

//value of the resisitor

// ultrasonic code

int pinEco=13;
int pinTrig=12;

long readUltrasonicDistance(int triggerPin, int echoPin)
{ //Iniciamos el pin del emisor de reuido en salida
  pinMode(triggerPin, OUTPUT);
  //Apagamos el emisor de sonido
  digitalWrite(triggerPin, LOW);
  //Retrasamos la emision de sonido por 2 milesismas de segundo
  delayMicroseconds(2);
  // Comenzamos a emitir sonido
  digitalWrite(triggerPin, HIGH);
  //Retrasamos la emision de sonido por 2 milesismas de segundo
  delayMicroseconds(10);
  //Apagamos el emisor de sonido
  digitalWrite(triggerPin, LOW);
  //Comenzamos a escuchar el sonido
  pinMode(echoPin, INPUT);
  // Calculamos el tiempo que tardo en regresar el sonido
  return pulseIn(echoPin, HIGH);
}

// Initialize WiFi
void initWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi ..");

  while (WiFi.status() != WL_CONNECTED) {
    loadingRGB(rgbPins);
  }
  Serial.println(WiFi.localIP());
  Serial.println(WIFI_SSID);
}

// Write float values to the database
void sendFloat(String path, float value){
  if (Firebase.RTDB.setFloat(&fbdo, path.c_str(), value)){
    Serial.print("Writing value: ");
    Serial.print (value);
    Serial.print(" on the following path: ");
    Serial.println(path);
  }
  else {
    Serial.println("FAILED");
    Serial.println("REASON: " + fbdo.errorReason());
  }
}

void setup(){
  pinMode(25,OUTPUT);
  pinMode(26, OUTPUT);
  pinMode(27, OUTPUT);
  pinMode(alarmPin, OUTPUT);  
  pinMode(lightPin, OUTPUT);
  Serial.begin(115200);
  digitalWrite(alarmPin, HIGH);

  initWiFi();
  // Assign the api key (required)
  config.api_key = API_KEY;

  // Assign the user sign in credentials
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  // Assign the RTDB URL (required)
  config.database_url = DATABASE_URL;

  Firebase.reconnectWiFi(true);
  fbdo.setResponseSize(4096);

  // Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h

  // Assign the maximum retry of token generation
  config.max_token_generation_retry = 5;

  // Initialize the library with the Firebase authen and config
  Firebase.begin(&config, &auth);

  // Getting the user UID might take a few seconds
  Serial.println("Getting User UID");
  while ((auth.token.uid) == "") {
    loadingRGB(rgbPins);
  }
  // Print user UID
  uid = auth.token.uid.c_str();
  Serial.print("User UID: ");
  Serial.println(uid);

  // Update database path for sensor
  userPath = "/UsersData/" + uid;
  databasePath = userPath + "/Sensors";

  // Update database path for sensor readings
  tempPath = databasePath + "/Temperature (°C)";
  distancePath = databasePath + "/Distance (Cm)"; 
  ldrPath = databasePath + "/Ldr (Volts)";

  if (Firebase.RTDB.getInt(&fbdo, userPath + "/on")) {
    if (fbdo.dataType() == "boolean") { turnOn = fbdo.boolData(); }
    if (Firebase.ready() && turnOn) {handleRGB(rgbPins, stateOn);}
    else { handleRGB(rgbPins, stateOff); };
  }

}

void massDigitalWrite(unsigned char pins[], unsigned char states[]) {
  const int length = sizeof(pins) / sizeof(pins[0]);
  unsigned char i;
  for (i = 0; i < length; i++)
  digitalWrite(pins[i], states[i]);
}

void handleRGB(unsigned char pins[], unsigned char states[]) {
  massDigitalWrite(pins, states);
  delay(2000);
  massDigitalWrite(pins, state);
}

void loadingRGB(unsigned char pins[]) {
  massDigitalWrite(pins, stateOff);
  delay(250);
  massDigitalWrite(pins, stateGreen);
  delay(250);
  massDigitalWrite(pins, stateOn);
  delay(250);
  massDigitalWrite(pins, state);
}

int getData(String path) {
  if (Firebase.RTDB.getInt(&fbdo, userPath + path)) {
        if (fbdo.dataType() == "int") { return(fbdo.intData()); }
      }
}

float getDataFloat(String path) {
  if (Firebase.RTDB.getFloat(&fbdo, userPath + path)) {
        if (fbdo.dataType() == "float") { return(fbdo.intData()); }
      }
}



void loop(){
  if (Firebase.RTDB.getInt(&fbdo, userPath + "/on")) {
      if (fbdo.dataType() == "bool") { turnOn = fbdo.intData(); }
      }

  if (Firebase.ready()) {
    if (turnOn != lastTurn) {
      lastTurn = turnOn;
      if (turnOn) {handleRGB(rgbPins, stateOn);}
      else { handleRGB(rgbPins, stateOff);}
    }
    
    if (turnOn) {
      distanceLimit = getData("/Limit Distance");
      tempLimit = getData("/Limit Temp");
      ldrLimit = getDataFloat("/Limit Ldr");

      temperature = (analogRead(lm35) * 4620/4095)/10;
      distance = 0.01723 * readUltrasonicDistance(pinTrig, pinEco);
      ldrVolts = analogRead(ldrpin) * 4.620/4095;

      if (abs(ldrVolts - lastLdr) > ldrThreshold) {
      lastLdr = ldrVolts;
      Serial.print(ldrVolts);
      sendFloat(ldrPath, ldrVolts);
      }

      if (abs(temperature - lastTemp) > tempThreshold) {
      lastTemp = temperature;
      sendFloat(tempPath, lastTemp);
      }

      if (abs(distance - lastDistance) > distanceThreshold) {
      lastDistance = distance;
      sendFloat(distancePath, lastDistance);
      }

      if (distance < distanceLimit) {
        digitalWrite(alarmPin, LOW);
        delay(250);
        digitalWrite(alarmPin, HIGH);
      }

      if (ldrVolts < ldrLimit) {digitalWrite(lightPin, HIGH);}
      else {digitalWrite(lightPin, LOW);};
    }
  }
  delay(250);
```	

