import * as React from "react"
import { DelayCodeblockData, ArduinoCodeblockData } from "../../code_generator/types"
import { Card } from "antd"
import { Tag, Popover, InputNumber, Switch, Input, Icon } from 'antd';
import { PopoverValue } from "./popover_value"

type DelayBlockProps = {
    setBlock: (l: DelayCodeblockData & { label: string }) => void
    leave: DelayCodeblockData & { label: string }
    removeBlock: (l: DelayCodeblockData & { label: string }) => void

}

export const DelayBlock = (props: DelayBlockProps) => {

    const setMs = (
        <InputNumber
            value={props.leave.milliseconds}
            onChange={m => props.setBlock({ ...props.leave, milliseconds: Number(m) })}
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
            </h3>
            <p>Wait for <PopoverValue
                popoverElem={setMs}
                tagElem={props.leave.milliseconds}
            /> milliseconds.
            </p>
        </Card>
    )
}