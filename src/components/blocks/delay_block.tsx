import * as React from "react"
import { DelayCodeblockData, ArduinoCodeblockData } from "../../code_generator/types"
import { Card } from "antd"
import { Tag, Popover, InputNumber, Switch, Input  } from 'antd';
import { PopoverValue } from "./popover_value"

type DelayBlockProps = {
    setBlock: (l: DelayCodeblockData & {label:string}) => void
    leave: DelayCodeblockData & {label:string}
}

export const DelayBlock = (props: DelayBlockProps) => {

  const setMs = (
        <InputNumber
            value={props.leave.milliseconds}
            onChange={m => props.setBlock({...props.leave, milliseconds: Number(m)})}
        />
    )

    return (
        <Card style={{minHeight: 150, borderRadius: 20, marginBottom: 50}}>
            <h3>Delay</h3>
            <p>Wait for <PopoverValue
                popoverElem={setMs}
                tagElem={props.leave.milliseconds}
            /> milliseconds.
            </p>
        </Card>
    )
}