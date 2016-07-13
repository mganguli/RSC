#!/usr/bin/env python
# Copyright (c) 2016 Intel, Inc.
#
#    Licensed under the Apache License, Version 2.0 (the "License"); you may
#    not use this file except in compliance with the License. You may obtain
#    a copy of the License at
#
#         http://www.apache.org/licenses/LICENSE-2.0
#
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
#    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
#    License for the specific language governing permissions and limitations
#    under the License.

import urllib2
import urllib
import json
import sys
import traceback
import os
from oslo_log import log as logging
from oslo_config import cfg
from plasma.common.redfish import tree

LOG = logging.getLogger(__name__)
cfg.CONF.import_group('podm', 'plasma.common.redfish.config')


def get_rfs_url(serviceext):
    REDFISH_BASE_EXT="/redfish/v1/"
    if REDFISH_BASE_EXT in serviceext:
	    return cfg.CONF.podm.url + serviceext + '/index.json'
    else:
            return cfg.CONF.podm.url + REDFISH_BASE_EXT + serviceext + '/index.json'

def send_request(resource):
    jsonContent = ''
    url = get_rfs_url(resource) 
    user_agent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64)'
    headers = {'User-Agent': user_agent,
               'Authorization': 'Basic YWRtaW46YWRtaW4='}
    req = urllib2.Request(url, None, headers)
    LOG.info(url)
    response = urllib2.urlopen(req)
    jsonContent = response.read()
    LOG.info(jsonContent)
    return json.loads(jsonContent)


def filter_chassis(jsonContent, filterCondition):
    returnJSONObj = {}
    returnMembers = []
    parsed = json.loads(jsonContent)
    members = parsed['Members']
    count = parsed['Members@odata.count']
    for member in members:
        resource = member['@odata.id']
        memberJson = send_request(resource)
        memberJsonObj = json.loads(memberJson)
        chassisType = memberJsonObj['ChassisType']
        if chassisType == filterCondition:
            returnMembers.append(member)
            # print(resource)
        returnJSONObj["Members"] = returnMembers
        returnJSONObj["Members@odata.count"] = len(returnMembers)
    return returnJSONObj


def get_details(source):
    returnJSONObj = {}
    returnMembers = []
    count = source['Members@odata.count']
    members = source['Members']
    for member in members:
        resource = member['@odata.id']
        memberJson = send_request(resource)
        memberJsonObj = json.loads(memberJson)
        returnJSONObj[resource] = memberJsonObj
    return returnJSONObj


def systemdetails():
    returnJSONObj = {}
    returnJSONMembers = []
    jsonContent = send_request('/redfish/v1/Systems')
    parsed = json.loads(jsonContent)
    members = parsed['Members']
    for member in members:
        resource = member['@odata.id']
        memberJsonContent = send_request(resource)
        memberJSONObj = json.loads(memberJsonContent)
        returnJSONObj[resource] = memberJSONObj
    return(json.dumps(returnJSONObj))


def nodedetails():
    returnJSONObj = {}
    returnJSONMembers = []
    parsed = send_request('/redfish/v1/Nodes')
    members = parsed['Members']
    for member in members:
        resource = member['@odata.id']
        memberJSONObj = send_request(resource)
        returnJSONObj[resource] = memberJSONObj
    return(json.dumps(returnJSONObj))


def podsdetails():
    jsonContent = send_request('/redfish/v1/Chassis')
    pods = filter_chassis(jsonContent, 'Pod')
    podsDetails = get_details(pods)
    return json.dumps(podsDetails)


def racksdetails():
    jsonContent = send_request('/redfish/v1/Chassis')
    racks = filter_chassis(jsonContent, 'Rack')
    racksDetails = get_details(racks)
    return json.dumps(racksDetails)


def racks():
    jsonContent = send_request('/redfish/v1/Chassis')
    racks = filter_chassis(jsonContent, 'Rack')
    return json.dumps(racks)


def pods():
    jsonContent = send_request('/redfish/v1/Chassis')
    pods = filter_chassis(jsonContent, 'Pod')
    return json.dumps(pods)


def urls2list(url):
    # This will extract the url values from @odata.id inside Members
    respdata = send_request(url)
    print type(respdata).__name__
    print respdata
    return [u['@odata.id'] for u in respdata['Members']]


def extract_val(data, path):
    # function to select value at particularpath
    patharr = path.split("/")
    for p in patharr:
        data = data[p]
    return data


