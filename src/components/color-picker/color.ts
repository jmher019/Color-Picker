export interface Color {
  getColorCss: () => Array<string>;
}

export class RGBColor implements Color {
  public r: number;
  public g: number;
  public b: number;

  constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  public getColorCss(): Array<string> {
    let ret = new Array<string>();

    ret.push('rgb(' + Math.floor(this.r) + ', ' + Math.floor(this.g) + ', ' + Math.floor(this.b) + ')');

    let rHex = this.r < 16 ? '0' + Math.floor(this.r).toString(16) : Math.floor(this.r).toString(16);
    let gHex = this.g < 16 ? '0' + Math.floor(this.g).toString(16) : Math.floor(this.g).toString(16);
    let bHex = this.b < 16 ? '0' + Math.floor(this.b).toString(16) : Math.floor(this.b).toString(16);
    ret.push('#' + rHex + gHex + bHex);

    return ret;
  }
}

export class HSVColor implements Color {
  public h: number;
  public s: number;
  public v: number;

  constructor(h: number, s: number, v: number) {
    this.h = h;
    this.s = s;
    this.v = v;
  }

  public getColorCss(): Array<string> {
    return convertToRGBColor(this).getColorCss();
  }
}

export function convertToHSVColor(color: RGBColor): HSVColor {
  let min: number;
  let max: number;
  let delta: number;

  min = color.r < color.g ? color.r : color.g;
  min = (min < color.b ? min : color.b) / 255;

  max = color.r > color.g ? color.r : color.g;
  max = (max > color.b ? max : color.b) / 255;

  let ret = new HSVColor(0, 0, 0);
  ret.v = max;
  delta = max - min;
  if (delta < 0.00001) {
    ret.s = 0;
    ret.h = 0;
    return ret;
  }

  if (max > 0) {
    ret.s = delta / max;
  } else {
    ret.s = 0;
    ret.h = Number.NaN;
    return ret;
  }

  if (color.r / 255 >= max) {
    ret.h = (color.g - color.b) / delta / 255;
  } else {
    if (color.g >= max) {
      ret.h = 2 + (color.b - color.r) / delta / 255;
    } else {
      ret.h = 4 + (color.r - color.g) / delta / 255;
    }
  }

  ret.h *= 60;

  if (ret.h < 0) {
    ret.h += 360;
  }

  return ret;
}

export function convertToRGBColor(color: HSVColor): RGBColor {
  let ret = new RGBColor(0, 0, 0);

  let hh: number;
  let p: number;
  let q: number;
  let t: number;
  let ff: number;
  let i: number;

  if (color.s <= 0) {
    ret.r = color.v * 255;
    ret.g = color.v * 255;
    ret.b = color.v * 255;
    return ret;
  }

  hh = color.h;
  if (hh >= 360) {
    hh = 0;
  }

  hh /= 60;
  i = Math.floor(hh);
  ff = hh - i;

  p = color.v * (1 - color.s);
  q = color.v * (1 - color.s * ff);
  t = color.v * (1 - color.s * (1 - ff));

  switch (i) {
    case 0:
      ret.r = color.v * 255;
      ret.g = t * 255;
      ret.b = p * 255;
      break;
    case 1:
      ret.r = q * 255;
      ret.g = color.v * 255;
      ret.b = p * 255;
      break;
    case 2:
      ret.r = p * 255;
      ret.g = color.v * 255;
      ret.b = t * 255;
      break;
    case 3:
      ret.r = p * 255;
      ret.g = q * 255;
      ret.b = color.v * 255;
      break;
    case 4:
      ret.r = t * 255;
      ret.g = p * 255;
      ret.b = color.v * 255;
      break;
    case 5: 
    default:
      ret.r = color.v * 255;
      ret.g = p * 255;
      ret.b = q * 255;
      break;
  }

  return ret;
}