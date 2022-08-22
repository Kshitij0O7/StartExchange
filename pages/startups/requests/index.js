import React, {Component} from "react";
import {Button, Table} from 'semantic-ui-react';
import {Link} from '../../../routes';
import Layout from "../../../components/Layout";
import StartupInstance from "../../../ethereum/startup";
import RequestRow from "../../../components/RequestRow";

class RequestIndex extends Component{
    static async getInitialProps(props){
        const { address } = props.query;
        const startup = StartupInstance(address);
        const requestCount = await startup.methods.getRequestsCount().call();
        const investorCount = await startup.methods.investorCount().call();
        const requests = await Promise.all(
            Array(parseInt(requestCount)).fill().map((element, index) => {
                return startup.methods.requests(index).call();
            })
        );
        //console.log(requests); --good till yet
        return {address, requests, requestCount, investorCount};
    }

    renderRows(){
        console.log(this.props.requestCount);
        return this.props.requests.map((request, index) => {
            return <RequestRow 
                key={index}
                id = {index}
                request = {request}
                address = {this.props.address}
                investorCount = {this.props.investorCount}
            />
        });
    }

    render(){
        const { Header, Row, HeaderCell, Body} = Table;
        //console.log(this.props.requests);
        return(
            <Layout>
                <h3>Requests</h3>
                <Link route = {`/startups/${this.props.address}/requests/new`}>
                    <a>
                    <Button primary floated="right" style={{ marginBottom: 10 }}> Add Request</Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount(in GWEI)</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>{this.renderRows()}</Body>
                </Table>
                <div>Found {this.props.requestCount} requests.</div>
            </Layout>  
        );
    };
};

export default RequestIndex;