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

from pecan import route, expose
from plasma.api.controllers.v1 import flavor as v1flavor
from plasma.api.controllers.v1 import nodes as v1nodes


class V1Controller(object):
    @expose('json')
    def index(self):
        return {"version": "1.0.0"}

route(V1Controller, 'flavor',  v1flavor.FlavorController())
route(V1Controller, 'nodes',  v1nodes.NodesController())
