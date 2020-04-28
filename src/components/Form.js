import React from 'react'

export class Form extends React.Component {
    render() {
        return (
            <form onSubmit = {this.props.getWeather}>
                <div className='search-box'>
                    <input 
                        type='text'
                        name='city'
                        placeholder='City...'   
                    />
                    <button>Get Weather</button>
                </div>
            </form>
        )
    }
}

export default Form;

