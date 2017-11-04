/**
 * Created by janghunlee on 2017. 11. 4..
 */
module.exports = elecCar;

function elecCar(app,request,parseString) {

    app.get('/location/chargingStation',(req,res)=>{
        "use strict";
        request.get({"url":"http://open.ev.or.kr:8080/openapi/services/rest/EvChargerService?serviceKey=QP2h4bHuyL7jObG%2B92OQa%2F1vZLmO1wr9VqMkdwTP3IW80Ie%2F1Y7KTa0fbzRsQNYe3kdDtECUljR%2FWNuPDJTftQ%3D%3D"},(err,response,body)=>{
            if(err) throw err;
            console.log(body);
            parseString(body, function (err, result) {
                res.send(result)
            });
        });
    });
}