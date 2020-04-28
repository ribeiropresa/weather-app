import React, { Component } from 'react'

export class Conditions extends Component {
    render() {
        return (
            <div className='conditions'>
                {this.props.feels_like && <p><u>feels like <i>{Math.round(this.props.feels_like)}&deg;</i></u></p>}
                {this.props.humidity && <p>Humidity: {this.props.humidity}%</p>}
                {this.props.description && <p>Conditions: {this.props.description}</p>}
            </div>
        )
    }
}

export default Conditions
