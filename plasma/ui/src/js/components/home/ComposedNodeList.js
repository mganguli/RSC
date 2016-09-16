import React from "react";
import NodeList from "./NodeList";

var config = require('../../config.js');
var util = require('../../util.js');

const ComposedNodeList = React.createClass({

  getInitialState() {
    return {composedNodes: []};
  },

  componentWillMount() {
    this.getComposedNodes();
    setInterval(this.getComposedNodes, 2000);
  },

  getComposedNodes() {
    var composedNodes;
    var url = config.url + '/redfish/v1/Nodes';
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
      <NodeList onShowDetail={this.props.onShowDetail} items={this.state.composedNodes} header="COMPOSED NODES" />
    );
  }
});

export default ComposedNodeList
