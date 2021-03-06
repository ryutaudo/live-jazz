/* eslint-disable no-useless-escape */
import React, { Component } from 'react';
import { injectStripe } from 'react-stripe-elements';

import { CardNumberElement, CardExpiryElement, CardCVCElement } from 'react-stripe-elements';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

const styleProps = {
  base: {
    color: 'black',
    '::placeholder': {
      color: '#ABAB9A',
    },
    fontSize: '16px',
    lineHeight: '24px',
  },
  complete: {
    color: 'green',
  },
  invalid: {
    color: 'red',
  }
};

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class CheckoutForm extends Component {

  handleSubmit = (event) => {
    event.preventDefault();

    let error = false;
    if(document.getElementById('card-holder-field').value === '') {
      this.props.setNameErrorText('Card holder name is required');
      error = true;
    } else {
      this.props.setNameErrorText('');      
    }
    if(document.getElementById('address-field').value === '') {
      this.props.setAddressErrorText('Billing address is required');
      error = true;
    } else {
      this.props.setAddressErrorText('');      
    }
    if(document.getElementById('email-field').value === '') {
      this.props.setEmailErrorText('E-mail address is required');
      error = true;
    } else if (!emailRegex.test(document.getElementById('email-field').value)) {
      this.props.setEmailErrorText('E-mail address is not valid');
      error = true;
    } else {
      this.props.setEmailErrorText('');
    }

    if(!error) {
      this.props.stripe.createToken({
        name: document.getElementById('card-holder-field').value
      }).then(async (response) => {
        const stripeToken = response.token;
  
        if(stripeToken) {
          let headers = new Headers();
          headers.append('Content-Type', 'application/json');
          headers.append('Bearer', this.props.jwt);
    
          const res = await (await fetch('/api/charge', {
            method: 'POST',
            body: JSON.stringify({
              stripeToken,
              eventID: this.props.eventID,
            }),
            headers,
          })).json();

          if (res.OK) {
            this.props.setChargeResponse(res);
            this.props.history.push('/confirmation');
          } else {
            this.props.setCreditCardError();
          }
        } else {
          this.props.setCreditCardError();
        }
      });
    }
  }

  render() {
    const actions = [
      <RaisedButton
        primary
        label="OK"
        onClick={this.props.setCreditCardError}
      />,
    ];

    return (
      <form onSubmit={this.handleSubmit} className="flex column center">
        <ul id="payment-info-table">
          <li className="flex">
            <p className="listTtl">Card Holder:</p>
            <div className="listItem">
              <TextField
                id="card-holder-field"
                hintText="John Smith"
                errorText={ this.props.nameErrorText }
              />
            </div>
          </li>
          <li className="flex">
            <p className="listTtl">Billing Address:</p>
            <div className="listItem">
              <TextField
                id="address-field"
                hintText="123 New Orleans"
                errorText={ this.props.addressErrorText }
              />
            </div>
          </li>
          <li className="flex">
            <p className="listTtl">E-mail:</p>
            <div className="listItem">
              <TextField
                id="email-field"
                hintText="test@example.com"
                errorText={ this.props.emailErrorText }
              />
            </div>
          </li>
          <li className="flex">
            <p className="listTtl">Card Number:</p>
            <div className="listItem">
              <div className="underline">
                <CardNumberElement style={styleProps} />
              </div>
            </div>
          </li>
          <li className="flex">
            <p className="listTtl">Expiry Date:</p>
            <div id="expiry-date" className="listItem">
              <div className="underline">
                <CardExpiryElement style={styleProps} />
              </div>
            </div>
            <p id="cvc">CVC:</p>
            <div className="listItem">
              <div className="underline">
                <CardCVCElement style={styleProps} />
              </div>
            </div>
          </li>
        </ul>
        <RaisedButton primary className="orderButton" label="Confirm Order" type="submit" />
        <Dialog
          title="Error"
          actions={actions}
          modal={false}
          open={this.props.creditCardError}
          onRequestClose={this.props.setCreditCardError}
        >
          Please input a valid credit card.
        </Dialog>
      </form>
    );
  }
}

export default injectStripe(CheckoutForm);
