import React from 'react';
import AddTeams from './AddTeams'
import PoolTabs from './PoolTabs'
import Team from './Model/Team'
import Pool from './Model/Pool'
import Pools from './Pools'

function shuffleArray(array) {
    let i = array.length - 1;
    for (; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}


class Tournament extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teams: [],
            pools: [],
            nbPools: 1,
            showAddTeams: true,
            showSelectNbPools: false,
            showPools: false
        };
        this.handleTeamsChange = this.handleTeamsChange.bind(this);
        this.handleTeamsValidation = this.handleTeamsValidation.bind(this);
        this.handleNbPoolsChange = this.handleNbPoolsChange.bind(this);
        this.handleNbPoolsValidation = this.handleNbPoolsValidation.bind(this);
        this.updatedPools = this.updatedPools.bind(this);
    }

    handleTeamsChange(teamName) {
        var newTeam = new Team(Date.now(), teamName);
        this.setState(state => ({
            teams: state.teams.concat(newTeam)
        }))
    }

    handleTeamsValidation() {
        this.setState(state => ({
            showAddTeams: !state.showAddTeams,
            showSelectNbPools: !state.showSelectNbPools
        }))
    }

    handleNbPoolsChange(e) {
        this.setState({ nbPools: e.target.value });
    }

    handleNbPoolsValidation() {
        this.shuffleTeams();
        var newPools = this.updatedPools();
        this.setState(state => ({
            pools: newPools,
            showSelectNbPools: !state.showSelectNbPools,
            showPools: !state.showPools
        }))
    }

    updatedPools() {
        var updatedPools = [];
        const nbPools = this.state.nbPools;
        const nbTeams = this.state.teams.length;
        var newPool;
        var teams = this.state.teams;
        for (var i = 0; i < nbTeams % nbPools; i++) {
            newPool = new Pool(Date.now(), "Pool#" + i, []);
            for (var k = 0; k < parseInt(nbTeams / nbPools) + 1; k++) {
                newPool.teams = newPool.teams.concat([teams.pop()]);
            }
            updatedPools = updatedPools.concat([newPool]);
        }
        for (i; i < nbPools; i++) {
            newPool = new Pool(Date.now(), "Pool#" + i, []);
            for (k = 0; k < parseInt(nbTeams / nbPools); k++) {
                newPool.teams = newPool.teams.concat([teams.pop()]);
            }
            updatedPools = updatedPools.concat([newPool]);
        }
        return updatedPools;
    }

    shuffleTeams() {
        this.setState(state => ({
            teams: shuffleArray(state.teams)
        }));
    }

    render() {

        return (
            <div className="Tournament">
                {this.state.showAddTeams &&
                    <AddTeams
                        teams={this.state.teams}
                        onChange={this.handleTeamsChange}
                        onValidation={this.handleTeamsValidation}
                    />
                }
                {this.state.showSelectNbPools &&
                    <form onSubmit={this.handleNbPoolsValidation}>Choisissez le nombre de Pools :
                        <input
                            type="number" name="nbPools" min="1" max={Math.max(1, parseInt((this.state.teams.length + 1) / 2))}
                            id="number-pools"
                            onChange={this.handleNbPoolsChange}
                            value={this.state.nbPools}
                        />
                        <button type="submit">
                            Valider
                        </button>
                    </form>
                }
                <div>
                    {this.state.showPools && <div><Pools pools={this.state.pools} /></div>}
                </div>
            </div>

        )
    }

}

export default Tournament;
