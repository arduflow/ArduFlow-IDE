import * as React from "react";
import * as ReactDOM from "react-dom";
import {renderBlock} from "./components/flowcard"
import { Layout, Row } from "antd"

const App = () => (
  <Layout>
    <Layout.Header style={{ height: "10vh" }}></Layout.Header>
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
              block: "none"
            }
          }
        }
      })}
      <Layout.Footer style={{ height: "20vh"}}>
      </Layout.Footer>
      </Layout>
  </Layout>
)


ReactDOM.render(
    <App/>,
    document.getElementById("example")
);