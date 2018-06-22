# TaiwanDailyStock
use nodejs for Taiwan stock data


# TWSE Reqeuest
   - fetch POST data from TWSE

# 預先準備
- install mongoDB https://docs.mongodb.com/manual/installation/
- install nodejs

# Install
    npm install
   - 根據 package.json 來安裝相依檔案

# Check
    node showDBData.js 2330 2018 01
   - 這個指令會把 MongoDB 內的台積電(2330) 2018年的1月資料都噴出來, 但如果你裡面沒有會回傳一個空的陣列

# Run
    node app.js
   - 根據 twse_company_list 來爬資料到 MongoDB
   - 會跑在背景, ssh 斷了也沒關係, ps aux | grep node 可以看到

# 調整一些參數
   - 設定要抓的時間 app.js 內的 genParaList
   - 修改 progress.config 設定起始的公司以及時間
      

