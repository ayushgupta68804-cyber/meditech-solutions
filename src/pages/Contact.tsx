import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          subject: formData.subject.trim() || undefined,
          message: formData.message.trim(),
        },
      });

      if (error) throw error;

      toast.success("Thank you for contacting us! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-block rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
                Contact Us
              </span>
              <h1 className="mt-4 font-heading text-4xl font-bold text-foreground md:text-5xl">
                Get in Touch
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Have questions about MediTeck? We're here to help. Reach out to
                us and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground">
                    Contact Information
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Reach out to us through any of the following channels.
                  </p>
                </div>

                <div className="space-y-6">
                  <a
                    href="mailto:ayushgupta69904@gmail.com"
                    className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Email</h3>
                      <p className="text-muted-foreground">
                        ayushgupta69904@gmail.com
                      </p>
                    </div>
                  </a>

                  <a
                    href="tel:+919022053701"
                    className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Phone</h3>
                      <p className="text-muted-foreground">+91 90220 53701</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 rounded-lg border border-border bg-card p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Address</h3>
                      <p className="text-muted-foreground">
                        123 Medical Plaza, Bramhanand Nagar,
                        <br />
                        Kamatghar, Bhiwandi, Thane 421305
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-lg border border-border bg-card p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Business Hours
                      </h3>
                      <p className="text-muted-foreground">
                        Mon - Sat: 9:00 AM - 8:00 PM
                        <br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="card-medical">
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Send us a Message
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Fill out the form below and we'll get back to you shortly.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="+91 XXXXX XXXXX"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      Message <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your inquiry..."
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full gap-2 bg-gradient-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
