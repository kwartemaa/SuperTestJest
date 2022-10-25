import request from "supertest";
import { baseUrl } from "../../supertest.config";

let accessToken: string
describe("tests", ()=>{
    beforeAll( async()=>{
       const authentication = "/api-clients/"
       const user ={
        "clientName": "Annie",
        "clientEmail": 'annie'+ new Date().getTime()+"@amalitech.com"
       }
       
       const authResponse = await request(baseUrl).post(authentication).send(user)
       accessToken = authResponse.body.accessToken

    })
    it('should check API status', async()=>{
        const status = "/status"
        const response = await request(baseUrl).get(status).expect(200)
        const statusMessage = response.body
        expect(statusMessage).toHaveProperty("status","OK")

    })

    it('should get a list of books', async()=>{
        const books = "/books"
        const response = await request(baseUrl).get(books).expect(200)
        const listOfBooks  = response.body
        const thirdBook = listOfBooks[2]
        expect(thirdBook).toHaveProperty("id", 3)
        expect(thirdBook).toHaveProperty("name","The Vanishing Half")
    })

    it('should get a single book', async()=>{
        const oneBook = "/books/1"
        const response = await request(baseUrl).get(oneBook).expect(200)
        const firstBook = response.body
        expect(firstBook).toHaveProperty("id", 1)
    })
    
    it('should submit an order', async()=>{
        const order = "/orders"
        const bookOrder = 
        {
            "bookId": "1",
            "customerName": "Anita"
        }
        const response = await request(baseUrl).post(order).set("Authorization", accessToken).send(bookOrder).expect(201)
        const orderStatus = response.body
        expect(orderStatus).toHaveProperty("orderId")
        expect(orderStatus).toHaveProperty("created", true)
    })

    it('should get all orders', async()=>{
        const orders = "/orders"
        const response = await request(baseUrl).get(orders).set("Authorization", accessToken).expect(200)
        const orderSummary = response.body
        expect (orderSummary[0]).toHaveProperty("bookId", 1)
        expect(orderSummary[0]).toHaveProperty("customerName", "Anita")
        console.log(orderSummary)
    })

    
})