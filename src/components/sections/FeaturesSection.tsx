import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const features = [
  {
    title: "Orquestração Inteligente",
    description: "Integração perfeita entre múltiplos modelos de IA para otimizar resultados e reduzir custos operacionais.",
    benefits: [
      "Redução de até 40% nos custos de inferência",
      "Alta disponibilidade com failover automático",
      "Otimização de custos em tempo real"
    ]
  },
  {
    title: "AGI Prática",
    description: "Sistemas que aprendem e se adaptam às necessidades específicas do seu negócio, sem necessidade de reengenharia constante.",
    benefits: [
      "Adaptação contínua a novas demandas",
      "Aprendizado com interações reais",
      "Melhoria contínua sem intervenção"
    ]
  },
  {
    title: "Segurança Empresarial",
    description: "Arquitetura zero-trust com criptografia de ponta a ponta e conformidade com os mais rigorosos padrões do setor.",
    benefits: [
      "Conformidade com LGPD e GDPR",
      "Isolamento completo de dados",
      "Auditoria em tempo real"
    ]
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Tecnologia que entrega resultados reais
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Soluções projetadas para escalar com seu negócio, mantendo desempenho e segurança.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-200">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
