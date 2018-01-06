import * as React from 'react'

export class Widget extends React.Component<{
    text: string
}, {}> {
    render() {
        return(
            <div>
                {this.props.text}
                <form action="/quotes" method="POST">
                    <input type="text" placeholder="name" name="name" />
                    <input type="text" placeholder="quote" name="quote" />
                    <button type="submit">Submit</button>
                </form>
            </div>
        )
    }
}
