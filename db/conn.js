const express = require("express")
const app =express()
app.use(express.json())
const PORT  = 6001
const {Pool} = require("pg")

const pool = new Pool({
    user: 'justi',
    password: "Justin#127166",
    host: "localhost",
    port: 5432,
    database: "tracker"
})
app.use(express.static("public"))


app.get('/all', async(req,res)=>{
    try{
        const{rows} = await pool.query('SELECT * FROM goals')
        res.send(rows)
    }catch(error){
        console.error(error)
    }
})

app.get('/getone/:id', async(req,res)=>{
    try{
        const {id} = req.params
        const{rows} = await pool.query('SELECT * FROM goals WHERE id = $1', [id])
        res.send(rows)
    }catch(error){
        res.status(500).send(error.messages)
    }
})


app.post('/post', async (req,res)=>{
    try{
        const {goal} = req.body
        const {rows} = await pool.query('INSERT INTO goals (goal) VALUES ($1)RETURNING *', [goal])
        res.send(rows)
    }catch(error){
        console.error(error)
    }
})

app.delete('/delete/:id', async(req,res)=>{
    try{
        const {id} = req.params
        const {rows} = await pool.query('DELETE FROM goals WHERE id = $1 RETURNING *', [id])
        res.send(rows)
    }catch(error){
        res.status(500).send(error.message)
    }
})


app.patch('/patch/:id', async(req,res)=>{
    try{
        const {id} = req.params
        const {goal} = req.body
        const {rows} = await pool.query('UPDATE goals SET goal = $1 WHERE id = $2 RETURNING *', [goal, id])
        res.send(rows)
    }catch(error){
        res.status(500).send(error.message)
    }
})









app.listen(PORT,()=>{
    console.log(`listening on port: ${PORT}`)
})