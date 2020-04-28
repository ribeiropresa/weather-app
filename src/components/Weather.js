import React from 'react';

export class Weather extends React.Component {
    render() {
        return (
            <div className='temperature'>
                {this.props.temperature && <h3><b>{Math.round(this.props.temperature)}&deg;c</b></h3>}
            </div>
        )
    }
}

export default Weather;
