"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { MapPin, Mail, Phone, Clock, Link as LinkIcon } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export default function Contact() {
  const { t } = useI18n();
  const [contactRef, contactInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const info = [
    {
      label: t("landing.contact.info.location.label", "場所"),
      value: t(
        "landing.contact.info.location.value",
        "インベンチュラ神田ビル、東京都千代田区神田小川町2-4-8、〒101-0052"
      ),
      href: t(
        "landing.contact.info.location.href",
        "https://maps.app.goo.gl/YourLocationLink"
      ),
      icon: <MapPin className="size-5 text-blue-500" />,
    },
    {
      label: t("landing.contact.info.email.label", "メール"),
      value: t("landing.contact.info.email.value", "support@inventura.jp"),
      href: "mailto:support@inventura.jp",
      icon: <Mail className="size-5 text-blue-500" />,
    },
    {
      label: t("landing.contact.info.phone.label", "電話"),
      value: t("landing.contact.info.phone.value", "+81-3-1234-5678"),
      href: "tel:+81312345678",
      icon: <Phone className="size-5 text-blue-500" />,
    },
    {
      label: t("landing.contact.info.hours.label", "営業時間"),
      value: t(
        "landing.contact.info.hours.value",
        "月曜 - 金曜: 午前9時 - 午後6時 (JST)"
      ),
      href: "#",
      icon: <Clock className="size-5 text-blue-500" />,
    },
    {
      label: t("landing.contact.info.social.label", "ソーシャル"),
      value: t("landing.contact.info.social.value", "inventura.jp/social"),
      href: t(
        "landing.contact.info.social.href",
        "https://twitter.com/inventura_jp"
      ),
      icon: <LinkIcon className="size-5 text-blue-500" />,
    },
  ];

  return (
    <section
      ref={contactRef}
      id="contact"
      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-20 lg:py-32 transition-colors duration-500"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={contactInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {t("landing.contact.heading", "お問い合わせ")}
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            {t(
              "landing.contact.subheading",
              "サポートやご質問がある場合は、お気軽にお問い合わせください。"
            )}
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={contactInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto bg-gray-50 dark:bg-gray-900  p-8 md:p-12 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {info.map((item, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 text-lg text-gray-700 dark:text-gray-300"
            >
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold">{item.label}</h3>
                <a
                  href={item.href}
                  className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                >
                  {item.value}
                </a>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
