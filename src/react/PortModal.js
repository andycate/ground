import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Form, Button, Row, Col, Spinner } from 'react-bootstrap';

import { getAvailablePorts,
         selectPort,
         startConnListen,
         startSensorListen } from './actions/connActions';

class PortModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPort: 0,
      ports: [],
      baud: 57600,
      success: null,
      loading: true
    };
  }
  refresh = async () => {
    this.setState({loading: true});
    const ports = await getAvailablePorts();
    console.log(ports);
    this.setState({
      ports,
      loading: false
    });
  }
  componentDidMount = async () => {
    await this.refresh();
  }
  openPort = async () => {
    this.setState({ loading: true });
    const success = await this.props.selectPort(this.state.ports[this.state.selectedPort], this.state.baud);
    // if(success) {
    //   this.props.startConnListen();
    //   this.props.startSensorListen();
    // }
    this.setState({ success, loading: false });
  }
  render() {
    return (
      <Modal show={!(this.state.success || this.props.conn.port)}>
        <Modal.Body>
          <Row>
            <Col md='auto' className='p-0 pl-3'>
              <p className='h3 font-weight-light'>Select a port</p>
            </Col>
            <Col>
              <Button variant='light' onClick={this.refresh}>{this.state.loading?<Spinner animation='border' size='sm'/>:'Refresh'}</Button>
            </Col>
          </Row>
          <Form>
            <Form.Control as='select' value={this.state.selectedPort} onChange={e => this.setState({selectedPort: parseInt(e.target.value)})}>
              {this.state.ports.map((v, i) => (
                <option value={i} key={v.path}>{v.path}</option>
              ))}
            </Form.Control>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={ this.state.loading } onClick={this.openPort}>Select</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

PortModal.propTypes = {
  conn: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  conn: state.conn
});
export default connect(
  mapStateToProps,
  { selectPort,
    startConnListen,
    startSensorListen }
)(PortModal);
