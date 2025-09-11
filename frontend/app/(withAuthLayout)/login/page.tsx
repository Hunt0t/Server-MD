import Login from "@/components/auth-section/Login";
import Navbar from "@/components/shared/Navbar/Navbar";

export const metadata = {
  title: "Login - My Website",
  description: "Access your account securely on My Website.",
};
const LoginPage = () => {
  return (
    <div>
      <Navbar/>
      <Login/>
    </div>
  )
}

export default LoginPage