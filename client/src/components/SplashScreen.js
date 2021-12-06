import { Link } from 'react-router-dom'

export default function SplashScreen() {
    return (
        <div id="splash-screen">
            <div style = {{marginBottom: "3rem"}}>
                    Welcome to Top 5 Lister!
            </div>
            
            <button id = "splash-button"
                style = {{marginBottom: "1rem"}}>
                    <Link to='/login/'>Log In</Link>
            </button>   
            <button id = "splash-button"
                style = {{marginBottom: "1rem"}}
                >
                    <Link to='/register/'>Create Account</Link>
            </button>
            <button id = "splash-button"
                style = {{marginBottom: "2rem"}}
                >
                    Continue as Guest
            </button>

            <div id = "splash-introduction"
                >
                This an application where users can list their five favority anything as well as lists made by other users and even see the aggregate top 5 lists of all users for a given category
            </div>

            <div id = "splash-developer">
                Developed By Wengan Ou
            </div>
            
        </div>
    )
}