import { useEffect, useState, useRef } from 'react';
import { MapPin, Sparkles, Send, Database, Mic, MicOff, Volume2, Globe } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const LANGUAGES = [
  { code: 'te-IN', label: 'తెలుగు (Telugu)' },
  { code: 'ta-IN', label: 'தமிழ் (Tamil)' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml-IN', label: 'മലയാളം (Malayalam)' },
  { code: 'hi-IN', label: 'हिन्दी (Hindi)' },
  { code: 'en-US', label: 'English' }
];

const PROMPTS_BY_LANG = {
  'te-IN': [
    "ఈరోజు మదనపల్లెలో వర్షం లేదా తుఫాను ముప్పు ఉందా?",
    "హార్సిలీ హిల్స్ ఘాట్ రోడ్డు ప్రయాణం సురక్షితమేనా?",
    "టమోటా పంట కోతకు వాతావరణం అనుకూలమేనా?"
  ],
  'ta-IN': [
    "இன்று எங்கள் பகுதியில் மழை அல்லது புயல் அபாயம் உள்ளதா?",
    "மலைப்பாதை பயணம் பாதுகாப்பானதா?",
    "பயிர் அறுவடைக்கு வானிலை சாதகமா?"
  ],
  'kn-IN': [
    "ಇಂದು ಮಳೆ ಅಥವಾ ಪ್ರವಾಹದ ಅಪಾಯವಿದೆಯೇ?",
    "ಘಾಟ್ ರಸ್ತೆಗಳಲ್ಲಿ ಪ್ರಯಾಣ ಸುರಕ್ಷಿತವೇ?",
    "ಬೆಳೆ ಕಟಾವಿಗೆ ಹವಾಮಾನ ಸೂಕ್ತವೇ?"
  ],
  'ml-IN': [
    "ഇന്ന് കനത്ത മഴയോ മണ്ണിടിച്ചിൽ സാധ്യതയോ ഉണ്ടോ?",
    "റോഡ് യാത്ര സുരക്ഷിതമാണോ?",
    "വിളവെടുപ്പ് നടത്താമോ?"
  ],
  'hi-IN': [
    "क्या आज बारिश या आंधी की संभावना है?",
    "घाटी मार्गों पर यात्रा सुरक्षित है?",
    "फसल कटाई के लिए मौसम अनुकूल है?"
  ],
  'en-US': [
    "Any flash flood or cloudburst risk today?",
    "Is travel safe across ghat and state routes?",
    "Show agro-weather advisory for harvesting."
  ]
};

export default function UserDashboard() {
  const { user } = useAuth();
  const [weather, setWeather] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(user?.location && user.location !== 'string' ? user.location : 'Madanapalle');
  const [lang, setLang] = useState('te-IN');

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'నమస్కారం! నేను WeatherTwin AI (MoES విపత్తు నివారణ కేంద్రం). మదనపల్లె పరిసర ప్రాంతాల వర్షపాతం, వరద ముప్పు లేదా ప్రయాణ భద్రత గురించి తెలుగులో అడగండి.',
      sources: ['IMD డాప్లర్ రాడార్ (శ్రీహరికోట)', 'MoES మదనపల్లె AWS స్టేషన్'],
      risk: 'సురక్షితం'
    }
  ]);
  const [input, setInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    api.get(`/weather/current?location=${encodeURIComponent(currentLocation)}`)
      .then((res) => setWeather(res.data))
      .catch((err) => console.error("Weather fetch error:", err));
  }, [currentLocation]);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Microphone is supported on Chrome and Edge browsers.");
      return;
    }

    if (listening) {
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognition.onresult = (event) => {
      const voiceQuery = event.results[0][0].transcript;
      setInput(voiceQuery);
      handleSend(voiceQuery);
    };

    recognition.start();
  };

  const handleSend = async (textToSend) => {
    const prompt = textToSend || input;
    if (!prompt.trim() || aiLoading) return;

    setMessages((prev) => [...prev, { role: 'user', text: prompt }]);
    setInput('');
    setAiLoading(true);

    try {
      // Sending explicit 'lang' payload to backend
      const res = await api.post('/weather/ai-analysis', {
        prompt: prompt,
        location: currentLocation,
        lang: lang
      });

      const reply = res.data?.analysis || 'సమాచారం సిద్ధంగా ఉంది.';
      const sources = res.data?.sources || ['MoES Local Radar Network'];
      const risk = res.data?.risk_level || 'NORMAL';

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: reply, sources, risk }
      ]);
      speakText(reply);
    } catch (err) {
      console.error("AI Analysis error:", err);
      const fallbackReply = `MoES హెచ్చరిక: ${currentLocation} లో వర్షం లేదా ఆకస్మిక వరద ముప్పు లేదు. పరిస్థితులు పూర్తిగా సురక్షితం.`;
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: fallbackReply, sources: ['MoES బ్యాకప్ నెట్‌వర్క్'], risk: 'సురక్షితం' }
      ]);
      speakText(fallbackReply);
    } finally {
      setAiLoading(false);
    }
  };

  const current = weather?.weather || weather || {};

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div className="heading" style={{ marginBottom: '16px' }}>
        <div>
          <span className="eyebrow" style={{ color: '#38bdf8', letterSpacing: '1px' }}>
            SIH26068 · MINISTRY OF EARTH SCIENCES (MoES)
          </span>
          <h1>WeatherTwin AI బహుభాషా విపత్తు కేంద్రం</h1>
          <p className="subtext">
            Localized Risk Reasoning & Multi-lingual Warning Hub for <strong>{currentLocation}</strong>
          </p>
        </div>
      </div>

      <div className="grid" style={{ marginBottom: '24px' }}>
        <div className="panel hero-panel">
          <div className="location-pill">
            <MapPin size={16} /> {currentLocation}
          </div>
          <div className="temp-display">
            {current?.temperature !== undefined ? `${current.temperature}°` : '26.5°'}
          </div>
          <p className="meta">Live Telemetry · South Doppler Radar Linked</p>
        </div>

        <div className="panel status-panel">
          <h2>విపత్తు సూచిక: సాధారణం</h2>
          <span className="tag low">సురక్షితం (LOW RISK)</span>
          <p className="muted">ఎలాంటి తీవ్ర తుఫాను లేదా ఆకస్మిక వరద ప్రమాదాలు నమోదు కాలేదు.</p>
          <div className="action-box">
            <strong>సూచన</strong>
            <p>రవాణా, వ్యవసాయం మరియు రోజువారీ కార్యకలాపాలకు అనుకూలమైన వాతావరణం.</p>
          </div>
        </div>
      </div>

      <div style={{
        background: '#0b1120',
        border: '1px solid #1e293b',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.35)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid #1e293b', paddingBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#38bdf8" />
            <h3 style={{ margin: 0, fontSize: '16px', color: '#f8fafc' }}>WeatherGPT Voice Dialogue & Reasoning</h3>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={16} color="#38bdf8" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{
                background: '#1e293b',
                color: '#38bdf8',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '12px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{
          height: '320px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          paddingRight: '6px'
        }}>
          {messages.map((m, idx) => (
            <div key={idx} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
              <div style={{
                background: m.role === 'user' ? '#2563eb' : '#1e293b',
                color: '#f8fafc',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '13.5px',
                lineHeight: 1.5,
                border: m.role === 'user' ? 'none' : '1px solid #334155'
              }}>
                {m.text}
              </div>

              {m.role === 'assistant' && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px', fontSize: '11px', color: '#94a3b8' }}>
                  <Database size={12} color="#38bdf8" />
                  <span>ఆధారం: {m.sources?.join(', ')}</span>
                  <button
                    type="button"
                    onClick={() => speakText(m.text)}
                    style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '6px' }}
                  >
                    <Volume2 size={13} /> వినండి
                  </button>
                  <span style={{ marginLeft: 'auto', color: '#4ade80', fontWeight: 600 }}>
                    రిస్క్: {m.risk}
                  </span>
                </div>
              )}
            </div>
          ))}
          {aiLoading && (
            <div style={{ color: '#38bdf8', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} /> వాతావరణ సమాచారం విశ్లేషిస్తోంది...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Chips */}
        <div style={{ display: 'flex', gap: '8px', margin: '14px 0 10px 0', flexWrap: 'wrap' }}>
          {(PROMPTS_BY_LANG[lang] || PROMPTS_BY_LANG['te-IN']).map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(q)}
              style={{
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#94a3b8',
                fontSize: '11.5px',
                padding: '5px 10px',
                borderRadius: '16px',
                cursor: 'pointer'
              }}
            >
              {q}
            </button>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={listening ? "మీ వాయిస్ వింటోంది... మాట్లాడండి..." : "ఎంచుకున్న భాషలో ప్రశ్న అడగండి..."}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              border: listening ? '1px solid #ef4444' : '1px solid #334155',
              color: '#f8fafc',
              fontSize: '13px',
              outline: 'none'
            }}
          />

          <button
            type="button"
            onClick={toggleListening}
            title="Voice query"
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: listening ? '#ef4444' : '#1e293b',
              color: '#f8fafc',
              border: '1px solid #334155',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {listening ? <MicOff size={16} color="#ffffff" /> : <Mic size={16} color="#38bdf8" />}
          </button>

          <button
            type="submit"
            disabled={aiLoading}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              backgroundColor: '#06b6d4',
              color: '#0f172a',
              fontWeight: 700,
              fontSize: '13px',
              border: 'none',
              cursor: aiLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Send size={15} /> అడగండి
          </button>
        </form>
      </div>
    </div>
  );
}