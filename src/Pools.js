import React from 'react';

class Pools extends React.Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      return (
        <div>
          <h3>Pools formées</h3>
          <ItemList items={this.props.pools} />
          <form onSubmit={this.props.onPoolsValidation}>
            <button type="submit">
              Valider
            </button>
          </form>
        </div>
      );
    }
}

  

  class ItemList extends React.Component {
    render() {
      return (
        <ul>
          {this.props.items.map(item => (
            <li key={item.name}>{item.name}
            <ul>
                {item.teams.map(team => <li key={team.name+"_"+item.id}>{team.name}</li>)}
            </ul>
            </li>
          ))}
        </ul>
      );
    }
  }

  export default Pools;
