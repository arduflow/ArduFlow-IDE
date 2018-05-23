import * as React from "react";
import {
  ExitCodeBlockData,
  ArduinoCodeblockData
} from "../../code_generator/types";
import { Card } from "antd";
import { Tag, Popover, InputNumber, Switch, Input, Icon } from "antd";
import { PopoverValue } from "./popover_value";

type ExitBlockProps = {
  setBlock: (l: ExitCodeBlockData & { label: string }) => void;
  leave: ExitCodeBlockData & { label: string };
  removeBlock: (l: ExitCodeBlockData & { label: string }) => void;
  moveRight: (l: ExitCodeBlockData & { label: string }) => void;
  moveLeft: (l: ExitCodeBlockData & { label: string }) => void;
};

export const ExitBlock = (props: ExitBlockProps) => {
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
        <span
          style={{ float: "right", marginLeft: 15, marginRight: 15 }}
          onClick={e => props.moveRight(props.leave)}
        >
          <Icon type="arrow-right" />
        </span>
        <span
          style={{ float: "right" }}
          onClick={e => props.moveLeft(props.leave)}
        >
          <Icon type="arrow-left" />
        </span>
      </h3>
      <p>Exit the program</p>
    </Card>
  );
};
