import * as React from "react"
import * as Immutable from "immutable"
import { ArduinoCodeblockData, BlockUIData } from "../../code_generator/types"
import { defaultTemplates } from "../../code_generator/templates"
import { renderBlock } from "./../blocks/block_renderer"
import { Button, Row, Col, Tabs, Icon, Card } from  "antd"
import { Toolbar } from "../toolbar_actions/toolbar"
import { getMetadata } from "../metadata"

type CodeTreeProps = {
    blocks: Immutable.List<ArduinoCodeblockData>
    setTree: (_:Immutable.List<ArduinoCodeblockData>) => void
    availableBlocks: Immutable.List<ArduinoCodeblockData>
}

export const CodeTree = (props: CodeTreeProps) => <div>
    <Row>
      <Col span={18} offset={3} style={{ marginBottom: 20 }}>
        <h1>Realise your idea</h1>
      </Col>
    </Row>    
    <Row type="flex" justify="start" style={{ flexWrap: "nowrap", overflow: "auto", padding: 50, paddingTop: 10}}>
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

    <Row type="flex" justify="start" style={{ flexWrap: "nowrap", alignItems: "center", backgroundColor: "white", height: "15vh", padding: 50, position: "fixed", left: 0, bottom: 0, width: "100%"}}>
        {props.availableBlocks
            .concat(defaultTemplates)
            .sort((a,b) => a.label.localeCompare(b.label))
            .map(b => (
              <div style={{marginRight: 15 }} className="toolbar-bottom">
                <Card
                  style={{ minHeight: "9.5vh", minWidth: "20vh", borderRadius: 5, marginRight: 20 }}
                  hoverable
                  bordered
                  >
                  <Card.Meta
                    title={<h3>{b.label}<span style={{float: 'right'}}><Icon type="question" onClick={e => e.stopPropagation()} /></span></h3>}
                    description={
                      <div style={{display: "flex", justifyContent: "center", width: "100%" }}>
                        <Button
                          type="primary"
                          onClick={() => props.setTree(props.blocks.push({...b}))}
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
