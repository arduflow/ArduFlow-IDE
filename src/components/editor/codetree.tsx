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

/*
 * TODO: add blocks to secondary trees
 * TODO: add / update blocks to use 2 code paths 
 * TODO: remove test code
 *
 */
export const CodeTree = (props: CodeTreeProps) => {

  const blockGrid = addPathToBlockgrid([], props.blocks, props.setTree)

  return (
    <div>
      <Row>
        <Col span={18} offset={3} style={{ marginBottom: 20 }}>
          <h1>Realise your idea</h1>
        </Col>
      </Row>
      <div style={{ overflow: 'auto', minHeight: '80vh' }}>
        {blockGrid.map(br => renderBlockRow(br))}
      </div>
      <Row type="flex" justify="start" style={{ flexWrap: "nowrap", alignItems: "center", backgroundColor: "white", height: "15vh", padding: 50, position: "fixed", left: 0, bottom: 0, width: "100%" }}>
        {toolbar(props.availableBlocks, props.setTree, props.blocks)}
      </Row>
    </div>
  )
}

const tap: <a, b> (_: (_: a) => b, __: a) => a =
  (f, a) => { f(a); return a }

const renderBlockRow: (br: JSX.Element[]) => JSX.Element =
  br => <Row type="flex" justify="start" style={{ flexWrap: "nowrap", padding: 50, paddingTop: 10, paddingBottom: 10 }}>
    {br}
  </Row>

const renderBlockElement: (
  b: ArduinoCodeblockData,
  isLast: boolean,
  setPath: (_: Immutable.List<ArduinoCodeblockData>) => void,
  path: Immutable.List<ArduinoCodeblockData>
) => JSX.Element =
  (b, isLast, setPath, path) => (
    <Col span={6} style={{ position: 'relative' }}>
      <div style={{ width: '80%' }}>
        {renderBlock(
          b,
          new_b => setPath(path.set(path.indexOf(b), new_b)),
          rm_b => setPath(path.remove(path.indexOf(rm_b))),
          l_b => {
            const old_index = path.indexOf(l_b)
            if (old_index == 0) return
            const new_index = old_index - 1
            const old = path.get(new_index)
            setPath(path
              .set(new_index, l_b)
              .set(old_index, old))
          },
          r_b => {
            const old_index = path.indexOf(r_b)
            if (old_index == path.count() - 1) return
            const new_index = old_index + 1
            const old = path.get(new_index)
            setPath(path
              .set(new_index, r_b)
              .set(old_index, old))
          })}
      </div>
      {!isLast && <div style={{ width: '20%', position: 'absolute', top: 0, right: 0 }}>
        <Icon type="arrow-right" style={{ fontSize: "5vh", marginTop: 50, marginLeft: 10 }} />
      </div>}
    </Col>
  )

const emptyColls = (n: number) => Array.apply(null, new Array(n)).map(_ => (<Col span={6}> </Col>))

const toolbar = (
  availableBlocks: Immutable.List<ArduinoCodeblockData>,
  setTree: (_: Immutable.List<ArduinoCodeblockData>) => void,
  blocks: Immutable.List<ArduinoCodeblockData>
) => availableBlocks
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
                onClick={() => setTree(blocks.push({ ...b }))}
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

const addPathToBlockgrid = (
  blockGrid: BlockGrid,
  path: Immutable.List<ArduinoCodeblockData>,
  setPath: (_: Immutable.List<ArduinoCodeblockData>) => void,
  offset: number = 0
): BlockGrid => {
  blockGrid.push([])

  blockGrid[blockGrid.length - 1].push(emptyColls(offset))

  path.forEach((b, _, itt) => {
    blockGrid[blockGrid.length - 1].push(renderBlockElement(
      b,
      itt.last() == b,
      setPath,
      path
    ))
    return true
  })

  path.reverse().forEach(b => {
    if (hasSecondaryTree(b))
      addPathToBlockgrid(
        blockGrid,
        (b as any).secondaryTree,
        p => setPath(
          path.set(
            path.indexOf(b),
            { ...b, secondaryTree: p } as ArduinoCodeblockData
          )
        ),
        path.indexOf(b) + offset
      )
    return true
  })

  return blockGrid
}

const hasSecondaryTree = (b: ArduinoCodeblockData) : boolean =>
  b.kind == 'condition' ||
  b.kind == 'ultrasone-sensor'