import React from "react";

var config = require('../../config.js');
var util = require('../../util.js');

const NodeList = React.createClass({

  compose() {
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

  delete(nodeId) {
    var url = config.url + '/redfish/v1/Nodes/' + nodeId;
    $.ajax({
      url: url,
      type: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
  },

  renderList: function() {
    return this.props.items.map((item, i) =>
      <div class="item" key={i}>
        {item.Name}
        <input type="button" class="detail-button" onClick={() => this.props.onShowDetail(item, this.props.header)} value="Show" />
        <input type="button" class="detail-button" onClick={() => this.delete(item.Id)} value="Delete" />
        <br />
        {item.Description}
        <hr class="separator"/>
      </div>
    );
  },

  render: function() {
    return (
      <div>
        {this.renderList()}
        <input type="button" class="detail-button" onClick={() => this.compose()} value="Compose Node" />
      </div>
    );
  },
});

NodeList.defaultProps = { items: [], header: ""};

export default NodeList;
