import React from 'react';

class AddTeams extends React.Component {
    constructor(props) {
      super(props);
      this.state = {name: '' };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    render() {
      return (
        <div>
          <h3>Ajout des équipes</h3>
          <ItemList items={this.props.teams} />
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="new-team">
              Entrez le nom d'une équipe à ajouter au tournoi.
            </label> <br/>
            <input
              id="new-team"
              onChange={this.handleChange}
              value={this.state.name}
            />
            <button>
              Ajouter #{this.props.teams.length + 1}
            </button>
            <button onClick={this.props.onValidation}>
              Valider
            </button>

          </form>
        </div>
      );
    }
  
    handleChange(e) {
      this.setState({ name: e.target.value });
    }
  
    handleSubmit(e) {
      e.preventDefault();
      if (!this.state.name.length) {
        return;
      }
      this.setState({ name: '' });
      this.props.onChange(e.target[0].value);
    }
  }
  
  class ItemList extends React.Component {
    render() {
      return (
        <ul>
          {this.props.items.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      );
    }
  }

  export default AddTeams;
