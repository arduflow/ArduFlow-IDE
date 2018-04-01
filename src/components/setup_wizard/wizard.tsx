import * as React from "react"
import * as Immutable from "immutable"
// import { defaultTemplates } from "../../code_generator/templates"
import { ArduinoCodeTemplate, arduinoCodeblockConstructor } from "../../code_generator/generator"
import { ArduinoCodeblockData, BlockUIData } from "../../code_generator/types"
import { Steps, Col, Row } from "antd"
import { PlatformStep } from "./platform_step"
import { HardwareStep } from "./hardware_step"

type WizardProps = {
    availableTemplates: Immutable.List<ArduinoCodeblockData>
    setAvailableTemplates: (b: Immutable.List<ArduinoCodeblockData>) => void
    next: () => void
}

export type Platforms = "arduino-uno" | "arduino-nano" | "arduino-lilypad"



type WizardState = {
    step: "platform" | "hardware" | "recap"
    platform: "none" | Platforms
}

export class Wizard extends React.Component<WizardProps, WizardState> {
    constructor(props) {
        super(props)

        this.state = {
            step: "platform",
            platform: "none"
        }
    }

    render() {
        return <Row>
            <Col span={18} offset={3} style={{ marginBottom: 20, marginTop: 20}}>
                <Steps current={this.state.step == "platform" ? 0 : this.state.step == "hardware" ? 1 : 2}>
                    <Steps.Step title="Plaftorm" description="Pick your platform" />
                    <Steps.Step title="Hardware" description="Pick your hardware" />
                </Steps>
            </Col>

            {this.state.step == "platform" ?
                <PlatformStep
                    setPlatform={p => this.setState({...this.state, platform: p, step: "hardware"})}
                />
            : this.state.step == "hardware" ?
                <HardwareStep
                    {...this.props}
                    next={() => this.props.next()}
                />
            : null}
        </Row>
    }
}