import React from "react";
import {mockRacks} from "./MockData";
import ItemList from "./ItemList";

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
      <ItemList items={this.state.racks} header="RACKS" />
    );
  }
}
