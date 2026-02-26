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
            {/* Contact Info */}
            <div className="mt-4 flex flex-col gap-2 text-sm opacity-80">
              <a href="mailto:info@nepalelection.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail size={14} />
                info@nepalelection.com
              </a>
              <a href="tel:+9771XXXXXXX" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone size={14} />
                +977-1-XXXXXXX
              </a>
              <span className="flex items-center gap-2">
                <MapPin size={14} />
                काठमाडौं, नेपाल
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">छिटो लिंकहरू</h4>
            <ul className="flex flex-col gap-2 text-sm opacity-85">
              <li><Link href="/results" className="hover:text-primary transition-colors">निर्वाचन नतिजा</Link></li>
              <li><Link href="/candidates" className="hover:text-primary transition-colors">उम्मेदवारहरू</Link></li>
              <li><Link href="/voter-guide" className="hover:text-primary transition-colors">मतदाता गाइड</Link></li>
              <li><Link href="/quiz" className="hover:text-primary transition-colors">क्विज खेल्नुहोस्</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-lg mb-4">स्रोतहरू</h4>
            <ul className="flex flex-col gap-2 text-sm opacity-85">
              <li><Link href="/manifestos" className="hover:text-primary transition-colors">घोषणापत्र</Link></li>
              <li><Link href="/support-us" className="hover:text-primary transition-colors">सहयोग गर्नुहोस्</Link></li>
              <li><a href="#faq" className="hover:text-primary transition-colors">बारम्बार सोधिने प्रश्नहरू</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">हाम्रो बारेमा</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-lg mb-4">कानुनी</h4>
            <ul className="flex flex-col gap-2 text-sm opacity-85">
              <li><a href="#" className="hover:text-primary transition-colors">गोपनीयता नीति</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">सेवा सर्तहरू</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">हामीसँग सम्पर्क गर्नुहोस्</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">समस्या रिपोर्ट गर्नुहोस्</a></li>
            </ul>
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
