import './App.css'
import { Route, Routes } from 'react-router-dom';
import IndexPage from "./pages/IndexPage";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './Layout';
import axios from "axios";
import { UserContextProvider } from './UserContext';
import ProfilePage from './pages/ProfilePage';
import EventsPage from './pages/EventsPage';
import EventsFormPage from './pages/EventsFormPage';
import EventPage from './pages/EventPage';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import BookingsPage from "./pages/BookingsPage";
import BookingPage from "./pages/BookingPage";

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

function App() {
  const initialOptions = {
    "client-id": "ASd9LAt1YHs7rCWni76tw0MumbKUqFJlqwQhbIpa4Tw5QRDBPYKnQqVSZCSZJgSsurwOBR9OlkFCU_IK",
    currency: "EUR",
    intent: "capture",
    "disable-funding": "credit,sofort,card",
  };
  return (
    <PayPalScriptProvider options={initialOptions}>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account/" element={<ProfilePage />} />
            <Route path="/account/events" element={<EventsPage />} />
            <Route path="/account/events/new" element={<EventsFormPage />} />
            <Route path="/account/events/:id" element={<EventsFormPage />} />
            <Route path="/events/:id" element={<EventPage />} />
            <Route path="/account/bookings" element={<BookingsPage />} />
            <Route path="/account/bookings/:id" element={<BookingPage />} />
          </Route>
        </Routes>
      </UserContextProvider>
    </PayPalScriptProvider>

  )
}

export default App
