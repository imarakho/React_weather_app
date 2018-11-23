import React from 'react';

import './index.css'


import { Col, Row, Container,CardSubtitle, CardText,CardImg ,Card, CardBody, CardTitle } from 'reactstrap';
import {Tabs, Tab} from 'react-bootstrap-tabs';

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

      componentWillMount()
      {
        if (!this.state.setted) {
          this.set_day();
          this.setState({setted:true});
        }
      }

      createDay = (i, end, city, days, ch) => {
        let d = [];

        for (; i < end; i++) {
          let img = "http://openweathermap.org/img/w/" + days[i].weather[0].icon + ".png";
            d.push( 
            <Col sm="6" md={{ size: 5, offset: 1 }} key={i}>
              <br />
                <Card body className="weather_cards">
                  <CardBody align="center">
                    <CardTitle>Forecast on: {days[i].dt_txt} </CardTitle>
                      <CardImg top width="20%" src={img} alt="Card image cap"/>
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
        if(ch === 0)
          this.setState({day_0: d});
        else if(ch === 1)
          this.setState({day_1: d});
        else if(ch === 2)
          this.setState({day_2: d});
        else if(ch === 3)
          this.setState({day_3: d});
      }

      render() {
      return (
        <div >
        <Tabs defaultActiveKey={1} id="uncontrolled-tab">
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

export default Result