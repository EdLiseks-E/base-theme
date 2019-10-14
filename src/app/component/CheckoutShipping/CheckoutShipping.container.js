import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { shippingMethodsType } from 'Type/Checkout';
import { trimCustomerAddress, trimAddressFields } from 'Util/Address';
import { customerType } from 'Type/Account';

import CheckoutShipping from './CheckoutShipping.component';

export const mapStateToProps = state => ({
    customer: state.MyAccountReducer.customer
});

export const mapDispatchToProps = dispatch => ({
    // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class CheckoutShippingContainer extends PureComponent {
    static propTypes = {
        saveAddressInformation: PropTypes.func.isRequired,
        shippingMethods: shippingMethodsType.isRequired,
        customer: customerType.isRequired
    };

    containerFunctions = {
        onShippingSuccess: this.onShippingSuccess.bind(this),
        onShippingError: this.onShippingError.bind(this),
        onAddressSelect: this.onAddressSelect.bind(this),
        onShippingMethodSelect: this.onShippingMethodSelect.bind(this)
    };

    constructor(props) {
        super(props);

        const { shippingMethods } = props;
        const [selectedShippingMethod] = shippingMethods;

        this.state = {
            selectedCustomerAddressId: 0,
            selectedShippingMethod
        };
    }

    onAddressSelect(id) {
        this.setState({ selectedCustomerAddressId: id });
    }

    onShippingMethodSelect(method) {
        this.setState({ selectedShippingMethod: method });
    }

    onShippingError(fields, invalidFields, asyncData) {
        const {
            selectedCustomerAddressId,
            selectedShippingMethod
        } = this.state;

        console.log(fields, invalidFields, asyncData, selectedCustomerAddressId, selectedShippingMethod);
    }

    onShippingSuccess(fields) {
        const { saveAddressInformation } = this.props;

        const {
            selectedCustomerAddressId,
            selectedShippingMethod
        } = this.state;

        const shippingAddress = selectedCustomerAddressId
            ? this._getAddressById(selectedCustomerAddressId)
            : trimAddressFields(fields);

        const {
            carrier_code: shipping_carrier_code,
            method_code: shipping_method_code
        } = selectedShippingMethod;

        const data = {
            billing_address: shippingAddress,
            shipping_address: shippingAddress,
            shipping_carrier_code,
            shipping_method_code
        };

        saveAddressInformation(data);
    }


    _getAddressById(addressId) {
        const { customer: { addresses } } = this.props;
        const address = addresses.find(({ id }) => id === addressId);
        return trimCustomerAddress(address);
    }

    render() {
        return (
            <CheckoutShipping
              { ...this.props }
              { ...this.state }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutShippingContainer);