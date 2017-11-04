/**
 * Created by janghunlee on 2017. 11. 4..
 */
module.exports = pay;
function pay(app , userModel , historyModel) {
    app.post('/pay/payment',(req,res)=>{
        "use strict";
        var data = req.body;

        userModel.findOne({"token":data.token},(err,model)=>{
            if(err) throw err;
            if(model.length == 0){
                res.send(404,"user not found");
            }
            else{
                var d = new Date();
                var month = d.getMonth() + 1;
                var min = d.getMinutes() + 1;
                data.name = model["name"];
                data.date = d.getFullYear()+"/"+month+"/"+d.getDay()+"/"+min+"/"+d.getSeconds();

                var saveHistroy = new historyModel(data);
                saveHistroy.save((err,model)=>{
                    if(err) throw err;
                    res.send(200);
                });
            }
        });

    });

    app.get('/pay/paymentList',(req,res)=>{
        "use strict";
        var token = req.param("token");

        historyModel.findOne({"token":token},(err,model)=>{
            if(err) throw err;
            if(model.length == 0){
                res.send(404,"user not found");
            }
            else{
                res.send(200,model);
            }
        });
    });
}