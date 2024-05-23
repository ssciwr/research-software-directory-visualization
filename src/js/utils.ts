// set overall size and center point of svg in pixels
const svg_size_pixels = 1200;
export const sx = svg_size_pixels;
export const sy = svg_size_pixels;
export const cx = sx / 2;
export const cy = sy / 2;

// https://stackoverflow.com/a/36164530/6465472
export function transpose<T>(m: T[][]) {
  return m[0].map((x, i) => m.map((x) => x[i]));
}

// get indices of sorted array of objects, sorted by given member of object
export function sorted_indices(
  array: Array<Record<string, object>>,
  member: string,
) {
  const len = array.length;
  const indices = new Array(len);
  for (let i = 0; i < len; ++i) {
    indices[i] = i;
  }
  indices.sort(function (a, b) {
    return array[a][member] < array[b][member]
      ? -1
      : array[a][member] > array[b][member]
        ? 1
        : 0;
  });
  return indices;
}

// svg circle arc math based on https://stackoverflow.com/a/18473154/6465472
function xy(radius: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180.0;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

// svg path for text inside a segment (single arc)
export function makeTextArc(
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const anticlockwise = startAngle > 70 && endAngle < 290;
  // slight adjustment to vertically center text within segment
  if (anticlockwise) {
    radius = radius * 1.01;
  } else {
    radius = radius * 0.985;
  }
  const p0 = xy(radius, startAngle);
  const p1 = xy(radius, endAngle);
  if (anticlockwise) {
    return ["M", p1.x, p1.y, "A", radius, radius, 0, 0, 0, p0.x, p0.y].join(
      " ",
    );
  }
  return ["M", p0.x, p0.y, "A", radius, radius, 0, 0, 1, p1.x, p1.y].join(" ");
}

export function makeArrowArc(
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const p0 = xy(radius, startAngle);
  const p1 = xy(radius, endAngle);
  const clockwise = endAngle < startAngle ? 0 : 1;
  return [
    "M",
    p0.x,
    p0.y,
    "A",
    radius,
    radius,
    0,
    0,
    clockwise,
    p1.x,
    p1.y,
  ].join(" ");
}

// svg path for a segment (two arcs connected by straight lines)
export function makeSegment(
  radius: number,
  startAngle: number,
  endAngle: number,
  width: number,
) {
  const rm = radius - width;
  const rp = radius + width;
  const p0 = xy(rm, startAngle);
  const p1 = xy(rm, endAngle);
  const p2 = xy(rp, endAngle);
  const p3 = xy(rp, startAngle);
  return [
    "M",
    p0.x,
    p0.y,
    "A",
    rm,
    rm,
    0,
    0,
    1,
    p1.x,
    p1.y,
    "L",
    p2.x,
    p2.y,
    "A",
    rp,
    rp,
    0,
    0,
    0,
    p3.x,
    p3.y,
    "z",
  ].join(" ");
}

export function nextGroupBoxIndex(
  p: { x: number; y: number },
  ncols: number,
  nrows = 0,
) {
  let x_max = ncols - 1;
  let x_min = 0;
  if (ncols >= 4) {
    // first 2, last 3 don't have outer two columns
    if (p.y <= 1 || p.y >= nrows - 4) {
      x_max = ncols - 2;
      x_min = 1;
    }
    if (p.y === 1) {
      x_min = 0;
    }
    if (p.y === nrows - 4) {
      x_max = ncols - 1;
    }
  }
  if (p.x < x_max) {
    return { x: p.x + 1, y: p.y };
  }
  return { x: x_min, y: p.y + 1 };
}

export function getMethodWeight(group: string, category: string[]) {
  let group_item = group.split("/");
  let first_upper_letter_group = group_item.map((firstLetter) =>
    firstLetter[0].toUpperCase(),
  );
  const method_weight = new Array(category.length).fill(0);
  first_upper_letter_group.forEach(function (value) {
    for (const [i, v] of category.entries()) {
      if (value === v.charAt(0).toUpperCase()) {
        method_weight[i] = 1;
      }
    }
  });
  return method_weight;
}

export function getApplicationWeight(field: string, category: string[]) {
  let field_item = field.match(/(?=\S)[^,]+?(?=\s*(,|$))/g);
  let application_weight = [0, 0, 0, 0, 0, 0];

  if (field_item !== null) {
    field_item.forEach(function (item) {
      application_weight[
        Object.values(category).findIndex((e) => e.includes(item))
      ] = 1;
    });
  }
  return application_weight;
}
