import React from "react";
import ItemList from "./ItemList";

const Pods = React.createClass({

  getInitialState() {
    return {pods: []};
  },

  componentWillMount() {
    this.getPods();
  },

  getPods() {
    var pods;
    var url = 'http://127.0.0.1:6000/redfish/v1/Chassis';
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      cache: false,
      success: function(resp) {
        pods = this.filterChassis(resp, 'Pod');
        this.setData(pods);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },

  filterChassis(jsonContent, filter) {
    var returnMembers = [];
    var members = jsonContent['Members'];
    var count = jsonContent['Members@odata.count'];

    var resource;
    var memberJson;
    var memberJsonObj;
    var chassisType;
    for (var i=0; i<count; i++) {
      resource = members[i]['@odata.id'];
      memberJson = this.readAndReturn(resource);
      memberJsonObj = JSON.parse(memberJson);
      chassisType = memberJsonObj["ChassisType"];
      if (chassisType == filter) {
        returnMembers.push(memberJsonObj);
      }
    }
    console.log(returnMembers);
    return returnMembers;
  },

  readAndReturn(resource) {
    var url = 'http://127.0.0.1:6000' + resource;
    return $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      cache: false,
      async: false,
    }).responseText;
  },


  setData(pods) {
    this.setState({pods: pods});
  },

  render() {
    return (
      <ItemList items={this.state.pods} header="PODS" />
    );
  }
});

export default Pods
