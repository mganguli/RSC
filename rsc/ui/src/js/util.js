var config = require('./config.js');

exports.getPods = function(callback) {
  var url = config.url + '/redfish/v1/Chassis';
  $.ajax({
    url: url,
    type: 'GET',
    dataType: 'json',
    cache: false,
    success: function(resp) {
      var chassis = this.listMembers(resp);
      var pods = this.filterChassis(chassis, 'Pod');
      callback(pods);
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(url, status, err.toString());
    }.bind(this)
  });
};

exports.getRacks = function(callback) {
  var url = config.url + '/redfish/v1/Chassis';
  $.ajax({
    url: url,
    type: 'GET',
    dataType: 'json',
    cache: false,
    success: function(resp) {
      var chassis = this.listMembers(resp);
      var racks = this.filterChassis(chassis, 'Rack');
      callback(racks);
    }.bind(this),
    error: function(xhr, status, err) {
      console.log(url, status, err.toString());
    }.bind(this)
  });
};

exports.getSystems = function(callback) {
  var url = config.url + '/redfish/v1/Systems';
  $.ajax({
    url: url,
    type: 'GET',
    dataType: 'json',
    cache: false,
    success: function(resp) {
      var systems = this.listMembers(resp);
      callback(systems);
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(url, status, err.toString());
    }.bind(this)
  });
};

exports.getNodes = function(callback) {
  var url = config.url + '/redfish/v1/Nodes';
  $.ajax({
    url: url,
    type: 'GET',
    dataType: 'json',
    cache: false,
    success: function(resp) {
      var nodes = this.listMembers(resp);
      callback(nodes);
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(url, status, err.toString());
    }.bind(this)
  });
};

exports.listMembers = function(jsonContent) {
  var returnMembers = [];
  var members = jsonContent['Members'];
  var count = jsonContent['Members@odata.count'];

  var resource;
  var memberJson;
  var memberJsonObj;
  for (var i=0; i<count; i++) {
    resource = members[i]['@odata.id'];
    memberJson = this.readAndReturn(resource);
    memberJsonObj = JSON.parse(memberJson);
    returnMembers.push(memberJsonObj);
  }
  return returnMembers;
};

exports.filterChassis = function(memberList, filter) {
  var returnMembers = [];
  var chassisType;
  var memberCount = memberList.length;
  for (var i=0; i<memberCount; i++) {
    chassisType = memberList[i]["ChassisType"];
    if (chassisType == filter) {
      returnMembers.push(memberList[i]);
    }   
  }   
  return returnMembers;
};  

exports.readAndReturn = function(resource) {
  var url = config.url + resource;
  return $.ajax({
    url: url,
    type: 'GET',
    dataType: 'json',
    cache: false,
    async: false,
  }).responseText;
};
