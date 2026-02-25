'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy, AlertTriangle, Clock, ChevronRight, X, BarChart3 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type QuizData = {
  id: string;
  title: string;
  description: string;
  timeLabel: string;
  difficulty: string;
  questionCount: number;
  participantCount: number;
  questions: {
    question: string;
    options: { text: string; parties: Record<string, number> }[];
  }[];
  leaderboard: {
    question: string;
    topAnswer: string;
    count: number;
    percentage: number;
    answers: { text: string; count: number; percentage: number }[];
  }[];
};

const partyProfiles: Record<string, { name: string; color: string; description: string; policies: string[] }> = {
  partyA: {
    name: 'नेपाली काँग्रेस',
    color: 'bg-primary',
    description: 'लोकतान्त्रिक समाजवाद र मिश्रित अर्थतन्त्रमा विश्वास',
    policies: ['लोकतन्त्र', 'समाजवाद', 'मानव अधिकार', 'आर्थिक वृद्धि'],
  },
  partyB: {
    name: 'एमाले',
    color: 'bg-secondary',
    description: 'जनमुखी विकास र राष्ट्रवादी दृष्टिकोण',
    policies: ['राष्ट्रवाद', 'जनमुखी विकास', 'औद्योगीकरण', 'आत्मनिर्भरता'],
  },
  partyC: {
    name: 'माओवादी केन्द्र',
    color: 'bg-accent',
    description: 'समावेशी विकास र सामाजिक रूपान्तरण',
    policies: ['समावेशिता', 'रूपान्तरण', 'भूमिसुधार', 'सामाजिक न्याय'],
  },
  partyD: {
    name: 'राष्ट्रिय स्वतन्त्र पार्टी',
    color: 'bg-chart-4',
    description: 'स्वतन्त्र र पारदर्शी शासन',
    policies: ['पारदर्शिता', 'सुशासन', 'नवाचार', 'युवा सशक्तिकरण'],
  },
  partyE: {
    name: 'जनता समाजवादी पार्टी',
    color: 'bg-chart-5',
    description: 'सङ्घीयता र मधेश अधिकारमा केन्द्रित',
    policies: ['सङ्घीयता', 'समानता', 'सामाजिक न्याय', 'क्षेत्रीय विकास'],
  },
};

