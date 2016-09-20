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

import json
from oslo_config import cfg
from oslo_log import log as logging
from rsc.common.redfish import tree
import urllib2

LOG = logging.getLogger(__name__)
cfg.CONF.import_group('podm', 'rsc.common.redfish.config')


def get_rfs_url(serviceext):
    REDFISH_BASE_EXT = "/redfish/v1/"
    INDEX = '' 
    # '/index.json'
    if REDFISH_BASE_EXT in serviceext:
        return cfg.CONF.podm.url + serviceext + INDEX
    else:
        return cfg.CONF.podm.url + REDFISH_BASE_EXT + serviceext + INDEX


def send_request(resource):
    jsonContent = ''
    url = get_rfs_url(resource)
    user_agent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64)'
    headers = {'User-Agent': user_agent,
               'Authorization': 'Basic YWRtaW46YWRtaW4='}
    req = urllib2.Request(url, None, headers)
    LOG.debug(url)
    response = urllib2.urlopen(req)
    jsonContent = response.read()
    # LOG.debug(jsonContent)
    return json.loads(jsonContent)


def filter_chassis(jsonContent, filterCondition):
    returnJSONObj = {}
    returnMembers = []
    parsed = json.loads(jsonContent)
    members = parsed['Members']
    # count = parsed['Members@odata.count']
    for member in members:
        resource = member['@odata.id']
        memberJson = send_request(resource)
        memberJsonObj = json.loads(memberJson)
        chassisType = memberJsonObj['ChassisType']
        if chassisType == filterCondition:
            returnMembers.append(member)
        returnJSONObj["Members"] = returnMembers
        returnJSONObj["Members@odata.count"] = len(returnMembers)
    return returnJSONObj


def generic_filter(jsonContent, filterConditions):
    # returns boolean based on filters..its generic filter
    # returnMembers = []
    is_filter_passed = False
    for fc in filterConditions:
        if fc in jsonContent:
            if jsonContent[fc].lower() == filterConditions[fc].lower():
                is_filter_passed = True
            else:
                is_filter_passed = False
            break
        elif "/" in fc:
            querylst = fc.split("/")
            tmp = jsonContent
            for q in querylst:
                tmp = tmp[q]
            if tmp.lower() == filterConditions[fc].lower():
                is_filter_passed = True
            else:
                is_filter_passed = False
            break
        else:
            LOG.warn(" Filter string mismatch ")
    LOG.info(" JSON CONTENT " + str(is_filter_passed))
    return is_filter_passed


def get_details(source):
    # count = source['Members@odata.count']
    returnJSONObj = []
    members = source['Members']
    for member in members:
        resource = member['@odata.id']
        memberJson = send_request(resource)
        memberJsonObj = json.loads(memberJson)
        returnJSONObj[resource] = memberJsonObj
    return returnJSONObj


def systemdetails():
    returnJSONObj = []
    parsed = send_request('Systems')
    members = parsed['Members']
    for member in members:
        resource = member['@odata.id']
        memberJsonContent = send_request(resource)
        memberJSONObj = json.loads(memberJsonContent)
        returnJSONObj[resource] = memberJSONObj
    return(json.dumps(returnJSONObj))


def nodedetails():
    returnJSONObj = []
    parsed = send_request('Nodes')
    members = parsed['Members']
    for member in members:
        resource = member['@odata.id']
        memberJSONObj = send_request(resource)
        returnJSONObj[resource] = memberJSONObj
    return(json.dumps(returnJSONObj))


def podsdetails():
    jsonContent = send_request('Chassis')
    pods = filter_chassis(jsonContent, 'Pod')
    podsDetails = get_details(pods)
    return json.dumps(podsDetails)


def racksdetails():
    jsonContent = send_request('Chassis')
    racks = filter_chassis(jsonContent, 'Rack')
    racksDetails = get_details(racks)
    return json.dumps(racksDetails)


def racks():
    jsonContent = send_request('Chassis')
    racks = filter_chassis(jsonContent, 'Rack')
    return json.dumps(racks)


