const fs = require("fs");

class Track {
  newDirection(cart) {
    throw new Error("Not Implemented");
  }

  makeTurn(cart) {
    cart.direction = this.newDirection(cart);
  }
}

// "-" or "|"
class Straight extends Track {
  newDirection(cart) {
    return cart.direction;
  }
}

// "/"
class Curve1 extends Track {
  newDirection(cart) {
    switch (cart.direction) {
      case 0:
        return 1;
      case 1:
        return 0;
      case 2:
        return 3;
      case 3:
        return 2;
    }
  }
}

// "\"
class Curve2 extends Track {
  newDirection(cart) {
    switch (cart.direction) {
      case 0:
        return 3;
      case 1:
        return 2;
      case 2:
        return 1;
      case 3:
        return 0;
    }
  }
}

// "+"
class Intersection extends Track {
  newDirection(cart) {
    return (cart.direction + cart.nextTurn) % 4;
  }

  makeTurn(cart) {
    super.makeTurn(cart);
    cart.setNextTurn();
  }
}

class Cart {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.nextTurn = 3;
  }

  move() {
    switch (this.direction) {
      case 0:
        this.y--;
        break;
      case 1:
        this.x++;
        break;
      case 2:
        this.y++;
        break;
      case 3:
        this.x--;
        break;
    }
  }

  setNextTurn() {
    switch (this.nextTurn) {
      case 0:
        this.nextTurn = 1;
        break;
      case 1:
        this.nextTurn = 3;
        break;
      case 3:
        this.nextTurn = 0;
        break;
    }
  }
}

function parseData(data) {
  const lines = data.split("\n");
  const tracks = [];
  const carts = [];
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    tracks.push(
      line.split("").map((char, x) => {
        if ("^" === char) carts.push(new Cart(x, y, 0));
        else if (">" === char) carts.push(new Cart(x, y, 1));
        else if ("v" === char) carts.push(new Cart(x, y, 2));
        else if ("<" === char) carts.push(new Cart(x, y, 3));

        if (["-", "|", "^", ">", "v", "<"].includes(char))
          return new Straight();
        else if ("/" === char) return new Curve1();
        else if ("\\" === char) return new Curve2();
        else if ("+" === char) return new Intersection();
        else return null;
      })
    );
  }
  return { tracks, carts };
}

function answer() {
  const data = fs.readFileSync(__dirname + "/input", { encoding: "utf8" });
  const { tracks, carts } = parseData(data);

  while (true) {
    let doBreak = false;
    carts
      .sort((a, b) => (a.y === b.y ? a.x - b.x : a.y - b.y))
      .forEach(cart => {
        cart.move();
        tracks[cart.y][cart.x].makeTurn(cart);
        if (
          carts.some(
            cart2 => cart !== cart2 && cart.x === cart2.x && cart.y === cart2.y
          )
        ) {
          console.log(cart.x + "," + cart.y);
          doBreak = true;
        }
      });
    if (doBreak) break;
  }
}

answer();
