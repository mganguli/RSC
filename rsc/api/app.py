#    Licensed under the Apache License, Version 2.0 (the "License");
#    you may not use this file except in compliance with the License.
#    You may obtain a copy of the License at
#
#        http://www.apache.org/licenses/LICENSE-2.0
#
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS,
#    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#    See the License for the specific language governing permissions and
#    limitations under the License.

from oslo_config import cfg
from oslo_middleware import request_id
from oslo_service import service
from pecan import configuration
from pecan import make_app
from rsc.common import exceptions as p_excp


def setup_app(*args, **kwargs):
    config = {
        'server': {
            'host': cfg.CONF.api.bind_port,
            'port': cfg.CONF.api.bind_host
        },
        'app': {
            'root': 'rsc.api.controllers.root.RootController',
            'modules': ['rsc.api'],
            'errors': {
                400: '/error',
                '__force_dict__': True
            }
        }
    }
    pecan_config = configuration.conf_from_dict(config)

    app = make_app(
        pecan_config.app.root,
        wrap_app=_wrap_app,
        logging=getattr(config, 'logging', {})
    )

    return app


def _wrap_app(app):
    app = request_id.RequestId(app)

    if cfg.CONF.auth_strategy == 'noauth':
        pass
    elif cfg.CONF.auth_strategy == 'keystone':
        p_excp.NotImplemented(func_name='keystone as auth_strategy')
    else:
        raise p_excp.InvalidConfigurationOption(
            opt_name='auth_strategy', opt_value=cfg.CONF.auth_strategy)

    return app

_launcher = None


def serve(api_service, conf, workers=1):
    global _launcher
    if _launcher:
        raise RuntimeError('serve() can only be called once')

    _launcher = service.launch(conf, api_service, workers=workers)


def wait():
    _launcher.wait()
