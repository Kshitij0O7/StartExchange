import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';

class StartupFactory extends Component{
    static async getInitialProps(){
        const startups = await factory.methods.getStartupList().call();

        return { startups };
    }

    renderStartups(){
        const items = this.props.startups.map(address => {
            return{
                header: address,
                description: (
                    <Link route = {`/startups/${address}`}>
                        <a>View Startup</a>
                    </Link>
                ),
                fluid: true
            };
        });

        return <Card.Group items = {items} />;
    }

    render(){
        return( 
            <Layout>
                <div> 
                    <h3>Listed Startups</h3>
                    <Link route = '/startups/new'>
                        <a>
                            <Button 
                                floated = "right"
                                content = "List Startup"
                                icon = "add circle"
                                primary
                            />
                        </a>
                    </Link>

                    {this.renderStartups()}

                </div>
            </Layout>
        )    
    }
}

export default StartupFactory;