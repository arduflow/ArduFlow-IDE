import * as React from "react"
import { Button, Icon, Modal, Form, Input } from "antd"
import * as Immutable from "immutable"
import { BlockUIData, ArduinoCodeblockData } from "../../code_generator/types"

export const Toolbar = (
    tree: Immutable.List<ArduinoCodeblockData>,
    availableBlocks: Immutable.List<ArduinoCodeblockData>,
    setMainState: (tree: Immutable.List<ArduinoCodeblockData>, availableBlocks: Immutable.List<ArduinoCodeblockData>) => void
) => [
    // <Button
    //     style={{margin: 15}}
    //     onClick={() => Modal.info({
    //         title: "Save project",
    //         content: <Save tree={tree} availableBlocks={availableBlocks} />,
    //         iconType: "save",
    //         okText: "cancel",
    //         okType:"dashed"
    //     })}
    // >
    //     <Icon type="save" />Save
    // </Button>,
    // <Button
    //     style={{margin: 15}}
    //     onClick={() => Modal.info({
    //         title: "Open project",
    //         content: <Open open={setMainState}/>,
    //         okText: "cancel",
    //         okType: "dashed",
    //         iconType: "folder-open"
    //     })}
    // >
        // <Icon type="folder-open" />Open
    // </Button>,
    <Button style={{margin: 15}}><Icon type="delete" />Reset tree</Button>,
    <Button style={{margin: 15}}><Icon type="file-add" />New</Button>,
    <Button style={{margin: 15}}><Icon type="download" />Download</Button>
]

class Save extends React.Component<{tree: Immutable.List<ArduinoCodeblockData>, availableBlocks: Immutable.List<BlockUIData>}, {name: string}> {
    constructor(props) {
        super(props)
        this.state = {name: ""}
    }

    save() {
        if(localStorage.getItem("_save_" + this.state.name) == null) {
            localStorage.setItem("_save_" + this.state.name, JSON.stringify({
                tree: this.props.tree.toArray(),
                blocks: this.props.availableBlocks.toArray()}
            ))
        }
    }

    render() {
        return (
            <Form onSubmit={e => e.preventDefault() && this.save()}>
                <Form.Item>
                    <label>Name</label>
                    <Input value={this.state.name} onChange={e => this.setState({...this.state, name:e.currentTarget.value})}/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={() => this.save()}>Save</Button>
                </Form.Item>
            </Form>
        )
    }
}

class Open extends React.Component<{open: (tree: Immutable.List<ArduinoCodeblockData>, availableBlocks: Immutable.List<BlockUIData>) => void}, {}> {
    open(key:string) {
        if(localStorage.getItem(key) != null) {
            const data = JSON.parse(localStorage.getItem(key)) as {blocks: BlockUIData[], tree: ArduinoCodeblockData}
            this.props.open(Immutable.List(data.tree), Immutable.List(data.blocks))
        }
    }

    render() {
        return (
            <div>
                {Object.keys(localStorage)
                    .filter(k => k.startsWith("_save_"))
                    .map(k => <div><Button onClick={() => this.open(k)} style={{ width: "100%", margin: 10, textAlign: "left" }}>{k.substr(6)}</Button></div>)}
            </div>
        )
    }
}