def node_cpu_details(nodeurl):
    cpucnt = 0
    cpuarch = ""
    cpulist = urls2list(nodeurl + '/Processors')
    for lnk in cpulist:
        LOG.info("Processing CPU %s" % lnk)
        respdata = send_request(lnk)
        cpucnt += extract_val(respdata, "TotalCores")
        cpuarch = extract_val(respdata, "InstructionSet")
        cpumodel = extract_val(respdata, "Model")
        LOG.debug(" Cpu details %s: %d: %s: %s "
                  % (nodeurl, cpucnt, cpuarch, cpumodel))
    return {"count": str(cpucnt), "arch": cpuarch, "model": cpumodel}


def node_ram_details(nodeurl):
    # this extracts the RAM and returns as dictionary
    resp = send_request(nodeurl)
    ram = extract_val(resp, "MemorySummary/TotalSystemMemoryGiB")
    LOG.debug(" Total Ram for node %s : %d " % (nodeurl, ram))
    return str(ram)


def node_nw_details(nodeurl):
    # this extracts the total nw interfaces and returns as a string
    resp = send_request(nodeurl + "/EthernetInterfaces")
    nwi = extract_val(resp, "Members@odata.count")
    LOG.debug(" Total NW for node %s : %d " % (nodeurl, nwi))
    return str(nwi)


def node_storage_details(nodeurl):
    # this extracts the RAM and returns as dictionary
    storagecnt = 0
    hddlist = urls2list(nodeurl + "/SimpleStorage")
    for lnk in hddlist:
        resp = send_request(lnk)
        hdds = extract_val(resp, "Devices")
        for sd in hdds:
	    if "CapacityBytes" in sd:
               if sd["CapacityBytes"] is not None:
		       storagecnt += sd["CapacityBytes"]
        # storagecnt += sum([(0 if sd["CapacityBytes"] is None else sd["CapacityBytes"] for sd in hdds if "CapacityBytes" in sd)])
    LOG.debug(" Total storage for node %s : %d " % (nodeurl, storagecnt))
    # to convert Bytes in to GB. Divide by 1073741824
    return str(storagecnt/1073741824).split(".")[0]


def nodes_full_list(filters=None):
    # list of nodes with hardware details needed for flavor creation
    systemurllist = urls2list("/redfish/v1/Systems")
    lst_nodes = []
    podmtree = build_hierarchy_tree()
    for lnk in systemurllist[:2]:
        LOG.debug("Processing %s" % lnk)
        nodeid = lnk.split("/")[-1]
        nodelocation = podmtree.getPath(lnk)
        cpu = node_cpu_details(lnk)
        ram = node_ram_details(lnk)
        nw = node_nw_details(lnk)
        storage = node_storage_details(lnk)
        node = {"nodeid": nodeid, "cpu": cpu,
                "ram": ram, "storage": storage,
                "nw": nw, "location": nodelocation}
        LOG.info(str(node))
        lst_nodes.append(node)
    return lst_nodes


def get_chassis_list():
    chassis_lnk_lst = urls2list("/redfish/v1/Chassis")
    lst_chassis = []

    for clnk in chassis_lnk_lst:
        data = send_request(clnk)
        LOG.debug(data)
        if "Links" in data:
            linksdata = data["Links"]
            contains = (linksdata["Contains"] if "Contains" in linksdata else [])
            containedby = (linksdata["ContainedBy"]['@odata.id'].split("/")[-1] if "ContainedBy" in linksdata else {})
            computersystems = (linksdata["ComputerSystems"] if "ComputerSystems" in linksdata else [])
            contains = [c['@odata.id'].split("/")[-1] for c in contains]
            computersystems = [c['@odata.id'] for c in computersystems]
            c = {"name": data["ChassisType"] + ":" + data["Id"],
                 "ChassisType": data["ChassisType"],
                 "ChassisID": data["Id"],
                 "Contains": contains,
                 "ContainedBy": containedby,
                 "ComputerSystems": computersystems}
            lst_chassis.append(c)
    return lst_chassis


def get_nodebyid(nodeid):
    return json.dumps(send_request("/redfish/v1/Systems/" + nodeid))


def build_hierarchy_tree():
    # builds the tree sturcture of the PODM data to get the location hierarchy
    lst_chassis = get_chassis_list()
    podmtree = tree.Tree()
    podmtree.add_node("0")  # Add root node

    for d in lst_chassis:
        podmtree.add_node(d["ChassisID"], d)

    for d in lst_chassis:
        containedby = d["ContainedBy"] if d["ContainedBy"] else "0"
        podmtree.add_node(d["ChassisID"], d, containedby)
        systems = d["ComputerSystems"]
        for sys in systems:
            sysname = sys.split("/")[-2] + ":" + sys.split("/")[-1]
            podmtree.add_node(sys, {"name": sysname}, d["ChassisID"])
    return podmtree
