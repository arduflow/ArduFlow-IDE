import {
  ArduinoCodeblockConstructor,
  ArduinoCodeblockData,
  ButtonCodeblockData,
  LedCodeblockData,
  DelayCodeblockData,
  ArduinoCodeblockDefenition,
  ArduinoCodeGenerator,
  RepeatCodeBlockData,
  UltrasoneSensorBlockData,
  ExitCodeBlockData
} from "./types";
import * as Immutable from "immutable";
import { constructUltrasoneSensorData } from "./templates";

const tap: <a, b> (_: (_: a) => b, __: a) => a =
  (f, a) => { f(a); return a }

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
            : data.kind == "exit"
              ? exitCodeblockConstructor(data)
              : (id: number) => ({
                globalsCode: ``,
                startUpCode: ``,
                routineCode: `state++;`
              });

const buttonCodeblockConstructor = (data: ButtonCodeblockData) => (id, state) =>
  data.trigger == "pressed"
    ? {
      globalsCode: ``,
      startUpCode: `pinMode(${data.port}, INPUT);`,
      routineCode:
        ` if(digitalRead(${data.port}) == HIGH) {
            ${state}++;
          }`
    }
    : data.trigger == "down"
      ? {
        globalsCode: `bool prevv_state_${id} = false;`,
        startUpCode: `pinMode(${data.port}, INPUT);`,
        routineCode:
          ` bool curr_state = digitalRead(${data.port}) == HIGH;
          if(curr_state == true && prevv_state_${id} == false){
            ${state}++;
          }
          prevv_state_${id} = curr_state;`
      }
      : {
        globalsCode: `bool prevv_state_${id} = false;`,
        startUpCode: `pinMode(${data.port}, INPUT);`,
        routineCode:
          ` bool curr_state = digitalRead(${data.port}) == HIGH;
            if(curr_state == false && prevv_state_${id} == true){
                ${state}++;
            }
            prevv_state_${id} = curr_state;`
      };

const ledCodeblockConstructor = (data: LedCodeblockData) => (id, state) => ({
  globalsCode: ``,
  startUpCode: `pinMode(${data.port}, OUTPUT);`,
  routineCode:
    ` digitalWrite(${data.port}, ${data.transition == "on" ? "HIGH" : "LOW"});
      ${state}++;`
});

const delayCodeblockConstructor = (data: DelayCodeblockData) => (id, state) => ({
  globalsCode: ``,
  startUpCode: ``,
  routineCode:
    ` delay(${data.milliseconds});
      ${state}++;`
});

const repeatCodeblockConstructor = (data: RepeatCodeBlockData) => id => ({
  globalsCode: ``,
  startUpCode: ``,
  routineCode: `state = ${data.steps == "all" ? 0 : `state - ${data.steps}`};`
});

const ultrasoneSensorCodeblockConstructor = (data: UltrasoneSensorBlockData) => (id, state) => {
  let globalsCode = Immutable.List([`int ${state}_${id} = 0;`])
  const startUpCode = ``
  const routineCode = `
    switch(${state}_${id}) {
      ${data.secondaryTree
        .map(arduinoCodeblockConstructor)
        .map((x, i) => x(`${id}_${i}`, `${state}_${id}`))
        .map(x => tap(x => globalsCode = globalsCode.push(x.globalsCode), x))
        .map((x, i) => `case ${i}:\n { \n ${x.routineCode} \n break; }`)
        .toArray()
        .join("\n")
      }
    }
  `

  return { globalsCode: globalsCode.toArray().join('\n'), startUpCode, routineCode}
};

const exitCodeblockConstructor = (data: ExitCodeBlockData) => (id, state) => ({
  globalsCode: ``,
  startUpCode: ``,
  routineCode: `state = -1;`
})


export const ArduinoCodeTemplate: ArduinoCodeGenerator = (
  tree: Immutable.List<ArduinoCodeblockDefenition>
) => `
int state = 0;
int state_0 = 0;

${tree
    .map((x, i) => x(`${i}`, `state`))
    .map(x => x.globalsCode)
    .toArray()
    .join("\n")}

void setup() {
  ${tree
    .map((x, i) => x(`${i}`, `state`))
    .map(x => x.startUpCode)
    .toArray()
    .join("\n")
  }
}

void loop() {

  switch(state) {
      ${tree
        .map((x, i) => x(`${i}`, `state`))
        .map((x, i) => `case ${i}:\n { \n ${x.routineCode} \n break; }`)
        .toArray()
        .join("\n")
      }
  }
}`
