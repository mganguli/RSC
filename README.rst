===============================
plasma
===============================

Openstack Plasma Project

A Controller service for lifecycle management of Pooled bare-metal hardware
infrastructure like Rack Scale architecture which uses Redfish 
as one of the management protocols.

* Free software: Apache license
* Documentation: http://docs.openstack.org/developer/plasma
* Source: http://git.openstack.org/cgit/openstack/plasma
* Bugs: http://bugs.launchpad.net/plasma


plasma-api
##########
A pecan based application to process plasma REST requests. plasma-api 
communicates through plasma-controller through AMQP.

plasma-controller
#################
Controller implements all the handlers for Plasma-api. It reads requests from
the AMQP queue, process it and send the reponse back to the caller.


Installation
------------

* Create virtualenv for plasma project
* Clone the plasma code from git repo
* pip install the dependency packages from requirements.txt
      $ pip install -r requirements.txt
* Copy the plasma-api.conf, plasma-controller.conf from 
  plasma/doc/source/samples directory to /etc/init/
* Configure the plasma-api.conf, plasma-controller.conf to set
  log file and config file locations
* Configure plasma/etc/plasma.conf to set Plasma environment.
* Start plasma-api and plasma-controller
      $ service plasma-api start
      $ service plasma-controller start

Features
--------

* TODO

  Please refer the blueprints 
      https://blueprints.launchpad.net/plasma
