import * as React from "react"
import * as Immutable from "immutable"
import { ArduinoCodeblockData, BlockUIData } from "../../code_generator/types"
import { defaultTemplates } from "../../code_generator/templates"
import { renderBlock } from "./../blocks/block_renderer"
import { Button, Row, Col, Tabs, Icon, Card, Modal, Dropdown, Menu } from "antd"
import { getMetadata } from "../metadata"

type CodeTreeProps = {
  blocks: Immutable.List<ArduinoCodeblockData>
  setTree: (_: Immutable.List<ArduinoCodeblockData>) => void
  availableBlocks: Immutable.List<ArduinoCodeblockData>
}

type BlockGrid = Array<Array<JSX.Element>>

export const CodeTree = (props: CodeTreeProps) => {

  const blockGrid = addPathToBlockgrid([], props.availableBlocks, props.blocks, props.setTree)

  return (
    <div>
      <Row>
        <Col span={18} offset={3} style={{ marginBottom: 20, height: '5vh' }}>
          <h1>Realise your idea</h1>
        </Col>
      </Row>
      <div style={{ overflow: 'auto', minHeight: '77vh', backgroundColor: '#f0f2f5' }}>
        {blockGrid.map(br => renderBlockRow(br))}
      </div>
    </div>
  )
}

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

const addPathToBlockgrid = (
  blockGrid: BlockGrid,
  availableBlocks: Immutable.List<ArduinoCodeblockData>,
  path: Immutable.List<ArduinoCodeblockData>,
  setPath: (_: Immutable.List<ArduinoCodeblockData>) => void,
  offset: number = 0
): BlockGrid => {
  blockGrid.push([])

  blockGrid[blockGrid.length - 1].push(emptyColls(offset))

  path.forEach((b, _, itt) => {
    blockGrid[blockGrid.length - 1].push(renderBlockElement(
      b,
      b.kind == 'repeat' || b.kind == 'exit',
      setPath,
      path
    ))
    return true
  })

  if (!(!path.isEmpty() && (path.last().kind == 'exit' || path.last().kind == 'repeat'))) {
    blockGrid[blockGrid.length - 1].push(
      <AddButton
        blockGrid={blockGrid}
        availableBlocks={availableBlocks}
        path={path}
        setPath={setPath}
      />
    )
  }

  path.reverse().forEach(b => {
    if (hasSecondaryTree(b))
      addPathToBlockgrid(
        blockGrid,
        availableBlocks,
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

const AddButton = (props: {
  blockGrid: BlockGrid,
  availableBlocks: Immutable.List<ArduinoCodeblockData>,
  path: Immutable.List<ArduinoCodeblockData>,
  setPath: (_: Immutable.List<ArduinoCodeblockData>) => void,
}) => (
    <Col
      span={5}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
        borderRadius: 20,
        marginBottom: 50,
        flexWrap: 'wrap'
      }}>

      <Dropdown overlay={
        <Menu>
          {props.availableBlocks
            .concat(defaultTemplates)
            .sort((a, b) => a.label.localeCompare(b.label))
            .map(b => NewBlockItem(props.path, props.setPath, b))
          }
        </Menu>
      }>
        <Button
          type="primary"
          size="large"
        ><Icon type="down" />Add hardwareblock</Button>
      </Dropdown>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Button.Group>
          <Button
            onClick={() => props.setPath(props.path.push({ kind: 'repeat', steps: 'all', label: 'Repeat program' }))}
          ><Icon type="plus" /> Repeat</Button>
          <Button
            onClick={() => props.setPath(props.path.push({ kind: 'exit', label: 'Exit program' }))}
          ><Icon type="plus" /> Exit</Button>
          <Button
            onClick={() => props.setPath(props.path.push({ kind: 'delay', label: 'Delay', milliseconds: 100 }))}
          ><Icon type="plus" /> Delay</Button>
        </Button.Group>
      </div>
    </Col>
  )

const NewBlockItem = (
  path: Immutable.List<ArduinoCodeblockData>,
  setPath: (_: Immutable.List<ArduinoCodeblockData>) => void,
  block: ArduinoCodeblockData
) => {
  switch (block.kind) {
    default: return (
      <Menu.Item>
        <h3 onClick={e => setPath(path.push({ ...block }))}>
          <Icon type="plus" /> {block.label}
        </h3>
      </Menu.Item>
    )
    case 'ultrasone-sensor': return [
      <Menu.Item>
        <h3 onClick={e => setPath(path.push({ ...block, secondaryTree: 'none' } as ArduinoCodeblockData))}>
          <Icon type="plus" /> {block.label} (wait until)
        </h3>
      </Menu.Item>,
      <Menu.Item>
        <h3 onClick={e => setPath(path.push({ ...block, secondaryTree: Immutable.List() } as ArduinoCodeblockData))}>
          <Icon type="plus" /> {block.label} (if-else)
        </h3>
      </Menu.Item>
    ]
    case 'button': return [
      <Menu.Item>
        <h3 onClick={e => setPath(path.push({ ...block } as ArduinoCodeblockData))}>
          <Icon type="plus" /> {block.label} (wait until)
        </h3>
      </Menu.Item>,
      <Menu.Item>
        <h3 onClick={e => setPath(path.push({ ...block } as ArduinoCodeblockData))}>
          <Icon type="plus" /> {block.label} (if-else)
        </h3>
      </Menu.Item>
    ]
  }
}

const hasSecondaryTree = (b: ArduinoCodeblockData): boolean =>
  b.kind == 'condition' ||
  b.kind == 'ultrasone-sensor' && b.secondaryTree != 'none' ||
  b.kind == 'button' && b.secondaryTree != 'none'

const tap: <a, b> (_: (_: a) => b, __: a) => a =
  (f, a) => { f(a); return a }
