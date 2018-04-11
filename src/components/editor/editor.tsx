import * as React from "react"
import * as Immutable from "immutable"
// import { defaultTemplates } from "../../code_generator/templates"
import { ArduinoCodeTemplate, arduinoCodeblockConstructor } from "../../code_generator/generator"
import { ArduinoCodeblockData, BlockUIData } from "../../code_generator/types"
import { Steps, Col, Row, Menu, Icon } from "antd"
import { HardwareStep } from "./hardware_step"
import { CodeTree } from "./codetree"

type EditorProps = {
    availableTemplates: Immutable.List<ArduinoCodeblockData>
    setAvailableTemplates: (b: Immutable.List<ArduinoCodeblockData>) => void
    tree: Immutable.List<ArduinoCodeblockData>;
    setTree: (_: Immutable.List<ArduinoCodeblockData>) => void
}


type EditorState = {
    step: "hardware" | "codetree"
    hasSeenCodetree: boolean
}

export class Editor extends React.Component<EditorProps, EditorState> {
    constructor(props) {
        super(props)

        this.state = {
            step: "hardware",
            hasSeenCodetree: false
        }
    }

    render() {
        return (
            <div>
                <Row>
                    <Menu
                        onClick={e => this.setState({ ...this.state, step: e.key == "hardware" ? "hardware" : "codetree" })}
                        selectedKeys={[this.state.step]}
                        mode="horizontal"
                        style={{ backgroundColor: "#f0f2f5ad", height: "5vh", marginBottom: "1vh"}}
                    >
                        <Menu.Item key="hardware" style={{ marginLeft: 50 }}>
                            <Icon type="tool" />Hardware
                        </Menu.Item>
                        <Menu.Item key="codetree" style={{ marginLeft: 50 }}>
                            <Icon type="code-o" />Code
                        </Menu.Item>
                    </Menu>
                </Row>
                <Row>
                    {this.state.step == "hardware" ?
                        <HardwareStep
                            availableTemplates={this.props.availableTemplates}
                            setAvailableTemplates={t => this.props.setAvailableTemplates(t)}
                            next={() => this.setState({ ...this.state, step: "codetree", hasSeenCodetree: true })}
                            hasSeenCodetree={this.state.hasSeenCodetree}
                        />
                        :
                        <CodeTree
                            blocks={this.props.tree}
                            setTree={t => this.props.setTree(t)}
                            availableBlocks={this.props.availableTemplates}
                        />
                    }
                </Row>
            </div>
        )
    }
}