import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const Login = ({ onClose }) => {
    return (
        <div className="overlay" onClick={onClose}>
            <div className="login" onClick={(e) => e.stopPropagation()}>
                <div className="login-container">
                    <div className="login-header">
                        <h2>Sign in</h2>
                        <FontAwesomeIcon icon={faXmark} onClick={onClose} />
                    </div>
                    <form className="login-form" action="#">
                        <div className="login-email">
                            {/* <label htmlFor="">Email</label> */}
                            <input type="email" placeholder="email@domain.com" required />
                        </div>
                        <div className="login-password">
                            {/* <label htmlFor=""></label> */}
                            <input type="password" placeholder="password" required />
                        </div>
                        <button className="login-submit" type="submit">Sign in</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;