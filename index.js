// fala que será usado o modulo express nesse arquivo
const express = require('express')
const cors = require('cors')
const uuid = require('uuid')
const port = 3002

// inicializamos o modulo do express
const app = express()
// quero usar o padrão json
app.use(express.json())

app.use((req, res, next) => {

    res.header("Access-Control-Allow-Origin", "https://example.com")
    res.header("Access-Control-Max-Age: 1800")
    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,POST,DELETE,PATCH")
    res.header("Access-Control-Allow-Headers", "Content-Type")
    res.header("'Access-Control-Allow-Credentials': true")
    // "preflightContinue", false
    // "optionsSuccessStatus", 204

    app.use(cors())
    next()
})



// criamos o servidor do express para escutar na porta 3001
// deixar uma mensagem no terminal


const orders = []

const checkIfExistId = (req, res, next) => {
    const { id } = req.params
    
    const index = orders.findIndex(newOrder => newOrder.id === id)

    if(index < 0) {
        return res.status(404).json({Error: "Order not found"})
    }

    req.newOrderIndex = index
    req.newOrderId = id


     next()
}

const showRequest = (req, res, next) => {
    console.log(req)
 
    next()
 
 }

app.get('/orders', cors(), showRequest, (req, res) => {
     return res.json(orders)
     console.log(orders)
})


app.post('/orders', cors(), showRequest, (req, res) => {
    const { order, clientName, price, status } = req.body

    const newOrder = { id: uuid.v4(), order, clientName, price, status }

    orders.push(newOrder)

    console.log(newOrder)

    return res.status(201).json(newOrder)
})

app.put('/orders/:id', cors(), showRequest, checkIfExistId, (req, res) => {
    
    const { order, clientName, price, status } = req.body
    const index = req.newOrderIndex
    const id = req.newOrderId 

    const updateNewOrder = { id, order, clientName, price, status }


    orders[index] = updateNewOrder

    console.log(updateNewOrder)

    return res.json(updateNewOrder)
})

app.delete('/orders/:id', cors(), checkIfExistId, (req, res) => {
    const index = req.newOrderIndex
    
    orders.splice(index,1)

    return res.status(204).json()
})

/* Pedido específico  */
app.get('/orders/:id', cors(),  checkIfExistId, (req, res) => {
    const index = req.newOrderIndex
    const id = req.newOrderId
    
    const { order, clientName, price, status } = req.body

    const updateNewOrder = { id, order, clientName, price, status }


    orders[index] = updateNewOrder

    return res.json(updateNewOrder)

    
})

app.patch('/orders/:id', cors(), showRequest, checkIfExistId , (req, res) => {
    const index = req.newOrderIndex
    const id = req.newOrderId 

    const { order, clientName, price, status } = req.body

    const changedOrder = { id, order, clientName, price, status }

    
    orders[index] = changedOrder

    console.log(changedOrder)

    return res.json(changedOrder)
})



app.listen(port, () => {
    console.log(` 🚀 Server started on port ${ port}`)
})