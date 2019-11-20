import React from 'react';
import AddTeams from './AddTeams'
import Team from './Model/Team'
import Pool from './Model/Pool'
import Game from './Model/Game';
import Games from './Games'
import TeamTable from './TeamTable'
import Navbar from 'react-bootstrap/Navbar'
import {logo} from './logo.svg'
import 'bootstrap/dist/css/bootstrap.css';
import './Tournament.css'

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

function replaceObject(array, newItem) {
    var id = newItem.id;
    var index = array.findIndex(item => item.id === id);
    // Replace the item by index.
    array.splice(index, 1, newItem);
    return array;
}


function updateScoreInGame(score, team, game) {
    var gameCopy = game
    if(score === ""){
        score = null
    }
    if(gameCopy.teamA.id === team.id) {
        gameCopy.scoreA = score;
    } else if (gameCopy.teamB.id === team.id) {
        gameCopy.scoreB = score
    } else {
        return game;
    }
    var scoreA = gameCopy.scoreA;
    var scoreB = gameCopy.scoreB;
    if(gameCopy.scoreA !== null && gameCopy.scoreB !== null) {
        if(parseInt(scoreA) > parseInt(scoreB)) {
            gameCopy.winnerId = gameCopy.teamA.id
        } else if (parseInt(scoreA) === parseInt(scoreB)) {
            gameCopy.winnerId = "draw"
        } else {
            gameCopy.winnerId = gameCopy.teamB.id
        }
    }
    return gameCopy;
}

function updateTeams(pool) {
    var newTeams = pool.teams
    newTeams.map(team => {
        let countPoints = pool.games.reduce((n, game) => n + 3*(game.winnerId === team.id) + (game.winnerId === "draw" && [game.teamA.id,game.teamB.id].some(x => x===team.id)), 0);
        team.totalPoints = countPoints;
    })
    pool.teams = newTeams;
    return pool
}

function updateTeamGoalAverage(team, games) {
    team.goalAverage =0;
    games.map(game => {
        if(game.teamA.id === team.id ) {
            team.goalAverage += parseInt(game.scoreA !== null ? game.scoreA : 0)
        } else if (game.teamB.id === team.id  ) {
            team.goalAverage += parseInt(game.scoreB !== null ? game.scoreB : 0)
        }
    })
    return team
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
            showPools: false,
            showGames: false,
            showResults: false,
            allGamesInformed:false
        };
        this.handleTeamsChange = this.handleTeamsChange.bind(this);
        this.handleTeamsValidation = this.handleTeamsValidation.bind(this);
        this.handleNbPoolsChange = this.handleNbPoolsChange.bind(this);
        this.handleNbPoolsValidation = this.handleNbPoolsValidation.bind(this);
        this.updatedPools = this.updatedPools.bind(this);
        this.handleGamesChange = this.handleGamesChange.bind(this);
        this.handleAllGamesInformed = this.handleAllGamesInformed.bind(this);
        this.handleResultsValidation = this.handleResultsValidation.bind(this);
        this.handleRedoPhase = this.handleRedoPhase.bind(this);
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
        var shuffledTeams = shuffleArray(this.state.teams)
        var newPools = this.updatedPools(shuffledTeams);
        newPools = this.fillPoolsWithGames(newPools);
        this.setState(state => ({
            pools: newPools,
            showSelectNbPools: !state.showSelectNbPools,
            showGames: !state.showGames
        }))
    }

    updatedPools(shuffledTeams) {
        var updatedPools = [];
        const nbPools = this.state.nbPools;
        const nbTeams = shuffledTeams.length;
        var newPool;
        var teams = shuffledTeams;
        for (var i = 0; i < nbTeams % nbPools; i++) {
            newPool = new Pool(Date.now() + "Pool" +i, "Pool#" + i, []);
            for (var k = 0; k < parseInt(nbTeams / nbPools) + 1; k++) {
                newPool.teams = newPool.teams.concat([teams.pop()]);
            }
            updatedPools = updatedPools.concat([newPool]);
        }
        for (i; i < nbPools; i++) {
            newPool = new Pool(Date.now() + "Pool" +i, "Pool#" + i, []);
            for (k = 0; k < parseInt(nbTeams / nbPools); k++) {
                newPool.teams = newPool.teams.concat([teams.pop()]);
            }
            updatedPools = updatedPools.concat([newPool]);
        }
        return updatedPools;
    }

    handleGamesChange(score, team, game, pool){
        game = updateScoreInGame(score, team, game)
        pool.games = replaceObject(pool.games, game)
        team = updateTeamGoalAverage(team, pool.games)
        pool = updateTeams(pool)
        var poolsCopy = this.state.pools
        poolsCopy = replaceObject(poolsCopy, pool)
        this.setState({
            pools: poolsCopy
        })
    }

    handleAllGamesInformed(){
        this.setState({
            allGamesInformed: true
        })
    }

    handleResultsValidation() {
        var poolsCopy = this.state.pools
        var teams = []
        poolsCopy.map(pool => {
            pool.teams = pool.teams.sort(function (a, b) {
                return b.totalPoints - a.totalPoints || b.goalAverage - a.goalAverage;
              })
            pool.teams.map((team,index)=>{
                team.positionInPool = index
                teams = teams.concat([team])
            })
        })
        teams = teams.sort(function (a,b) {
            return a.positionInPool - b.positionInPool || b.totalPoints - a.totalPoints || b.goalAverage - a.goalAverage;
        })
        this.setState({
            teams: teams,
            pools: poolsCopy,
            showResults: true,
            allGamesInformed: false
        })
    }

    handleRedoPhase() {
        var newPools = this.state.pools
        var teams = this.state.teams
        newPools = this.updatedPools(teams.reverse())
        newPools.map(pool => {
            pool.teams.map(team => {team.totalPoints=0;team.goalAverage=0;team.positionInPool=null})
        })
        newPools = this.fillPoolsWithGames(newPools);
        this.setState(state => ({
            pools: newPools,
            showGames: true,
            showResults: false
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
                                var g = new Game(Date.now()+subitem[0].name+subitem[1].name, subitem[0], subitem[1]);
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
                <header className="Tournament-header">
                    <p> Simulateur de Tournoi </p>
                </header>

                {this.state.showAddTeams &&
                    <AddTeams
                        teams={this.state.teams}
                        onChange={this.handleTeamsChange}
                        onValidation={this.handleTeamsValidation}
                    />
                }
                {this.state.showSelectNbPools &&
                    <form onSubmit={this.handleNbPoolsValidation}>
                        <h3>Choix du nombre de pools</h3>
                        Choisissez le nombre de Pools :
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
                {this.state.showGames && 
                <div>
                    <Games 
                        pools={this.state.pools} 
                        onChange={this.handleGamesChange}
                        onAllGamesInformed={this.handleAllGamesInformed}
                        showResults={this.state.showResults}
                    />
                    {this.state.allGamesInformed &&
                    <button onClick={this.handleResultsValidation}>
                        Valider tous les résultats
                    </button>
                    }
                    {this.state.showResults &&
                    <button onClick={this.handleRedoPhase}>
                        Recréer des pools et des matchs en fonction des résultats
                    </button>}
                </div>
                }
            </div>
            </div>

        )
    }

}
export default Tournament;