const dailyQuizzes: QuizData[] = [
  {
    id: 'quiz-1',
    title: 'राजनीतिक विचारधारा क्विज',
    description: 'तपाईंको राजनीतिक विचारधारा कुन दलसँग मिल्छ पत्ता लगाउनुहोस्',
    timeLabel: 'बिहानको क्विज',
    difficulty: 'सजिलो',
    questionCount: 5,
    participantCount: 4832,
    questions: [
      {
        question: 'सरकारको प्राथमिक ध्यान कुन विषयमा हुनुपर्छ?',
        options: [
          { text: 'आर्थिक विकास र लगानी प्रवर्द्धन', parties: { partyA: 2 } },
          { text: 'सामाजिक कल्याण र गरिबी निवारण', parties: { partyB: 2 } },
          { text: 'वातावरण संरक्षण र दिगो विकास', parties: { partyD: 2 } },
          { text: 'शिक्षा सुधार र प्रविधि विकास', parties: { partyC: 2, partyE: 1 } },
        ],
      },
      {
        question: 'स्वास्थ्य सेवा कत्तिको महत्त्वपूर्ण छ?',
        options: [
          { text: 'अत्यन्त महत्त्वपूर्ण - ठूलो सरकारी लगानी गर्नुपर्छ', parties: { partyB: 2 } },
          { text: 'महत्त्वपूर्ण - बजेट सन्तुलन गर्दै लगानी गर्नुपर्छ', parties: { partyA: 1, partyC: 1 } },
          { text: 'निजी क्षेत्रलाई प्रोत्साहन गर्नुपर्छ', parties: { partyE: 2 } },
          { text: 'समुदायमा केन्द्रित स्वास्थ्य कार्यक्रम चलाउनुपर्छ', parties: { partyD: 1 } },
        ],
      },
      {
        question: 'कृषि र ग्रामीण विकासबारे तपाईंको विचार?',
        options: [
          { text: 'सरकारले प्रमुख सहयोग गर्नुपर्छ', parties: { partyA: 2 } },
          { text: 'समुदाय र किसान नेतृत्वमा विकास हुनुपर्छ', parties: { partyB: 2 } },
          { text: 'बजार उदारीकरण र निर्यातमा जोड दिनुपर्छ', parties: { partyE: 2 } },
          { text: 'जैविक खेती र दिगो कृषि अभ्यास अपनाउनुपर्छ', parties: { partyD: 2 } },
        ],
      },
      {
        question: 'नेपालले जलवायु परिवर्तनलाई कसरी सम्बोधन गर्नुपर्छ?',
        options: [
          { text: 'आक्रामक जलवायु कार्य र हरित नीति अपनाउनुपर्छ', parties: { partyD: 2 } },
          { text: 'विकाससँग सन्तुलन राखेर अघि बढ्नुपर्छ', parties: { partyA: 1, partyC: 1 } },
          { text: 'हरित रोजगार सिर्जना र ऊर्जा संक्रमण गर्नुपर्छ', parties: { partyB: 2 } },
          { text: 'बजारमा आधारित प्रोत्साहन दिनुपर्छ', parties: { partyE: 1 } },
        ],
      },
      {
        question: 'लैङ्गिक समानताबारे तपाईंको दृष्टिकोण?',
        options: [
          { text: 'प्राथमिकतामा राखेर सक्रिय नीतिहरू लागू गर्नुपर्छ', parties: { partyB: 2 } },
          { text: 'समान अवसर सुनिश्चित गर्नुपर्छ', parties: { partyC: 1, partyD: 1, partyE: 1 } },
          { text: 'सांस्कृतिक मूल्यसँग सन्तुलन गर्नुपर्छ', parties: { partyA: 1 } },
          { text: 'शिक्षा र सचेतनामार्फत परिवर्तन ल्याउनुपर्छ', parties: { partyE: 1, partyD: 1 } },
        ],
      },
    ],
    leaderboard: [
      { question: 'सरकारको प्राथमिक ध्यान', topAnswer: 'आर्थिक विकास र लगानी प्रवर्द्धन', count: 3847, percentage: 34, answers: [
        { text: 'आर्थिक विकास र लगानी प्रवर्द्धन', count: 3847, percentage: 34 },
        { text: 'सामाजिक कल्याण र गरिबी निवारण', count: 2890, percentage: 26 },
        { text: 'वातावरण संरक्षण र दिगो विकास', count: 2105, percentage: 19 },
        { text: 'शिक्षा सुधार र प्रविधि विकास', count: 2390, percentage: 21 },
      ]},
      { question: 'स्वास्थ्य सेवा महत्त्व', topAnswer: 'अत्यन्त महत्त्वपूर्ण - ठूलो सरकारी लगानी', count: 4215, percentage: 42, answers: [
        { text: 'अत्यन्त महत्त्वपूर्ण', count: 4215, percentage: 42 },
        { text: 'बजेट सन्तुलन गर्दै लगानी', count: 2900, percentage: 29 },
        { text: 'निजी क्षेत्रलाई प्रोत्साहन', count: 1485, percentage: 15 },
        { text: 'समुदायमा केन्द्रित', count: 1400, percentage: 14 },
      ]},
      { question: 'कृषि र ग्रामीण विकास', topAnswer: 'समुदाय र किसान नेतृत्व', count: 2934, percentage: 29, answers: [
        { text: 'सरकारले प्रमुख सहयोग', count: 2700, percentage: 27 },
        { text: 'समुदाय र किसान नेतृत्व', count: 2934, percentage: 29 },
        { text: 'बजार उदारीकरण', count: 2200, percentage: 22 },
        { text: 'जैविक खेती र दिगो कृषि', count: 2166, percentage: 22 },
      ]},
      { question: 'जलवायु परिवर्तन सम्बोधन', topAnswer: 'आक्रामक जलवायु कार्य', count: 3102, percentage: 31, answers: [
        { text: 'आक्रामक जलवायु कार्य', count: 3102, percentage: 31 },
        { text: 'विकाससँग सन्तुलन', count: 2800, percentage: 28 },
        { text: 'हरित रोजगार सिर्जना', count: 2500, percentage: 25 },
        { text: 'बजारमा आधारित', count: 1598, percentage: 16 },
      ]},
      { question: 'लैङ्गिक समानता', topAnswer: 'प्राथमिकतामा राखेर सक्रिय नीतिहरू', count: 3560, percentage: 36, answers: [
        { text: 'सक्रिय नीतिहरू लागू', count: 3560, percentage: 36 },
        { text: 'समान अवसर', count: 2900, percentage: 29 },
        { text: 'सांस्कृतिक सन्तुलन', count: 1840, percentage: 18 },
        { text: 'शिक्षा र सचेतना', count: 1700, percentage: 17 },
      ]},
    ],
  },
  {
    id: 'quiz-2',
    title: 'नेपालको संविधान क्विज',
    description: 'नेपालको संविधानबारे तपाईंको ज्ञान जाँच गर्नुहोस्',
    timeLabel: 'दिउँसोको क्विज',
    difficulty: 'मध्यम',
    questionCount: 5,
    participantCount: 3214,
    questions: [
      {
        question: 'सङ्घीयताबारे तपाईंको दृष्टिकोण?',
        options: [
          { text: 'सङ्घीयता नेपालको विकासको आधार हो', parties: { partyC: 2, partyE: 2 } },
          { text: 'सङ्घीयतामा सुधार आवश्यक छ', parties: { partyA: 2 } },
          { text: 'केन्द्र सरकार बलियो हुनुपर्छ', parties: { partyB: 2 } },
          { text: 'स्थानीय सरकारलाई थप अधिकार दिनुपर्छ', parties: { partyD: 2 } },
        ],
      },
      {
        question: 'धर्मनिरपेक्षताबारे तपाईंको विचार?',
        options: [
          { text: 'नेपाल धर्मनिरपेक्ष राष्ट्र रहनुपर्छ', parties: { partyC: 2, partyB: 1 } },
          { text: 'हिन्दू राष्ट्र घोषणा गर्नुपर्छ', parties: { partyD: 0 } },
          { text: 'सबै धर्मलाई समान सम्मान दिनुपर्छ', parties: { partyA: 2, partyE: 1 } },
          { text: 'धर्म र राज्य अलग हुनुपर्छ', parties: { partyD: 2 } },
        ],
      },
      {
        question: 'समावेशी प्रतिनिधित्वबारे तपाईंको विचार?',
        options: [
          { text: 'आरक्षण प्रणाली जारी राख्नुपर्छ', parties: { partyC: 2, partyE: 2 } },
          { text: 'योग्यताको आधारमा मात्र चयन हुनुपर्छ', parties: { partyA: 1 } },
          { text: 'दुबै सन्तुलन गर्नुपर्छ', parties: { partyA: 1, partyB: 1 } },
          { text: 'समय सीमा राखेर आरक्षण दिनुपर्छ', parties: { partyD: 2 } },
        ],
      },
      {
        question: 'न्यायपालिकाको स्वतन्त्रताबारे तपाईंको विचार?',
        options: [
          { text: 'पूर्ण स्वतन्त्र हुनुपर्छ', parties: { partyA: 2, partyD: 2 } },
          { text: 'जनताप्रति जवाफदेही हुनुपर्छ', parties: { partyB: 2, partyC: 1 } },
          { text: 'सुधार आवश्यक छ तर स्वतन्त्रता कायम रहनुपर्छ', parties: { partyA: 1, partyE: 1 } },
          { text: 'न्यायपालिका सफाइ अभियान चलाउनुपर्छ', parties: { partyB: 1, partyD: 1 } },
        ],
      },
      {
        question: 'मौलिक अधिकारबारे कुन विषय महत्त्वपूर्ण?',
        options: [
          { text: 'अभिव्यक्ति स्वतन्त्रता', parties: { partyA: 2, partyD: 1 } },
          { text: 'रोजगारीको अधिकार', parties: { partyB: 2, partyC: 1 } },
          { text: 'सामाजिक सुरक्षाको अधिकार', parties: { partyC: 2, partyE: 1 } },
          { text: 'सूचनाको अधिकार', parties: { partyD: 2 } },
        ],
      },
    ],
    leaderboard: [
      { question: 'सङ्घीयताबारे दृष्टिकोण', topAnswer: 'सङ्घीयतामा सुधार आवश्यक', count: 2890, percentage: 38, answers: [
        { text: 'सङ्घीयता विकासको आधार', count: 2100, percentage: 28 },
        { text: 'सङ्घीयतामा सुधार', count: 2890, percentage: 38 },
        { text: 'केन्द्र सरकार बलियो', count: 1500, percentage: 20 },
        { text: 'स्थानीय सरकारलाई अधिकार', count: 1010, percentage: 14 },
      ]},
      { question: 'धर्मनिरपेक्षता', topAnswer: 'सबै धर्मलाई समान सम्मान', count: 3100, percentage: 41, answers: [
        { text: 'धर्मनिरपेक्ष राष्ट्र', count: 2800, percentage: 37 },
        { text: 'हिन्दू राष्ट्र', count: 500, percentage: 7 },
        { text: 'सबै धर्मलाई सम्मान', count: 3100, percentage: 41 },
        { text: 'धर्म र राज्य अलग', count: 1100, percentage: 15 },
      ]},
      { question: 'समावेशी प्रतिनिधित्व', topAnswer: 'दुबै सन्तुलन', count: 2650, percentage: 35, answers: [
        { text: 'आरक्षण जारी', count: 2200, percentage: 29 },
        { text: 'योग्यताको आधारमा', count: 1300, percentage: 17 },
        { text: 'दुबै सन्तुलन', count: 2650, percentage: 35 },
        { text: 'समय सीमा आरक्षण', count: 1350, percentage: 19 },
      ]},
      { question: 'न्यायपालिका स्वतन्त्रता', topAnswer: 'पूर्ण स्वतन्त्र', count: 3500, percentage: 47, answers: [
        { text: 'पूर्ण स्वतन्त्र', count: 3500, percentage: 47 },
        { text: 'जनताप्रति जवाफदेही', count: 1800, percentage: 24 },
        { text: 'सुधार सहित स्वतन्त्रता', count: 1500, percentage: 20 },
        { text: 'सफाइ अभियान', count: 700, percentage: 9 },
      ]},
      { question: 'मौलिक अधिकार', topAnswer: 'रोजगारीको अधिकार', count: 2900, percentage: 39, answers: [
        { text: 'अभिव्यक्ति स्वतन्त्रता', count: 2100, percentage: 28 },
        { text: 'रोजगारीको अधिकार', count: 2900, percentage: 39 },
        { text: 'सामाजिक सुरक्षा', count: 1500, percentage: 20 },
        { text: 'सूचनाको अधिकार', count: 1000, percentage: 13 },
      ]},
    ],
  },
  {
    id: 'quiz-3',
    title: 'विकास प्राथमिकता क्विज',
    description: 'नेपालको विकासमा तपाईंको प्राथमिकता पत्ता लगाउनुहोस्',
    timeLabel: 'साँझको क्विज',
    difficulty: 'सजिलो',
    questionCount: 5,
    participantCount: 2567,
    questions: [
      {
        question: 'नेपालको सबैभन्दा ठूलो विकास चुनौती के हो?',
        options: [
          { text: 'पूर्वाधार विकास (सडक, विजुली, इन्टरनेट)', parties: { partyA: 2, partyB: 1 } },
          { text: 'रोजगारी सिर्जना र युवा पलायन रोक्ने', parties: { partyB: 2, partyC: 1 } },
          { text: 'भ्रष्टाचार नियन्त्रण र सुशासन', parties: { partyD: 2 } },
          { text: 'शिक्षा र स्वास्थ्य सेवा सुधार', parties: { partyC: 2, partyE: 1 } },
        ],
      },
      {
        question: 'वैदेशिक रोजगारीबारे तपाईंको विचार?',
        options: [
          { text: 'देश भित्रै रोजगारी सिर्जना गर्नुपर्छ', parties: { partyB: 2 } },
          { text: 'व्यवस्थित वैदेशिक रोजगारी जारी राख्नुपर्छ', parties: { partyA: 2 } },
          { text: 'सीपमूलक तालिम दिएर पठाउनुपर्छ', parties: { partyC: 1, partyD: 1 } },
          { text: 'रेमिट्यान्सलाई उत्पादनशील क्षेत्रमा लगानी गर्नुपर्छ', parties: { partyE: 2 } },
        ],
      },
      {
        question: 'पर्यटन विकासको उत्तम तरिका के हो?',
        options: [
          { text: 'पूर्वाधार र अन्तर्राष्ट्रिय विमानस्थल विकास', parties: { partyA: 2 } },
          { text: 'सामुदायिक पर्यटन प्रवर्द्धन', parties: { partyC: 2 } },
          { text: 'डिजिटल मार्केटिङ र ब्राण्डिङ', parties: { partyD: 2 } },
          { text: 'पर्यटन क्षेत्रमा विदेशी लगानी', parties: { partyE: 2 } },
        ],
      },
      {
        question: 'ऊर्जा विकासमा कुन क्षेत्रमा जोड दिनुपर्छ?',
        options: [
          { text: 'जलविद्युत विकास', parties: { partyA: 2, partyB: 1 } },
          { text: 'सौर्य ऊर्जा र वैकल्पिक ऊर्जा', parties: { partyD: 2 } },
          { text: 'भारत र चीनसँग ऊर्जा व्यापार', parties: { partyE: 2 } },
          { text: 'ग्रामीण विद्युतीकरण', parties: { partyC: 2 } },
        ],
      },
      {
        question: 'प्रविधि विकासमा सरकारको भूमिका के हुनुपर्छ?',
        options: [
          { text: 'डिजिटल नेपाल अभियान चलाउनुपर्छ', parties: { partyD: 2 } },
          { text: 'स्टार्टअप र आईटी क्षेत्रमा लगानी गर्नुपर्छ', parties: { partyA: 2 } },
          { text: 'ग्रामीण क्षेत्रमा इन्टरनेट पुर्याउनुपर्छ', parties: { partyB: 2, partyC: 1 } },
          { text: 'साइबर सुरक्षा र डाटा गोपनीयता कानुन बनाउनुपर्छ', parties: { partyE: 2 } },
        ],
      },
    ],
    leaderboard: [
      { question: 'विकास चुनौती', topAnswer: 'रोजगारी सिर्जना र युवा पलायन', count: 3200, percentage: 40, answers: [
        { text: 'पूर्वाधार विकास', count: 2000, percentage: 25 },
        { text: 'रोजगारी सिर्जना', count: 3200, percentage: 40 },
        { text: 'भ्रष्टाचार नियन्त्रण', count: 1800, percentage: 23 },
        { text: 'शिक्षा र स्वास्थ्य', count: 1000, percentage: 12 },
      ]},
      { question: 'वैदेशिक रोजगारी', topAnswer: 'देश भित्रै रोजगारी सिर्जना', count: 2800, percentage: 35, answers: [
        { text: 'देश भित्रै रोजगारी', count: 2800, percentage: 35 },
        { text: 'व्यवस्थित वैदेशिक रोजगारी', count: 2200, percentage: 28 },
        { text: 'सीपमूलक तालिम', count: 1600, percentage: 20 },
        { text: 'रेमिट्यान्स लगानी', count: 1400, percentage: 17 },
      ]},
      { question: 'पर्यटन विकास', topAnswer: 'सामुदायिक पर्यटन प्रवर्द्धन', count: 2500, percentage: 32, answers: [
        { text: 'पूर्वाधार र विमानस्थल', count: 2400, percentage: 31 },
        { text: 'सामुदायिक पर्यटन', count: 2500, percentage: 32 },
        { text: 'डिजिटल मार्केटिङ', count: 1600, percentage: 20 },
        { text: 'विदेशी लगानी', count: 1300, percentage: 17 },
      ]},
      { question: 'ऊर्जा विकास', topAnswer: 'जलविद्युत विकास', count: 3000, percentage: 38, answers: [
        { text: 'जलविद्युत', count: 3000, percentage: 38 },
        { text: 'सौर्य ऊर्जा', count: 2200, percentage: 28 },
        { text: 'ऊर्जा व्यापार', count: 1400, percentage: 18 },
        { text: 'ग्रामीण विद्युतीकरण', count: 1300, percentage: 16 },
      ]},
      { question: 'प्रविधि विकास', topAnswer: 'ग्रामीण इन्टरनेट', count: 2700, percentage: 34, answers: [
        { text: 'डिजिटल नेपाल', count: 2200, percentage: 28 },
        { text: 'स्टार्टअप लगानी', count: 1600, percentage: 20 },
        { text: 'ग्रामीण इन्टरनेट', count: 2700, percentage: 34 },
        { text: 'साइबर सुरक्षा कानुन', count: 1500, percentage: 18 },
      ]},
    ],
  },
  {
    id: 'quiz-4',
    title: 'निर्वाचन ज्ञान क्विज',
    description: 'नेपालको निर्वाचन प्रणालीबारे तपाईंको ज्ञान परीक्षण गर्नुहोस्',
    timeLabel: 'बेलुकाको क्विज',
    difficulty: 'कठिन',
    questionCount: 5,
    participantCount: 1894,
    questions: [
      {
        question: 'नेपालमा कुन निर्वाचन प्रणाली लागू छ?',
        options: [
          { text: 'मिश्रित निर्वाचन प्रणाली (प्रत्यक्ष + समानुपातिक)', parties: { partyA: 2 } },
          { text: 'पूर्ण समानुपातिक प्रणाली', parties: { partyC: 2 } },
          { text: 'पूर्ण प्रत्यक्ष निर्वाचन प्रणाली', parties: { partyB: 2 } },
          { text: 'राष्ट्रपतीय प्रणाली', parties: { partyD: 1 } },
        ],
      },
      {
        question: 'प्रतिनिधि सभामा कति सदस्य छन्?',
        options: [
          { text: '२७५ सदस्य', parties: { partyA: 2 } },
          { text: '३३० सदस्य', parties: { partyB: 1 } },
          { text: '२०१ सदस्य', parties: { partyC: 1 } },
          { text: '१६५ सदस्य', parties: { partyD: 0 } },
        ],
      },
      {
        question: 'मतदानको न्यूनतम उमेर कति हो?',
        options: [
          { text: '१८ वर्ष', parties: { partyA: 2 } },
          { text: '२१ वर्ष', parties: { partyB: 1 } },
          { text: '१६ वर्ष', parties: { partyD: 1 } },
          { text: '२५ वर्ष', parties: { partyC: 0 } },
        ],
      },
      {
        question: 'निर्वाचन आयोगको मुख्य काम के हो?',
        options: [
          { text: 'स्वतन्त्र र निष्पक्ष निर्वाचन सञ्चालन', parties: { partyA: 2, partyD: 2 } },
          { text: 'राजनीतिक दल दर्ता', parties: { partyB: 1 } },
          { text: 'मतदाता शिक्षा', parties: { partyC: 1, partyE: 1 } },
          { text: 'निर्वाचन विवाद समाधान', parties: { partyE: 1 } },
        ],
      },
      {
        question: 'समानुपातिक निर्वाचनमा कति सिट छन्?',
        options: [
          { text: '११० सिट', parties: { partyA: 2 } },
          { text: '१६५ सिट', parties: { partyB: 1 } },
          { text: '५९ सिट', parties: { partyC: 0 } },
          { text: '२७५ सिट', parties: { partyD: 0 } },
        ],
      },
    ],
    leaderboard: [
      { question: 'निर्वाचन प्रणाली', topAnswer: 'मिश्रित निर्वाचन प्रणाली', count: 3800, percentage: 64, answers: [
        { text: 'मिश्रित प्रणाली', count: 3800, percentage: 64 },
        { text: 'समानुपातिक', count: 1100, percentage: 18 },
        { text: 'प्रत्यक्ष', count: 800, percentage: 14 },
        { text: 'राष्ट्रपतीय', count: 200, percentage: 4 },
      ]},
      { question: 'प्रतिनिधि सभा सदस्य', topAnswer: '२७५ सदस्य', count: 4200, percentage: 71, answers: [
        { text: '२७५ सदस्य', count: 4200, percentage: 71 },
        { text: '३३० सदस्य', count: 900, percentage: 15 },
        { text: '२०१ सदस्य', count: 600, percentage: 10 },
        { text: '१६५ सदस्य', count: 200, percentage: 4 },
      ]},
      { question: 'मतदानको उमेर', topAnswer: '१८ वर्ष', count: 5100, percentage: 86, answers: [
        { text: '१८ वर्ष', count: 5100, percentage: 86 },
        { text: '२१ वर्ष', count: 500, percentage: 8 },
        { text: '१६ वर्ष', count: 250, percentage: 4 },
        { text: '२५ वर्ष', count: 100, percentage: 2 },
      ]},
      { question: 'निर्वाचन आयोगको काम', topAnswer: 'स्वतन्त्र र निष्पक्ष निर्वाचन', count: 4500, percentage: 76, answers: [
        { text: 'निष्पक्ष निर्वाचन', count: 4500, percentage: 76 },
        { text: 'दल दर्ता', count: 600, percentage: 10 },
        { text: 'मतदाता शिक्षा', count: 500, percentage: 8 },
        { text: 'विवाद समाधान', count: 350, percentage: 6 },
      ]},
      { question: 'समानुपातिक सिट', topAnswer: '११० सिट', count: 3600, percentage: 61, answers: [
        { text: '११० सिट', count: 3600, percentage: 61 },
        { text: '१६५ सिट', count: 1200, percentage: 20 },
        { text: '५९ सिट', count: 700, percentage: 12 },
        { text: '२७५ सिट', count: 400, percentage: 7 },
      ]},
    ],
  },
];

