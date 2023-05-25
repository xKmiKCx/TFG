import { useContext, useEffect, useState } from "react";
import PayPalPayment from "./paypal/PayPalPayment";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./UserContext";

export default function BookingWidget({ event }) {
    const [numberGuests, setNumberGuests] = useState(1);
    const [showPayPal, setShowPayPal] = useState('');
    const [redirect, setRedirect] = useState('');

    const checkInDate = event.checkInDate;
    const checkInTime = event.checkInTime;

    const { user } = useContext(UserContext);

    let finalPrice = event.price * numberGuests;

    async function bookEvent() {
        const response = await axios.post('/bookings', {
            event: event._id,
            checkInDate,
            checkInTime,
            numberGuests,
            finalPrice
        });
        const bookingID = response.data._id;
        setRedirect(`/account/bookings/${bookingID}`);
    }
    async function showPayPalWidget() {
        if (user) {
            if (showPayPal) {
                setShowPayPal(false);
                //bookEvent()
            } else {
                setShowPayPal(true);
                //bookEvent()
            }
        } else {
            alert('Logueo necesario')
        }
    }
    if (redirect) {
        return <Navigate to={redirect} />
    }
    return (
        <div className="bg-white shadow p-4 rounded-2xl">
            <div className="text-2xl text-center">
                <label className="font-semibold">Precio: {event.price}€ </label>
                por persona
            </div>
            <div className="border rounded-2xl mt-4">
                <div className="flex grid grid-cols-2">
                    <div className="px-4 py-4 border-r">
                        <label className="font-semibold">Día del evento:</label>
                        <input type="text" disabled value={event.checkInDate} />
                    </div>
                    <div className="px-4 py-4">
                        <label className="font-semibold">Horario del evento:</label>
                        <input type="text" disabled value={event.checkInTime} />
                    </div>
                </div>
                <div className="px-4 py-4 border-t">
                    <label className="font-semibold">Asistentes</label>
                    <input type="number" value={numberGuests} onChange={ev => setNumberGuests(ev.target.value)} max={event.maxGuests} min={1} />
                </div>
            </div>
            <button onClick={() => showPayPalWidget()} className="primary mt-4">
                Reservar
                {numberGuests > 0 && (
                    <span> por {finalPrice}€</span>
                )}
            </button>
            {showPayPal === true && (
                <div className=" rounded-2xl mt-2 p-2">
                    <PayPalPayment event={event} finalPrice={finalPrice} />
                </div>
            )}
        </div>
    );
}