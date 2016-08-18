import React from "react";

import Pods from "./Pods";
import Racks from "./Racks";
import Systems from "./Systems";
import ComposedNodes from "./ComposedNodes";

export default class Layout extends React.Component {
  render() {
    return (
      <div>
        <Pods />
        <Racks />
        <Systems />
        <ComposedNodes />
      </div>
    );
  }
}
