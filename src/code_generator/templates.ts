import * as Immutable from "immutable"
import { ArduinoCodeblockData, BlockUIData, ButtonCodeblockData } from "./types"

export const constructButtonData : (port: string, label: string) => ArduinoCodeblockData =
    (port: string, label: string) => ({
        kind: "button",
        trigger: "down",
        port,
        label
    })

export const constructLedData : (port: string, label: string, color: string) => ArduinoCodeblockData =
    (port: string, label: string, color: string) => ({
        kind: "led",
        port,
        transition: "on",
        color,
        label
    })

const delayData : ArduinoCodeblockData = {
    kind: "delay",
    label: "Delay",
    milliseconds: 100
}

const repeatData : ArduinoCodeblockData= {
  kind: "repeat",
  label:"Repeat",
  steps: "all"
}

export const defaultTemplates : Immutable.List<ArduinoCodeblockData> = Immutable.List([
    delayData,
    repeatData
])