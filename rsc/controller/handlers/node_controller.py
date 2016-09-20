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
from oslo_log import log as logging
from rsc.common import osinterface as osapi
from rsc.common.redfish import api as rfsapi
import requests

LOG = logging.getLogger(__name__)


class Handler(object):
    """RSC Node RPC handler.

    These are the backend operations. They are executed by the backend ervice.
    API calls via AMQP (within the ReST API) trigger the handlers to be called.

    """

    def __init__(self):
        super(Handler, self).__init__()

    def list_nodes(self, context, filters):
        LOG.info(str(filters))
        return rfsapi.systems_list(None, filters)

    def get_nodebyid(self, context, nodeid):
        return rfsapi.get_nodebyid(nodeid)

    def delete_composednode(self, context, nodeid):
        return {"node": "Delete the composed node"}

    def update_node(self, context, nodeid):
        return {"node": "Update node attributes"}

    def compose_nodes(self, context, criteria):
        """Chassis details could also be fetched and inserted"""

        nodes_to_compose = int(criteria["nodes"])  # no of nodes to compose
        systems = rfsapi.systems_list(nodes_to_compose, criteria["filter"])
        uci = osapi.get_undercloud_images()
        for system in systems:
            nodeprofile = 'controller' if system['ram'] < 20 else 'compute'
            # This Above simple logic needs to changed. IT IS FOR DEMO PURPOSE
            # ONLY
            nodesbody = {"driver": "pxe_ipmitool",
                          "uuid": system['uuid'],
                          "driver_info":{
                              "ipmi_address": system['bmcip'],
                              "ipmi_username":"intel",
                              "ipmi_password":"intel",
                              "deploy_kernel": uci["deploy_kernel"],
                              "deploy_ramdisk": uci["deploy_ramdisk"]},
                          "name": nodeprofile,
                          "instance_info":{
                              "ramdisk": uci["ramdisk"],
                              "kernel": uci["kernel"],
                              "image_source": uci["image_source"]}}
            extraparam = {"mac": [system['bmcmac']]}

            node_uuid = nodesbody['uuid']

            # get auth token from keystone
            tokenid, ironibasecurl = osapi._get_token_and_url("ironic")

            # create nodes by fetching endpoint from keystone response json
            ironicurl = ironibasecurl + "/v1/nodes"

            # send create ironic node request using token obtained
            headers = {'content-type': 'application/json',
                     'X-Auth-Token': tokenid,
                     'X-OpenStack-Ironic-API-Version': '1.9'}
            LOG.debug("Ironic URL " + ironicurl)
            resp = requests.post(ironicurl, headers=headers,
                                 data=json.dumps(nodesbody))
            LOG.debug("Ironic upload status %d " % resp.status_code)
            LOG.debug("Ironic Upload" + str(resp.status_code) + resp.text)

            # set state. Default is 'available' but it should be 'manage'
            ironicurl = ironicurl + "/" + node_uuid + "/states/provision"
            resp = requests.put(ironicurl, headers=headers,
                               data=json.dumps({"target": "manage"}))
            LOG.debug("Set Manage State" + str(resp.status_code))

            # set mac address
            portsurl = ironibasecurl + "/v1/ports"
            macs = extraparam['mac']
            for m in macs:
               portbody = {"node_uuid": node_uuid, "address": m}
               resp = requests.post(portsurl, headers=headers,
                                    data=json.dumps(portbody))
               LOG.debug("Add ports " + m + " " + str(resp.status_code))

        return {"msg": "Compose Initiated"}

    def list_node_storages(self, context, data):
        return {"node": "List the storages attached to the node"}

    def map_node_storage(self, context, data):
        return {"node": "Map storages to a node"}

    def delete_node_storage(self, context, data):
        return {"node": "Deleted storages mapped to a node"}
