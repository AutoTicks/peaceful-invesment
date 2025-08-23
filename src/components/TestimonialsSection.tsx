import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      company: "TechCorp",
      avatar: "👩‍💼",
      rating: 5,
      quote: "This app has completely transformed our workflow. The cross-platform compatibility means our entire team can collaborate seamlessly, regardless of their operating system.",
    },
    {
      name: "Marcus Rodriguez",
      role: "Software Developer",
      company: "StartupXYZ",
      avatar: "👨‍💻",
      rating: 5,
      quote: "I've tried countless apps in this category, but none come close to the performance and reliability of AppName. It's become an essential part of my daily toolkit.",
    },
    {
      name: "Dr. Emily Watson",
      role: "Research Scientist",
      company: "University Labs",
      avatar: "👩‍🔬",
      rating: 5,
      quote: "The security features give me complete confidence when handling sensitive research data. Plus, the auto-update system means I never have to worry about compatibility issues.",
    },
    {
      name: "David Kim",
      role: "Creative Director",
      company: "Design Studio",
      avatar: "👨‍🎨",
      rating: 5,
      quote: "Beautiful design meets powerful functionality. AppName strikes the perfect balance between aesthetics and performance. Our creative team loves it!",
    },
  ];

  const companies = [
    { name: "Google", logo: "🔍" },
    { name: "Microsoft", logo: "🪟" },
    { name: "Apple", logo: "🍎" },
    { name: "Netflix", logo: "🎬" },
    { name: "Spotify", logo: "🎵" },
    { name: "Adobe", logo: "🎨" },
  ];

  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Loved by <span className="text-gradient">Professionals</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of satisfied users who have made AppName an integral 
            part of their daily workflow.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="glass-card hover:glow-primary group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-primary opacity-50" />
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-foreground text-lg leading-relaxed mb-6">
                "{testimonial.quote}"
              </blockquote>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent-orange text-accent-orange" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof - Companies */}
        <div className="glass-card text-center">
          <h3 className="text-xl font-semibold text-foreground mb-8">
            Trusted by teams at leading companies
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center">
            {companies.map((company, index) => (
              <div 
                key={index}
                className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity group"
              >
                <div className="text-4xl group-hover:scale-110 transition-transform">
                  {company.logo}
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {company.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Rating */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 glass-card">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-accent-orange text-accent-orange" />
              ))}
            </div>
            <div className="text-2xl font-bold text-foreground">4.9</div>
            <div className="text-muted-foreground">
              • Based on 2,847 reviews
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;