# TaiwanDailyStock
use nodejs for Taiwan stock data


# TWSE Reqeuest
   - fetch POST data from TWSE

# 預先準備
- install mongoDB https://docs.mongodb.com/manual/installation/
- install nodejs

# run
    - npm install
      安裝相依檔案
    - node showDBData.js 2330 2018 01
      看看DB內有沒有存 2330 在 2018 年 1 月的資料
    - node app.js
      根據 twse_company_list 來爬資料到 MongoDB
      會跑在背景, ssh 斷了也沒關係, ps aux | grep node 可以看到
      
# 調整一些參數
   - 設定要抓的時間 app.js 內的 genParaList
   - 修改 progress.config 設定起始的公司以及時間
      

