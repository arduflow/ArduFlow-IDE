import * as React from "react";
import {
    UltrasoneSensorBlockData,
    ArduinoCodeblockData
} from "../../code_generator/types";
import { Card } from "antd";
import { Tag, Popover, InputNumber, Switch, Input, Icon } from "antd";
import { PopoverValue } from "./popover_value";

type UltrasoneSensorBlockProps = {
    setBlock: (l: UltrasoneSensorBlockData & { label: string }) => void;
    leave: UltrasoneSensorBlockData & { label: string };
    removeBlock: (l: UltrasoneSensorBlockData & { label: string }) => void;
    moveRight: (l: UltrasoneSensorBlockData & { label: string }) => void;
    moveLeft: (l: UltrasoneSensorBlockData & { label: string }) => void;
};

export const UltrasoneSensorBlock = (props: UltrasoneSensorBlockProps) => {
    if (props.leave.kind !== "ultrasone-sensor") return

    const setTrigger = (
        <Switch
            checkedChildren="smaller"
            unCheckedChildren="bigger"
            checked={props.leave.trigger == "smaller-then"}
            onChange={v => props.setBlock({ ...props.leave, trigger: v ? "smaller-then" : "bigger-then" })}
        />
    )

    const setDistance = (
        <InputNumber
            value={props.leave.distance}
            onChange={m => props.setBlock({ ...props.leave, distance: Number(m) })}
        />
    )
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
            <p>Wait until the distance is <PopoverValue
                popoverElem={setTrigger}
                tagElem={props.leave.trigger == "smaller-then" ? "smaller" : "bigger"} 
            />then <PopoverValue
                popoverElem={setDistance}
                tagElem={props.leave.distance} 
            /> cm.</p>
        </Card>
    );
};
