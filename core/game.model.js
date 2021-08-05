class Game {
  constructor(users) {
    this.users = users;
    this.table = new Array(12).fill(null);
    this.table = this.table.map(() => new Array(12).fill(null));
    this.end = false;
  }
  tableCheck(data) {
    const { heroNum, key } = data;
    this.users[heroNum].heroMove(key, this.table);
    const X = this.users[heroNum].position[0];
    const Y = this.users[heroNum].position[1];
    this.table[X][Y] = heroNum;

    // console.log(heroNum);
    // console.log(X, Y);
    // console.table(this.table);

    return [X, Y];
  }
  addHero() {
    this.users.forEach((user) => {
      const [X, Y] = user.position;
      const num = user.num;
      this.table[X][Y] = num;
    });
  }
  endGame() {
    return (this.end = true);
  }
}

module.exports = Game;
