import React from 'react';
import Table from 'react-bootstrap/Table'

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

  export default TeamTable;