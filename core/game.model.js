class Game {
  constructor(users) {
    this.users = users;
    this.table = new Array(12).fill(null);
    this.table = this.table.map(() => new Array(12).fill(null));
  }
  tableCheck(heroNum) {
    const X = this.users[heroNum].position[0];
    const Y = this.users[heroNum].position[1];
    this.table[X][Y] = heroNum;
    console.clear();
    console.log(heroNum);
    console.log(X, Y);
    console.table(this.table);
  }
}

module.exports = Game;
