import * as React from "react";
import * as ReactDOM from "react-dom";
import {renderBlock} from "./components/flowcard"
import { Layout, Row } from "antd"

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
              value: "if x  <3",
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
                      value: "if x  <3",
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
                            block: "none"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          })}
          <Layout.Footer style={{ position: "fixed", height: "20vh", width: "100vw", bottom: 0, left: 0, backgroundColor: "white" }}>
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