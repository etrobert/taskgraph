export interface Point {
  x: number;
  y: number;
}

export interface Box {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

/**
 * Returns the squared distance between two points.
 *
 * `distance(p1, p2) === sqrt((p1.x - p2.x)^2 + (p1.y - p2.y)^2)`
 *
 * Because the square root is an expensive operation,
 * it is faster to compare the squared distance between two points.
 *
 * `distance(p1, p2) > c === squaredDistance(p1, p2) > c^2`
 */
export function squaredDistance(p1: Point, p2: Point): number {
  return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
}

export function addPoints(p1: Point, p2: Point): Point {
  return {
    x: p1.x + p2.x,
    y: p1.y + p2.y,
  };
}

export function getBoxCenter(box: Box): Point {
  return {
    x: box.left + box.width / 2,
    y: box.top + box.height / 2,
  };
}

export function getExpandedBox(box: Box, offset: number): Box {
  return {
    left: box.left - offset,
    top: box.top - offset,
    right: box.right + offset,
    bottom: box.bottom + offset,
    width: box.width + offset * 2,
    height: box.height + offset * 2,
  };
}

export function getOffsetBox(element: HTMLElement): Box {
  return {
    left: element.offsetLeft,
    top: element.offsetTop,
    right: element.offsetLeft + element.offsetWidth,
    bottom: element.offsetTop + element.offsetHeight,
    width: element.offsetWidth,
    height: element.offsetHeight,
  };
}

// Finds the intersection point between the line segment p1->p2 and the given bounding box.
// If the line segment and the box don't intersect, null is returned.
export function intersectLineBox(p1: Point, p2: Point, box: Box): Point | null {
  const left = {
    p1: { x: box.left, y: box.top },
    p2: { x: box.left, y: box.bottom },
  };
  const top = {
    p1: { x: box.left, y: box.top },
    p2: { x: box.right, y: box.top },
  };
  const right = {
    p1: { x: box.right, y: box.top },
    p2: { x: box.right, y: box.bottom },
  };
  const bottom = {
    p1: { x: box.left, y: box.bottom },
    p2: { x: box.right, y: box.bottom },
  };

  return (
    intersectLines(p1, p2, left.p1, left.p2) ||
    intersectLines(p1, p2, top.p1, top.p2) ||
    intersectLines(p1, p2, right.p1, right.p2) ||
    intersectLines(p1, p2, bottom.p1, bottom.p2)
  );
}

// Finds the intersection point between the line segments p1->p2 and p3->p4.
// If the segments don't intersect, null is returned.
function intersectLines(
  p1: Point,
  p2: Point,
  p3: Point,
  p4: Point
): Point | null {
  // Check if none of the lines are of length 0
  if ((p1.x === p2.x && p1.y === p2.y) || (p3.x === p4.x && p3.y === p4.y)) {
    return null;
  }

  const denominator =
    (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);

  // Lines are parallel
  if (denominator === 0) {
    return null;
  }

  const ua =
    ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) /
    denominator;
  const ub =
    ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) /
    denominator;

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return null;
  }

  // Return a object with the x and y coordinates of the intersection
  const x = p1.x + ua * (p2.x - p1.x);
  const y = p1.y + ua * (p2.y - p1.y);

  return { x, y };
}
