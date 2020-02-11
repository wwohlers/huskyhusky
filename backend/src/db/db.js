const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://admin:zBIhXvgnVMTHLsDM@cluster0-2kcdt.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

mongoose.set('useFindAndModify', false);