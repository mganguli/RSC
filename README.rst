=======================
Openstack RSC Project
=======================

Rack Scale Controller (RSC) is a service for lifecycle management of pooled bare-metal hardware infrastructure such as Intel(R) Rack Scale architecture which uses Redfish(TM) as one of the management protocols.
    
:Free software: Apache license
:Wiki: https://wiki.openstack.org/wiki/Rsc
:Source: http://git.openstack.org/cgit/openstack/rsc
:Bugs: http://bugs.launchpad.net/plasma

    
===========================
Download and Installation
===========================

The following steps capture how to install rsc. All installation steps require super user permissions.

********************
RSC installation
********************
 1. Clone the RSC code from git repo. 
 2. Install all necessary software pre-requisites using the pip requirements file. 

    ``$ pip install -r requirements.txt``
 3. Execute the setup.py file to install the RSC package. 

    ``$ python setup.py install``
 
 4. Copy the rsc-api.conf, plasma-controller.conf from rsc/doc/source/samples directory to /etc/rsc/. 
 5. Edit the rsc-api.conf, rsc-controller.conf to set log file and config file locations
 6. Start api and controller services
    
    ``$ service rsc-api start`` 

    ``$ service rsc-controller start``


****************
GUI installation
****************
Please refer to the installation steps in the ui/README file. 


**********
Components
**********

RSC follows the typical OpenStack project setup. The components are listed below:

rsc-api
-----------
A pecan based daemon to expose RSC REST APIs. The api service communicates to the controller through AMQP.

rsc-controller
--------------
The controller implements all the handlers for Plasma-api. It reads requests from the AMQP queue, process it and send the reponse back to the caller.

rsc-ui
--------
rsc-ui provides a GUI interface to invoke RSC APIs. 

==========
Features
==========
Please refer the RSC blueprints for supported and in-the-pipeline features.
``https://blueprints.launchpad.net/plasma``


