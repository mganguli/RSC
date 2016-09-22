import React from "react";

const DetailDisplay = React.createClass({

  render: function() {
    return (
        <div class="details" style={{display: this.props.display}}>
          {this.props.data}
          <input type="button"
           class="detail-button"
           onClick={() => this.props.onHideDetail()} value="Return" />
        </div>
    );
  }
});

export default DetailDisplay
