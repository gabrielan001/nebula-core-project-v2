import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Ana Beatriz",
    role: "Diretora de Inovação",
    company: "FinTech Inova",
    content: "Reduzimos 35% dos custos operacionais no primeiro trimestre após a implementação. A plataforma se integrou perfeitamente aos nossos sistemas existentes.",
    rating: 5
  },
  {
    name: "Carlos Eduardo",
    role: "CTO",
    company: "LogiTech Solutions",
    content: "A orquestração de múltiplos modelos de IA nos permitiu otimizar rotas de entrega com 28% mais eficiência. O suporte técnico é excepcional.",
    rating: 5
  },
  {
    name: "Mariana Silva",
    role: "Head de Dados",
    company: "Saúde Digital",
    content: "A conformidade com LGPD foi um fator decisivo para nossa escolha. A segurança dos dados dos nossos pacientes é inegociável.",
    rating: 5
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Empresas que confiam em nossa solução
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Resultados reais de empresas que transformaram seus negócios com nossa plataforma.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="relative p-8 bg-gray-50 dark:bg-gray-800 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-gray-200 dark:text-gray-700" />
              
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-200 mb-4 italic">"{testimonial.content}"</p>
              
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Mais de 500 empresas em 15 países confiam em nossa plataforma para suas operações críticas.
          </p>
          <div className="flex flex-wrap justify-center gap-4 opacity-70">
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">Setor Financeiro</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">Saúde</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">Varejo</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">Manufatura</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">Logística</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
