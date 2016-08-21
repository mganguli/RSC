import React from "react";
import {mockSystems} from "./MockData";
import CollapsibleItemList from "./CollapsibleItemList";

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
      <CollapsibleItemList items={this.state.systems} header="SYSTEMS" />
    );
  }
}
