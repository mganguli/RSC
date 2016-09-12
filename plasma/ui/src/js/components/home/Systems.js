import React from "react";
import ItemList from "./ItemList";

var util = require('./util.js');

const Systems = React.createClass({

  getInitialState() {
    return {systems: []};
  },

  componentWillMount() {
    this.getSystems();
  },

  getSystems() {
    var systems;
    var url = 'http://127.0.0.1:6000/redfish/v1/Systems';
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      cache: false,
      success: function(resp) {
        systems = util.listMembers(resp);
        this.setData(systems);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },

  setData(systems) {
    this.setState({systems: systems});
  },

  render() {
    return (
      <ItemList items={this.state.systems} header="SYSTEMS" />
    );
  }
});

export default Systems
