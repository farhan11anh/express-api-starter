const fetchModel = require('../models/users');
module.exports = {
    fetchData:function(req,res){
        fetchModel.fetchData(function(data){
            res.json(data);
        });
    }
}