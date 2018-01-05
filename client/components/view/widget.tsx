import * as React from 'react'

export class Widget extends React.Component<{
    text: string
}, {}> {
    render() {
        return(
            <div>{this.props.text}</div>
        )
    }
}
