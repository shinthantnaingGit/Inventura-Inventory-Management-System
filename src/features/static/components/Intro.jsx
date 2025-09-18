"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Package, FileText, ClipboardList, BarChart2 } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export default function Intro() {
  const { t } = useI18n();
  const [introRef, introInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const features = [
    {
      icon: <Package className="h-12 w-12 text-blue-500 mb-4 mx-auto" />,
      title: t("landing.intro.features.inventory.title", "在庫管理"),
      description: t(
        "landing.intro.features.inventory.desc",
        "製品の追加、編集、削除をリアルタイムの在庫追跡とともに行い、簡単に管理できます。"
      ),
    },
    {
      icon: <FileText className="h-12 w-12 text-blue-500 mb-4 mx-auto" />,
      title: t("landing.intro.features.invoiceGen.title", "請求書生成"),
      description: t(
        "landing.intro.features.invoiceGen.desc",
        "自動計算機能付きで、プロフェッショナルな印刷可能な請求書を素早く作成します。作成された請求書は請求書管理システムにも保存されます。"
      ),
    },
    {
      icon: <ClipboardList className="h-12 w-12 text-blue-500 mb-4 mx-auto" />,
      title: t("landing.intro.features.invoiceMgmt.title", "請求書管理"),
      description: t(
        "landing.intro.features.invoiceMgmt.desc",
        "すべての請求書を追跡し、支払い状況を管理し、請求履歴を簡単に整理します。"
      ),
    },
    {
      icon: <BarChart2 className="h-12 w-12 text-blue-500 mb-4 mx-auto" />,
      title: t(
        "landing.intro.features.analytics.title",
        "ダッシュボードと分析"
      ),
      description: t(
        "landing.intro.features.analytics.desc",
        "収益、売上、トップセラー製品のインタラクティブなチャートで貴重な洞察を得られます。"
      ),
    },
  ];

  return (
    <section
      ref={introRef}
      id="intro"
      className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white py-20 lg:py-32 transition-colors duration-500"
    >
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={introInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-3xl lg:text-4xl font-bold mb-12"
        >
          {t("landing.intro.heading", "効率性を追求した主要機能")}
        </motion.h2>

        <motion.div
          ref={introRef}
          initial="hidden"
          animate={introInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gray-100 dark:bg-gray-700 p-8 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
            >
              {feature.icon}
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
