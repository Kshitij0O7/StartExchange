import React, { Component} from 'react';
import { Card, Grid, Button } from 'semantic-ui-react'
import Layout from '../../components/Layout';
import startupInstance from '../../ethereum/startup';
import InvestForm from '../../components/invest';
import web3 from "../../ethereum/web3";
import { Link } from '../../routes';

class StartupDetail extends Component{
    static async getInitialProps(props){
        const startup = startupInstance(props.query.address);
        const summary = await startup.methods.getSummary().call();
        // console.log(summary)
        return{
            address: props.query.address,
            minimumAsk: summary[0],
            balance: summary[1],
            requestCount: summary[2],
            investorCount: summary[3],
            manager: summary[4],
        };
    }

    renderCards(){
        const{
            balance,
            manager,
            minimumAsk,
            requestCount,
            investorCount,
        } = this.props;

        const items = [
            {
                header: manager,
                meta: 'Owner Address',
                description: 'This is the address of the owner who listed the startup and can create requests',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: minimumAsk,
                meta: 'Minimum Ask (in WEI)',
                description: 'This is the minimum amount of MATIC you have to pay to be listed as an investor',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: requestCount,
                meta: 'Total Requests',
                description: 'A request is created by the owner to ask to withdraw money from the contract',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: investorCount,
                meta: 'Investors',
                description: 'Total number of investors for the startup who have the power to approve request',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: web3.utils.fromWei(balance, "ether"),
                meta: 'Total funds (in ETH)',
                description: 'This is the total funds raised by the startup upto the date',
                style: {overflowWrap: 'break-word'}
            }
        ];

        return <Card.Group items = {items} />;
    }

    render(){
        return(
            <Layout>
                <h3>Startup Details</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <InvestForm address = {this.props.address}/>
                        </Grid.Column>
                    </Grid.Row>  
                    <Grid.Row>
                        <Grid.Column>
                            <Link route = {`/startups/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>    
                    </Grid.Row>                  
                </Grid>  
            </Layout>
        );
    };
};

export default StartupDetail;