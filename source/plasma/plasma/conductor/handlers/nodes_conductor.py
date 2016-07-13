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

from oslo_log import log as logging
from plasma.common.redfish import api as rfsapi

LOG = logging.getLogger(__name__)


class Handler(object):
    """Plasma Node RPC handler.
    These are the backend operations. They are executed by the backend ervice.
    API calls via AMQP (within the ReST API) trigger the handlers to be called.
    """

    def __init__(self):
        super(Handler, self).__init__()

    def list_nodes(self, context, filters):
        return rfsapi.nodes_full_list(filters)

    def get_nodebyid(self, context, nodeid):
        return rfsapi.get_nodebyid(nodeid)

    def delete_composednode(self, context, nodeid):
        return {"node": "Delete the composed node"}

    def update_node(self, context, nodeid):
        return {"node": "Update node attributes"}

    def compose_nodes(self, context, criteria):
        systems = rfsapi.urls2list("Systems")
        # TODO chassis details could also be fetched and inserted      
        for system in systems:
            nodedata = rfsapi.send_request(system)
            ram = nodedata['MemorySummary']['TotalSystemMemoryGiB']
            nodeprofile = 'controller' if ram < 20 else 'compute'  #This logic needs to changed
            node_json = [{"driver": "pxe_ipmitool", "uuid": nodedata['UUID'],
#                         "chassis_uuid":"d7d38d59-133d-49be-b3fa-ffffffffffff",
                          "driver_info":{
                              "ipmi_address": nodedata['Oem']['Dell_G5MC']['BmcIp'],
                              "ipmi_username":"intel","ipmi_password":"intel123",
                              "deploy_kernel":"bfcf3506-6424-4459-9621-5b1367743d42",
                              "deploy_ramdisk":"fad2caac-40fd-49ab-a126-401f399a3cb1"},
                              "name": nodeprofile,
                              "instance_info":{"ramdisk":"69d81739-c32d-42e6-b406-77966bd85897",
                                               "kernel":"07b66646-09b0-41ac-b328-b3d259638313",
                                               "image_source":"800dc5a9-217c-4a42-949b-80611f362156"}},
                         {"mac":[nodedata['Oem']['Dell_G5MC']['BmcMac']]}]

            with open("nodes.list", "a") as nodesfile:
                 nodesfile.write(json.dumps(node_json)+"\n")

    def list_node_storages(self, context, data):
        return {"node": "List the storages attached to the node"}

    def map_node_storage(self, context, data):
        return {"node": "Map storages to a node"}

    def delete_node_storage(self, context, data):
        return {"node": "Deleted storages mapped to a node"}
