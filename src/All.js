import React from 'react';
import axios from 'axios';
import './index.css'
import City from './City.js'
import Favorite from './Favorite.js'
import Result from './Result.js'

import { Col, Row, Container } from 'reactstrap';

class All extends React.Component
{
  constructor() {
    super();
    this.state = {
      res: null,
    }
  }

  checkDate = (days) => {
    let today = days[0].dt_txt.split('-')[2].slice(0, 2);
    let i;
    for (i = 0; i < 8; i++)
      if(today !== days[i].dt_txt.split('-')[2].slice(0, 2))
        return i;
    return i;
  }
  
  get_weather = (city) => {
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
    this.result.createDay(end + 16, end + 24, res.data.city.name, res.data.list, 3);
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

export default All;