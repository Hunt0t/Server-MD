import Registation from "@/components/auth-section/Registation";
import Container from "@/components/shared/Container/Container";
import Navbar from "@/components/shared/Navbar/Navbar";

export const metadata = {
    title: "Register - My Website",
    description: "Create an account on My Website and get started today.",
  };

const RegisterPage = () => {
  return (
    <Container>
       <Navbar/>
        <Registation/>
    </Container>
  )
}

export default RegisterPage