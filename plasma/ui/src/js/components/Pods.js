import React from "react";
import {mockPods} from "./MockData";
import CollapsibleItemList from "./CollapsibleItemList";

export default class Pods extends React.Component {
   componentWillMount() {
     var pods = this.getPods();
     this.setState({pods: pods});
   }

   getPods() {
     return mockPods;
   }

  render() {
    return (
      <CollapsibleItemList items={this.state.pods} header="PODS" />
    );
  }
}
