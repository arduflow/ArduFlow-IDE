import * as React from "react"
import * as Immutable from "immutable"
import { ArduinoCodeblockData, BlockUIData } from "../../code_generator/types"
import { defaultTemplates } from "../../code_generator/templates"
import { renderBlock } from "./../blocks/block_renderer"
import { Button, Row, Col, Tabs, Icon, Card } from "antd"
import { Toolbar } from "../toolbar_actions/toolbar"
import { getMetadata } from "../metadata"

type CodeTreeProps = {
  blocks: Immutable.List<ArduinoCodeblockData>
  setTree: (_: Immutable.List<ArduinoCodeblockData>) => void
  availableBlocks: Immutable.List<ArduinoCodeblockData>
}

type BlockGrid = Array<Array<JSX.Element>>

export const CodeTree = (props: CodeTreeProps) => {

  const blockGrid: BlockGrid = [[]]

  const renderBlockElement: (b: ArduinoCodeblockData) => JSX.Element =
    b => renderBlock(
      b,
      new_b => props.setTree(props.blocks.set(props.blocks.indexOf(b), new_b)),
      rm_b => props.setTree(props.blocks.remove(props.blocks.indexOf(rm_b))),
      l_b => {
        const old_index = props.blocks.indexOf(l_b)
        if (old_index == 0) return
        const new_index = old_index - 1
        const old = props.blocks.get(new_index)
        props.setTree(props.blocks
          .set(new_index, l_b)
          .set(old_index, old))
      },
      r_b => {
        const old_index = props.blocks.indexOf(r_b)
        if (old_index == props.blocks.count() - 1) return
        const new_index = old_index + 1
        const old = props.blocks.get(new_index)
        props.setTree(props.blocks
          .set(new_index, r_b)
          .set(old_index, old))
      }
    )

  const renderBlockRow: (br: JSX.Element[]) => JSX.Element =
    br => <Row type="flex" justify="start" style={{ flexWrap: "nowrap", padding: 50, paddingTop: 10 }}>
      {br.map(b => <Col span={5}>{b} </Col>)}
    </Row>

  const emptyColls = (n: number) => Array.apply(null, Array(n)).map(_ => <Col span={5}> </Col>)

  props.blocks
    .push({ label: "", kind: "condition", secondPath: props.blocks })
    .set(2, { label: "", kind: "condition", secondPath: props.blocks })
    .map(b => tap(b => blockGrid[0].push(renderBlockElement(b)), b))
    .reverse()
    .map((b, i, itt) => tap(b => b.kind == 'condition'
      ? blockGrid.push(
        [
          ...emptyColls(itt.count() - i - 1),
          ...b.secondPath.map(b1 => renderBlockElement(b1)).toArray()
        ])
      : b,
      b))

  return (
    <div>
      <Row>
        <Col span={18} offset={3} style={{ marginBottom: 20 }}>
          <h1>Realise your idea</h1>
        </Col>
      </Row>
      <div style={{ overflow: 'auto' }}>
        {blockGrid.map(br => renderBlockRow(br))}
      </div>
      <Row type="flex" justify="start" style={{ flexWrap: "nowrap", alignItems: "center", backgroundColor: "white", height: "15vh", padding: 50, position: "fixed", left: 0, bottom: 0, width: "100%" }}>
        {props.availableBlocks
          .concat(defaultTemplates)
          .sort((a, b) => a.label.localeCompare(b.label))
          .map(b => (
            <div style={{ marginRight: 15 }} className="toolbar-bottom">
              <Card
                style={{ minHeight: "9.5vh", minWidth: "20vh", borderRadius: 5, marginRight: 20 }}
                hoverable
                bordered
              >
                <Card.Meta
                  title={<h3>{b.label}<span style={{ float: 'right' }}><Icon type="question" onClick={e => e.stopPropagation()} /></span></h3>}
                  description={
                    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                      <Button
                        type="primary"
                        onClick={() => props.setTree(props.blocks.push({ ...b }))}
                      >
                        <Icon type="plus" />
                        add
                        </Button>
                    </div>
                  }
                />
              </Card>
            </div>
          ))
        }
      </Row>
    </div>
  )
}

const tap: <a, b> (_: (_: a) => b, __: a) => a =
  (f, a) => { f(a); return a }