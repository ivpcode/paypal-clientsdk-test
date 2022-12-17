// <script src="https://www.paypal.com/sdk/js?&client-id=AbOe348VDIwiBu0VAmTPqkkDyw9SfXDa_9a9g1NPnr9E4JkHiwCrR81A_hyxg0pvs2AW-RBU80J3v9vo&merchant-id=XB8P386GTFLBQ&currency=EUR"></script>

export default class PayPalLib {

	// AbOe348VDIwiBu0VAmTPqkkDyw9SfXDa_9a9g1NPnr9E4JkHiwCrR81A_hyxg0pvs2AW-RBU80J3v9vo
	// XB8P386GTFLBQ
	static async Init(ClientID, MerchatID, Currency) {
		if(window.paypal != null)
			return

		console.log("Init")
		if (Currency == null)
			Currency = "EUR"

		let sc = document.createElement('script'); 
		sc.type = 'text/javascript'; 
		
		sc.src = `https://www.paypal.com/sdk/js?&client-id=${ClientID}&merchant-id=${MerchatID}&currency=${Currency}`;
		let script_section = document.getElementsByTagName('script')[0]; 
		script_section.parentNode.insertBefore(sc, script_section);
		
		return new Promise((resolve)=>{
			let time_elapsed = 0
			let h = setInterval(()=> {			
				if(window.paypal != null) {
					clearInterval(h) 
					resolve(true)		
					return			
				}
				time_elapsed += 500
				// Attendiamo paypal massimo 20 sec
				if (time_elapsed > 500*2*10) {
					clearInterval(h) 
					resolve(false)		
					return			
				}
			}, 500)
		})
	}

	static async Checkout(paypal_buttons_container_id, order_hash, product_amount, product_description) {
		return new Promise( async (resolve) => {
			window.paypal.Buttons({

				createOrder: async (data, actions) => {
					// Qua potrebbe chiamare il server per ottenere il order_hash
										
					return actions.order.create({
						purchase_units: [{
							amount: {
								value: product_amount
							},

							// Order hash tornato dal server >> OCCHIO max 127 chars
							// https://developer.paypal.com/docs/api/orders/v2/#definition-purchase_unit_request
							custom_id: order_hash ,
							description: product_description,

						}]
					});
				},

				onApprove: async (data, actions) => {
					let orderData = await actions.order.capture()
					
					resolve({ result: 'success', data: orderData })
				},

				onCancel: async (data) => {											
					
					resolve({ result: 'cancel', data: data })
				},

				onError: async (err) => {											
					
					resolve({ result: 'error', data: err })
				},

			}).render('#'+paypal_buttons_container_id)
		})
	}

}

window.PayPalLib = PayPalLib