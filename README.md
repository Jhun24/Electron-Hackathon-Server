# Electron-Hackathon-Server
2017 KEPCO 일렉스톤 경진대회 - 해적왕 원준갓 팀 서버

# Schema

>> User Schema

    _id : String
    
    pw :String
    
    email : String
    
    name : String
    
    token : String
    
    accessToken : String
    
    cardNum : String
    
> EX : 1234-5678-1234-5678    
    
    cardPassword : String
    
> EX : 20
    
    cardBirthday : String
    
> EX : 980822  
    
    cardExpiry : String

> EX : 2020-09
    
>> History Schema

    token : String
    
    amount : String
    
    data : String
    
> EX : 년/월/일/시/분/초


## /auth

>> : POST /auth/login
    