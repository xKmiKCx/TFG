import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [terms, setTerms] = useState(false);
    const [redirect, setRedirect] = useState(null);
    const [human, setHuman] = useState(null);

    function validate(value) {
        setHuman(value);
    }

    async function registerUser(ev) {
        ev.preventDefault();
        if (human != null) {
            if (terms) {
                try {
                    await axios.post('/register', {
                        name,
                        email,
                        password,
                    });
                    setRedirect('/login');
                } catch (e) {
                    alert('Resgistro fallido. Pruebe de nuevo más tarde.');
                }
            } else {
                alert('Debe aceptar los términos y condiciones.');
            }
        } else {
            alert('Por favor, confirme que es humano.');
        }

    }
    if (redirect) {
        return <Navigate to={redirect} />
    }
    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="-mt-64">
                <h1 className="text-4xl text-center mb-4">Registro</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={ev => setName(ev.target.value)}
                        required />
                    <input type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={ev => setEmail(ev.target.value)}
                        required />
                    <input type="password"
                        placeholder="password"
                        value={password}
                        onChange={ev => setPassword(ev.target.value)}
                        required />
                    <div className="flex gap-1 items-center justify-center ">
                        <label className="p-4 flex rounded-2xl gap-2 cursor-pointer">
                            <input type="checkbox"
                                value={terms}
                                onChange={ev => setTerms(ev.target.value)} />
                        </label>
                        Acepto los Términos y Condiciones.
                    </div>
                    <div className="flex gap-1 items-center justify-center mb-3">
                        <ReCAPTCHA sitekey="6LdVKCYmAAAAAB1X3LuxEWw50a4NPXxonsDtjQbk" onChange={validate} />
                    </div>
                    <button className="primary" disabled={!human}>Registrarme</button>
                    <div className="text-center py-2 text-gray-500">
                        ¿Ya tienes cuenta? <Link className="underline text-black" to={'/login'}>Accede ahora.</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}