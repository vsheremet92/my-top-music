import * as React from 'react'
import { Widget } from './widget'
export class App extends React.Component<{}, {}> {

    state = {
        cnt: 0
    }

    render() {
        return(
            <div className="reactroot">
                <h3>Total times clicked: {this.state.cnt}</h3>
                <button onClick={()=> {
                    this.setState({cnt: this.state.cnt+1})
                }}>
                  Click me
                </button>
                <Widget text="String"/>
            </div>
        )
    }
}
