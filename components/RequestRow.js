import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import StartupInstance from "../ethereum/startup";

class RequestRow extends Component {
  onApprove = async () => {
    const startup = StartupInstance(this.props.address);

    const accounts = await web3.eth.getAccounts();
    await startup.methods.approveRequest(this.props.id).send({
      from: accounts[0],
    });
  };

  onFinalize = async () => {
    const startup = StartupInstance(this.props.address);

    const accounts = await web3.eth.getAccounts();
    await startup.methods.finaliseRequest(this.props.id).send({
      from: accounts[0],
    });
  };

  render() {
    const { Row, Cell } = Table;
    const { id, request, investorCount } = this.props;
    // const id = this.props.id;
    // const requests = this.props.requests;
    // const investorCount = this.props.investorCount;
    const readyToFinalize = request.approvalCount > investorCount / 2;

    return (
        <Row
            disabled={request.status}
            positive={readyToFinalize && !request.status}
        >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{request.value}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {request.approvalCount}/{investorCount}
        </Cell>
        <Cell>
          {request.status ? null : (
            <Button color="green" basic onClick={this.onApprove}>
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {request.status ? null : (
            <Button color="teal" basic onClick={this.onFinalize}>
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;