export default function Quiz() {
  const [selectedQuiz, setSelectedQuiz] = useState<QuizData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({ partyA: 0, partyB: 0, partyC: 0, partyD: 0, partyE: 0 });
  const [showResults, setShowResults] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handleAnswer = (parties: Record<string, number>) => {
    if (!selectedQuiz) return;
    const newScores = { ...scores };
    Object.entries(parties).forEach(([party, points]) => {
      newScores[party] = (newScores[party] || 0) + points;
    });
    setScores(newScores);

    if (currentQuestion < selectedQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const getResults = () => {
    return Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setScores({ partyA: 0, partyB: 0, partyC: 0, partyD: 0, partyE: 0 });
    setShowResults(false);
    setShowLeaderboard(false);
  };

  const progress = selectedQuiz ? ((currentQuestion + 1) / selectedQuiz.questions.length) * 100 : 0;

  /* ───── Leaderboard Modal ───── */
  if (showLeaderboard && selectedQuiz) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <section className="py-10 flex-1">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Trophy size={28} className="text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">उत्तर लिडरबोर्ड</h1>
                  <p className="text-sm text-muted-foreground">{selectedQuiz.title}</p>
                </div>
              </div>
              <button onClick={() => setShowLeaderboard(false)} className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors" aria-label="बन्द गर्नुहोस्">
                <X size={20} className="text-foreground" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-6">प्रत्येक प्रश्नमा सबैभन्दा धेरै रोजिएको उत्तर र तिनको वितरण</p>

            <div className="flex flex-col gap-5">
              {selectedQuiz.leaderboard.map((item, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-foreground">{item.question}</p>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{item.count.toLocaleString()} उत्तर</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {item.answers.map((ans, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs ${j === 0 ? 'font-bold text-primary' : 'text-muted-foreground'}`}>{ans.text}</span>
                            <span className={`text-xs font-bold ${j === 0 ? 'text-primary' : 'text-muted-foreground'}`}>{ans.percentage}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div className={`${j === 0 ? 'bg-primary' : 'bg-muted-foreground/30'} h-1.5 rounded-full transition-all`} style={{ width: `${ans.percentage}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-center mt-8">
              <button onClick={() => setShowLeaderboard(false)} className="bg-primary text-primary-foreground font-bold py-2.5 px-6 rounded-lg hover:bg-primary/90 transition-colors text-sm">
                नतिजामा फर्कनुहोस्
              </button>
              <button onClick={resetQuiz} className="bg-muted text-foreground font-bold py-2.5 px-6 rounded-lg hover:bg-muted/80 transition-colors text-sm">
                अर्को क्विज खेल्नुहोस्
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  /* ───── Quiz Results ───── */
  if (showResults && selectedQuiz) {
    const results = getResults();
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button onClick={resetQuiz} className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors text-sm">
            <ArrowLeft size={18} />
            सबै क्विजहरू हेर्नुहोस्
          </button>
        </div>

        <section className="py-10 flex-1">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-foreground mb-2">तपाईंको नतिजा</h1>
              <p className="text-muted-foreground">{selectedQuiz.title} - तपाईंका उत्तरका आधारमा</p>
            </div>

            {/* Disclaimer */}
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 mb-8 flex items-start gap-3">
              <AlertTriangle size={20} className="text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                यो क्विजले निर्वाचनमा कुनै प्रभाव पार्दैन। यो केवल शैक्षिक उद्देश्यको लागि हो। कृपया प्रत्येक दलको पूर्ण घोषणापत्र अध्ययन गर्नुहोस्।
              </p>
            </div>

            <div className="flex flex-col gap-6 mb-10">
              {results.map(([partyKey, score], idx) => {
                const party = partyProfiles[partyKey];
                const maxPossible = selectedQuiz.questions.length * 2;
                const percentage = Math.round((score / maxPossible) * 100);
                return (
                  <div key={partyKey} className="bg-card rounded-xl p-6 border border-border">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-3xl font-extrabold text-muted-foreground">#{idx + 1}</span>
                      <div className={`${party.color} w-12 h-12 rounded-lg flex items-center justify-center text-primary-foreground text-xs font-bold`}>
                        {party.name.substring(0, 4)}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">{party.name}</h2>
                        <p className="text-sm text-muted-foreground">{party.description}</p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-muted-foreground">मिलान स्कोर</span>
                        <span className="text-lg font-bold text-foreground">{percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className={`${party.color} h-2.5 rounded-full transition-all`} style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {party.policies.map((policy, i) => (
                        <span key={i} className="bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full text-xs font-semibold">{policy}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setShowLeaderboard(true)}
                className="bg-secondary text-secondary-foreground font-bold py-3 px-6 rounded-lg hover:bg-secondary/90 transition-colors text-sm flex items-center gap-2"
              >
                <BarChart3 size={18} />
                उत्तर लिडरबोर्ड हेर्नुहोस्
              </button>
              <button
                onClick={() => {
                  setCurrentQuestion(0);
                  setScores({ partyA: 0, partyB: 0, partyC: 0, partyD: 0, partyE: 0 });
                  setShowResults(false);
                }}
                className="bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                फेरि खेल्नुहोस्
              </button>
              <button onClick={resetQuiz} className="bg-muted text-foreground font-bold py-3 px-6 rounded-lg hover:bg-muted/80 transition-colors text-sm">
                अर्को क्विज खेल्नुहोस्
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  /* ───── Quiz In-Progress ───── */
  if (selectedQuiz) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button onClick={resetQuiz} className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors text-sm">
            <ArrowLeft size={18} />
            सबै क्विजहरू हेर्नुहोस्
          </button>
        </div>

        <section className="py-10 flex-1">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-foreground mb-2">{selectedQuiz.title}</h1>
              <p className="text-muted-foreground mb-6">{selectedQuiz.description}</p>

              {/* Disclaimer */}
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3 mb-6 flex items-start gap-2">
                <AlertTriangle size={16} className="text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-xs text-foreground">यो क्विजले निर्वाचनमा कुनै प्रभाव पार्दैन। यो केवल शैक्षिक उद्देश्यको लागि हो।</p>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">
                    प्रश्न {currentQuestion + 1} / {selectedQuiz.questions.length}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-bold text-foreground mb-6">{selectedQuiz.questions[currentQuestion].question}</h2>
              <div className="flex flex-col gap-3">
                {selectedQuiz.questions[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option.parties)}
                    className="w-full p-4 text-left bg-background border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200"
                  >
                    <p className="font-semibold text-foreground text-sm">{option.text}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 bg-primary/5 border border-primary/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                इमानदारीपूर्वक उत्तर दिनुहोस् - कुनै सही वा गलत उत्तर छैन।
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  /* ───── Quiz Selection (Landing) ───── */
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors text-sm">
          <ArrowLeft size={18} />
          गृहपृष्ठमा फर्कनुहोस्
        </Link>
      </div>

      <section className="bg-card border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy size={28} className="text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">आजका क्विजहरू</h1>
          </div>
          <p className="text-muted-foreground">हरेक दिन ३-५ वटा नयाँ क्विजहरू - खेल्नुहोस् र आफ्नो ज्ञान परीक्षण गर्नुहोस्</p>

          {/* Disclaimer */}
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3 mt-4 flex items-start gap-2">
            <AlertTriangle size={16} className="text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-xs text-foreground">यी क्विजहरूले निर्वाचनमा कुनै प्रभाव पार्दैनन्। यो केवल शैक्षिक र मनोरञ्जनात्मक उद्देश्यको लागि हो।</p>
          </div>
        </div>
      </section>

      <section className="py-10 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dailyQuizzes.map((quiz) => (
              <button
                key={quiz.id}
                onClick={() => setSelectedQuiz(quiz)}
                className="bg-card border border-border rounded-xl p-6 text-left hover:border-primary hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Clock size={12} />
                    {quiz.timeLabel}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    quiz.difficulty === 'सजिलो' ? 'bg-green-100 text-green-700' :
                    quiz.difficulty === 'मध्यम' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {quiz.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{quiz.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{quiz.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{quiz.questionCount} प्रश्न</span>
                    <span>{quiz.participantCount.toLocaleString()} सहभागी</span>
                  </div>
                  <ChevronRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
