const Constants = {
    code: {
        success: 200,
        error: 400
    },
    roles : {
        admin : 1,
        customers : 2
    },
    orderStatuses : {
        ordered : 'Ordered'
    },
    Messages : {
        common: {
            error: 'Something went wrong please try again later.',
            sessionSuccess: 'Checked',
            sessionError: 'Your session is expired, Please login again to continue.',
            invalidInput: 'Invalid input',
            internalServerError: 'Internal Server Error'
        },
        auth : {
            loginSuccess : 'You have logged in successfully.',
            registerSuccess : 'You registered successfully.',
            registerError : 'Email is already registered.',
            unauthorized : 'You are not authorized.'
        },
        product : {
            findAll : 'Products retrieved successfully.',
            findOne : 'Product retrieved successfully.',
            create : 'Product created successfully.',
            update : 'Product updated successfully.',
            delete : 'Product deleted successfully.',
            notFound : 'Product not found.',
        },
        order : {
            findAll : 'Orders retrieved successfully.',
            findOne : 'Order retrieved successfully.',
            create : 'Order created successfully.',
            notFound : 'Order not found.',
            errorQuantity : 'Requested quantity is not available.',
        },
        customer : {
            findAll : 'Customers retrieved successfully.',
            findOne : 'Customer retrieved successfully.',
            create : 'Customer created successfully.',
            update : 'Customer updated successfully.',
            delete : 'Customer deleted successfully.',
            emailAlreadyExist : 'Customer email is already exist.',
            notFound : 'Customer not found.',
        },
    }
};

export default Constants;