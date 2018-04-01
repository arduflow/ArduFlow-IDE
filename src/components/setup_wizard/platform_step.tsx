import * as React from "react";
import { Platforms } from "./wizard";
import { Row, Col, Card, Button } from "antd";

type PlatformStepProps = {
  setPlatform: (p: Platforms) => void;
};

export const PlatformStep = (props: PlatformStepProps) => (
  <div>
    <Row>
      <Col span={21} offset={3} style={{ marginBottom: 20 }}>
        <h2>Pick your platform</h2>
      </Col>
    </Row>
    <Row style={{ display: "flex", justifyContent: "space-around" }}>
      <Card
        style={{ width: 350 }}
        bordered
        hoverable
        actions={[
          <Button
            type="primary"
            onClick={e => props.setPlatform("arduino-uno")}
          >
            I have the Uno
          </Button>
        ]}
        cover={<img src="./images/uno.jpg" height={200} width="auto" />}
      >
        <Card.Meta description="The classic one" title="Arduino Uno" />
      </Card>
      <Card
        style={{ width: 350 }}
        bordered
        hoverable
        actions={[
          <Button disabled onClick={e => props.setPlatform("arduino-nano")}>
            Comming soon
          </Button>
        ]}
        cover={<img src="./images/nano.jpg" height={200} width="auto" />}
      >
        <Card.Meta description="The small one" title="Arduino Nano" />
      </Card>
      <Card
        style={{ width: 350 }}
        bordered
        hoverable
        actions={[
          <Button disabled onClick={e => props.setPlatform("arduino-lilypad")}>
            Comming soon
          </Button>
        ]}
        cover={<img src="./images/lilypad.jpg" height={200} width="auto" />}
      >
        <Card.Meta
          description="The one that loves swimming"
          title="Arduino Lilypad"
        />
      </Card>
    </Row>
  </div>
);
