import * as React from "react";
import { ArduinoCodeblockData } from "../../code_generator/types";
import * as Immutable from "immutable";
import { LedBlock } from "./led_block";
import { ButtonBlock } from "./button_block";
import { DelayBlock } from "./delay_block";
import { RepeatBlock } from "./repeat_block";

export const renderBlock = (
  block: ArduinoCodeblockData,
  setBlock: (b: ArduinoCodeblockData) => void
) =>
  block.kind == "led" ? (
    <LedBlock leave={block} setBlock={b => setBlock(b)} />
  ) : block.kind == "button" ? (
    <ButtonBlock leave={block} setBlock={b => setBlock(b)} />
  ) : block.kind == "delay" ? (
    <DelayBlock leave={block} setBlock={b => setBlock(b)} />
  ) : block.kind == "repeat" ? (
    <RepeatBlock leave={block} setBlock={b => setBlock(b)} />
  ) : null;
