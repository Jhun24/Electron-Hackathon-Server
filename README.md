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
    
> require

    email : 유저 이메일
    
    pw : 유저 비밀번호

> request

    Error : 400 , "Error message"
    
    Success : 200 , user Schema
    
>> : POST /auth/register

> require

    email : 유저 이메일
    
    pw : 유저 비밀번호
    
    name : 유저 이름
    
> request

    Error : 400 , "Error message"
        
    Success : 200 , user Schema
    
## /location

>> : GET /location/payphone

> require
    
    없음
    
> request

    주변 공중전화 위치
    
>> : GET /location/chargingStation

> require
    
    없음
    
> request

    주변 전기차충전소 위치
    
## /pay

>> : POST /pay/addCard

> require

    token : 유저 토큰
    
    cardNum : 카드 숫자 (0000-0000-0000-0000)
    
    cardPassword : 카드 비번 앞에 두자리
    
    cardBirthday : 유저 생년월일
    
    cardExpiry : 카드 만료기간 (2020-09)

> response

    Error : 500 , "error message"
        
    Success : 200

>> : POST /pay/payment

> require

    token : 유저 토큰
    
    amount : 지불가격
    
> response

    Error : 404 , "error message"
    
    Error : 409 , "error message"
        
    Success : 200
    
>> : POST /pay/charge
   
> require

    token : 유저 토큰
    
    amount : 충전할 금액
    
> response

    Error : 404 , "error message"
            
    Success : 200
 
>> : GET /pay/paymentList

> require

    token : 유저 토큰

> response

    Error : 404 , "error message"
            
    Success : 200 , history Schema
