import { Calendar as CalendarIcon, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const deadlines = [
  { date: 'May 15', task: 'PF & ESI Payment', type: 'Monthly' },
  { date: 'May 20', task: 'GSTR-3B Filing', type: 'Monthly' },
  { date: 'May 30', task: 'LLP Form 11 Filing', type: 'Annual' },
  { date: 'Jun 15', task: 'TDS Payment', type: 'Monthly' },
];

/**
 * ComplianceCalendar Component
 * 
 * Renders an immersive banner with an upcoming regulatory deadline tracker.
 * Displays critical date milestones for ROC, PF/ESI, GST and basic business actions.
 */
export default function ComplianceCalendar() {
  return (
    <section className="py-24 bg-brand-900 text-white overflow-hidden relative" id="compliance-calendar">
      {/* Abstract Background Design */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-brand-500 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-4">Stay Ahead</h2>
            <h3 className="text-4xl lg:text-5xl font-serif font-bold mb-8 leading-tight">
              Never Miss a <span className="italic text-emerald-400">Statutory Deadline</span> Again.
            </h3>
            <p className="text-brand-100 text-lg mb-10 leading-relaxed">
              Our automated compliance tracker keeps you informed about upcoming tax filings, ROC returns, and other legal requirements. Subscribe to our smart alerts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-emerald-500 text-brand-900 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all">
                Subscribe to Alerts
                <CalendarIcon size={20} />
              </button>
              <button className="bg-white/10 text-white px-8 py-4 rounded-xl font-bold border border-white/20 hover:bg-white/20 transition-all">
                View Full Calendar
              </button>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 lg:p-12">
            <h4 className="flex items-center gap-3 text-xl font-bold mb-8">
              <Clock className="text-emerald-400" />
              Upcoming Deadlines - May 2026
            </h4>
            
            <div className="space-y-6">
              {deadlines.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-xs text-brand-300 uppercase font-bold tracking-tighter">{item.date.split(' ')[0]}</div>
                      <div className="text-2xl font-bold text-emerald-400">{item.date.split(' ')[1]}</div>
                    </div>
                    <div className="h-10 w-[1px] bg-white/10" />
                    <div>
                      <div className="font-bold text-lg">{item.task}</div>
                      <div className="text-sm text-brand-300">{item.type} Compliance</div>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-white/20 group-hover:text-emerald-400 transition-colors group-hover:translate-x-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
