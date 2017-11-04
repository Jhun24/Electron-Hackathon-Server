/**
 * Created by janghunlee on 2017. 11. 4..
 */
module.exports = payphone;

function payphone(app ,request) {
    app.get('/location/payphone',(req,res)=>{
        "use strict";
        var userData = [];
        var num = 0;
        for(var i = 100; i<1001; i+=100){
            var options = {
                url: 'https://openapi.naver.com/v1/search/local.json?display=100&start='+i+'&query='+encodeURI("광주공중전화"),
                headers: {
                    'X-Naver-Client-Id': 'djXqKlGSzwJRLfpChMsX',
                    'X-Naver-Client-Secret':'pRfku1I1au'
                },
            };

            request.get(options,(err,response,body)=>{
                "use strict";
                if(err) throw err;

                var payphoneData = JSON.parse(body);
                var parseData = payphoneData["items"];

                if(parseData.length == 0){
                    res.send(404,"Data not found");
                }
                else{
                    for(var e = 0; e<parseData.length; e++){
                        userData[num] = {
                            "title":parseData[e]["title"].replace(/<b>/gm," ").replace(/<\/b>/gm," ").replace("(우 )"," ").replace(/\(옥외\)/gm," ").replace(/\(옥내\)/gm," "),
                            "address":parseData[e]["address"].replace("<b>","").replace("</b>",""),
                            "x":parseData[e]["mapx"],
                            "y":parseData[e]["mapy"]
                        };
                        num++;
                    }
                }

            });
        }

        setTimeout(function () {
            res.send(userData);
        },1000)
    });
}

