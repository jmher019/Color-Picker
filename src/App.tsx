import * as React from 'react';
import ColorPicker from './components/color-picker/color-picker';

class App extends React.Component {
  render() {
    return (
      <ColorPicker
        size={400}
        innerRadiusPercentage={65}
        outerRadiusPercentage={80}
      />
    );
  }
}

export default App;
