import React from 'react';
import AddTeams from './AddTeams'

class Tournament extends React.Component {
    constructor(props) {
        super(props);
        this.state = { teams: [], pools: [] };
        this.handleTeamsChange = this.handleTeamsChange.bind(this);
    }

    handleTeamsChange(teamName){
        const newTeam = {
            name: teamName,
            id: Date.now()
        };
        this.setState(state => ({
            teams: state.teams.concat(newTeam)
        }))
    }

    render() {
        const teams = this.state.teams;
        const pools = this.state.pools;

        return (
            <div className="Tournament">
                <AddTeams teams={this.state.teams} onChange={this.handleTeamsChange} />
            </div>
        )
    }

}

export default Tournament;
