function SignInForm() { 
 

    return (
        <section className="login-section">
            <h2 className="sign-in-title">Sign In</h2>
            <form className="sign-in-form" >
                <label htmlFor="username" className="form-label"><em>username/email:</em></label>
                <input type="text" id="username" name="username" required></input>

                <label htmlFor="password" className="form-label" required><em>password:</em></label>
                <input type="password" id="password" name="password"></input>

                <button type="submit" className="login" onClick={(e)=>e.preventDefault()}>
                    Login
                </button>
            </form>
            <p>OR</p>
            <a href="" >Register for new account</a>
        </section>
    )
}

export default SignInForm;