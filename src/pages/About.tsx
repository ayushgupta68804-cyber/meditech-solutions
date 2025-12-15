import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Target, Eye, Heart, Award, Users, Zap } from "lucide-react";

const About = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-block rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
                About Us
              </span>
              <h1 className="mt-4 font-heading text-4xl font-bold text-foreground md:text-5xl">
                Transforming Pharmacy Management
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                MediTeck is a comprehensive medical store management solution
                designed to streamline pharmacy operations and enhance customer
                service.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="card-medical">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-primary">
                  <Target className="h-7 w-7 text-primary-foreground" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Our Mission
                </h2>
                <p className="mt-4 text-muted-foreground">
                  To empower medical stores and pharmacies with cutting-edge
                  technology that simplifies inventory management, enhances
                  billing processes, and ensures better patient care through
                  accurate medicine tracking and smart alerts.
                </p>
              </div>

              <div className="card-medical">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-accent">
                  <Eye className="h-7 w-7 text-primary-foreground" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Our Vision
                </h2>
                <p className="mt-4 text-muted-foreground">
                  To become the leading pharmacy management solution in India,
                  helping thousands of medical stores operate efficiently while
                  maintaining the highest standards of healthcare and customer
                  service.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-muted/50 py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
                Our Core Values
              </h2>
              <p className="mt-4 text-muted-foreground">
                The principles that guide everything we do at MediTeck.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  Patient Safety
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ensuring accurate medicine tracking to protect patient health.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  Excellence
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Delivering high-quality software with attention to detail.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  Customer Focus
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Building features that solve real pharmacy challenges.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  Innovation
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Leveraging AI and modern tech for smarter solutions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20">
          <div className="container">
            <div className="grid gap-8 text-center md:grid-cols-4">
              <div>
                <div className="font-heading text-4xl font-bold text-primary md:text-5xl">
                  500+
                </div>
                <div className="mt-2 text-muted-foreground">Active Stores</div>
              </div>
              <div>
                <div className="font-heading text-4xl font-bold text-primary md:text-5xl">
                  50K+
                </div>
                <div className="mt-2 text-muted-foreground">
                  Medicines Tracked
                </div>
              </div>
              <div>
                <div className="font-heading text-4xl font-bold text-primary md:text-5xl">
                  1M+
                </div>
                <div className="mt-2 text-muted-foreground">
                  Transactions Processed
                </div>
              </div>
              <div>
                <div className="font-heading text-4xl font-bold text-primary md:text-5xl">
                  99.9%
                </div>
                <div className="mt-2 text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
