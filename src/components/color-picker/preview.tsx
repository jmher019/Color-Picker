import * as React from 'react';

interface Props {
  x: number;
  y: number;
  size: number;
  color: string;
}

interface State {

}

export default class Preview extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = this.getInitialState();
  }

  public getInitialState(): State {
    return {} as State;
  }

  public render(): JSX.Element {
    return (
      <div
        style={{
          position: 'absolute',
          top: this.props.y + 'px',
          left: this.props.x + 'px',
          border: '2px solid black',
          width: this.props.size + 'px',
          height: this.props.size + 'px',
          backgroundColor: this.props.color
        }}
      />
    );
  }
}