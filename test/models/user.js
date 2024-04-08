const registrationSchema = {
    first_name: {
        type: 'string',
        min: 3,
        max: 50,
        optional: false,
        messages: {
            required: "Nama awal harus ada",
            string: "Nama awal harus dalam format string",
            stringMin: "Nama awal terlalu pendek",
            stringMax: "Nama awal terlalu panjang"
        }
    },
    last_name: {
        type: 'string',
        min: 3,
        max: 50,
        optional: false,
        messages: {
            required: "Nama akhir harus ada",
            string: "Nama akhir harus dalam format string",
            stringMin: "Nama akhir terlalu pendek",
            stringMax: "Nama akhir terlalu panjang"
        }
    },
    email: {
        type: 'email',
        optional: false,
        messages: {
            required: "Email harus ada",
            email: "Parameter email tidak sesuai format"
        }
    },
    password: {
        type: 'string',
        min: 8,
        optional: false,
        messages: {
            required: "Password harus ada",
            string: "Password harus dalam format string",
            stringMin: "Password terlalu pendek",
        }
    }
}

const loginSchema = {
    email: {
        type: 'email',
        optional: false,
        messages: {
            required: "Email harus ada",
            email: "Parameter email tidak sesuai format"
        }
    },
    password: {
        type: 'string',
        optional: false,
        messages: {
            required: "Password harus ada",
            string: "Password harus dalam format string",
        }
    }
}

const profileUpdateSchema = {
    first_name: {
        type: 'string',
        min: 3,
        max: 50,
        optional: false,
        messages: {
            required: "Nama awal harus ada",
            string: "Nama awal harus dalam format string",
            stringMin: "Nama awal terlalu pendek",
            stringMax: "Nama awal terlalu panjang"
        }
    },
    last_name: {
        type: 'string',
        min: 3,
        max: 50,
        optional: false,
        messages: {
            required: "Nama akhir harus ada",
            string: "Nama akhir harus dalam format string",
            stringMin: "Nama akhir terlalu pendek",
            stringMax: "Nama akhir terlalu panjang"
        }
    },
}

module.exports = {registrationSchema, loginSchema, profileUpdateSchema};