import * as React from "react";
import * as ReactDOM from "react-dom";
import {renderBlock} from "./components/flowcard"
import { Layout, Row, Tabs } from "antd"

class App extends React.Component<{}, {}> {

  render() {
    return (
      <Layout>
        <Layout.Header style={{ height: "10vh", position: "fixed", top: 0, left: 0, width: "100vw" }}></Layout.Header>
        <Layout style={{ height: "70vh"}}>
          {renderBlock({
            kind: "simple-block",
            value: "button is pressed",
            block: {
              kind: "branched-block",
              value: "1",
              block: {
                kind: "simple-block",
                value: "turn LED on",
                block: "none"
              },
              branche: {
                kind: "simple-block",
                value: "turn LED off",
                block: {
                  kind: "simple-block",
                  value: "repeat programm",
                  block: {
                    kind: "simple-block",
                    value: "repeat programm",
                    block: {
                      kind: "branched-block",
                      value: "2",
                      block: {
                        kind: "simple-block",
                        value: "turn LED on",
                        block: "none"
                      },
                      branche: {
                        kind: "branched-block",
                        value: "turn LED off",
                        block: {
                          kind: "simple-block",
                          value: "repeat programm",
                          block: {
                            kind: "simple-block",
                            value: "repeat programm",
                            block: "none"
                          }
                        },
                        branche: "none"
                      }
                    }
                  }
                }
              }
            }
          })}
          <Layout.Footer style={{ position: "fixed", height: "20vh", width: "100vw", bottom: 0, left: 0, backgroundColor: "white" }}>
          <Tabs defaultActiveKey="1" tabPosition="left">
            <Tabs.TabPane tab="All blocks" key="1">All blocks</Tabs.TabPane>
            <Tabs.TabPane tab="Sensors" key="2">Sensors</Tabs.TabPane>
            <Tabs.TabPane tab="Output" key="3">Output</Tabs.TabPane>
          </Tabs>
          </Layout.Footer>
          </Layout>
      </Layout>
    )
  }
}


ReactDOM.render(
    <App/>,
    document.getElementById("example")
);