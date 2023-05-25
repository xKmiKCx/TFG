export default function EventsImg({ event, index = 0, className }) {
    if (!event.photos?.length) {
        return '';
    }
    if (!className) {
        className = 'object-cover';
    }
    return (
        <img className={className} src={'http://localhost:4000/uploads/' + event.photos[0]} />
    );
}