import React from "react";

import PodList from "./PodList";
import PodDetail from "./PodDetail";
import RackList from "./RackList";
import RackDetail from "./RackDetail";
import SystemList from "./SystemList";
import SystemDetail from "./SystemDetail";
import ComposedNodeList from "./ComposedNodeList";
import ComposedNodeDetail from "./ComposedNodeDetail";

const Home = React.createClass({

  getInitialState: function() {
    return {
      detail: "",
      detailDisplay: "none"
    };
  },

  handleShowDetail: function(item, itemType) {
    if (itemType == "PODS") {
      this.setState({detail: <PodDetail pod={item} />});
    } else if (itemType == "RACKS") {
      this.setState({detail: <RackDetail rack={item} />});
    } else if (itemType == "SYSTEMS") {
      this.setState({detail: <SystemDetail system={item} />});
    } else {
      this.setState({detail: <ComposedNodeDetail node={item} />});
    }
    this.setState({
      detailDisplay: "inline-block"
    });
  },

  handleHideDetail: function() {
    this.setState({
      detail: "",
      detailDisplay: "none"
    });
  },

  render: function() {
    return (
      <div>
        <div class="jumbotron">
          <h2>Welcome to RSD Details</h2>
          <p>This is a brief overview of all kinds of resources in this environment. See the <a href="#">User Guide</a> for more information on how to configure them.</p>
          <p>
            <a class="btn btn-lg btn-primary" href="../../components/#navbar" role="button">Configure &raquo;</a>
          </p>
        </div>

        <div class="dashboard">
          <div class="row">
            <div class="col-sm-3 col-md-2 sidebar">
              <ul class="nav nav-sidebar">
                <li class="active"><a href="#pods" data-toggle="tab">PODS </a></li>
                <li><a href="#racks" data-toggle="tab">RACKS</a></li>
                <li><a href="#systems" data-toggle="tab">SYSTEMS</a></li>
                <li><a href="#composednodes" data-toggle="tab">COMPOSED NODES</a></li>
              </ul>
            </div>
            <div class="col-sm-9 col-md-10 main">
              <div class="tab-content">
                <div role="tabpanel" class="tab-pane active" id="pods"><PodList onShowDetail={this.handleShowDetail} /></div>
                <div role="tabpanel" class="tab-pane" id="racks"><RackList onShowDetail={this.handleShowDetail} /></div>
                <div role="tabpanel" class="tab-pane" id="systems"><SystemList onShowDetail={this.handleShowDetail} /></div>
                <div role="tabpanel" class="tab-pane" id="composednodes"><ComposedNodeList onShowDetail={this.handleShowDetail} /></div>
              </div>
            </div>
          </div>
        </div>

        <div class="details" style={{display: this.state.detailDisplay}}>
          {this.state.detail}
          <input type="button" class="detail-button" onClick={() => this.handleHideDetail()} value="Hide Details" />
        </div>

      </div>
    );
  }
});

export default Home
