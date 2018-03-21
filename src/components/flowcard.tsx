import * as React from "react"
import { Row, Card, Col, Icon } from "antd"
import { render } from "react-dom";

type Block = SimpleBlock | BranchedBlock

type SimpleBlock = {
  kind: "simple-block"
  value: string
  block: Block | "none"
}

type BranchedBlock = {
  kind: "branched-block"
  value: string
  block: Block | "none"
  branche: Block | "none"
}

const renderBlockValue = (block: Block) => (
  <Card style={{ borderRadius: 25, width: 250, height: 100}}>
    <p>{block.value}</p>
  </Card>
)

const renderAddButton = (colum: number, row: number, position: "right" | "bottom" = "right") => position == "right" ?
  <div
    style={{
      position: "absolute",
      left: colum * 300 + 10,
      top: row * 150 + 28 + 0.15*window.innerHeight
    }}>
    <Icon
      type="plus-circle-o"
      style={{
        fontSize: 40,
        color: "darkgrey",
        backgroundColor: "white",
        border: "5px solid white",
        borderRadius: 25
      }}
    />
  </div>
:
  <div
    style={{
      position: "absolute",
      left: colum * 300 + 150,
      top: row * 150 - 35 + 0.15*window.innerHeight
      }}>
      <Icon
        type="plus-circle-o"
        style={{
          fontSize: 40,
          color: "darkgrey",
          backgroundColor: "white",
          border: "5px solid white",
          borderRadius: 25
        }}
      />
  </div>

export const renderBlock = (block: Block, colum = 0, row = 0) => (
  <div>
    <div
      style={{
        position: "absolute",
        left: colum * 300 + .05*window.innerHeight,
        top: row * 150 + 0.15*window.innerHeight
        }}>
      {renderBlockValue(block)}
    </div>

    {block.block != "none" ?
      renderBlock(block.block, colum + 1, row)
    :
      renderAddButton(colum + 1, row)}
    {block.kind == "branched-block" ?
      block.branche != "none" ?
        renderBlock(block.branche, colum, row + 1)
      :
        renderAddButton(colum, row + 1, "bottom")
    :
      null}
  </div>
)