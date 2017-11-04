/**
 * Created by janghunlee on 2017. 11. 4..
 */
module.exports = pay;
function pay(app , userModel , historyModel , iamporter , randomstring , IamporterError) {

    app.post('/pay/addCard',(req,res)=>{
        "use strict";
        var data = req.body;

        userModel.find({"token":data.token},(err,model)=>{
            if(err) throw err;
            if(model.length == 0){
                res.send(404,"user not found");
            }
            else{
                userModel.update({$set:{"cardNum":data.cardNum,"cardPassword":data.cardPassword,"cardBirthday":data.cardBirthday,"cardExpiry":data.cardExpiry}},(err,model)=>{
                    if(err) throw err;
                    res.send(200);
                });
            }
        });
    });

    app.post('/pay/payment',(req,res)=>{
        "use strict";
        var data = req.body;

        userModel.find({"token":data.token},(err,model)=>{
            if(err) throw err;
            if(model.length == 0){
                res.send(404,"user not found");
            }
            else{
                var userMoney = model[0]["cardMoney"] - data.amount;

                if(userMoney < 1){

                    res.send(409,"i need money");
                }
                else{
                    userMoney.update({"token":data.token},{$set:{"cardMoney":userMoney}},(err,model)=>{
                        if(err) throw err;
                        var d = new Date();

                        var month = d.getMonth() + 1;
                        var min = d.getMinutes() + 1;
                        var date = d.getFullYear()+"/"+month+"/"+d.getDay()+"/"+min+"/"+d.getSeconds();

                        var saveHistory = new historyModel({
                            "token":data.token,
                            "amount":data.amount,
                            "date":date
                        });

                        saveHistory.save((err,model)=>{
                            if(err) throw err;
                            res.send(200);
                        });
                    });
                }

            }
        });
    });

    app.post('/pay/charge',(req,res)=>{
        "use strict";
        var data = req.body;

        userModel.find({"token":data.token},(err,model)=>{
            if(err) throw err;
            if(model.length == 0){
                res.send(404,"user not found");
            }
            else{
                console.log(model);

                iamporter.payOnetime({
                    'merchant_uid':randomstring.generate(10),
                    'amount':data.amount,
                    'card_number': model[0]["cardNum"],
                    'expiry': model[0]["cardExpiry"],
                    'birth': model[0]["cardBirthday"],
                    'pwd_2digit':model[0]["cardPassword"]
                }).then(result => {
                    console.log(result);
                }).catch(err => {
                    if (err instanceof IamporterError){
                        console.log(err);
                    }
                });

                userModel.update({"token":data.token},{$set:{"cardMoney":data.amount}},(err,model)=>{
                    if(err) throw err;
                    res.send(200);
                });

            }
        });
    });

    // app.post('/pay/payment',(req,res)=>{
    //     "use strict";
    //     var data = req.body;
    //
    //     userModel.find({"token":data.token},(err,model)=>{
    //         if(err) throw err;
    //         if(model.length == 0){
    //             res.send(404,"user not found");
    //         }
    //         else{
    //             console.log(model);
    //
    //
    //             iamporter.payOnetime({
    //                 'merchant_uid':randomstring.generate(10),
    //                 'amount': data.amount,
    //                 'card_number': model[0]["cardNum"],
    //                 'expiry': model[0]["cardExpiry"],
    //                 'birth': model[0]["cardBirthday"],
    //                 'pwd_2digit':model[0]["cardPassword"]
    //             }).then(result => {
    //                 console.log(result);
    //             }).catch(err => {
    //                 if (err instanceof IamporterError){
    //                     console.log(err);
    //                 }
    //             });
    //
    //             var d = new Date();
    //
    //             var month = d.getMonth() + 1;
    //             var min = d.getMinutes() + 1;
    //             var date = d.getFullYear()+"/"+month+"/"+d.getDay()+"/"+min+"/"+d.getSeconds();
    //
    //             var saveHistory = new historyModel({
    //                 "token":data.token,
    //                 "amount":data.amount,
    //                 "date":date
    //             });
    //
    //             saveHistory.save((err,model)=>{
    //                 if(err) throw err;
    //                 res.send(200);
    //             });
    //
    //         }
    //     });
    // });

    app.get('/pay/paymentList',(req,res)=>{
        "use strict";
        var token = req.query.token;

        historyModel.find({"token":token},(err,model)=>{
            if(err) throw err;
            if(model.length == 0){
                res.send(404,"data not found");
            }
            else{
                res.send(200,model);
            }
        });
    });

}