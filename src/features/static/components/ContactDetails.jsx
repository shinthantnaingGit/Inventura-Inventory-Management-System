// components/ContactDetails.jsx
import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactDetails = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Shinichi IT Solutions
      </h3>
      <ul className="space-y-6">
        <li className="flex items-start space-x-4">
          <Mail size={24} className="text-blue-600 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Email Address
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              support@shinichi.com
            </p>
          </div>
        </li>
        <li className="flex items-start space-x-4">
          <Phone size={24} className="text-blue-600 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Phone Number
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              +1 (555) 123-4567
            </p>
          </div>
        </li>
        <li className="flex items-start space-x-4">
          <MapPin size={24} className="text-blue-600 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Our Office
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              123 Main Street, Suite 400
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Cityville, State 12345, USA
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ContactDetails;
