import * as React from "react";
import * as Immutable from "immutable";
import {
  ArduinoCodeTemplate,
  arduinoCodeblockConstructor
} from "../code_generator/generator";
import { BlockUIData, ArduinoCodeblockData } from "../code_generator/types";
import { Row, Col, Layout } from "antd";
import { Wizard as SetupWizard } from "./setup_wizard/wizard";
import { Editor } from "./editor/editor";
import { Button, Form, Input, Modal, Icon, Alert, Card, List } from "antd";

type MainProps = {};
type MainState = {
  tree: Immutable.List<ArduinoCodeblockData>;
  availableBlocks: Immutable.List<ArduinoCodeblockData>;
  state: "open" | "codetree";
};

export class Main extends React.Component<MainProps, MainState> {
  constructor(props) {
    super(props);

    this.state = {
      tree: Immutable.List(),
      availableBlocks: Immutable.List(),
      state: "open"
    };
  }

  render() {
    return (
      <Layout>
        <Layout.Header
          style={{
            height: "10vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end"
          }}
        >
          <ToolBar state={this.state} setState={s => this.setState(s)} />}
        </Layout.Header>
        <Layout.Content style={{ height: "90vh" }}>
          {this.state.state == "open" ? (
            <OpenScreen state={this.state} setState={s => this.setState(s)} />
          ) : (
              <Editor
                availableTemplates={this.state.availableBlocks}
                setAvailableTemplates={b => this.setState({ ...this.state, availableBlocks: b })}
                tree={this.state.tree}
                setTree={t => this.setState({ ...this.state, tree: t })}
              />
            )}
        </Layout.Content>
      </Layout>
    );
  }
}

const OpenScreen = (props: {
  state: MainState;
  setState: (_: MainState) => void;
}) => (
    <div>
      <Row>
        <Col span={18} offset={3} style={{ marginTop: 20, marginBottom: 35 }}>
          <h1>
            Start prototyping<Button
              style={{ float: "right" }}
              size="large"
              type="primary"
              onClick={() =>
                props.setState({
                  tree: Immutable.List(),
                  availableBlocks: Immutable.List(),
                  state: "codetree"
                })
              }
            >
              <Icon type="file-add" />Start new project
          </Button>
          </h1>
        </Col>
      </Row>
      <Row>
        <Col span={6} offset={4}>
          <Open
            open={(t, b) =>
              props.setState({
                ...props.state,
                tree: t,
                availableBlocks: b,
                state: "codetree"
              })
            }
          />
        </Col>
      </Row>
    </div>
  );

const ToolBar = (props: {
  state: MainState;
  setState: (_: MainState) => void;
}) => (
    <div>
      <Button.Group size="large">
        {props.state.state == "codetree" &&
          <Button
            ghost
            onClick={() =>
              Modal.confirm({
                content: "All your unsaved progres wil be lost.",
                title: "Back to home",
                onOk: () =>
                  props.setState({
                    tree: Immutable.List(),
                    availableBlocks: Immutable.List(),
                    state: "open"
                  }),
                iconType: "home"
              })
            }
          >
            <Icon type="home" />
          </Button>
        }
        <Button
          ghost
          onClick={() =>
            Modal.info({
              content: (
                <Open
                  open={(t, b) =>
                    props.setState({
                      ...props.state,
                      tree: t,
                      availableBlocks: b,
                      state: "codetree"
                    })
                  }
                />
              ),
              title: "Open",
              okType: "ghost",
              okText: "close",
              iconType: "folder-open"
            })
          }
        >
          <Icon type="folder-open" />
        </Button>
        {props.state.state == "codetree" && (
          <Button
            ghost
            onClick={() =>
              Modal.info({
                content: <Save {...props.state} />,
                title: "Save",
                okText: "close",
                okType: "ghost",
                iconType: "save"
              })
            }
          >
            <Icon type="save" />
          </Button>
        )}
      </Button.Group>
      {props.state.state == "codetree" && <Button
        size="large"
        style={{
          marginLeft: 15,
          backgroundColor: "white",
          color: "#001529",
          borderColor: "white",
          marginRight: -10
        }}
        type="primary"
        onClick={() =>
          downloadFile(
            ArduinoCodeTemplate(
              props.state.tree.map(b => arduinoCodeblockConstructor(b)).toList()
            )
          )
        }
      >
        <Icon type="download" />
        Build and download
    </Button>
      }
    </div>
  );

class Save extends React.Component<
  {
    tree: Immutable.List<ArduinoCodeblockData>;
    availableBlocks: Immutable.List<ArduinoCodeblockData>;
  },
  { name: string; msg: string }
  > {
  constructor(props) {
    super(props);
    this.state = { name: "", msg: "" };
  }

  save() {
    if (localStorage.getItem("_save_" + this.state.name) == null) {
      localStorage.setItem(
        "_save_" + this.state.name,
        JSON.stringify({
          tree: this.props.tree.toArray(),
          blocks: this.props.availableBlocks.toArray()
        })
      );
      this.setState({ ...this.state, msg: "project saved" });
    } else {
      this.setState({ ...this.state, msg: "this name is already taken" });
    }
  }

  render() {
    return (
      <Form onSubmit={e => e.preventDefault() && this.save()}>
        {this.state.msg != "" && <div>{this.state.msg}</div>}
        <Form.Item>
          <label>Name</label>
          <Input
            value={this.state.name}
            onChange={e =>
              this.setState({ ...this.state, name: e.currentTarget.value })
            }
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={() => this.save()}>
            Save
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

class Open extends React.Component<
  {
    open: (
      tree: Immutable.List<ArduinoCodeblockData>,
      availableBlocks: Immutable.List<ArduinoCodeblockData>
    ) => void;
  },
  {}
  > {
  open(key: string) {
    if (localStorage.getItem(key) != null) {
      const data = JSON.parse(localStorage.getItem(key)) as {
        blocks: ArduinoCodeblockData[];
        tree: ArduinoCodeblockData[];
      };
      this.props.open(Immutable.List(data.tree), Immutable.List(data.blocks));
    }
  }

  remove(key: string) {
    if (localStorage.getItem(key) != null) {
      localStorage.removeItem(key);
      this.forceUpdate();
    }
  }

  render() {
    return (
      <List
        bordered
        size="large"
        header={<h2>Saved projects</h2>}
        dataSource={Object.keys(localStorage).filter(k =>
          k.startsWith("_save_")
        )}
        renderItem={(k: string) => (
          <List.Item
            actions={[
              <Button onClick={() => this.open(k)}>
                <Icon type="folder-open" />
              </Button>,
              <Button onClick={() => this.remove(k)}>
                <Icon type="delete" />
              </Button>
            ]}
          >
            <List.Item.Meta title={k.substring(6)} />
          </List.Item>
        )}
      />
    );
  }
}

const downloadFile = (s: string) => {
  const link = document.createElement("a");
  link.download = "code.c";
  const blob = new Blob([s], { type: "text/plain" });
  link.href = window.URL.createObjectURL(blob);
  link.click();
};
