"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useI18n } from "@/i18n/I18nProvider";

export default function Hero() {
  const { t } = useI18n();
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.5 });

  return (
    <section ref={heroRef} id="hero" className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white py-20 lg:py-40 transition-colors duration-500">
      <div className="container mx-auto px-4 text-center">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={heroInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl lg:text-6xl font-extrabold mb-4"
        >
          {t("landing.hero.heading", "ビジネス運営をシンプルに")}
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={heroInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
        >
          {t("landing.hero.subheading", "在庫管理、請求書発行、売上分析を一つの強力なツールで実現します。")}
        </motion.p>
        <motion.a
          initial={{ y: 20, opacity: 0 }}
          animate={heroInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          href="/login"
          className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
        >
          {t("landing.hero.cta", "始める")}
        </motion.a>
      </div>
    </section>
  );
}
