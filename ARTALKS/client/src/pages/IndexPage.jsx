import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function IndexPage() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    axios.get('/events').then(response => {
      setEvents([...response.data]);
    });
  }, []);
  return (
    <div className="mt-8 gap-x-6 gap-y-8 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {events.length > 0 && events.map(event => (
        <Link to={'/events/' + event._id} className="border shadow-md p-4 rounded-2xl" key={event._id}>
          <div className="bg-gray-200 mb-2 rounded-2xl flex">
            {event.photos?.[0] && (
              <img className="rounded-2xl object-cover aspect-square" src={'http://localhost:4000/uploads/' + event.photos?.[0]} />
            )}
          </div>
          <h3 className="font-bold leading-4">{event.address}</h3>
          <h2 className="text-sm text-gray-500">{event.title}</h2>
          <div className="mt-1">
            <span className="font-bold">{event.price}€</span> por persona</div>
        </Link>
      ))}
    </div>
  );
}
