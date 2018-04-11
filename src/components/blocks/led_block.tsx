import * as React from "react"
import { LedCodeblockData } from "../../code_generator/types"
import { Card } from "antd"
import { Tag, Popover, Input, Switch, Icon } from 'antd';
import { PopoverValue } from "./popover_value"

type LedBlockProps = {
    setBlock: (l: LedCodeblockData) => void
    leave: LedCodeblockData
    removeBlock: (l: LedCodeblockData) => void
    moveLeft: (b: LedCodeblockData) => void,
    moveRight: (b: LedCodeblockData) => void
}

export const LedBlock = (props: LedBlockProps) => {
    const setTransition = (
        <Switch
            checkedChildren="on"
            unCheckedChildren="off"
            checked={props.leave.transition == "on"}
            onChange={v => props.setBlock({ ...props.leave, transition: v ? "on" : "off" })}
        />
    )

    const setPort = (
        <Input
            value={props.leave.port}
            onChange={p => props.setBlock({ ...props.leave, port: p.toString() })}
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
            <p>Turn the led connected to port {props.leave.port} <PopoverValue
                popoverElem={setTransition}
                tagElem={props.leave.transition} />
            </p>
        </Card>
    )
}


