/**
 * Created by janghunlee on 2017. 11. 4..
 */
module.exports = payphone;

function payphone(app ,request , payphoneModel,LocData) {
    app.get('/location/payphone',(req,res)=>{
        "use strict";
        LocData.find({},(err,model)=>{
            if(err) throw err;
            res.send(model);
        });
    });
}

