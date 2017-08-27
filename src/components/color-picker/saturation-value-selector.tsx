import * as React from 'react';

interface Props {

}

interface State {

}

export default class SaturationValueSelector extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = this.getInitialState();
  }

  public getInitialState(): State {
    return {} as State;
  }
}