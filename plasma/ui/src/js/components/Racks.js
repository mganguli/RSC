import React from "react";
import {mockRacks} from "./MockData";
import CollapsibleItemList from "./CollapsibleItemList";

export default class Racks extends React.Component {
  componentWillMount() {
     var racks = this.getRacks();
     this.setState({racks: racks});
   }

   getRacks() {
     return mockRacks;
   }

  render() {
    return (
      <CollapsibleItemList items={this.state.racks} header="RACKS" />
    );
  }
}
