import React from 'react';
import AddTeams from './AddTeams'
import Team from './Model/Team'
import Pool from './Model/Pool'
import Pools from './Pools'
import Game from './Model/Game';

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

const DUMMY = -1;
// returns an array of round representations (array of player pairs).
// http://en.wikipedia.org/wiki/Round-robin_tournament#Scheduling_algorithm
function roundrobin(n, ps) {  // n = num players
  var rs = [];                  // rs = round array
  if (!ps) {
    ps = [];
    for (var k = 1; k <= n; k += 1) {
      ps.push(k);
    }
  } else {
    ps = ps.slice();
  }

  if (n % 2 === 1) {
    ps.push(DUMMY); // so we can match algorithm for even numbers
    n += 1;
  }
  for (var j = 0; j < n - 1; j += 1) {
    rs[j] = []; // create inner match array for round j
    for (var i = 0; i < n / 2; i += 1) {
      if (ps[i] !== DUMMY && ps[n - 1 - i] !== DUMMY) {
        rs[j].push([ps[i], ps[n - 1 - i]]); // insert pair as a match
      }
    }
    ps.splice(1, 0, ps.pop()); // permutate for next round
  }
  return rs;
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
        this.handlePoolsValidation = this.handlePoolsValidation.bind(this);
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

    handlePoolsValidation(){
        var filledPools = this.fillPoolsWithGames(this.state.pools);
        this.setState(state => ({
            pools: filledPools
        }))
    }

    fillPoolsWithGames(pools){
        var poolsCopy = pools;
        poolsCopy.map(pool =>
            {
                var res = roundrobin(pool.teams.length, pool.teams);
                res.map(item => 
                    {
                        item.map(subitem =>
                            {
                                var g = new Game(Date.now, subitem[0], subitem[1]);
                                pool.games = pool.games.concat([g]);
                            }
                        )
                    }
                )
            }
        )
        return poolsCopy;
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
                    {this.state.showPools && 
                    <div>
                        <Pools 
                            pools={this.state.pools} 
                            onPoolsValidation={this.handlePoolsValidation}
                        />
                    </div>}
                </div>
            </div>

        )
    }

}

export default Tournament;
