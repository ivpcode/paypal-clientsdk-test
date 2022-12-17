const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(cors())
app.use(express.json()) // for parsing application/x-www-form-urlencoded

app.options('*', cors())

app.post ('/', async (req, res) => {

	console.log(req.body)

	res.send(200)
})

const paypal_app_client_id = "AbOe348VDIwiBu0VAmTPqkkDyw9SfXDa_9a9g1NPnr9E4JkHiwCrR81A_hyxg0pvs2AW-RBU80J3v9vo"
const paypal_app_secret = "EPracwYRGnoqxwX90dvJjhyaX0ugBdkV1SL3_fFu9rPqRuqVGY6wIB6cON_UFYPX5iJxuO14tlbETMLH"


app.post ('/api/purchase/create', async (req, res) => {

	let product_code = req.body.product_code	

	res.json({
		order_hash: "ORDER_HASH_"+(new Date()).getTime(),
		order_amount: 10,
		order_description: "Order description"
	})
})

app.post ('/api/purchase/confirm', async (req, res) => {

	let payapal_oder_id = req.body.id
	let local_purchase_id = req.body.purchase_units[0].custom_id		// Lo può utilizzare per trovare l'ordine a database

	try {

		let ret = await axios.post("https://api-m.sandbox.paypal.com/v1/oauth2/token",{
				grant_type: "client_credentials"
			},{
				auth: {
					username: paypal_app_client_id,
					password: paypal_app_secret
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}				
			}
		)
		let paypal_access_token = ret.data.access_token

		ret  = await axios.get("https://api.sandbox.paypal.com/v2/checkout/orders/"+payapal_oder_id, {
			headers: {'Authorization': 'Bearer '+paypal_access_token}	
		})

		console.log(ret.data)
	}
	catch (Ex) {
		console.error(Ex)
	}
	res.send(200)
})

app.listen(12001)
