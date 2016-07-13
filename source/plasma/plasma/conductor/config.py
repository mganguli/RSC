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

"""Config options for Plasma Conductor Service"""

import sys
from oslo_config import cfg
from oslo_log import log as logging

LOG = logging.getLogger(__name__)

CONDUCTOR_OPTS = [
    cfg.StrOpt('topic',
               default='plasma-conductor',
               help='The queue to add conductor tasks to.')
]
conductor_conf_group = cfg.OptGroup(name='conductor',
                                    title='Plasma Conductor options')
cfg.CONF.register_group(conductor_conf_group)
cfg.CONF.register_opts(CONDUCTOR_OPTS, group=conductor_conf_group)


def init(args, **kwargs):
    # Register the configuration options
    logging.register_options(cfg.CONF)
    cfg.CONF(args=args, project='plasma', **kwargs)

def setup_logging():
    """Sets up the logging options for a log with supplied name."""
    product_name = "plasma"
    logging.setup(cfg.CONF, product_name)
    LOG.info("Logging enabled!")
    LOG.debug("command line: %s", " ".join(sys.argv))
