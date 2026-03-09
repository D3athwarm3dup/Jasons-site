import Navbar from "@/components/NavbarServer";
import Footer from "@/components/Footer";
import FeedbackForm from "./FeedbackForm";

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <>
      <Navbar />
      <FeedbackForm token={token} />
      <Footer />
    </>
  );
}
