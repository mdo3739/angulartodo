var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res){
    /*ToDo.findById(req.params.id, function(err, result){
        if(err) throw err;
        res.send(result);
    })*/
    ToDo.find({}, function(err, users) {
        res.send(users.reduce(function(userMap, item) {
            userMap[item.id] = item;
            return userMap;
        }, {}));
    });
});

module.exports = router;