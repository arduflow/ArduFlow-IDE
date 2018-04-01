import * as React from "react";
import {
  RepeatCodeBlockData,
  ArduinoCodeblockData
} from "../../code_generator/types";
import { Card } from "antd";
import { Tag, Popover, InputNumber, Switch, Input } from "antd";
import { PopoverValue } from "./popover_value";

type RepeatBlockProps = {
  setBlock: (l: RepeatCodeBlockData & { label: string }) => void;
  leave: RepeatCodeBlockData & { label: string };
};

export const RepeatBlock = (props: RepeatBlockProps) => {
  return (
    <Card style={{ minHeight: 150, borderRadius: 20, marginBottom: 50 }}>
      <h3>Repeat</h3>
      <p>Repeat the program</p>
    </Card>
  );
};
