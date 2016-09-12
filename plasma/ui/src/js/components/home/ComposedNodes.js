import React from "react";
import ItemList from "./ItemList";

var util = require('./util.js');

const ComposedNodes = React.createClass({

  getInitialState() {
    return {composedNodes: []};
  },

  componentWillMount() {
    this.getComposedNodes();
  },

  getComposedNodes() {
    var composedNodes;
    var url = 'http://127.0.0.1:6000/redfish/v1/Nodes';
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      cache: false,
      success: function(resp) {
        composedNodes = util.listMembers(resp);
        this.setData(composedNodes);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },

  setData(composedNodes) {
    this.setState({composedNodes: composedNodes});
  },

  render() {
    return (
      <ItemList items={this.state.composedNodes} header="COMPOSED NODES" />
    );
  }
});

export default ComposedNodes
