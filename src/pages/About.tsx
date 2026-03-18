import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const About = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-secondary py-12">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold text-foreground mb-4">
                About MediTech
              </h1>
              <p className="text-muted-foreground">
                A comprehensive smart pharmacy solution designed to simplify pharmacy operations.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-12">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="border border-border rounded p-6 bg-card">
                <h2 className="text-xl font-bold text-primary mb-3">Our Mission</h2>
                <p className="text-muted-foreground">
                  To empower pharmacies with technology that simplifies 
                  inventory tracking, enhances billing processes, and ensures better 
                  patient care through accurate medicine tracking and smart alerts.
                </p>
              </div>
              <div className="border border-border rounded p-6 bg-card">
                <h2 className="text-xl font-bold text-primary mb-3">Our Vision</h2>
                <p className="text-muted-foreground">
                  To become the leading pharmacy solution in India, helping 
                  thousands of medical stores operate efficiently while maintaining the 
                  highest standards of healthcare and customer service.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="bg-secondary py-12">
          <div className="container">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Our Core Values</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center bg-card border border-border rounded p-4">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 text-lg">♥</div>
                <h3 className="font-bold text-foreground mb-1">Patient Safety</h3>
                <p className="text-sm text-muted-foreground">Ensuring accurate medicine tracking to protect patient health.</p>
              </div>
              <div className="text-center bg-card border border-border rounded p-4">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 text-lg">★</div>
                <h3 className="font-bold text-foreground mb-1">Excellence</h3>
                <p className="text-sm text-muted-foreground">Delivering high-quality software with attention to detail.</p>
              </div>
              <div className="text-center bg-card border border-border rounded p-4">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 text-lg">👥</div>
                <h3 className="font-bold text-foreground mb-1">Customer Focus</h3>
                <p className="text-sm text-muted-foreground">Building features that solve real pharmacy challenges.</p>
              </div>
              <div className="text-center bg-card border border-border rounded p-4">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 text-lg">⚡</div>
                <h3 className="font-bold text-foreground mb-1">Innovation</h3>
                <p className="text-sm text-muted-foreground">Leveraging modern tech for smarter solutions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12">
          <div className="container">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">System Statistics</h2>
            <div className="grid gap-4 text-center md:grid-cols-4">
              <div className="border border-border rounded p-4 bg-card">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Active Stores</div>
              </div>
              <div className="border border-border rounded p-4 bg-card">
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Medicines Tracked</div>
              </div>
              <div className="border border-border rounded p-4 bg-card">
                <div className="text-3xl font-bold text-primary">1M+</div>
                <div className="text-sm text-muted-foreground">Transactions</div>
              </div>
              <div className="border border-border rounded p-4 bg-card">
                <div className="text-3xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>
        </section>

        {/* Project Info */}
        <section className="bg-secondary py-12">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Project Information</h2>
              <div className="border border-border rounded p-6 bg-card text-left">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-2 font-bold">Project Name:</td>
                      <td className="py-2">MediTech - Smart Pharmacy Solution</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-2 font-bold">University:</td>
                      <td className="py-2">Mumbai University</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-2 font-bold">Technology Used:</td>
                      <td className="py-2">React, TypeScript, Tailwind CSS, PostgreSQL</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-2 font-bold">Developer:</td>
                      <td className="py-2">Ayush Gupta</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold">Contact:</td>
                      <td className="py-2">ayushgupta69904@gmail.com</td>
                    </tr>
                  </tbody>
                </table>
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
