import { motion } from 'motion/react';
import { UserPlus, FileSearch, CheckCircle, Rocket } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Consultation',
    desc: 'Speak with our experts to find the right structure for your dream.',
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    icon: FileSearch,
    title: 'Documentation',
    desc: 'Upload your ID and address proofs to our secure digital vault.',
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    icon: CheckCircle,
    title: 'Verification',
    desc: 'Our legal team vets your documents for 100% accuracy.',
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    icon: Rocket,
    title: 'Launch',
    desc: 'Receive your incorporation certificates and start trading!',
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  }
];

export default function ProcessSection() {
  return (
    <section className="py-32 bg-white relative overflow-hidden" id="process-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-blue-900 mb-6">How it works</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            We've distilled complex legal bureaucracy into four simple, elegant steps.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-[2px] bg-blue-100 -z-10" />
          
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group text-center"
            >
              <div className={`w-32 h-32 ${step.bg} rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-500/5 group-hover:scale-110 transition-transform duration-500 relative bg-white border border-blue-50`}>
                <step.icon className={`${step.color}`} size={44} strokeWidth={1.5} />
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-blue-900 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                  {idx + 1}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
