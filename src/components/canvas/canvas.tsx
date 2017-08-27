import * as React from 'react';

interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
  onmousedown?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onmouseup?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onmouseenter?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onmouseleave?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onmousemove?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onclick?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}

interface State {

}

export default class Canvas extends React.Component<Props, State> {
  private canvas: HTMLCanvasElement | null;

  constructor(props: Props) {
    super(props);
    this.state = this.getInitialState();
  }

  public getInitialState(): State {
    return {} as State;
  }

  public render(): JSX.Element {
    return (
      <canvas
        ref={(canvas: HTMLCanvasElement | null) => { this.canvas = canvas; }}
        style={{
          width: this.props.width + 'px',
          height: this.props.height + 'px',
          position: 'absolute',
          top: this.props.y + 'px',
          left: this.props.x + 'px',
          overflow: 'hidden'
        }}
        onMouseDown={this.props.onmousedown}
        onMouseUp={this.props.onmouseup}
        onMouseEnter={this.props.onmouseenter}
        onMouseLeave={this.props.onmouseleave}
        onMouseMove={this.props.onmousemove}
        onClick={this.props.onclick}
        width={this.props.width}
        height={this.props.height}
      >
        {this.props.children}
      </canvas>
    );
  }

  public refresh(): void {
    this.setState({} as State);
  }

  public getCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }
}