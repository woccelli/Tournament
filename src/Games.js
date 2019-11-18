import React from 'react';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Table from 'react-bootstrap/Table'

class Games extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        selectedPool: null
      }
      this.handleChange = this.handleChange.bind(this);
    }

    handleChange(score,team,game,pool){
        this.props.onChange(score,team,game,pool);
    }
  
    render() {
      return (
        <div>
          <Tabs defaultActiveKey={this.props.pools[0].id+this.props.pools[0].name} id="pools tabs"> 
          {this.props.pools.map(item => (
            <Tab key={item.id+item.name} eventKey={item.id+item.name} title={item.name}>
                <TeamTable teams={item.teams}/>
                <br/>                
                <h3>Matchs</h3>
                <GameTable pool={item} onChange={this.handleChange}/>
            </Tab>
          ))}
          </Tabs>
          <form onSubmit={this.props.onPoolsValidation}>
            <button type="submit">
              Valider
            </button>
          </form>
        </div>
      );
    }
}

class TeamTable extends React.Component {
  render() {
    return (
      <Table responsive="sm" size="sm">
      <thead>
        <tr>
          <th>Équipe</th>
          <th>Points</th>
          <th>Goal Average</th>
        </tr>
      </thead>
      <tbody>
          {this.props.teams.map(team => 
            <TeamRow key={team.id} team={team}/>  
          )}
      </tbody>
    </Table>  
    );
  }
}

class TeamRow extends React.Component {
  render(){
    return(
      <tr>
          <td width="30%">{this.props.team.name}</td>
          <td width="10%">{this.props.team.totalPoints}</td>
          <td width="10%">{this.props.team.goalAverage} </td>
          <td width="50%"></td>
      </tr>
    )
  }
}

class GameTable extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
  }

    handleChange(score, team, game) {
        this.props.onChange(score, team, game, this.props.pool);
    }

    render() {
      return (
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Équipe A</th>
            <th>Équipe B</th>
            <th>Score A</th>
            <th>Score B</th>
          </tr>
        </thead>
        <tbody>
            {this.props.pool.games.map((game,index) => 
              <GameRow key={game.id} index={index} game={game} onChange={this.handleChange}/>  
            )}
        </tbody>
      </Table>  
      );
    }
  }
  class GameRow extends React.Component {
    constructor(props) {
      super(props);
      this.handleScoreChange = this.handleScoreChange.bind(this)
    }

    handleScoreChange(score, team){
      this.props.onChange(score,team,this.props.game)
    }

    render(){
      return(
        <tr>
            <td>{this.props.index + 1}</td>
            <td>{this.props.game.teamA.name}</td>
            <td>{this.props.game.teamB.name}</td>
            <td> <ScoreInput index={this.props.index} team={this.props.game.teamA} onChange={this.handleScoreChange}/></td>
            <td> <ScoreInput index={this.props.index} team={this.props.game.teamB} onChange={this.handleScoreChange}/> </td>
        </tr>
      )
    }
  }

    class ScoreInput extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          score: ""
        }
        this.handleChange = this.handleChange.bind(this)
      }
    
      handleChange(e){
        e.preventDefault();
        if (e.target.value == null && e.target.value < 0) {return;}
        this.props.onChange(e.target.value, this.props.team);
        this.setState({
          score: e.target.value
        })
      }
  
      render(){
        return(
          <input
              type="number"
              id={this.props.index+"_score_"+this.props.team.name}
              onChange={this.handleChange}
              value={this.state.score}
          />
        )}
    }

  export default Games;
