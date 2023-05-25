import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import BookingWidget from "../BookingWidget";
import EventGallery from "../EventGallery";
import AddressWidget from "../AddressWidget";

export default function EventPage() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/events/' + id).then(response => {
            setEvent(response.data);
        });
    }, [id]);

    if (!event) return '';
    return (
        <div className="mt-4 bg-gray-100 -mx-8 md:mx-8 lg:mx-80 px-8 py-8">
            <div className="">
            <h1 className="text-3xl">{event.title}</h1>
            <AddressWidget>{event.address}</AddressWidget>
            <EventGallery event={event}/>

            <div className=" mt-8 grid gap-4 grid-cols-1 md:grid-cols-[2fr_1fr]">
                <div>
                    <div className="my-4">
                        <h2 className="font-semibold text-2xl">Descripción</h2>
                        {event.description}
                    </div>
                    Día del evento: {event.checkInDate}<br />
                    Horario del evento: {event.checkInTime}<br />
                    Máximo de asistentes: {event.maxGuests}<br />
                </div>
                <div>
                    <BookingWidget event={event} />
                </div>
            </div>
            <div className="border rounded-2xl bg-sky-100 mt-4">
                <div className="p-2">
                    <h2 className="font-semibold text-2xl">Información adicional</h2>
                    <div className="mb-4 mt-1 text-sm text-gray-700 leading-4">{event.info}</div>
                </div>
            </div>
            </div>
        </div>
    );
}