import React, { Component} from "react";
import { Form, Button, Message, Input} from 'semantic-ui-react';
import StartupInstance from "../../../ethereum/startup";
import web3 from "../../../ethereum/web3";
import {Link, Router} from '../../../routes'
import Layout from "../../../components/Layout";

class NewRequest extends Component {
    state = {
        description: '',
        value: '',
        recipient: '',
        loading: false,
        errorMessage: ''
    };
  
    static async getInitialProps(props) {
      const { address } = props.query;
  
      return { address };
    }
  
    onSubmit = async (event) => {
      event.preventDefault();
  
      const startup = StartupInstance(this.props.address);
      //const { description, value, recipient } = this.state;
  
      this.setState({ loading: true, errorMessage: '' });
      try {
        const accounts = await web3.eth.getAccounts();
        await startup.methods.createRequest(
            this.state.description,
            web3.utils.toWei(this.state.value, 'ether'),
            this.state.recipient
        ).send({ from: accounts[0]});

        Router.pushRoute(`/startups/${this.props.address}/requests`);
      }  catch (err) {
        this.setState({ errorMessage: err.message });
      }
      this.setState({ loading: false });
    };
  
    render(){
        return(
            <Layout>
                <Link route={`/startups/${this.props.address}/requests`}>
                    <a>Back</a>
                </Link>
                <h3>Create a Request</h3>
                <Form onSubmit = {this.onSubmit} error = {!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input 
                            value = {this.state.description}
                            onChange = {(event) => {this.setState({description: event.target.value})}} 
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Value in MATIC</label>
                        <Input 
                            value = {this.state.value}
                            onChange = {(event) => {this.setState({value: event.target.value})}} 
                            label = 'MATIC'
                            labelPosition = 'right'
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient</label>
                        <Input 
                            value = {this.state.recipient}
                            onChange = {(event) => {this.setState({recipient: event.target.value})}}
                        />
                    </Form.Field>
                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button primary loading = {this.state.loading}>Create!</Button>
                </Form>
            </Layout>
        );
    };
};

export default NewRequest;