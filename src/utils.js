export function shuffleArray(array) {
    let i = array.length - 1;
    for (; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

export function replaceObject(array, newItem) {
    var id = newItem.id;
    var index = array.findIndex(item => item.id === id);
    // Replace the item by index.
    array.splice(index, 1, newItem);
    return array;
}


export function updateScoreInGame(score, team, game) {
    var gameCopy = game
    if (score === "") {
        score = null
    }
    if (gameCopy.teamA.id === team.id) {
        gameCopy.scoreA = score;
    } else if (gameCopy.teamB.id === team.id) {
        gameCopy.scoreB = score
    } else {
        return game;
    }
    var scoreA = gameCopy.scoreA;
    var scoreB = gameCopy.scoreB;
    if (gameCopy.scoreA !== null && gameCopy.scoreB !== null) {
        if (parseInt(scoreA) > parseInt(scoreB)) {
            gameCopy.winnerId = gameCopy.teamA.id
        } else if (parseInt(scoreA) === parseInt(scoreB)) {
            gameCopy.winnerId = "draw"
        } else {
            gameCopy.winnerId = gameCopy.teamB.id
        }
    }
    return gameCopy;
}

export function updateTeams(pool) {
    var newTeams = pool.teams
    newTeams.map(team => {
        let countPoints = pool.games.reduce((n, game) => n + 3 * (game.winnerId === team.id) + (game.winnerId === "draw" && [game.teamA.id, game.teamB.id].some(x => x === team.id)), 0);
        team.totalPoints = countPoints;
        return team
    })
    pool.teams = newTeams;
    return pool
}

export function updateTeamGoalAverage(team, games) {
    team.goalAverage = 0;
    games.map(game => {
        if (game.teamA.id === team.id) {
            team.goalAverage += parseInt(game.scoreA !== null ? game.scoreA : 0)
        } else if (game.teamB.id === team.id) {
            team.goalAverage += parseInt(game.scoreB !== null ? game.scoreB : 0)
        }
        return team
    })
    return team
}

const DUMMY = -1;
// returns an array of round representations (array of player pairs).
// http://en.wikipedia.org/wiki/Round-robin_tournament#Scheduling_algorithm
export function roundrobin(n, ps) {  // n = num players
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