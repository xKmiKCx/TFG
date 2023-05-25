import { useState } from "react";

export default function EventsImg({ event }) {
    const [showPhotos, setShowPhotos] = useState(false);
    if (showPhotos) {
        return (
            <div className="absolute bg-black inset-0 min-h-screen">
                <div className=" bg-black p-7 grid justify-center gap-2">
                    <div>
                        <button onClick={() => setShowPhotos(false)} className=" fixed right-12 top-12 flex gap-2 py-2 px-4 rounded-2xl shadow shadow-black">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                            </svg>
                            Volver
                        </button>
                    </div>
                    {event?.photos?.length > 0 && event.photos.map(photo => (
                        <div key={photo}>
                            <img src={'http://localhost:4000/uploads/' + photo}/>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return (
        <div className="relative">
            <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-2xl overflow-hidden">
                <div>
                    {event.photos?.[0] && (
                        <div>
                            <img className="aspect-square object-cover" src={'http://localhost:4000/uploads/' + event.photos[0]} />
                        </div>
                    )}
                </div>
                <div className="grid">
                    {event.photos?.[0] && (
                        <img className="aspect-square object-cover" src={'http://localhost:4000/uploads/' + event.photos[1]} />
                    )}
                    <div className="overflow-hidden">
                        {event.photos?.[0] && (
                            <img className="aspect-square object-cover relative top-2" src={'http://localhost:4000/uploads/' + event.photos[2]} />
                        )}
                    </div>
                </div>
            </div>
            <button onClick={() => setShowPhotos(true)} className=" flex gap-1 absolute bottom-2 right-2 py-1 px-3 rounded-2xl bg-white shadow shadow-md shadow-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                Mostrar todas las imagenes</button>
        </div>
    );
}