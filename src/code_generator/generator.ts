import {
  ArduinoCodeblockConstructor,
  ArduinoCodeblockData,
  ButtonCodeblockData,
  LedCodeblockData,
  DelayCodeblockData,
  ArduinoCodeblockDefenition,
  ArduinoCodeGenerator,
  RepeatCodeBlockData,
  UltrasoneSensorBlockData
} from "./types";
import * as Immutable from "immutable";
import { constructUltrasoneSensorData } from "./templates";

export const arduinoCodeblockConstructor: ArduinoCodeblockConstructor = (
  data: ArduinoCodeblockData
) =>
  data.kind == "button"
    ? buttonCodeblockConstructor(data)
    : data.kind == "led"
      ? ledCodeblockConstructor(data)
      : data.kind == "delay"
        ? delayCodeblockConstructor(data)
        : data.kind == "repeat"
          ? repeatCodeblockConstructor(data)
          : data.kind == "ultrasone-sensor"
            ? ultrasoneSensorCodeblockConstructor(data)
            : (id: number) => ({
              globalsCode: ``,
              startUpCode: ``,
              routineCode: `state++;`
            });

const buttonCodeblockConstructor = (data: ButtonCodeblockData) => (
  id: number
) =>
  data.trigger == "pressed"
    ? {
      globalsCode: ``,
      startUpCode: `
            pinMode(${data.port}, INPUT);`,
      routineCode: `   if(digitalRead(${data.port}) == HIGH) {
                state++;
            }`
    }
    : data.trigger == "down"
      ? {
        globalsCode: `bool prevv_state_${id} = false;`,
        startUpCode: `
            pinMode(${data.port}, INPUT);`,
        routineCode: `   bool curr_state = digitalRead(${data.port}) == HIGH;
            if(curr_state == true && prevv_state_${id} == false){
                state++;
            }
            prevv_state_${id} = curr_state;`
      }
      : {
        globalsCode: `bool prevv_state_${id} = false;`,
        startUpCode: `
            pinMode(${data.port}, INPUT);`,
        routineCode: `   bool curr_state = digitalRead(${data.port}) == HIGH;
            if(curr_state == false && prevv_state_${id} == true){
                state++;
            }
            prevv_state_${id} = curr_state;`
      };

const ledCodeblockConstructor = (data: LedCodeblockData) => (id: number) => ({
  globalsCode: ``,
  startUpCode: `
            pinMode(${data.port}, OUTPUT);`,
  routineCode: `   digitalWrite(${data.port}, ${data.transition == "on" ? "HIGH" : "LOW"});
            state++;`
});

const delayCodeblockConstructor = (data: DelayCodeblockData) => (
  id: number
) => ({
  globalsCode: ``,
  startUpCode: ``,
  routineCode: `   delay(${data.milliseconds});
            state++;`
});

const repeatCodeblockConstructor = (data: RepeatCodeBlockData) => (
  id: number
) => ({
  globalsCode: ``,
  startUpCode: ``,
  routineCode: `
    state = ${data.steps == "all" ? 0 : `state - ${data.steps}`};`
});

const ultrasoneSensorCodeblockConstructor = (data: UltrasoneSensorBlockData) => (
  id: number
) => ({
  globalsCode: ``,
  startUpCode: ``,
  routineCode: ``
});


export const ArduinoCodeTemplate: ArduinoCodeGenerator = (
  tree: Immutable.List<ArduinoCodeblockDefenition>
) => `
        int state = 0;
        float value = 0;

        ${tree
    .map((x, i) => x(i))
    .map(x => x.globalsCode)
    .toArray()
    .join("\n")}

        void setup() {
            Serial.begin(9600);
            ${tree
    .map((x, i) => x(i))
    .map(x => x.startUpCode)
    .toArray()
    .join("\n")}
        }

        void loop() {

            switch(state) {
                ${tree
    .map((x, i) => x(i))
    .map(
      (x, i) => `case ${i}:\n { \n ${x.routineCode} \n break; }`
    )
    .toArray()
    .join("\n")}
            }
        }

    `;
