import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import { prisma } from "@/lib/prisma";

async function getApprovedFeedback() {
  try {
    const feedback = await prisma.feedback.findMany({
      where: { approved: true },
      include: { project: { select: { category: true } } },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
    return feedback.map((f) => ({
      clientName: f.clientName,
      rating: f.rating,
      comment: f.comment,
      category: f.project?.category,
    }));
  } catch {
    return [];
  }
}

export default async function Home() {
  const testimonials = await getApprovedFeedback();

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProcessSection />
        <TestimonialsSection testimonials={testimonials.length > 0 ? testimonials : undefined} />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

