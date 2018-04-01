import * as React from "react"
import { LedCodeblockData } from "../../code_generator/types"
import { Card } from "antd"
import { Tag, Popover, Input, Switch  } from 'antd';
import { PopoverValue } from "./popover_value"

type LedBlockProps = {
    setBlock: (l: LedCodeblockData) => void
    leave: LedCodeblockData
}

export const LedBlock = (props: LedBlockProps) => {
    const setTransition = (
        <Switch
            checkedChildren="on"
            unCheckedChildren="off"
            checked={props.leave.transition == "on"}
            onChange={v => props.setBlock({...props.leave, transition: v ? "on" : "off"})}
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
            <h3>Led</h3>
            <p>Turn the led connected to port <PopoverValue
                popoverElem={setPort}
                tagElem={props.leave.port}
            /> <PopoverValue
                popoverElem={setTransition}
                tagElem={props.leave.transition}/>
            </p>
        </Card>
    )
}


