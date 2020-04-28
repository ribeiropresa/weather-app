import React from 'react';


export class Titles extends React.Component {

    render() {
        return (
            <div className='city'>
                <span>
                    {this.props.city}, {this.props.country}

                </span>
            </div>
        )
    }
}

export default Titles;
