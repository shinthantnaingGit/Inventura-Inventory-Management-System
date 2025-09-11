"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useI18n } from "@/i18n/I18nProvider";

export default function About() {
  const { t } = useI18n();
  const [aboutRef, aboutInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={aboutRef} id="about" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-20 lg:py-32 transition-colors duration-500">
      <div className="container mx-auto px-4 text-center">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={aboutInView ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t("landing.about.heading", "Inventuraについて")}</h2>
          <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {t("landing.about.subheading", "ビジネス業務を効率化するあなたのパートナー")}
          </p>
        </motion.div>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={aboutInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
        >
          {t("landing.about.description", "Inventuraは、中小企業に強力で使いやすいツールを提供するというシンプルな理念のもとに設立されました。私たちは、在庫管理や請求書作成の課題を理解しており、お客様が最も得意なこと、つまりビジネスの成長に集中できるよう、これらのタスクを簡素化することを使命としています。私たちは、単なるツールではなく、真のパートナーとして機能する信頼性の高いソフトウェアを構築することを目指しています。")}
        </motion.p>
        <motion.a
          initial={{ y: 20, opacity: 0 }}
          animate={aboutInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          href="#contact"
          className="mt-8 inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
        >
          {t("landing.about.cta", "お問い合わせ")}
        </motion.a>
      </div>
    </section>
  );
}
