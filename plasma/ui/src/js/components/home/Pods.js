import React from "react";
import {mockPods} from "./MockData";
import ItemList from "./ItemList";

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
      <ItemList items={this.state.pods} header="PODS" />
    );
  }
}
