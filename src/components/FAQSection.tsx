import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "Is AppName free to use?",
      answer: "AppName offers both free and premium tiers. The free version includes core functionality with basic features, while our premium subscription unlocks advanced tools, priority support, and additional storage. You can upgrade or downgrade your plan at any time."
    },
    {
      question: "How do I update to the latest version?",
      answer: "AppName automatically checks for updates and will notify you when a new version is available. You can also manually check for updates in the app's settings menu. Updates are delivered seamlessly in the background, so you'll always have the latest features and security improvements."
    },
    {
      question: "What are the minimum system requirements?",
      answer: "For Windows: Windows 10 or later, 4GB RAM, 100MB free space. For macOS: macOS 11.0 or later, 4GB RAM, 150MB free space. For Linux: Ubuntu 20.04+/Fedora 34+, 4GB RAM, 80MB free space. We recommend having the latest OS updates installed for optimal performance."
    },
    {
      question: "Can I use AppName offline?",
      answer: "Yes! AppName works fully offline for most features. Your data is stored locally on your device, and any changes will sync automatically when you reconnect to the internet. Some advanced features like cloud collaboration require an internet connection."
    },
    {
      question: "How do I transfer my data between devices?",
      answer: "AppName includes built-in cloud synchronization that automatically keeps your data in sync across all your devices. Simply sign in with the same account on each device, and your data will be synchronized automatically. You can also export/import data manually if preferred."
    },
    {
      question: "Is my data secure and private?",
      answer: "Absolutely. AppName uses end-to-end encryption to protect your data both in transit and at rest. We follow industry-standard security practices and never share your personal data with third parties. You can review our detailed privacy policy for complete transparency about data handling."
    },
    {
      question: "Do you offer technical support?",
      answer: "Yes, we provide comprehensive support through multiple channels. Free users have access to our knowledge base and community forums. Premium users get priority email support with guaranteed response times. Enterprise customers receive dedicated support with phone and chat options."
    },
    {
      question: "Can I customize the app's appearance?",
      answer: "AppName offers extensive customization options including multiple themes (light, dark, and custom), adjustable layouts, and configurable shortcuts. You can tailor the interface to match your workflow and preferences. Premium users get access to additional themes and advanced customization options."
    }
  ];

  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions? We've got answers. If you can't find what you're looking for, 
            our support team is always ready to help.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="glass-card">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-border/50">
                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Support */}
        <div className="mt-16 text-center glass-card">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Still have questions?
          </h3>
          <p className="text-muted-foreground mb-6">
            Our friendly support team is here to help you get the most out of AppName.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#" 
              className="download-btn-primary inline-flex items-center justify-center"
            >
              💬 Contact Support
            </a>
            <a 
              href="#" 
              className="download-btn-secondary inline-flex items-center justify-center"
            >
              📚 Browse Documentation
            </a>
            <a 
              href="#" 
              className="download-btn-secondary inline-flex items-center justify-center"
            >
              👥 Join Community
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;