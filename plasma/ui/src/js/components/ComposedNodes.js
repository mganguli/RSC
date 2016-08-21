import React from "react";
import {mockComposedNodes} from "./MockData";
import CollapsibleItemList from "./CollapsibleItemList";

export default class ComposedNodes extends React.Component {
  componentWillMount() {
     var composedNodes = this.getComposedNodes();
     this.setState({composedNodes: composedNodes});
   }

   getComposedNodes() {
     return mockComposedNodes;
   }

  render() {
    return (
      <CollapsibleItemList items={this.state.composedNodes} header="COMPOSED NODES" />
    );
  }
}
