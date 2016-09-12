import React from "react";

export default class ItemList extends React.Component {
  renderItems() {
    return this.props.items.map((item, i) =>
      <div class="item" key={i}>
        {item.Name} <br />
        {item.Description}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderItems()}
      </div>
    );
  }
}

ItemList.defaultProps = { items: [], header: ""};
