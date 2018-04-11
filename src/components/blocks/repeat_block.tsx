import * as React from "react";
import {
  RepeatCodeBlockData,
  ArduinoCodeblockData
} from "../../code_generator/types";
import { Card } from "antd";
import { Tag, Popover, InputNumber, Switch, Input, Icon } from "antd";
import { PopoverValue } from "./popover_value";

type RepeatBlockProps = {
  setBlock: (l: RepeatCodeBlockData & { label: string }) => void;
  leave: RepeatCodeBlockData & { label: string };
  removeBlock: (l: RepeatCodeBlockData & { label: string }) => void;

};

export const RepeatBlock = (props: RepeatBlockProps) => {
  return (
    <Card style={{ minHeight: 150, borderRadius: 20, marginBottom: 50 }}>
      <h3>
        {props.leave.label}
        <span
          style={{ float: "right", color: "red" }}
          onClick={e => props.removeBlock(props.leave)}
        >
          <Icon type="delete" />
        </span>
      </h3>
      <p>Repeat the program</p>
    </Card>
  );
};
