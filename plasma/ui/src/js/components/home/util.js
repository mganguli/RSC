var config = require('../../../config.js');

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
