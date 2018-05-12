import * as React from "react";
import { ArduinoCodeblockData } from "../../code_generator/types";
import * as Immutable from "immutable";
import { LedBlock } from "./led_block";
import { ButtonBlock } from "./button_block";
import { DelayBlock } from "./delay_block";
import { RepeatBlock } from "./repeat_block";
import { UltrasoneSensorBlock } from "./ultrasone_sensor_block";
import { Card, Icon } from "antd"

export const renderBlock = (
  block: ArduinoCodeblockData,
  setBlock: (b: ArduinoCodeblockData) => void,
  removeBlock: (b: ArduinoCodeblockData) => void,
  moveLeft: (b: ArduinoCodeblockData) => void,
  moveRight: (b: ArduinoCodeblockData) => void
) =>
  block.kind == "led" ? (
    <LedBlock
      leave={block}
      setBlock={b => setBlock(b)}
      moveLeft={b => moveLeft(b)}
      moveRight={b => moveRight(b)}
      removeBlock={b => moveRight(b)}
    />
  ) : block.kind == "button" ? (
    <ButtonBlock
      leave={block}
      setBlock={b => setBlock(b)}
      moveLeft={b => moveLeft(b)}
      moveRight={b => moveRight(b)}
      removeBlock={b => removeBlock(b)}
    />
  ) : block.kind == "delay" ? (
    <DelayBlock
      leave={block}
      setBlock={b => setBlock(b)}
      moveLeft={b => moveLeft(b)}
      moveRight={b => moveRight(b)}
      removeBlock={b => removeBlock(b)}
    />
  ) : block.kind == "repeat" ? (
    <RepeatBlock
      leave={block}
      setBlock={b => setBlock(b)}
      moveLeft={b => moveLeft(b)}
      moveRight={b => moveRight(b)}
      removeBlock={b => removeBlock(b)}
    />
  ) : block.kind == "ultrasone-sensor" ? (
    <UltrasoneSensorBlock
      leave={block}
      setBlock={b => setBlock(b)}
      moveLeft={b => moveLeft(b)}
      moveRight={b => moveRight(b)}
      removeBlock={b => removeBlock(b)}
    />
  ) : block.kind == "condition" ? (
    <Card style={{ minHeight: 150, borderRadius: 20, marginBottom: 50 }}>
      <h3>Test condition block</h3>
      <Icon type="arrow-down" style={{ fontSize: "5vh", marginTop: 50, marginLeft: 'auto', marginRight: 'auto' }} />
    </Card>
  ) : null;
