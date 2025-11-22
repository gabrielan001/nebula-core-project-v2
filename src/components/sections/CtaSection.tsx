import { GradientButton } from '@/components/ui/advanced/GradientButton';
import { motion } from 'framer-motion';

export function CtaSection() {
  return (
    <section className="relative py-20 bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-grid-white/20 [mask-image:linear-gradient(180deg,white,transparent)]"></div>
      </div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Pronto para transformar seu negócio com IA?
          </motion.h2>
          
          <motion.p 
            className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Agende uma demonstração personalizada e descubra como nossa plataforma pode impulsionar seus resultados em semanas, não em anos.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GradientButton 
              variant="secondary" 
              size="lg" 
              className="px-8 bg-white text-blue-700 hover:bg-blue-50"
              glowEffect={false}
            >
              Falar com Especialista
            </GradientButton>
            <GradientButton 
              variant="ghost" 
              size="lg" 
              className="px-8 border-2 border-white text-white hover:bg-white/10"
              glowEffect={false}
            >
              Ver Preços
            </GradientButton>
          </motion.div>
          
          <motion.div 
            className="mt-8 text-sm text-blue-100"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p>Sem compromisso • Cancelamento a qualquer momento • Suporte 24/7</p>
            <div className="flex justify-center gap-6 mt-4">
              <span className="flex items-center">✓ Sem taxas ocultas</span>
              <span className="flex items-center">✓ Teste gratuito de 14 dias</span>
              <span className="flex items-center">✓ Segurança em primeiro lugar</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
