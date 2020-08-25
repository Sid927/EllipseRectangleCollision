let length = prompt('What do you want to be the length of your rectangle');
let epsilon = 0.001;
let cx = 400;
let cy = 400;
let d1 = prompt('What do you want to be the first diameter of your ellipse'); 
let d2 = prompt('What do you want to be the second diameter of your ellipse');
let c1x = 0;
let c1y = 0;
let c2x = 0;
let c2y = 0;
let l = 0;
let numPoints = 180;
let rx1 = 300;
let ry1 = 400;
let rx2 = 0;
let ry2 = 0;
let hit = false;
let hit2 = false;
let pointsOnEllipse = [];

const checkCollisionPointRectangle = (px, py, rx1, ry1, rx2, ry2) => {
  if (px >= rx1 && px <= rx2 && py >= ry1 && py <= ry2) {
    return true;
  } else {
    return false;
  }
}

const checkCollisionPointEllipse = (px, py, c1x, c1y, c2x, c2y, l) => {
  let lhs = Math.sqrt(((px - c1x) ** 2) + ((py - c1y) ** 2)) + Math.sqrt(((px - c2x) ** 2) + ((py - c2y) ** 2));
  if (lhs - l <= 0) {
    return true;
  } else {
    return false;
  }
}

const findYForX = (c1x, c1y, c2x, c2y, cx, cy, d1, d2, l, x, epsilon) => {
  let y = cy;
  let lhs = 0;
  let error = 0;
  let minY = cy - (d2 / 2);
  let maxY = cy + (d2 / 2);
  let bestGuesses = [[minY, l - Math.sqrt(((x - c1x) ** 2) + ((minY - c1y) ** 2)) - Math.sqrt(((x - c2x) ** 2) + ((minY - c2y) ** 2))], 
    [maxY, l - Math.sqrt(((x - c1x) ** 2) + ((maxY - c1y) ** 2)) - Math.sqrt(((x - c2x) ** 2) + ((maxY - c2y) ** 2))]];
  for (let i = 0; i < 30; i++) {
    y = (bestGuesses[0][0] + bestGuesses[1][0]) / 2;
    lhs = Math.sqrt(((x - c1x) ** 2) + ((y - c1y) ** 2)) + Math.sqrt(((x - c2x) ** 2) + ((y - c2y) ** 2));
    error = l - lhs;
    if (Math.abs(error) < epsilon) {
      break;
    } else {
      if (error < 0 && bestGuesses[0][1] < 0) {
        bestGuesses[0][0] = y;
        bestGuesses[0][1] = error;
      } else if (error > 0 && bestGuesses[0][1] > 0) {
        bestGuesses[0][0] = y;
        bestGuesses[0][1] = error;
      } else {
        bestGuesses[1][0] = y;
        bestGuesses[1][1] = error;
      }
    }
  }
  return [y, (2 * cy) - y];
};

const getPointsOnEllipse = (cx, cy, d1, d2, numPoints, epsilon) => {
  c1x = cx - ( d1 > d2 ? Math.sqrt((d1 / 2) ** 2 - (d2 / 2) ** 2) : 0);
  c1y = cy - ( d2 > d1 ? Math.sqrt((d2 / 2) ** 2 - (d1 / 2) ** 2) : 0);
  c2x = cx + ( d1 > d2 ? Math.sqrt((d1 / 2) ** 2 - (d2 / 2) ** 2) : 0);
  c2y = cy + ( d2 > d1 ? Math.sqrt((d2 / 2) ** 2 - (d1 / 2) ** 2) : 0);
  let pointsOnEllipse = [];
  l = ( d1 > d2 ? d1 : d2);
  let x = cx - (d1 / 2);
  let y1 = 0;
  let y2 = 0;
  for (let i = 0; i <= numPoints / 2; i++) {
    [y1, y2] = findYForX(c1x, c1y, c2x, c2y, cx, cy, d1, d2, l, x, epsilon);
    pointsOnEllipse.push([x, y1]);
    pointsOnEllipse.push([x, y2]);
    x += l / (numPoints / 2);
  }
  return pointsOnEllipse;
};

const checkCollisionEllipseRectangle = (pointsOnEllipse, rx1, ry1, rx2, ry2) => {
  for (let i = 0; i < pointsOnEllipse.length - 1; i++) {
    if (checkCollisionPointRectangle(pointsOnEllipse[i][0], pointsOnEllipse[i][1], rx1, ry1, rx2, ry2)) {
      circle(pointsOnEllipse[i][0], pointsOnEllipse[i][1], 20)
      return true;
    } else if (checkCollisionPointRectangle(pointsOnEllipse[i + 1][0], pointsOnEllipse[i + 1][1], rx1, ry1, rx2, ry2)) {
      circle(pointsOnEllipse[i + 1][0], pointsOnEllipse[i + 1][1], 20)
      return true;
    }
  }
  return false;
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  pointsOnEllipse = getPointsOnEllipse(cx, cy, d1, d2, 100, epsilon);
}

function draw() {
  hit = false;
  hit2 = false;
  background(255);
  ellipse(cx, cy, d1, d2);
  rect(mouseX, mouseY, length, length / 2);
  rx2 = mouseX + length;
  ry2 = mouseY + length / 2;
  hit = checkCollisionEllipseRectangle(pointsOnEllipse, mouseX, mouseY, rx2, ry2);
  hit2 = checkCollisionPointEllipse(mouseX, mouseY, c1x, c1y, c2x, c2y, l)
  console.log(hit + ' ' + hit2)
  stroke( (hit) || (hit2) ? color("red"): 0);
  // console.log('Colliding: ' + hit)
  // for (let i = 0; i < pointsOnEllipse.length; i++) {
  //   circle(pointsOnEllipse[i][0], pointsOnEllipse[i][1], 15);
  // }
}
