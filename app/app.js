const express = require('express')
const app = express()
const sqlite3 = require('sqlite3')
const path = require('path')
const bodyPaser = require('body-parser')
const { resolve } = require('path')
const { rejects } = require('assert')

const dbPath = "app/db/database.sqlite3"


// リクエストのbodyをパースする設定
app.use(bodyPaser.urlencoded({extended: true}))
app.use(bodyPaser.json())

// publicディレクトリを静的ファイル群のルートディレクトリに設定
app.use(express.static(path.join(__dirname, 'public')))


//Get all users
app.get('/api/v1/users', (req, res) => {
  // Connect database
  const db = new sqlite3.Database(dbPath)
  db.all('SELECT * FROM users',(err,rows) =>{
    res.json(rows)
  })
  db.close()
})
//Get a user
app.get('/api/v1/users/:id', (req, res) => {
  // Connect database
  const db = new sqlite3.Database(dbPath)
  const id = req.params.id
  db.get(`SELECT * FROM users WHERE id =${id}`,(err,row) =>{
    res.json(row)
  })
  db.close()
})



//Search users matching keywords
app.get('/api/v1/search', (req, res) => {
  // Connect database
  const db = new sqlite3.Database(dbPath)
  const keywords = req.query.q
  db.all(`SELECT * FROM users WHERE name LIKE "%${keywords}%"`,(err,rows) =>{
    res.json(rows)
  })
  db.close()
})

//Create anew user
app.post('/api/v1/users', async (req, res) => {
  // Connect database
  const db = new sqlite3.Database(dbPath)
  // console.log(req.body)

  const name = req.body.name
  const profile = req.body.profile ? req.body.profile : ""
  const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : ""
  
  const run = async (sql) => {
    return new Promise((resolve, reject) => {
      db.run(sql,(err) =>{
        if (err) {
          res.status(500).send(err)
          return reject()
        } else {
          res.json({message: "新規ユーザーを作成しました！"})
          return resolve()
        }
      })
    })
  }
  console.log(name)
  console.log(profile)
  console.log(dateOfBirth)
  await run(`INSERT INTO users (name, profile, date_of_birth) VALUES ("${name}","${profile}","${dateOfBirth}")`)
  db.close()

})



const port = process.env.PORT||3000;
app.listen(port)
console.log("Listen on port: " + port)