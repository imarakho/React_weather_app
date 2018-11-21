import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './index.css'

import { Col, Row, Button, Container, Form, FormGroup, Input,CardSubtitle, CardText,CardImg ,Card, CardBody, CardTitle, Label } from 'reactstrap';
import {Tabs, Tab} from 'react-bootstrap-tabs';

class City extends React.Component {
    constructor(props) {
    super(props);
    this.state = {city: ''};
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange = (event) => {
    this.setState({city: event.target.value});
  }
  handleSubmit = (event) => {
    this.props._func(this.state.city);
    event.preventDefault();
  }
  render() {
    return (
      <div>
        <h3>Tap name of the city to get forecast:</h3>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Row>
                <Col sm={{ size: 6, offset: 2 }}>
                  <Input onChange={this.handleChange} placeholder="Enter your city"/>
                </Col>
                <Col sm={{ size: 1}}>
                  <Button color="success">Get forecast</Button>
                </Col>
              </Row>
            </FormGroup>
          </Form>
      </div>
    );
  }
}

class Favorite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fav: localStorage.getItem('favorites') !== null ? localStorage.getItem('favorites').split(",") : null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.getForecast = this.getForecast.bind(this);
    this.removeFavorite = this.removeFavorite.bind(this);
  }

  handleChange(event) {
    this.setState({city: event.target.value});
  }

  getForecast(event) {
    this.props._func(document.getElementById("favorites").value);
    event.preventDefault();
  }

  add_favorite_city()
{
    let fav = localStorage.getItem('favorites');
    let city = document.getElementById("add_favorite").value.toLowerCase();
    let url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&mode=json&&APPID=e77dd68c9d1dfe314070865567840739";
   axios.get(url)
   .then(res => {
    let x = document.getElementById("favorites");
    var option = document.createElement("option");
    option.text = city;
      if(fav != null)
      {
        let arr = fav.split(',');
        for(let i = 0;i < arr.length;i++)
          arr[i] = arr[i].toLowerCase();
        city = city.toLowerCase();
        if(arr.indexOf(city) === -1)
        {
          localStorage.setItem('favorites', fav + ',' + city);
          x.add(option);
          alert(city + " is added to favorites!");
        }
        else
          alert("There is such city in favorites");
      }
      else
      {
        localStorage.setItem('favorites', city);
        x.add(option);
        alert(city + " is added to favorites!");
      }
   }).catch(error => {
    alert(error.response.data.message);
});
}

  removeFavorite(event) {
    if(localStorage.getItem('favorites') === null)
    {
      alert("There is no favorites!");
      return ;
    }
    let del = document.getElementById("favorites").value;
    let arr = localStorage.getItem('favorites').split(",");
    document.getElementById("favorites").remove(arr.indexOf(del));
    arr.splice(arr.indexOf(del), 1);
    if(arr.length !== 0)
      localStorage.setItem("favorites", arr);
    else
      localStorage.removeItem("favorites");
    alert(del + " is remove from favorites!");
    event.preventDefault();
  } 

    render() {
      let map = null;
      if (this.state.fav) {
        map = this.state.fav.map((el, i) => {
          return (
            <option key={ i }>{el}</option>
          )
        })
      }
        return (          
          <div>
             <Label>Tap name of the city to add it to favorites:</Label>
            <Row>
              <Col sm={{ size: 6, offset: 2 }}>
                <Input type="text" id="add_favorite" placeholder="Add city to favorites"/>
              </Col>
              <Col sm={{ size: 1 }}>
                <Button color="info" onClick={this.add_favorite_city}>Add to favorites</Button>{' '}
              </Col>
            </Row>
            <Label>Choose city from favorites and tap green button to see the forecast.</Label>
            <Label>Tap red to remove chosen city from favorites.</Label>
            <Row>
              <Col sm={{ size: 6, offset: 2 }}>
            <Input type="select" id="favorites" className="favorites">
                  { map }
            </Input>
                <br />
                <Button onClick={this.getForecast} color="success">Get favorite</Button>{' '}
                <Button onClick={this.removeFavorite} color="danger">Remove favorite</Button>{' '}
              </Col>
            </Row>
          </div>
        );
      }
    }


    class Result extends React.Component
    {
      constructor(props) {
        super(props);
        this.state = {
          days: null,
          day_0: null,
          day_1: null,
          day_2: null,
          day_3: null,
          setted: false
         };
      }

      set_day = () => {
        let ds = JSON.parse(localStorage.getItem("days"));
        if(ds == null) 
          return;
        this.createDay(0, ds.end, ds.city, ds.days, 0);
        this.createDay(ds.end, ds.end + 8, ds.city, ds.days, 1);
        this.createDay(ds.end + 8, ds.end + 16, ds.city, ds.days, 2);
        this.createDay(ds.end + 16, ds.end + 24, ds.city, ds.days, 3);
      }

      createDay = (i, end, city, days, ch) => {
        let d = [];
        if(days == null || city == null || end == null) return;
        for (; i < end; i++) {
          let img = "http://openweathermap.org/img/w/" + days[i].weather[0].icon + ".png";
            d.push( 
            <Col sm="6" md={{ size: 5, offset: 1 }}>
            <br />
            <Card body className="weather_cards" class="card card-3 stacked--up">
            <CardBody>
            <CardTitle>Forecast on: {days[i].dt_txt} </CardTitle>
            <CardImg top width="10%" src={img} alt="Card image cap"/>
            <CardSubtitle>Weather is {days[i].weather[0].description} </CardSubtitle>
            <CardText>{city} average temperature on {days[i].dt_txt}:{days[i].main.temp}°C.<br />
              Max temperature:{days[i].main.temp_max}°C.<br />
              Min temperature:{days[i].main.temp_min}°C.<br />
              Humidity is about:{days[i].main.humidity}%.<br />
              Wind speed is about {days[i].wind.speed} m/s.<br /></CardText>
            </CardBody>
            </Card>
            </Col>
          );
        }
        let p = {};
          p.city = city;
          p.days = days;
          p.end = end;
        if(ch === 0)
          this.setState({day_0: d});
        else if(ch === 1)
          this.setState({day_1: d});
        else if(ch === 2)
          this.setState({day_2: d});
        else if(ch ===3)
        this.setState({day_3: d});
      }

      render() {
        if (!this.state.setted) {
          this.set_day();
          this.setState({setted:true});
        }
      return (
        <div >
        <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
        <Tab eventKey={1} title="Today" label="Today">
                      <div id="day1">
                      <Container><Row>{this.state.day_0}</Row></Container></div>
        </Tab>
        <Tab eventKey={2} title="Tomorrow" label="Tomorrow">
                      <div id="day2"><Container><Row>{this.state.day_1}</Row></Container></div>
        </Tab>
        <Tab eventKey={3} title="After Tomorrow" label="After Tomorrow">
                      <div id="day3"><Container><Row>{this.state.day_2}</Row></Container></div>
        </Tab>
        <Tab eventKey={3} title="After after Tomorrow" label="After after Tomorrow">
                      <div id="day4"><Container><Row>{this.state.day_3}</Row></Container></div>
        </Tab>
        </Tabs>
        </div>
      );
      }
    }

    class All extends React.Component
    {
      constructor() {
        super();
        this.state = {
          res: null,
        }
      }

      checkDate = (days) =>
      {
        let today = days[0].dt_txt.split('-')[2].slice(0, 2);
        for (let i = 0; i < 8; i++)
        {
          if(today !== days[i].dt_txt.split('-')[2].slice(0, 2))
            return i;
        }
      }
      
    get_weather = (city) =>
    {
     city = city.toLowerCase();
    let url = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&mode=json&&APPID=e77dd68c9d1dfe314070865567840739";
    axios.get(url)
      .then(res => {
          let end = this.checkDate(res.data.list);
          let p = {};
          p.city = res.data.city.name;
          p.end = end;
          p.days = res.data.list;
          this.result.createDay(0, end, res.data.city.name, res.data.list, 0);
          this.result.createDay(end, end + 8, res.data.city.name, res.data.list, 1);
          this.result.createDay(end + 8, end + 16, res.data.city.name, res.data.list, 2);
          this.result.createDay(end + 16, end + 24, res.data.city.name, res.data.list, 2);
          localStorage.setItem("days", JSON.stringify(p));  
          this.setState({res: res.data.list})
      }).catch(error => {
        alert(error);
      });
  }
    render() {
      return (
        <div>
          <Container>
            <h1>Forecast</h1>
            <Row>
              <Col sm="6">
                <div className="City">
                  <City _func={this.get_weather} />
                </div>
              </Col>
              <Col sm="6">
                <div className="Favorite">
                  <Favorite _func={this.get_weather} />
                </div>
              </Col>
            </Row>
            </Container>
        <div className="Result">
          <Result ref={r => this.result = r} />
        </div>
      </div>
      );
    }
}
    
ReactDOM.render(
    <All />,
    document.getElementById('root')
  );
      