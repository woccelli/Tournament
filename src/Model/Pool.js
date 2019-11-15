import Team from "./Team";
import Game from "./Game";

class Pool  {
    constructor(id,name,teams) { 
        this.id = id;
        this.name = name;
        this.teams = teams; 
        this.games = [];
    }

    orderGames(){
        var g = new Game("id", this.teams[0], this.teams[1]);
        this.games = this.games.concat([g])
    }

}
export default Pool;