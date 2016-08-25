import React from "react";
import {mockSystems} from "./MockData";
import ItemList from "./ItemList";

export default class Systems extends React.Component {
  componentWillMount() {
     var systems = this.getSystems();
     this.setState({systems: systems});
   }

   getSystems() {
     return mockSystems;
   }

  render() {
    return (
      <ItemList items={this.state.systems} header="SYSTEMS" />
    );
  }
}
