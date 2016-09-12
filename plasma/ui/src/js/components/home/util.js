exports.filterChassis = function(jsonContent, filter) {
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
  return returnMembers;
};  

exports.readAndReturn = function(resource) {
  var url = 'http://127.0.0.1:6000' + resource;
  return $.ajax({
    url: url,
    type: 'GET',
    dataType: 'json',
    cache: false,
    async: false,
  }).responseText;
};
