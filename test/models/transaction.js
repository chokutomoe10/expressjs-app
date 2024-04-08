const topupSchema = {
    top_up_amount: {
        type: 'number',
        min: 0,
        optional: false
    },
}

const transactionSchema = {
    service_code: {
        type: 'string',
        optional: false
    },
};

module.exports = {topupSchema, transactionSchema};