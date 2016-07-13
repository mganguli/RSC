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

"""
Plasma base exception handling.
"""
import six

from oslo_utils import excutils


class PlasmaException(Exception):
    """Base Plasma Exception.
    """
    message = "An unknown exception occurred."

    def __init__(self, **kwargs):
        try:
            super(PlasmaException, self).__init__(self.message % kwargs)
            self.msg = self.message % kwargs
        except Exception:
            with excutils.save_and_reraise_exception() as ctxt:
                if not self.use_fatal_exceptions():
                    ctxt.reraise = False
                    # at least get the core message out if something happened
                    super(PlasmaException, self).__init__(self.message)

    if six.PY2:
        def __unicode__(self):
            return unicode(self.msg)

        def use_fatal_exceptions(self):
            return False


class BadRequest(PlasmaException):
    message = 'Bad %(resource)s request'


class NotImplemented(PlasmaException):
    message = ("Not yet implemented  %(func_name)s: ")


class NotFound(PlasmaException):
    pass


class Conflict(PlasmaException):
    pass


class ServiceUnavailable(PlasmaException):
    message = "The service is unavailable"


class ConnectionRefused(PlasmaException):
    message = "Connection to the service endpoint is refused"


class TimeOut(PlasmaException):
    message = "Timeout when connecting to OpenStack Service"


class InternalError(PlasmaException):
    message = "Error when performing operation"


class InvalidInputError(PlasmaException):
    message = ("An invalid value was provided for %(opt_name)s: "
               "%(opt_value)s")
