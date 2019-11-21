import React from 'react';
import AddTeams from './AddTeams'
import Team from './Model/Team'
import Pool from './Model/Pool'
import Game from './Model/Game';
import Games from './Games'
import * as utils from './utils.js';
import 'bootstrap/dist/css/bootstrap.css';
import './Tournament.css'

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
            allGamesInformed: false
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
        var shuffledTeams = utils.shuffleArray(this.state.teams)
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
            newPool = new Pool(Date.now() + "Pool" + i, "Pool#" + i, []);
            for (var k = 0; k < parseInt(nbTeams / nbPools) + 1; k++) {
                newPool.teams = newPool.teams.concat([teams.pop()]);
            }
            updatedPools = updatedPools.concat([newPool]);
        }
        for (i; i < nbPools; i++) {
            newPool = new Pool(Date.now() + "Pool" + i, "Pool#" + i, []);
            for (k = 0; k < parseInt(nbTeams / nbPools); k++) {
                newPool.teams = newPool.teams.concat([teams.pop()]);
            }
            updatedPools = updatedPools.concat([newPool]);
        }
        return updatedPools;
    }

    handleGamesChange(score, team, game, pool) {
        game = utils.updateScoreInGame(score, team, game)
        pool.games = utils.replaceObject(pool.games, game)
        team = utils.updateTeamGoalAverage(team, pool.games)
        pool = utils.updateTeams(pool)
        var poolsCopy = this.state.pools
        poolsCopy = utils.replaceObject(poolsCopy, pool)
        this.setState({
            pools: poolsCopy
        })
    }

    handleAllGamesInformed() {
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
            pool.teams.map((team, index) => {
                team.positionInPool = index
                teams = teams.concat([team])
                return teams
            })
            return pool
        })
        teams = teams.sort(function (a, b) {
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
            pool.teams.map(team => {
                team.totalPoints = 0;
                team.goalAverage = 0;
                team.positionInPool = null;
                return team
            })
            return pool
        })
        newPools = this.fillPoolsWithGames(newPools);
        this.setState(() => ({
            pools: newPools,
            showGames: true,
            showResults: false
        }))
    }

    fillPoolsWithGames(pools) {
        var poolsCopy = pools;
        poolsCopy.map(pool => {
            var res = utils.roundrobin(pool.teams.length, pool.teams);
            res.map(item => {
                item.map(subitem => {
                    var g = new Game(Date.now() + subitem[0].name + subitem[1].name, subitem[0], subitem[1]);
                    pool.games = pool.games.concat([g]);
                    return item
                }
                )
                return res
            }
            )
            return pool
        }
        )
        return poolsCopy;
    }

    shuffleTeams() {
        this.setState(state => ({
            teams: utils.shuffleArray(state.teams)
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
