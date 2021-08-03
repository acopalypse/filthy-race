class Game {
  constructor(users) {
    this.users = users;
    this.table = new Array(12).fill(0);
    this.table = this.table.map(() => new Array(12).fill(0));
    console.log(this.users);
  }
  tableCheck(user) {
    const X = user.position[0];
    const Y = user.position[1];
    this.table[X][Y] = 1;
    console.clear();
    console.log(X, Y);
    console.table(this.table);
  }
}

module.exports = Game;
