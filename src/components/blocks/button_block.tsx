import * as React from "react"
import { ButtonCodeblockData, ArduinoCodeblockData } from "../../code_generator/types"
import { Card } from "antd"
import { Tag, Popover, InputNumber, Switch, Input, Icon, Button } from 'antd';
import { PopoverValue } from "./popover_value"

type ButtonBlockProps = {
    setBlock: (l: ButtonCodeblockData & {label:string}) => void
    leave: ButtonCodeblockData & {label:string}
    removeBlock: (l: ButtonCodeblockData & {label:string}) => void
    moveRight: (l: ButtonCodeblockData & {label:string}) => void
    moveLeft: (l: ButtonCodeblockData & {label:string}) => void
}

export const ButtonBlock = (props: ButtonBlockProps) => {
    if(props.leave.kind !== "button") return

    const setTrigger = (
        <Switch
            checkedChildren="pressed"
            unCheckedChildren="released"
            checked={props.leave.trigger == "up"}
            onChange={v => props.setBlock({...props.leave, trigger: v ? "up" : "down"})}
        />
    )

    const setPort = (
        <Input
            value={props.leave.port}
            onChange={p => props.setBlock({...props.leave, port:p.toString()})}
        />
    )

    return (
        <Card style={{minHeight: 150, borderRadius: 20, marginBottom: 50}}>
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
            <p>Go to the next step if the button with inputport {props.leave.port} is <PopoverValue
                popoverElem={setTrigger}
                tagElem={props.leave.trigger == "up" ? "pressed" : "released"}/>
            </p>
        </Card>
    )
}