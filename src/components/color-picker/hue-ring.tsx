import * as React from 'react';
import Canvas from '../canvas/canvas';
import { HSVColor } from './color';
import Selector from './selector';

interface Props {
  size: number;
  innerRadiusPercentage: number;
  outerRadiusPercentage: number;
  selectorSizePercentage: number;
  angleStepSize?: number;
  onHueChange?: (hue: number) => void;
}

interface State {
  hue: number;
  selectingColor: boolean;
}

export default class HueRing extends React.Component<Props, State> {
  private canvas: Canvas | null;

  constructor(props: Props) {
    super(props);
    this.state = this.getInitialState();

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  public getInitialState(): State {
    return {
      hue: 0,
      selectingColor: false
    } as State;
  }

  public render(): JSX.Element {
    let ringThickness = this.getRingThickness();
    let pos = this.getSelectorPos(this.state.hue, ringThickness);
    return (
      <div
        style={{
          position: 'absolute',
          top: '0px',
          left: '0px'
        }}
      >
        <Canvas
          ref={(canvas: Canvas | null) => { this.canvas = canvas; }}
          x={0}
          y={0}
          width={this.props.size}
          height={this.props.size}
          onmousemove={e => { this.onMouseMove(e, false); }}
          onmousedown={this.onMouseDown}
          onmouseup={this.onMouseUp}
        />
        <Selector
          x={pos[0]}
          y={pos[1]}
          size={ringThickness}
          sizePercentage={this.props.selectorSizePercentage}
        />
      </div>
    );
  }

  public componentDidMount(): void {
    this.initializeBar();
  }

  private initializeBar(): void {
    if (this.canvas) {
      let canvas = this.canvas.getCanvas();
      if (canvas) {
        let ctx = canvas.getContext('2d');
        if (ctx) {
          let delAngle = this.props.angleStepSize ? this.props.angleStepSize : 80 / this.props.size;
          let delRadians = delAngle / 180 * Math.PI;
          let numSteps = 360 / delAngle;
          let innerRadius = this.props.innerRadiusPercentage / 100 * this.props.size / 2;
          let outerRadius = this.props.outerRadiusPercentage / 100 * this.props.size / 2;
          let centerX = this.props.size / 2;
          let centerY = centerX;
          for (let step = 0; step < numSteps; step++) {
            let color = new HSVColor(delAngle * step, 1, 1);
            ctx.fillStyle = color.getColorCss()[0];
            ctx.fillRect(centerX + innerRadius, centerY, outerRadius - innerRadius, 1);
            ctx.translate(centerX, centerY);
            ctx.rotate(-delRadians);
            ctx.translate(-centerX, -centerY);
          }
        }
      }

      this.canvas.refresh();

      if (this.props.onHueChange) {
        this.props.onHueChange(this.state.hue);
      }
    }
  }

  private onMouseMove(e: React.MouseEvent<HTMLCanvasElement> | MouseEvent, ignoreState?: boolean): void {
    if (this.state.selectingColor || ignoreState) {
      if (this.canvas) {
        let canvas = this.canvas.getCanvas();
        if (canvas) {
          let pos = this.calculatePosition(canvas.getBoundingClientRect(), e.clientX, e.clientY);
          let offsetFromCenter = this.getOffsetFromCenter(pos);
          let angle = -Math.atan2(offsetFromCenter[1], offsetFromCenter[0]) / Math.PI * 180;
          let hue = angle;
          
          if (this.state.hue !== hue) {
            if (angle < 0) {
              hue = 360 + angle;
              this.setState({hue});
            } else {
              this.setState({hue});
            }
    
            if (this.props.onHueChange) {
              this.props.onHueChange(hue);
            }
          }
        }
      }
    }
  }

  private onMouseDown(e: React.MouseEvent<HTMLCanvasElement>): void {
    let pos = this.calculatePosition(e.currentTarget.getBoundingClientRect(), e.clientX, e.clientY);
    let selectingColor = this.isWithinRing(pos);
    this.setState({selectingColor});

    if (selectingColor) {
      document.onmousemove = this.onMouseMove;
      document.onmouseup = this.onMouseUp;
      this.onMouseMove(e, true);
    }
  }

  private onMouseUp(e: React.MouseEvent<HTMLCanvasElement> | MouseEvent): void {
    if (this.state.selectingColor) {
      this.setState({selectingColor: !this.state.selectingColor});
    }
  }

  private calculatePosition(bbox: ClientRect, clientX: number, clientY: number): number[] {
    return [clientX - bbox.left, clientY - bbox.top];
  }

  private getOffsetFromCenter(pos: number[]): number[] {
    let halfSize = this.props.size / 2;
    return [pos[0] - halfSize, pos[1] - halfSize];
  }

  private getRadii(): number[] {
    let halfSize = this.props.size / 2;
    return [
      halfSize * this.props.innerRadiusPercentage / 100,
      halfSize * this.props.outerRadiusPercentage / 100
    ];
  }

  private isWithinRing(pos: number[]): boolean {
    let offsetFromCenter = this.getOffsetFromCenter(pos);
    let offsetMagnitude = Math.pow(offsetFromCenter[0], 2) + Math.pow(offsetFromCenter[1], 2);

    let radii = this.getRadii();
    let innerRadius = radii[0];
    let outerRadius = radii[1];

    return innerRadius * innerRadius <= offsetMagnitude && outerRadius * outerRadius >= offsetMagnitude;
  }

  private getSelectorPos(hue: number, ringThickness: number): number[] {
    let radii = this.getRadii();
    let halfSize = this.props.size / 2;
    let halfRingThickness = ringThickness / 2;
    let radius = radii[0] + halfRingThickness;

    let radians = hue / 180 * Math.PI;
    let COS = Math.cos(radians);
    let SIN = Math.sin(radians);

    return [radius * COS + halfSize - halfRingThickness, halfSize - radius * SIN - halfRingThickness];
  }

  private getRingThickness(): number {
    let radii = this.getRadii();
    let ringThickness = radii[1] - radii[0];
    if (ringThickness < 0) {
      ringThickness = 0;
    }

    return ringThickness;
  }
}