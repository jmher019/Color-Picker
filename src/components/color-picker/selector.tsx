import * as React from 'react';
import Canvas from '../canvas/canvas';

interface Props {
  x: number;
  y: number;
  size: number;
  sizePercentage: number;
}

interface State {

}

export default class Selector extends React.Component<Props, State> {
  private canvas: Canvas | null;

  constructor(props: Props) {
    super(props);
    this.state = this.getInitialState();
  }

  public getInitialState(): State {
    return {} as State;
  }

  public render(): JSX.Element {
    return (
      <Canvas
        ref={(canvas: Canvas | null) => { this.canvas = canvas; }}
        x={this.props.x}
        y={this.props.y}
        width={this.props.size}
        height={this.props.size}
      />
    );
  }

  public componentDidMount(): void {
    this.initializeSelector();
  }

  private initializeSelector(): void {
    if (this.canvas) {
      let canvas = this.canvas.getCanvas();
      if (canvas) {
        let ctx = canvas.getContext('2d');
        if (ctx) {
          let halfSize = this.props.size / 2;
          let outerRadius = (halfSize - 2) * this.props.sizePercentage / 100;
          let innerRadius = (halfSize - 4) * this.props.sizePercentage / 100;

          if (outerRadius < 0) {
            outerRadius = 0;
          }

          if (innerRadius < 0) {
            innerRadius = 0;
          }

          ctx.lineWidth = 4 * this.props.sizePercentage / 100;
          ctx.strokeStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(halfSize, halfSize, outerRadius, 0, Math.PI * 2);
          ctx.stroke();

          ctx.lineWidth = outerRadius - innerRadius;
          ctx.strokeStyle = '#000000';
          ctx.beginPath();
          ctx.arc(halfSize, halfSize, innerRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      this.canvas.refresh();
    }
  }
}