import React from "react";

export default class CollapsibleItemList extends React.Component {  
   componentWillMount() {
     this.setState({collapsed: true});
   }

   renderItems() {
   	return this.state.collapsed? [] : this.props.items.map((item, i) => 
     	<div class="item" key={i}>
     	  {item.name} <br />
     	  {item.description}
     	</div>
     	);
   }

   onClick() {
   	this.setState({collapsed: !this.state.collapsed});
   }

  render() {
    return (
      <div>
        <div class="header" onClick={this.onClick.bind(this)}>
          <label><span>{this.props.header} </span><span>({this.props.items.length})</span></label>
        </div>
        <div class="items">
          {this.renderItems()}
        </div>
      </div>
    );
  }
}

CollapsibleItemList.defaultProps = { items: [], header: ""};
