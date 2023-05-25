import { PayPalButtons } from "@paypal/react-paypal-js";

export default function PayPalPayment(event, finalPrice) {
    const appURL = 'http://localhost:4000';
    const createOrder = (data) => {
        console.log(data);
        // Order is created on the server and the order id is returned
        return fetch(`${appURL}/create-paypal-order`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // use the "body" param to optionally pass additional order information
            // like product skus and quantities
            body: JSON.stringify({
                product: 
                    {
                        description: event._id,
                        cost: finalPrice,
                    },
            }),
        })
            .then((response) => response.json())
            .then((order) => order.id);
    };
    const onApprove = (data) => {
        console.log(data);
        // Order is captured on the server and the response is returned to the browser
        return fetch(`${appURL}/capture-paypal-order`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                orderID: data.orderID
            })
        })
            .then((response) => {
                console.log("Reserva realizada");
                return response.json();
            }).then((data) => console.log(data));
            
    };
    return (
        <PayPalButtons
            createOrder={(data, actions) => createOrder(data, actions)}
            onApprove={(data, actions) => onApprove(data, actions)}
        />
    );
}