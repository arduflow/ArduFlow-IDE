import * as React from "react"
import { ReadBlockData, ArduinoCodeblockData } from "../../code_generator/types"
import { Card } from "antd"
import { Tag, Popover, InputNumber, Switch, Input, Icon, Select } from 'antd';
import { PopoverValue } from "./popover_value"

type ReadBlockProps = {
  setBlock: (l: ReadBlockData & { label: string }) => void
  leave: ReadBlockData & { label: string }
  removeBlock: (l: ReadBlockData & { label: string }) => void
  moveRight: (l: ReadBlockData & { label: string }) => void
  moveLeft: (l: ReadBlockData & { label: string }) => void
}

export const ReadBlock = (props: ReadBlockProps) => {

  const setValue = (
    <InputNumber
      value={props.leave.value}
      onChange={m => props.setBlock({ ...props.leave, value: Number(m) })}
    />
  )

  const setPort = (
    <Select
      value={props.leave.port}
      onChange={p => props.setBlock({ ...props.leave, port: p.toString() })}
    >
      <Select.Option value="1">1</Select.Option>
      <Select.Option value="2">2</Select.Option>
      <Select.Option value="3">3</Select.Option>
      <Select.Option value="4">4</Select.Option>
      <Select.Option value="5">5</Select.Option>
      <Select.Option value="6">6</Select.Option>
      <Select.Option value="7">7</Select.Option>
      <Select.Option value="8">8</Select.Option>
      <Select.Option value="9">9</Select.Option>
      <Select.Option value="10">10</Select.Option>
      <Select.Option value="11">11</Select.Option>
      <Select.Option value="12">12</Select.Option>
      <Select.Option value="13">13</Select.Option>
      <Select.Option value="A1">A1</Select.Option>
      <Select.Option value="A2">A2</Select.Option>
      <Select.Option value="A3">A3</Select.Option>
      <Select.Option value="A4">A4</Select.Option>
      <Select.Option value="A5">A5</Select.Option>
    </Select>
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
      <p>Wait until port <PopoverValue
        popoverElem={setPort}
        tagElem={props.leave.port}
      /> outputs a value of <PopoverValue
          popoverElem={setValue}
          tagElem={props.leave.value}
        /> milliseconds.
      </p>
    </Card>
  )
}