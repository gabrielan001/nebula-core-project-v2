import { GradientButton } from '@/components/ui/advanced/GradientButton';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Inteligência Artificial <span className="gradient-text">para Negócios Reais</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Soluções de IA que resolvem problemas reais, impulsionam eficiência e geram resultados mensuráveis para seu negócio.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <GradientButton size="lg" className="px-8">
              Agendar Demonstração
            </GradientButton>
            <GradientButton variant="secondary" size="lg" className="px-8">
              Ver Estudos de Caso
            </GradientButton>
          </motion.div>
          
          <motion.div 
            className="mt-16 text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <p>Plataforma confiável por mais de 500 empresas em 15 países</p>
            <div className="flex justify-center gap-8 mt-6 opacity-70">
              <span>✓ Alta disponibilidade</span>
              <span>✓ Conformidade com LGPD</span>
              <span>✓ Suporte 24/7</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
