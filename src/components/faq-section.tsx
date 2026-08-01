import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "What counts as one generation?",
    answer:
      "Each time you generate a CV, cover letter, ATS report, or humanized version counts as one generation. Free accounts get 3 shared generations per month; Premium accounts get unlimited generations.",
  },
  {
    question: "Can I try Premium before paying?",
    answer:
      "You start with 3 free generations every month to try every tool. If you need more, you can upgrade to Premium at any time — no hidden commitments.",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "You can manage or cancel your subscription anytime from the Subscription page in your account. Cancellations take effect at the end of your current billing period.",
  },
  {
    question: "Is my data private?",
    answer:
      "Yes. We don't track employment details beyond what you choose to share, and we don't sell your data. Job descriptions are used only to tailor your results.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "Payments are processed securely through Stripe. We accept major credit and debit cards, plus any payment methods supported by Stripe in your region.",
  },
];

export function FaqSection() {
  return (
    <div className="mx-auto mt-16 max-w-3xl">
      <h2 className="font-display text-center text-2xl tracking-tight sm:text-3xl">Frequently asked questions</h2>
      <div className="mt-6 overflow-hidden rounded-3xl border border-border/70 bg-card">
        <Accordion type="single" collapsible className="px-5">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b last:border-0">
              <AccordionTrigger className="text-left text-base hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
