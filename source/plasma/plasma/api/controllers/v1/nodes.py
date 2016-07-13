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

import pecan
from pecan import expose, rest, request
from pecan.rest import RestController
import oslo_messaging as messaging
from oslo_config import cfg
from oslo_log import log as logging
from plasma.common import exceptions
from plasma.common import rpc
from plasma.common import context
from plasma.conductor import api as conductor_api

CONF = cfg.CONF
LOG = logging.getLogger(__name__)


class NodesController(RestController):

    def __init__(self, *args, **kwargs):
        super(NodesController, self).__init__(*args, **kwargs)

    # HTTP GET /nodes/
    @expose(generic=True, template='json')
    def index(self, **kwargs):
        LOG.debug("GET /nodes")
        rpcapi = conductor_api.API(context=request.context)
        res = rpcapi.list_nodes(kwargs)
        return res

    @expose(template='json')
    def get(self, nodeid):
        rpcapi = conductor_api.API(context=request.context)
        node = rpcapi.get_nodebyid(nodeid=nodeid)
        if not node:
            abort(404)
        return node
