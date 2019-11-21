import React from 'react';
import Table from 'react-bootstrap/Table'

class TeamTable extends React.Component {
  render() {
    return (
      <Table responsive="sm" size="sm">
        <thead>
          <tr>
            {this.props.displayRank && <th align="center">Classement</th>}
            <th>Équipe</th>
            <th>Points</th>
            <th>Goal Average</th>
          </tr>
        </thead>
        <tbody>
          {this.props.teams.map((team, index) =>
            <TeamRow key={team.id} team={team} displayIndex={this.props.displayRank} index={index} />
          )}
        </tbody>
      </Table>
    );
  }
}

class TeamRow extends React.Component {
  render() {
    return (
      <tr>
        {this.props.displayIndex && <td align="center" width="10%">{(this.props.index + 1)}</td>}
        <td width="30%">{this.props.team.name}</td>
        <td width="10%">{this.props.team.totalPoints}</td>
        <td width="10%">{this.props.team.goalAverage} </td>
        <td width="40%"></td>
      </tr>
    )
  }
}

export default TeamTable;