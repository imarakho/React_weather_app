import React from 'react';
import { Col, Row, Button, Form, FormGroup, Input } from 'reactstrap';

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
        <h3>Enter name of the city to get forecast:</h3>
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

export default City;