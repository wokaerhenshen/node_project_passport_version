module.exports = {  
    // Database connection information
    'database': 'mongodb://xuwenjie410:xuwenjie360@ds013456.mlab.com:13456/kdnodeproject',
    'database_ignore': 'kdnodeproject',
    // Secret key for JWT signing and encryption
    'secret': 'super secret passphrase',

    // Setting port for server
    'port': process.env.PORT || 80   
};

//test