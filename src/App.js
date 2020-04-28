import React, {Component, Fragment} from 'react';
import Titles from './components/Titles';
import Form from './components/Form';
import Weather from './components/Weather';
import Conditions from './components/Conditions';
import {Line as LineChart} from 'react-chartjs-2';
import PickyDateTime from 'react-picky-date-time';
/*import { WiCloudy } from 'weather-icons-react';
import { WiDayShowers } from 'weather-icons-react';
import { WiDaySnow } from 'weather-icons-react';
import { WiDayThunderstorm } from 'weather-icons-react';
import { WiDaySunny } from 'weather-icons-react';
import { WiDayWindy } from 'weather-icons-react';*/

const api_key = '0a5562a0925d78a5bfebaf513fe718ec';

export class App extends Component {

  state = {
    temperature: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    icon: undefined,
    feels_like: undefined,
    temp_min: undefined,
    temp_max: undefined,
    error: undefined,
    /*tp create my chart*/
    chartData: {},
    isLoading: true,
  }
  /*to create my chart*/
  forecastData = (data) => {
    let arrayMax = [];
    let arrayMin = [];
  /*add x-axis*/  
    let arrayTime = [];
    //console.log('this is data', data)
    for(let i=0; i < data.list.length; i++) {
        arrayMax.push(data.list[i].main.temp_max)
        arrayMin.push(data.list[i].main.temp_min)

        if (i % 8 === 0)
        arrayTime.push(data.list[i].dt_txt.slice(5,10))
    }
  
    return {
        arrayMin,
        arrayMax,
        arrayTime
    }
  }
  
  getWeather = async (e) => {
    //maybe this event is not cancelable 
    e.preventDefault();
    const city = e.target.elements.city.value;
    //console.log(city)
    const data = await fetch(`https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=${api_key}`)
    .then(response => response.json())
    .then(data =>data)
    .catch(err => console.log(err))

    
    if(data.cod != 404) {
      let {arrayMin, arrayMax, arrayTime} = this.forecastData(data);
      this.setState({
        data:{},
        temperature: data.list[0].main.temp,
        city: data.city.name,
        country: data.city.country,
        humidity: data.list[0].main.humidity,
        description: data.list[0].weather[0].description,
        //icon: data.list[0].weather[0].icon,
        feels_like: data.list[0].main.feels_like,
        temp_min: data.list[0].main.temp_min,
        temp_max: data.list[0].main.temp_max,
        error: undefined, 
        chartData: {
          labels:arrayTime,
          datasets: [{
            fill: true,
            label: 'Min-Temperature',
            labelColor:'rgba(10, 150, 245, 0.5)',
            yAxisID:'Min-Temp',
            data: arrayMin,
            backgroundColor: 'rgba(10, 150, 245, 0.5)',
          }, {
            fill: true,
            label: 'Max-Temperature',
            labelColor:'rgba(160, 80, 10, 0.5)',
            yAxisID:'Max-Temp',
            data: arrayMax,
            backgroundColor: 'rgba(160, 80, 10, 0.5)',
          }]
        },
        isLoading: false
      })  
      console.log(this.state)
    } else {
      this.setState({
        temperature: undefined,
        city: undefined,
        country: undefined,
        humidity: undefined,
        description: undefined,
        //icon: undefined,
        feels_like: undefined,
        temp_min: undefined,
        temp_max: undefined,
        error: 'City not found',
        chartData: undefined,
        isLoading: false
      });
    }
  }

  dateBuilder = (d) => {
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${year} ${month} ${date}`
  }

  conditionalRendering() {
    if (this.state.isLoading)
      return(
            <div className='clock'>
              <PickyDateTime
                size="s"
                mode={2}
                locale="en-us"
                show={true}
              />
            </div>)
    else if (this.state.error != undefined) 
      return (<div className='error'>{this.state.error}</div>)
    else {
      return (
        <Fragment>
          <div className={
            (typeof this.state.description !='undefined')?(
            (this.state.description.includes('clouds')) ? 'location-box cloudy':
            (this.state.description.includes('rain')) ? 'location-box rainy':
            (this.state.description.includes('snow')) ? 'location-box snowy':
            (this.state.description.includes('storm')) ? 'location-box stormy':
            (this.state.description.includes('clear')) || (this.state.temperature > 20) ? 'location-box sunny':
            (this.state.description.includes('wind')) ? 'location-box windy':
            'location-box'):'location-box'
            }>
            <Titles 
              city = {this.state.city} 
              country = {this.state.country}
              
            />
          </div>
          <div className='weather-box'>
              <Weather 
                  temperature = {this.state.temperature}
              />
              <Conditions
                feels_like = {this.state.feels_like}
                humidity = {this.state.humidity}
                description = {this.state.description}
              />
            </div>
          <div className='chart-app' >
            <LineChart className = 'chart_temperature' 
              data={this.state.chartData}
              options={{
                legend: {
                  labels: {
                    fontColor: 'white'
                }
                },
                scales: {
                  xAxes: [{
                    ticks: {
                      fontColor:'white',
                      // color: 'rgba(255, 255, 255, 0.7)'
                    },
                    gridLines : {
                      display : false,
                  }
                  }],
                  yAxes: [{
                    // type: 'degrees',
                    id: 'Min-Temp',
                    position:'right',
                    ticks: {
                      fontColor:'white',
                      stepSize: 5,
                      suggestedMin: 10,
                      suggestedMax: 20,    
                    },
                  }, {
                    id:'Max-Temp',
                    ticks: {
                      fontColor:'white',
                      stepSize: 5,
                      suggestedMin: 10,
                      suggestedMax: 20,
                    },
                  }]
                },
              }
            }
            />
          </div>
        </Fragment>
      )
    }
  }

  render() {
    
    return (
      <div className={
        (typeof this.state.description !='undefined')?(
        (this.state.description.includes('clouds')) ? 'main cloudy':
        (this.state.description.includes('rain')) ? 'main rainy':
        (this.state.description.includes('snow')) ? 'main snowy':
        (this.state.description.includes('storm')) ? 'main stormy':
        (this.state.description.includes('clear')) || (this.state.temperature > 20) ? 'main sunny':
        (this.state.description.includes('wind')) ? 'main windy':
        'main'):'main'
        }>
        <div className='top-bar'>
            <Form getWeather={this.getWeather}/>
            <div className='date'>{this.dateBuilder(new Date())}</div>  
        </div>    
        {this.conditionalRendering()}
      </div>
    )
  }
}

export default App
