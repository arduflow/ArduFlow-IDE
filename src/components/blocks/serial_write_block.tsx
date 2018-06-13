import * as React from "react"
import { SerialWriteBlockData, ArduinoCodeblockData } from "../../code_generator/types"
import { Card } from "antd"
import { Tag, Popover, InputNumber, Switch, Input, Icon } from 'antd';
import { PopoverValue } from "./popover_value"

type SerialWriteBlockProps = {
  setBlock: (l: SerialWriteBlockData & { label: string }) => void
  leave: SerialWriteBlockData & { label: string }
  removeBlock: (l: SerialWriteBlockData & { label: string }) => void
  moveRight: (l: SerialWriteBlockData & { label: string }) => void
  moveLeft: (l: SerialWriteBlockData & { label: string }) => void
}

export const SerialWriteBlock = (props: SerialWriteBlockProps) => {

  const setText = (
    <Input
      value={props.leave.text}
      placeholder='hello word'
      onChange={m => props.setBlock({ ...props.leave, text: m.currentTarget.value })}
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
      <p>Write <PopoverValue
        popoverElem={setText}
        tagElem={props.leave.text == ''
          ? <span style={{ color: 'grey' }}>hello word</span> 
          : props.leave.text}
      /> to the serial port.
      </p>
    </Card>
  )
}