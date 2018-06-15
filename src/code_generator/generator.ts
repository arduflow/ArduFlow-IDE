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
  ExitCodeBlockData,
  WriteBlockData,
  SerialWriteBlockData,
} from "./types";
import * as Immutable from "immutable";
import { constructUltrasoneSensorData } from "./templates";

const tap: <a, b> (_: (_: a) => b, __: a) => a =
  (f, a) => { f(a); return a }

export const arduinoCodeblockConstructor: ArduinoCodeblockConstructor = (
  data: ArduinoCodeblockData
) => {
  switch (data.kind) {
    case "button": return buttonCodeblockConstructor(data)
    case "led": return ledCodeblockConstructor(data)
    case "delay": return delayCodeblockConstructor(data)
    case "repeat": return repeatCodeblockConstructor(data)
    case "ultrasone-sensor": return ultrasoneSensorCodeblockConstructor(data)
    case "exit": return exitCodeblockConstructor(data)
    case "write": return writeCodeblockConstructor(data)
    case "serial-write": return serialWriteCodeblockConstructor(data)
    default: throw new Error("Codeblock not implemented in the codegenerator")
  }
}

const buttonCodeblockConstructor = (data: ButtonCodeblockData) =>
  (id, state) => {
    let globalsCode = Immutable.List([
      `int ${id}_out = 0;`
    ])

    let startUpCode = Immutable.List<string>([
      `pinMode(${data.port}, INPUT);`
    ])

    const routineCode = `
    if(${id}_out == 0) {  

      if(digitalRead(${data.port}) == HIGH) {
        ${state}++;
      } else {
        ${data.secondaryTree == 'none' ? '' : `${id}_out = 1;`}
      }
    }

    if(${state}_out == 1){ 
      switch(${state}_${id}) {
        ${data.secondaryTree == 'none'
        ? `${state}++;`
        : data.secondaryTree
          .map(arduinoCodeblockConstructor)
          .map((x, i) => x(`${id}_${i}`, `${state}_${id}`))
          .map(x => tap(x => globalsCode = globalsCode.push(x.globalsCode), x))
          .map(x => tap(x => startUpCode = startUpCode.push(x.startUpCode), x))
          .map((x, i) => `case ${i}:\n { \n ${x.routineCode} \n break; }`)
          .toArray()
          .join("\n")
      }
      }
  }
  `

    return {
      globalsCode: globalsCode.toArray().join('\n'),
      startUpCode: startUpCode.toArray().join('\n'),
      routineCode
    }
  }

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
  let globalsCode = Immutable.List(data.secondaryTree == 'none'
    ? [`int ${id}_out = 0;`]
    : [
      `int ${state}_${id} = 0;`,
      `int ${id}_out = 0;`
    ]
  )

  let startUpCode = Immutable.List<string>([])

  const routineCode = `
    if(${id}_out == 0) {  
      digitalWrite(${data.triggerPort}, LOW);
      delayMicroseconds(2);

      digitalWrite(${data.triggerPort}, HIGH);
      delayMicroseconds(10);
      digitalWrite(${data.triggerPort}, LOW);

      long duration = pulseIn(${data.echoPort}, HIGH);

      if(duration*0.034/2 ${data.trigger == 'bigger-then' ? '<' : '>'} ${data.distance}) {
        ${state}++;
      } else {
        ${data.secondaryTree == 'none' ? '' : `${id}_out = 1;`}
      }
    }

    if(${state}_out == 1){ 
      switch(${state}_${id}) {
        ${data.secondaryTree == 'none'
      ? `${state}++;`
      : data.secondaryTree
        .map(arduinoCodeblockConstructor)
        .map((x, i) => x(`${id}_${i}`, `${state}_${id}`))
        .map(x => tap(x => globalsCode = globalsCode.push(x.globalsCode), x))
        .map(x => tap(x => startUpCode = startUpCode.push(x.startUpCode), x))
        .map((x, i) => `case ${i}:\n { \n ${x.routineCode} \n break; }`)
        .toArray()
        .join("\n")
    }
      }
  }
  `

  return {
    globalsCode: globalsCode.toArray().join('\n'),
    startUpCode: startUpCode.toArray().join('\n'),
    routineCode
  }
};

const exitCodeblockConstructor = (data: ExitCodeBlockData) => (id, state) => ({
  globalsCode: ``,
  startUpCode: ``,
  routineCode: `state = -1;`
})

const writeCodeblockConstructor = (data: WriteBlockData) => (id, state) => ({
  globalsCode: ``,
  startUpCode: ``,
  routineCode: `
    analogWrite(${data.port}, ${data.value});
    ${state}++;
  `
})

const serialWriteCodeblockConstructor = (data: SerialWriteBlockData) => (id, state) => ({
  globalsCode: ``,
  startUpCode: ``,
  routineCode: `
    Serial.write("${data.text}");
    ${state}++;
  `
})

export const ArduinoCodeTemplate: ArduinoCodeGenerator = (
  tree: Immutable.List<ArduinoCodeblockDefenition>
) => `
int state = 0;

${tree
    .map((x, i) => x(`${i}`, `state`))
    .map(x => x.globalsCode)
    .toArray()
    .join("\n")}

void setup() {
  Serial.begin(9600);

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
