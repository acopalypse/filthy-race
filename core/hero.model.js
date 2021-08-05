class Hero {
  constructor(user) {
    this.uid = user.uid;
    this.num = user.num;
    this.position = user.position;
    this.room = user.room;
    this.color = user.color;
    this.cName = user.cName;
  }

  heroMove(key, table) {
    const [X, Y] = this.position;
    switch (key) {
      case 'ArrowUp':
        if (
          X > 0 &&
          (table[X - 1][Y] === null || table[X - 1][Y] === this.num)
        ) {
          this.position[0] -= 1;
          // console.log('move up');
        }
        break;
      case 'ArrowDown':
        if (
          X < 11 &&
          (table[X + 1][Y] === null || table[X + 1][Y] === this.num)
        ) {
          this.position[0] += 1;
          // console.log('move down');
        }
        break;
      case 'ArrowLeft':
        if (
          Y > 0 &&
          (table[X][Y - 1] === null || table[X][Y - 1] === this.num)
        ) {
          this.position[1] -= 1;
          // console.log('move left');
        }
        break;
      case 'ArrowRight':
        if (
          Y < 11 &&
          (table[X][Y + 1] === null || table[X][Y + 1] === this.num)
        ) {
          this.position[1] += 1;
          // console.log('move right');
        }
        break;
    }
    return this.position;
  }
}

module.exports = Hero;
