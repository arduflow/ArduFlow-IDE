import * as React from "react"

export const Info = {
  button: [
    <p>The button is a simple way to start an action.</p>,
    <h3>Wiring it up</h3>,
    <p>Connect one side to the 5v output. Connect the other side to the ground (gnd) and your inputport.</p>,
    <p><img src="./images/button-wiring.png" width="100%" height="auto" /></p>
  ],
  led: [
    <p>The LED block lets you turn a LED on and off.</p>,
    <h3>Wiring it up</h3>,
    <p>Connect one pin to the output port. Connect the other side to the GND via a resistor</p>,
    <p>Try turning the pins around if the LED does not work</p>
  ],
  ultrasone_sensor: [
    <p>Start an action if something get to close</p>,
    <h3>Wiring it up</h3>,
    <p>Connect the Trig and Echo port to two Arduino ports.The Ucc port needs power and the Gnd is the GND port.</p>
  ]
}