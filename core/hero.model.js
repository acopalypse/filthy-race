class Hero {
  constructor(user) {
    this.uid = user.uid;
    // this.name = user.name;
    this.position = user.position;
    this.room = user.room;
    this.color = user.color;
  }

  heroMove(key) {
    switch (key) {
      case 'ArrowUp':
        if (this.position[0] > 0) {
          this.position[0] -= 1;
          // console.log('move up');
        }
        break;
      case 'ArrowDown':
        if (this.position[0] < 11) {
          this.position[0] += 1;
          // console.log('move down');
        }
        break;
      case 'ArrowLeft':
        if (this.position[1] > 0) {
          this.position[1] -= 1;
          // console.log('move left');
        }
        break;
      case 'ArrowRight':
        if (this.position[1] < 11) {
          this.position[1] += 1;
          // console.log('move right');
        }
        break;
    }
    return this.position;
  }
}

module.exports = Hero;
