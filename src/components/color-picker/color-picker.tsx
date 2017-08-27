import * as React from 'react';
import HueRing from './hue-ring';
import SaturationValueSquare from './saturation-value-square';
import { HSVColor } from './color';
import Preview from './preview';

interface Props {
  size?: number;
  innerRadiusPercentage?: number;
  outerRadiusPercentage?: number;
  showPreview?: boolean;
  onColorChange?: (colorString: string) => void;
}

interface State {
  hue: number;
  saturation: number;
  value: number;
}

export default class ColorPicker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = this.getInitialState();
  }

  public getInitialState(): State {
    return {
      hue: 0,
      saturation: 1,
      value: 1
    } as State;
  }

  public render(): JSX.Element {
    return (
      <div
        style={{
          position: 'absolute',
          top: '0px',
          left: '0px'
        }}
      >
        <HueRing
          size={this.props.size || 400}
          innerRadiusPercentage={this.props.innerRadiusPercentage || 65}
          outerRadiusPercentage={this.props.outerRadiusPercentage || 80}
          selectorSizePercentage={80}
          angleStepSize={0.1}
          onHueChange={hue => this.setState({hue})}
        />
        <SaturationValueSquare
          size={this.props.size || 400}
          innerRadiusPercentage={this.props.innerRadiusPercentage || 65}
          hue={this.state.hue}
          onSaturationValueChange={(saturation: number, value: number) => this.setState({saturation, value})}
        />
        <Preview
          x={this.props.size || 400}
          y={this.props.size ? this.props.size / 2 - 16 : 200 - 16}
          size={32}
          color={this.getCurrentColor()}
        />
      </div>
    );
  }

  public componentDidUpdate() {
    if (this.props.onColorChange) {
      this.props.onColorChange(
        (new HSVColor(
          this.state.hue, this.state.saturation, this.state.value
        )
      ).getColorCss()[0]);
    }
  }

  private getCurrentColor(): string {
    return (new HSVColor(this.state.hue, this.state.saturation, this.state.value)).getColorCss()[0];
  }
}