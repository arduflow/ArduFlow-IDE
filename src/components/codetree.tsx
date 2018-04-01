import * as React from "react"
import * as Immutable from "immutable"
import { ArduinoCodeblockData, BlockUIData } from "../code_generator/types"
import { defaultTemplates } from "../code_generator/templates"
import { renderBlock } from "./blocks/block_renderer"
import { Button, Row, Col, Tabs, Icon } from  "antd"
import { Toolbar } from "./toolbar_actions/toolbar"

type CodeTreeProps = {
    blocks: Immutable.List<ArduinoCodeblockData>
    setTree: (_:Immutable.List<ArduinoCodeblockData>) => void
    availableBlocks: Immutable.List<ArduinoCodeblockData>
}

export const CodeTree = (props: CodeTreeProps) => <div>
    <Row type="flex" justify="start" style={{ flexWrap: "nowrap", overflow: "auto", height: "75vh", padding: 50}}>
        {props.blocks.map(
            (b, _, i) => [
              <Col span={5}>
                {renderBlock(b, new_b => props.setTree(props.blocks.set(props.blocks.indexOf(b), new_b)))}
              </Col>,
              i.last() != b && <Col span={1}>
                <Icon type="arrow-right" style={{fontSize: "5vh", marginTop: 50, marginLeft: 10}}/>
              </Col>
            ]
        )}
        <Col span={1} />
    </Row>

    <Row type="flex" justify="start" style={{ flexWrap: "nowrap", alignItems: "center", backgroundColor: "white", height: "15vh", padding: 50}}>
        {props.availableBlocks
            .concat(defaultTemplates)
            .sort((a,b) => a.label.localeCompare(b.label))
            .map(b => <Button size="large" style={{marginRight: 15}} onClick={() => props.setTree(props.blocks.push({...b}))}><Icon type="plus" />{b.label}</Button>)
        }
    </Row>
</div>
