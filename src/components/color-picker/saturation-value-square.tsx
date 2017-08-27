import * as React from 'react';
import Canvas from '../canvas/canvas';
import { HSVColor } from './color';
import Selector from './selector';

export interface Props {
  size: number;
  innerRadiusPercentage: number;
  hue: number;
  onSaturationValueChange?: (s: number, v: number) => void;
}

export interface State {
  saturation: number;
  value: number;
  selectingColor: boolean;
}

export default class SaturationValueSquare extends React.Component<Props, State> {
  private canvas: Canvas | null;

  constructor(props: Props) {
    super(props);
    this.state = this.getInitialState();

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  public getInitialState(): State {
    return {
      saturation: 1,
      value: 1,
      selectingColor: false
    } as State;
  }

  public render(): JSX.Element {
    let size = this.getSize();
    let x = (this.props.size - size) / 2;
    let y = (this.props.size - size) / 2;
    let pos = this.getSelectorPos(size);
    return (
      <div
        style={{
          position: 'absolute',
          top: x + 'px',
          left: y + 'px'
        }}
      >
        <Canvas
          ref={(canvas: Canvas | null) => { this.canvas = canvas; }}
          x={0}
          y={0}
          width={size}
          height={size}
          onmousedown={this.onMouseDown}
          onmousemove={e => { this.onMouseMove(e, false); }}
          onmouseup={this.onMouseUp}
        />
        <Selector
          x={pos[0]}
          y={pos[1]}
          size={size / 10}
          sizePercentage={100}
        />
      </div>
    );
  }

  public componentDidMount(): void {
    this.initializeBox();
  }

  public componentWillReceiveProps(next: Props) {
    if (this.props.hue !== next.hue) {
      this.updateBox();
    }
  }

  private initializeBox(): void {
    if (this.canvas) {
      let canvas = this.canvas.getCanvas();
      if (canvas) {
        let ctx = canvas.getContext('2d');
        if (ctx) {
          let size = this.getSize();
          for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
              let s = x / size;
              let v = 1 - y / size;
              ctx.fillStyle = (new HSVColor(this.props.hue, s, v)).getColorCss()[0];
              ctx.fillRect(x, y, 1, 1);
            }
          }
        }
      }

      this.canvas.refresh();

      if (this.props.onSaturationValueChange) {
        this.props.onSaturationValueChange(this.state.saturation, this.state.value);
      }
    }
  }

  private updateBox(): void {
    if (this.canvas) {
      let canvas = this.canvas.getCanvas();
      if (canvas) {
        let ctx = canvas.getContext('2d');
        if (ctx) {
          let size = this.getSize();
          ctx.clearRect(0, 0, size, size);
          for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
              let s = x / size;
              let v = 1 - y / size;
              ctx.fillStyle = (new HSVColor(this.props.hue, s, v)).getColorCss()[0];
              ctx.fillRect(x, y, 1, 1);
            }
          }
        }
      }

      this.canvas.refresh();
    }
  }

  private onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    let pos = this.calculatePosition(e.currentTarget.getBoundingClientRect(), e.clientX, e.clientY);
    let selectingColor = this.isWithinBox(pos);
    this.setState({selectingColor});
  
    if (selectingColor) {
      document.onmousemove = this.onMouseMove;
      document.onmouseup = this.onMouseUp;
      this.onMouseMove(e, true);
    }
  }

  private onMouseMove(e: React.MouseEvent<HTMLCanvasElement> | MouseEvent, ignoreState?: boolean) {
    if (this.state.selectingColor || ignoreState) {
      if (this.canvas) {
        let canvas = this.canvas.getCanvas();
        if (canvas) {
          let pos = this.calculatePosition(canvas.getBoundingClientRect(), e.clientX, e.clientY);
          let size = this.getSize();

          let saturation = pos[0] / size;
          let value = (size - pos[1]) / size;

          saturation = Math.min(Math.max(0, saturation), 1);
          value = Math.min(Math.max(0, value), 1);

          let stateChanged = false;

          if (this.state.saturation !== saturation) {
            stateChanged = true;
          }

          if (this.state.value !== value) {
            stateChanged = true;
          }

          if (stateChanged) {
            if (this.props.onSaturationValueChange) {
              this.props.onSaturationValueChange(saturation, value);
            }
            
            this.setState({saturation, value});
          }
        }
      }
    }
  }

  private onMouseUp(e: React.MouseEvent<HTMLCanvasElement> | MouseEvent) {
    if (this.state.selectingColor) {
      this.setState({selectingColor: !this.state.selectingColor});
    }
  }

  private getSize(): number {
    let radius = this.props.size / 2 * this.props.innerRadiusPercentage / 100;
    let size = Math.sqrt(2) * radius - 4;

    if (size < 0) {
      size = 0;
    }

    return size;
  }

  private getSelectorPos(size: number): number[] {
    return [(this.state.saturation - 0.05) * size, (1 - this.state.value - 0.05) * size];
  }

  private calculatePosition(bbox: ClientRect, clientX: number, clientY: number): number[] {
    return [clientX - bbox.left, clientY - bbox.top];
  }

  private isWithinBox(pos: number[]): boolean {
    let size = this.getSize();
    return 0 <= pos[0] && pos[0] <= size && 0 <= pos[1] && pos[1] <= size;
  }
}