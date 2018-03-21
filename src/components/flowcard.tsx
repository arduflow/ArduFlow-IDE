import * as React from "react"
import { Row, Card, Col } from "antd"

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
    <h2>{block.value}</h2>
  </Card>
)

export const renderBlock = (block: Block, colum = 0, row = 0) => (
  <div>
    <div style={{ position: "absolute", left: colum * 300 + .05*window.innerHeight, top: row * 150 + 0.15*window.innerHeight }}>
      {renderBlockValue(block)}
    </div>
    {block.block != "none" && renderBlock(block.block, colum + 1, row)}
    {block.kind == "branched-block" && block.branche != "none" && renderBlock(block.branche, colum, row + 1)}
  </div>
)