import Link from 'next/link';
import { Vote, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Vote className="text-primary" size={28} />
              <div>
                <div className="font-bold text-xl">नेपाल निर्वाचन</div>
                <div className="text-xs opacity-75">Nepal Election Portal</div>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              नागरिकहरूलाई सशक्त निर्णय लिन पारदर्शी निर्वाचन जानकारी प्रदान गर्दै।
            </p>
          </div>
        </div>

        <div className="border-t border-primary/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-75 gap-4">
            <p>&copy; {currentYear} नेपाल निर्वाचन पोर्टल। सर्वाधिकार सुरक्षित।</p>
            <p>पारदर्शी र न्यायपूर्ण निर्वाचनको प्रवर्द्धन गर्दै</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
