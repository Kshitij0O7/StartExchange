import React, { Component } from "react";
import {Form, Button, Input, Message} from 'semantic-ui-react';
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";

class NewStartup extends Component{
    state = {
        minimumAsk: '',
        errorMessage: '',
        loading: false
    };
    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({loading: true, errorMessage: ''})
        try{
            const accounts = await web3.eth.getAccounts();
            await factory.methods.addMyStartup(this.state.minimumAsk).send({
                from: accounts[0]
            });

            Router.pushRoute('/');
        } catch(err){
            this.setState({errorMessage: err.message});
        }
        this.setState({loading: false}) 
    };
    render(){
        return(
            <Layout>
                <h3>LIST YOUR STARTUP</h3>

                <Form onSubmit={this.onSubmit} error = {!!this.state.errorMessage}>
                    <Form.Field>
                        <label>MINIMUM ASK</label>
                        <Input 
                            label = "WEI" 
                            labelPosition="right"
                            value = {this.state.minimumAsk}
                            onChange = {event => {
                                this.setState({minimumAsk: event.target.value})}
                            }    
                        />
                    </Form.Field>

                    <Message error header = "Oops" content = {this.state.errorMessage} />
                    <Button loading = {this.state.loading} primary> LIST </Button>
                </Form>
            </Layout>
            
        );
    }
}

export default NewStartup;