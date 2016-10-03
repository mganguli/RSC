import React from "react";
import PodList from "./PodList";
import RackList from "./RackList";
import SystemList from "./SystemList";
import ComposedNodeList from "./ComposedNodeList";

var config = require('../../config.js');
var util = require('../../util.js');

const Home = React.createClass({

  configCompose: function() {
    /* This is a temporary function that will compose a node based on the JSON value
     * of the nodeConfig variable in config.js.
     *
     * TODO(ntpttr): Remove this once the compose menu is fully flushed out.
     */
    var url = config.url + '/redfish/v1/Nodes/Actions/Allocate';
    $.ajax({
      url: url,
      type: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(config.nodeConfig),
      dataType: 'text',
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },

  componentWillMount: function() {
    this.getPods();
    this.getRacks();
    this.getSystems();
    this.getNodes();
  },

  getPods: function() {
    util.getPods(this.setPods);
  },

  getRacks: function() {
    util.getRacks(this.setRacks);
  },

  getSystems: function() {
    util.getSystems(this.setSystems);
  },

  getNodes: function() {
    util.getNodes(this.setNodes);
  },

  setPods: function(pods) {
    this.props.onUpdatePods(pods);
  },

  setRacks: function(racks) {
    this.props.onUpdateRacks(racks);
  },

  setSystems: function(systems) {
    this.props.onUpdateSystems(systems);
  },

  setNodes: function(nodes) {
    this.props.onUpdateNodes(nodes);
  },

  render: function() {
    return (
      <div style={{display: this.props.display}}>
        <div class="jumbotron">
          <h2>Welcome to RSD Details</h2>
          <p>This is a brief overview of all kinds of resources in this environment. See the <a href="#">User Guide</a> for more information on how to configure them.</p>
          <p>
            <input type="button" class="btn btn-lg btn-primary" style={{marginRight:'20px'}} onClick={() => this.props.onShowCompose()} value="Compose Node" />
            <input type="button" class="btn btn-lg btn-primary" onClick={() => this.configCompose()} value="Compose From Config File" />
          </p>
        </div>

        <div class="dashboard">
          <div class="row">
            <div class="col-sm-3 col-md-2 sidebar">
              <ul class="nav nav-sidebar">
                <li class="active"><a href="#pods" data-toggle="tab" onClick={() => this.getPods()}>PODS</a></li>
                <li><a href="#racks" data-toggle="tab" onClick={() => this.getRacks()}>RACKS</a></li>
                <li><a href="#systems" data-toggle="tab" onClick={() => this.getSystems()}>SYSTEMS</a></li>
                <li><a href="#composednodes" data-toggle="tab" onClick={() => this.getNodes()}>COMPOSED NODES</a></li>
              </ul>
            </div>
            <div class="col-sm-9 col-md-10 main">
              <div class="tab-content">
                <div role="tabpanel" class="tab-pane active" id="pods">
                  <PodList
                    onShowDetail={this.props.onShowDetail}
                    podList={this.props.podList}
                  />
                </div>
                <div role="tabpanel" class="tab-pane" id="racks">
                  <RackList
                    onShowDetail={this.props.onShowDetail}
                    rackList={this.props.rackList}
                  />
                </div>
                <div role="tabpanel" class="tab-pane" id="systems">
                  <SystemList
                    onShowDetail={this.props.onShowDetail}
                    systemList={this.props.systemList}
                  />
                </div>
                <div role="tabpanel" class="tab-pane" id="composednodes">
                  <ComposedNodeList
                    onShowDetail={this.props.onShowDetail}
                    nodeList={this.props.nodeList}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default Home
