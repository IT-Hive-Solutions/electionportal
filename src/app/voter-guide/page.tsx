'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Clock, Users, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdBanner from '@/components/AdBanner';

export default function VoterGuide() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const faqItems = [
    {
      q: 'मतदान सम्पन्न भएपछि के प्रक्रिया हुन्छ?',
      a: 'मतदान गरेपछि तपाईंको औंलामा अमिट मसी लगाइनेछ, जसले मतदान सम्पन्न भएको जनाउँछ। त्यसपछि मतदान केन्द्रबाट बाहिरिन सक्नुहुन्छ।',
    },
    {
      q: 'यदि मतदाता नामावलीमा मेरो नाम फेला परेन भने के गर्ने?',
      a: 'मतदान केन्द्रका मतदान अधिकृतसँग तुरुन्त सम्पर्क गर्नुहोस्। अन्तिम प्रकाशित मतदाता सूचीमा नाम नभएमा मतदान गर्न पाइँदैन।',
    },
    {
      q: 'विदेशमा रहेका नेपालीले मतदान गर्न सक्छन्?',
      a: 'हाल प्रचलित कानून अनुसार विदेशबाट मतदानको व्यवस्था लागू गरिएको छैन। मतदान गर्न नेपालमै तोकिएको मतदान केन्द्रमा उपस्थित हुनुपर्छ।',
    },
    {
      q: 'मतपत्र कसरी सही तरिकाले प्रयोग गर्ने?',
      a: 'गोप्य मतदान कक्षमा गई आफूले रोजेको उम्मेदवार वा दलको चुनाव चिन्हमा आधिकारिक छाप स्पष्ट रूपमा लगाउनुहोस्। अन्य ठाउँमा छाप लगाउँदा मत बदर हुन सक्छ।',
    },
    {
      q: 'कुन–कुन परिचयपत्र देखाएर मतदान गर्न सकिन्छ?',
      a: 'मतदाता नामावलीमा नाम भएमा मतदाता परिचयपत्र, नागरिकता प्रमाणपत्र, राष्ट्रिय परिचयपत्र वा निर्वाचन आयोगले स्वीकृत गरेको अन्य वैध सरकारी परिचयपत्र देखाएर मतदान गर्न सकिन्छ।',
    },
    {
      q: 'मतदाता परिचयपत्र नआएमा के मतदान गर्न पाइन्छ?',
      a: 'मतदाता परिचयपत्र नभएमा नागरिकता प्रमाणपत्र वा अन्य स्वीकृत सरकारी परिचयपत्र देखाएर पनि मतदान गर्न पाइन्छ।',
    },
    {
      q: 'मतपत्र किन बदर हुन सक्छ?',
      a: 'निर्धारित स्थान बाहिर छाप लगाउनु, एकभन्दा बढी चिन्हमा छाप लगाउनु वा मतपत्रमा अन्य लेखोट गर्नु मत बदर हुने प्रमुख कारण हुन्।',
    },
    {
      q: 'नामावलीमा सामान्य त्रुटि भएमा के मतदान गर्न पाइन्छ?',
      a: 'सानोतिनो अक्षर वा त्रुटि भए पनि मतदान गर्न सकिन्छ, यदि नाम स्पष्ट पहिचान योग्य छ भने।',
    },
    {
      q: 'मतदाता सूचिमा दावी/आपत्ति कहिले गर्न सकिन्छ?',
      a: 'निर्वाचन आयोगले मतदाता सूची प्रकाशित गर्दा तोकिएको समय भित्र दावी/आपत्ति गर्न सकिन्छ।',
    },
    {
      q: 'विदेशबाट मतदान गर्ने व्यवस्था छ?',
      a: 'हाल नेपालमा विदेशबाट मतदानको व्यवस्था लागू गरिएको छैन। मतदाता नेपालमै तोकिएको मतदान केन्द्रमा उपस्थित भई मतदान गर्नु पर्छ।',
    },
  ];

  const votingProcess = [
    {
      step: '१',
      title: 'मतदान केन्द्रमा उपस्थित हुनुहोस्',
      description: 'निर्वाचन आयोगले तोकेको समयभित्र आफ्नो नाम दर्ता भएको मतदान केन्द्रमा उपस्थित हुनुहोस्।',
    },
    {
      step: '२',
      title: 'पहिचान प्रमाणीकरण',
      description:
        'नागरिकता, राष्ट्रिय परिचयपत्र, मतदाता परिचयपत्र वा आयोगले स्वीकृत गरेको अन्य वैध कागजात पेश गर्नुहोस्।',
    },
    {
      step: '३',
      title: 'मतदाता नामावली प्रमाणीकरण',
      description: 'मतदान अधिकृतले मतदाता नामावलीमा तपाईंको नाम र विवरण प्रमाणीकरण गर्नुहुनेछ।',
    },
    {
      step: '४',
      title: 'हस्ताक्षर वा औंठाछाप दिनुहोस्',
      description: 'मतदाता नामावलीमा हस्ताक्षर वा औंठाछाप गरी मतदान अधिकार प्रयोगको पुष्टि गर्नुहोस्।',
    },
    {
      step: '५',
      title: 'मतपत्र प्राप्त गर्नुहोस्',
      description: 'सम्बन्धित निर्वाचनका लागि मतपत्र प्राप्त गरी आधिकारिक छाप लगाइएको सुनिश्चित गर्नुहोस्।',
    },
    {
      step: '६',
      title: 'गोप्य मतदान कक्षमा मतदान गर्नुहोस्',
      description: 'गोप्य मतदान कक्षमा गई आफ्नो रोजाइ अनुसार चुनाव चिन्हमा छाप लगाउनुहोस्।',
    },
    {
      step: '७',
      title: 'मतपत्र मतपेटिकामा राख्नुहोस्',
      description: 'मतपत्रलाई ठीक तरिकाले फोल्ड गरी सम्बन्धित मतपेटिकामा राख्नुहोस्।',
    },
    {
      step: '८',
      title: 'मतदान सम्पन्न भएको चिन्ह',
      description: 'मतदानपछि औंलामा अमिट मसी लगाइनेछ, जसले मतदान सम्पन्न भएको जनाउँछ।',
    },
  ];
  const requirements = [
    { text: 'नेपाली नागरिकता प्रमाणपत्र' },
    { text: '१८ वर्ष वा सोभन्दा माथिको उमेर' },
    { text: 'मतदाता नामावलीमा नाम दर्ता भएको' },
    { text: 'अन्तिम मतदाता सूचीमा नाम समावेश भएको' },
    { text: 'वैध पहिचान कागजात साथमा रहेको' },
    { text: 'कानून बमोजिम मतदान अधिकारबाट वञ्चित नभएको' },
    { text: 'एकभन्दा बढी स्थानमा मतदाता दर्ता नभएको' },
    { text: 'स्थायी ठेगाना अनुसार सम्बन्धित निर्वाचन क्षेत्रमा दर्ता भएको' },
    { text: 'झूटा विवरण पेश नगरेको' },
    { text: 'निर्वाचन आयोगले तोकेको समयभित्र दर्ता पूरा गरेको' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors text-sm"
        >
          <ArrowLeft size={18} />
          गृहपृष्ठमा फर्कनुहोस्
        </Link>
      </div>

      <section className="bg-card border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Users size={28} className="text-secondary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">मतदाता गाइड</h1>
          </div>
          <p className="text-muted-foreground">सबै मतदाताका लागि आवश्यक जानकारी</p>
        </div>
      </section>

      <AdBanner type="banner" position="top" />

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Requirements */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">मतदाता हुनका लागि आवश्यकताहरू</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requirements.map((req, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 hover:border-primary/30 transition-colors"
                >
                  <CheckCircle size={22} className="text-primary flex-shrink-0" />
                  <p className="text-foreground font-semibold text-sm">{req.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Voting Process */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">मतदान प्रक्रिया</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {votingProcess.map((process, index) => (
                <div key={index} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary text-primary-foreground font-bold text-lg rounded-full flex items-center justify-center flex-shrink-0">
                      {process.step}
                    </div>
                    <h3 className="font-bold text-foreground text-sm">{process.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">{process.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Important Dates */}
          <div className="mb-12 bg-primary/5 border-l-4 border-primary rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock size={24} className="text-primary" />
              <h2 className="text-xl font-bold text-foreground">महत्त्वपूर्ण मितिहरू</h2>
            </div>
            <ul className="flex flex-col gap-2 text-foreground text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span>
                  मतदान मिति: २०८२ साल फाल्गुन २१ गते (५ मार्च २०२६), बिहीबार, बिहान ७:०० बजे देखि साँझ ५:०० बजे सम्म
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span>
                  मतदान केन्द्र खोज्नुहोस्: निर्वाचन आयोगको आधिकारिक वेबसाइटमा उपलब्ध पोलिङ केन्द्र सूचिमा हेर्नुहोस्
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span>
                  अन्तिम मतदाता नामावली प्रकाशित: २०७८ पुस १२ गते निर्वाचन आयोगले प्रकाशित गरेको अन्तिम मतदाता सूची
                  उपलब्ध छ
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span>मतदाता संख्या: कुल १८,९०३,६८९ मतदाताहरूलाई अन्तिम मतदाता सूचीमा समावेश गरिएको छ</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span>
                  मतदान केन्द्र र पोलिङ स्थल: देशभर १०,९६७ मतदान केन्द्र अन्तर्गत २३,११२ पोलिङ स्थल तोकिएका छन्
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span>
                  मतदाता नामावलीमा नाम नभएमा मतदान गर्न पाइँदैन — नाम सहि/समीक्षा गर्न आयोग कार्यालयमा आवेदन दिन सकिन्छ
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span>
                  मतदान अधिकार प्रयोग गर्नको लागि वैध परिचयपत्र अनिवार्य छ (मतदाता/नागरिकता/राष्ट्रिय परिचयपत्र)
                </span>
              </li>
            </ul>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">बारम्बार सोधिने प्रश्नहरू</h2>
            <div className="flex flex-col gap-3 max-w-3xl">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-card border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
                  >
                    <p className="font-semibold text-foreground text-sm pr-4">{item.q}</p>
                    {openAccordion === index ? (
                      <ChevronUp size={18} className="text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown size={18} className="text-muted-foreground flex-shrink-0" />
                    )}
                  </button>
                  {openAccordion === index && (
                    <div className="px-5 pb-4 border-t border-border">
                      <p className="text-sm text-muted-foreground pt-3 leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AdBanner type="sidebar" position="middle" />

      <Footer />
    </div>
  );
}
