import * as Immutable from "immutable"
import { ArduinoCodeblockData, BlockUIData, ButtonCodeblockData } from "./types"
import { read } from "fs";

export const constructButtonData: (port: string, label: string) => ArduinoCodeblockData =
  (port: string, label: string) => ({
    kind: "button",
    trigger: "down",
    port,
    label
  })

export const constructLedData: (port: string, label: string, color: string) => ArduinoCodeblockData =
  (port: string, label: string, color: string) => ({
    kind: "led",
    port,
    transition: "on",
    color,
    label
  })

export const constructUltrasoneSensorData: (echoPort: string, triggerPort: string, label: string) => ArduinoCodeblockData =
  (echoPort: string, triggerPort: string, label: string) => ({
    kind: "ultrasone-sensor",
    echoPort,
    triggerPort,
    trigger: "smaller-then",
    label,
    distance: 10,
    secondaryTree: Immutable.List()
  })

const delayData: ArduinoCodeblockData = {
  kind: "delay",
  label: "Delay",
  milliseconds: 100
}

const repeatData: ArduinoCodeblockData = {
  kind: "repeat",
  label: "Repeat program",
  steps: "all"
}

const exitData: ArduinoCodeblockData = {
  kind: 'exit',
  label: 'Exit program'
}

const readData: ArduinoCodeblockData = {
  kind: 'read',
  label: 'Read from port',
  condition: 'bigger-then',
  secondaryTree: 'none',
  value: 3,
  port: '1'
}

const writeData: ArduinoCodeblockData = {
  kind: 'write',
  label: 'Write to port',
  port: '1',
  value: 3
}

export const serialWriteData: ArduinoCodeblockData = {
  kind: 'serial-write',
  label: 'Serial write',
  text: ''
}

export const defaultTemplates: Immutable.List<ArduinoCodeblockData> = Immutable.List([
  writeData,
  readData,
  serialWriteData
])