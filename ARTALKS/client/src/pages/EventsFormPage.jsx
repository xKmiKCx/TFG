import { useEffect, useState } from "react";
import Perks from "../Perks";
import Photos from "../Photos";
import axios from "axios";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";

export default function EventsFormPage() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [photos, setPhotos] = useState([]);
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [info, setInfo] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkInTime, setCheckInTime] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [price, setPrice] = useState(10);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/events/' + id).then(response => {
            const { data } = response;
            setTitle(data.title);
            setAddress(data.address);
            setPhotos(data.photos);
            setDescription(data.description);
            setPerks(data.perks);
            setInfo(data.info);
            setCheckInDate(data.checkInDate);
            setCheckInTime(data.checkInTime);
            setMaxGuests(data.maxGuests);
            setPrice(data.price);

        })
    }, [id]);

    function inputHeader(text) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }
    function inputDescription(text) {
        return (
            <p className="text-gray-400 text-sm">{text}</p>
        );
    }
    function preTitle(header, description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        );
    }
    async function saveEvent(ev) {
        ev.preventDefault();
        const eventData = {
            title, address, photos,
            description, perks, info,
            checkInDate, checkInTime, maxGuests,
            price
        };
        if (id) {
            await axios.put('/events', {
                id, ...eventData
            });
            setRedirect(true);
        } else {
            await axios.post('/events', eventData);
            setRedirect(true);
        }

    }
    if (redirect) {
        return <Navigate to={'/account/events'} />
    }
    return (
        <div>
            <AccountNav />
            <form onSubmit={saveEvent}>
                {preTitle('Titulo', 'Indique, en pocas palabras, la temática de su evento.(Ejemplo: Experiencia Barroco)')}
                <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="title" required />
                {preTitle('Dirección', 'Indique el lugar donde se realizará el evento.(Ejemplo: Museo del Prado / Calle Luis Becerra, 24 29119 Madrid)')}
                <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="address" required />
                {preTitle('Imagenes', 'Añada imagenes para contextualizar el evento de forma visual. Cuantas más añada, mejor.')}
                <Photos photos={photos} onChange={setPhotos} />
                {preTitle('Descripción', 'Detalle en que consistirá su evento. Cuanta mas información aporte, más aceptación recibirá su evento.')}
                <textarea value={description} onChange={ev => setDescription(ev.target.value)} required />
                {preTitle('Ventajas', 'Seleccione las ventajas que ofrecerá para su evento. Cuantas más mejor.')}
                <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                    <Perks selected={perks} onChange={setPerks} />
                </div>
                {preTitle('Información adicional', 'Especifica si los asistentes a tu evento deben tener algo preparado o que les ayude durante el transcurso del mismo.')}
                <textarea value={info} onChange={ev => setInfo(ev.target.value)} />
                {preTitle('Horarios y Asistentes', 'Especifica la hora de entradas y salida de tu evento, así como sus asistentes máximos permitidos.')}
                <div className="grid gap-2 sm:grid-cols-3">
                    <div>
                        <h3 className="mt-2 -mb-1">Día del evento</h3>
                        <input type="text"
                            value={checkInDate}
                            onChange={ev => setCheckInDate(ev.target.value)}
                            placeholder="14:00"
                            required />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Horario del evento</h3>
                        <input type="text"
                            value={checkInTime}
                            onChange={ev => setCheckInTime(ev.target.value)}
                            placeholder="16:00"
                            required />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Asistentes máximos</h3>
                        <input type="number"
                            value={maxGuests}
                            onChange={ev => setMaxGuests(ev.target.value)}
                            placeholder="2"
                            required />
                    </div>
                </div>
                {preTitle('Precio por persona', 'Especifica el precio por persona de tu evento.')}
                <input type="number"
                    value={price}
                    onChange={ev => setPrice(ev.target.value)}
                    placeholder="15"
                    required />
                <button className="primary my-4">Guardar</button>
            </form>
        </div>
    );
}