
class Team {

  constructor(id, name) {
    this.id = id
    this.name = name
    this.totalPoints = 0;
    this.goalAverage = 0;
    this.positionInPool = null;
  }
  
  resetScores() {
    this.totalPoints=0;
    this.goalAverage=0;
  }
}

export default Team;