def pods():
    jsonContent = send_request('Chassis')
    pods = filter_chassis(jsonContent, 'Pod')
    return json.dumps(pods)


def urls2list(url):
    # This will extract the url values from @odata.id inside Members
    respdata = send_request(url)
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
    LOG.debug("Total storage for node %s : %d " % (nodeurl, storagecnt))
    # to convert Bytes in to GB. Divide by 1073741824
    return str(storagecnt / 1073741824).split(".")[0]


def systems_list(count=None, filters={}):
    # comment the count value which is set to 2 now..
    # list of nodes with hardware details needed for flavor creation
    # count = 2
    lst_nodes = []
    systemurllist = urls2list("Systems")
    podmtree = build_hierarchy_tree()
    #podmtree.writeHTML("0","/tmp/a.html")

    for lnk in systemurllist[:count]:
        filterPassed = True
        system = send_request(lnk)

        # this below code need to be changed when proper query mechanism
        # is implemented
        if any(filters):
            filterPassed = generic_filter(system, filters)
        if not filterPassed:
            continue

        nodeid = lnk.split("/")[-1]
        nodeuuid = system['UUID']
        nodelocation = podmtree.getPath(lnk)
        cpu = node_cpu_details(lnk)
        ram = node_ram_details(lnk)
        nw = node_nw_details(lnk)
        storage = node_storage_details(lnk)
        bmcip = "127.0.0.1" #system['Oem']['Dell_G5MC']['BmcIp']
        bmcmac = "00:00:00:00:00" #system['Oem']['Dell_G5MC']['BmcMac']
        node = {"nodeid": nodeid, "cpu": cpu,
                "ram": ram, "storage": storage,
                "nw": nw, "location": nodelocation,
                "uuid": nodeuuid, "bmcip": bmcip, "bmcmac": bmcmac}

        # filter based on RAM, CPU, NETWORK..etc
        if 'ram' in filters:
            filterPassed = (True
                            if int(ram) >= int(filters['ram'])
                            else False)

        # filter based on RAM, CPU, NETWORK..etc
        if 'nw' in filters:
            filterPassed = (True
                            if int(nw) >= int(filters['nw'])
                            else False)

        # filter based on RAM, CPU, NETWORK..etc
        if 'storage' in filters:
            filterPassed = (True
                            if int(storage) >= int(filters['storage'])
                            else False)

        if filterPassed:
            lst_nodes.append(node)
        # LOG.info(str(node))
    return lst_nodes


def get_chassis_list():
    chassis_lnk_lst = urls2list("Chassis")
    lst_chassis = []

    for clnk in chassis_lnk_lst:
        data = send_request(clnk)
        LOG.info(data)
        if "Links" in data:
            contains = []
            containedby = {}
            computersystems = []
            linksdata = data["Links"]
            if "Contains" in linksdata and linksdata["Contains"]:
                for c in linksdata["Contains"]:
                    contains.append(c['@odata.id'].split("/")[-1])

            if "ContainedBy" in linksdata and linksdata["ContainedBy"]:
                odata = linksdata["ContainedBy"]['@odata.id']
                containedby = odata.split("/")[-1]

            if "ComputerSystems" in linksdata and linksdata["ComputerSystems"]:
                for c in linksdata["ComputerSystems"]:
                    computersystems.append(c['@odata.id'])

            name = data["ChassisType"] + ":" + data["Id"]
            c = {"name": name,
                 "ChassisType": data["ChassisType"],
                 "ChassisID": data["Id"],
                 "Contains": contains,
                 "ContainedBy": containedby,
                 "ComputerSystems": computersystems}
            lst_chassis.append(c)
    return lst_chassis


def get_nodebyid(nodeid):
    return json.dumps(send_request("Systems/" + nodeid))


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
        for system in systems:
            sysname = system.split("/")[-2] + ":" + system.split("/")[-1]
            podmtree.add_node(system, {"name": sysname}, d["ChassisID"])
    return podmtree
