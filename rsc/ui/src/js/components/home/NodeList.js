import React from "react";

var config = require('../../config.js');
var util = require('../../util.js');

const NodeList = React.createClass({

  delete(nodeId) {
    var url = config.url + '/redfish/v1/Nodes/' + nodeId;
    $.ajax({
      url: url,
      type: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      success: function(resp) {
        this.props.updateList();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },

  renderList: function() {
    return this.props.items.map((item, i) =>
      <div class="item" key={i}>
        {item.Name}
        <input type="button" class="detail-button" onClick={() => this.props.onShowDetail(item)} value="Show" />
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
      </div>
    );
  },
});

NodeList.defaultProps = { items: [], header: ""};

export default NodeList;
