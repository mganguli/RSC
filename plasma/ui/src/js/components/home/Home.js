import React from "react";

import Pods from "./Pods";
import Racks from "./Racks";
import Systems from "./Systems";
import ComposedNodes from "./ComposedNodes";

export default class Home extends React.Component {

  render() {
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
                <div role="tabpanel" class="tab-pane active" id="pods"><Pods /></div>
                <div role="tabpanel" class="tab-pane" id="racks"><Racks /></div>
                <div role="tabpanel" class="tab-pane" id="systems"><Systems /></div>
                <div role="tabpanel" class="tab-pane" id="composednodes"><ComposedNodes /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
