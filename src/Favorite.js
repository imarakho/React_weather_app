import React from 'react';
import axios from 'axios';
import './index.css'

import { Col, Row, Button, Input, Label } from 'reactstrap';

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
  
    add_favorite_city() {
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
          <Label>Enter name of the city to add it to favorites:</Label>
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

export default Favorite;