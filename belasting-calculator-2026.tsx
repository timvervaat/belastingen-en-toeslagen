import React, { useState } from 'react';
import { Calculator, Users, Home, Baby, Euro, TrendingUp, FileText } from 'lucide-react';

export default function BelastingCalculator() {
  const [fiscaalPartner, setFiscaalPartner] = useState(false);
  const [aantalKinderen, setAantalKinderen] = useState(0);
  const [adres, setAdres] = useState('');
  const [postcode, setPostcode] = useState('');
  const [wozWaarde, setWozWaarde] = useState('');
  const [wozLoading, setWozLoading] = useState(false);
  
  // Box 1 data
  const [brutoLoon, setBrutoLoon] = useState('');
  const [brutoLoonPartner, setBrutoLoonPartner] = useState('');
  const [eigenWoningRente, setEigenWoningRente] = useState('');
  const [eigenWoningRentePartner, setEigenWoningRentePartner] = useState('');
  const [arbeidsongeschiktheid, setArbeidsongeschiktheid] = useState('');
  const [arbeidsongeschiktheidPartner, setArbeidsongeschiktheidPartner] = useState('');
  
  // Box 3 data
  const [bankrekeningen, setBankrekeningen] = useState('');
  const [bankrekeningenPartner, setBankrekeningenPartner] = useState('');
  const [beleggingen, setBeleggingen] = useState('');
  const [beleggingenPartner, setBeleggingenPartner] = useState('');
  const [schulden, setSchulden] = useState('');
  const [schuldenPartner, setSchuldenPartner] = useState('');
  
  // Ingehouden loonheffing
  const [ingehoudenLoonheffing, setIngehoudenLoonheffing] = useState('');
  const [ingehoudenLoonheffingPartner, setIngehoudenLoonheffingPartner] = useState('');
  
  const [resultaten, setResultaten] = useState(null);
  const [activeTab, setActiveTab] = useState('stamgegevens');

  const haalWozWaarde = async () => {
    if (!adres || !postcode) {
      alert('Vul eerst een adres en postcode in');
      return;
    }
    
    setWozLoading(true);
    setTimeout(() => {
      const gesimuleerdeWoz = Math.floor(Math.random() * 200000) + 250000;
      setWozWaarde(gesimuleerdeWoz.toString());
      setWozLoading(false);
      alert('WOZ-waarde opgehaald (gesimuleerd): €' + gesimuleerdeWoz.toLocaleString('nl-NL'));
    }, 1500);
  };

  const berekenBox1 = (brutoInkomen, eigenwoningRente, ao) => {
    const inkomen = parseFloat(brutoInkomen) || 0;
    const rente = parseFloat(eigenwoningRente) || 0;
    const aoVerzekering = parseFloat(ao) || 0;
    
    const wozWaardeNum = parseFloat(wozWaarde) || 0;
    const eigenwoningforfait = wozWaardeNum > 0 ? wozWaardeNum * 0.0035 : 0;
    
    const box1Inkomen = inkomen - rente - aoVerzekering + eigenwoningforfait;
    
    let belasting = 0;
    if (box1Inkomen > 78426) {
      belasting += (box1Inkomen - 78426) * 0.495;
      belasting += (78426 - 38883) * 0.3756;
      belasting += 38883 * 0.3575;
    } else if (box1Inkomen > 38883) {
      belasting += (box1Inkomen - 38883) * 0.3756;
      belasting += 38883 * 0.3575;
    } else if (box1Inkomen > 0) {
      belasting += box1Inkomen * 0.3575;
    }
    
    return { box1Inkomen, belasting };
  };

  const berekenBox3 = (bank, beleg, schuld) => {
    const banktegoeden = parseFloat(bank) || 0;
    const beleggingsVermogen = parseFloat(beleg) || 0;
    const schuldenBedrag = parseFloat(schuld) || 0;
    
    const heffingsVrijVermogen = 57684;
    const totaalBezittingen = banktegoeden + beleggingsVermogen;
    const belastbaarVermogen = Math.max(0, totaalBezittingen - heffingsVrijVermogen - Math.max(0, schuldenBedrag - 3800));
    
    const rendementBank = banktegoeden * 0.0128;
    const rendementBeleggingen = beleggingsVermogen * 0.06;
    const rendementSchulden = schuldenBedrag > 3800 ? (schuldenBedrag - 3800) * 0.027 : 0;
    
    const belastbaarRendement = Math.max(0, rendementBank + rendementBeleggingen - rendementSchulden);
    const box3Belasting = belastbaarRendement * 0.36;
    
    return { belastbaarVermogen, belastbaarRendement, box3Belasting };
  };

  const berekenHeffingskortingen = (verzamelinkomen, arbeidsinkomen) => {
    let ahk = 3115;
    if (verzamelinkomen > 29736) {
      const afbouw = (verzamelinkomen - 29736) * 0.06398;
      ahk = Math.max(0, ahk - afbouw);
    }
    
    let ak = 0;
    if (arbeidsinkomen > 0) {
      if (arbeidsinkomen <= 11491) {
        ak = arbeidsinkomen * 0.08425;
      } else if (arbeidsinkomen <= 25142) {
        ak = 968 + (arbeidsinkomen - 11491) * 0.34503;
      } else if (arbeidsinkomen <= 45592) {
        ak = 5685;
      } else if (arbeidsinkomen <= 132920) {
        ak = Math.max(0, 5685 - (arbeidsinkomen - 45592) * 0.0651);
      }
    }
    
    return { ahk, ak };
  };

  const berekenIACK = (arbeidsinkomen, aantalKinderenParam) => {
    if (aantalKinderenParam === 0 || arbeidsinkomen < 6239) return 0;
    
    let iack = 0;
    if (arbeidsinkomen >= 6239) {
      iack = 3032 * 0.115 * aantalKinderenParam;
      iack = Math.min(3032, iack);
    }
    
    return iack;
  };

  const berekenKindgebondenBudget = (verzamelinkomen, aantalKinderenParam, vermogen) => {
    if (aantalKinderenParam === 0) return 0;
    
    const maxVermogen = fiscaalPartner ? 184633 : 146011;
    if (vermogen > maxVermogen) return 0;
    
    let budget = 0;
    const basisBedragPerKind = 1259;
    
    if (fiscaalPartner) {
      if (verzamelinkomen <= 39141) {
        budget = basisBedragPerKind * aantalKinderenParam * 12;
      } else {
        const afbouw = (verzamelinkomen - 39141) * 0.075;
        budget = Math.max(0, (basisBedragPerKind * aantalKinderenParam * 12) - afbouw);
      }
    } else {
      if (verzamelinkomen <= 29736) {
        budget = basisBedragPerKind * aantalKinderenParam * 12;
      } else {
        const afbouw = (verzamelinkomen - 29736) * 0.075;
        budget = Math.max(0, (basisBedragPerKind * aantalKinderenParam * 12) - afbouw);
      }
    }
    
    return budget;
  };

  const berekenAlles = () => {
    const box1Persoon1 = berekenBox1(brutoLoon, eigenWoningRente, arbeidsongeschiktheid);
    const box3Persoon1 = berekenBox3(bankrekeningen, beleggingen, schulden);
    
    let box1Persoon2 = { box1Inkomen: 0, belasting: 0 };
    let box3Persoon2 = { belastbaarVermogen: 0, belastbaarRendement: 0, box3Belasting: 0 };
    
    if (fiscaalPartner) {
      box1Persoon2 = berekenBox1(brutoLoonPartner, eigenWoningRentePartner, arbeidsongeschiktheidPartner);
      box3Persoon2 = berekenBox3(bankrekeningenPartner, beleggingenPartner, schuldenPartner);
    }
    
    const totaalBox1Inkomen = box1Persoon1.box1Inkomen + box1Persoon2.box1Inkomen;
    const totaalBox1Belasting = box1Persoon1.belasting + box1Persoon2.belasting;
    const totaalBox3Belasting = box3Persoon1.box3Belasting + box3Persoon2.box3Belasting;
    const totaalVermogen = box3Persoon1.belastbaarVermogen + box3Persoon2.belastbaarVermogen;
    
    const verzamelinkomen = totaalBox1Inkomen + box3Persoon1.belastbaarRendement + box3Persoon2.belastbaarRendement;
    const arbeidsinkomen = (parseFloat(brutoLoon) || 0) + (parseFloat(brutoLoonPartner) || 0);
    
    const kortingen1 = berekenHeffingskortingen(verzamelinkomen, parseFloat(brutoLoon) || 0);
    const kortingen2 = fiscaalPartner ? berekenHeffingskortingen(verzamelinkomen, parseFloat(brutoLoonPartner) || 0) : { ahk: 0, ak: 0 };
    
    const iack1 = berekenIACK(parseFloat(brutoLoon) || 0, aantalKinderen);
    const iack2 = fiscaalPartner ? berekenIACK(parseFloat(brutoLoonPartner) || 0, aantalKinderen) : 0;
    
    const totaalHeffingskortingen = kortingen1.ahk + kortingen1.ak + kortingen2.ahk + kortingen2.ak + iack1 + iack2;
    const brutoBelasting = totaalBox1Belasting + totaalBox3Belasting;
    const nettoBelasting = Math.max(0, brutoBelasting - totaalHeffingskortingen);
    
    const totaalIngehoudenLoonheffing = (parseFloat(ingehoudenLoonheffing) || 0) + (parseFloat(ingehoudenLoonheffingPartner) || 0);
    const teBetalenOntvangen = totaalIngehoudenLoonheffing - nettoBelasting;
    
    const kindgebondenBudget = berekenKindgebondenBudget(verzamelinkomen, aantalKinderen, totaalVermogen);
    
    setResultaten({
      persoon1: {
        box1: box1Persoon1,
        box3: box3Persoon1,
        kortingen: kortingen1,
        iack: iack1
      },
      persoon2: {
        box1: box1Persoon2,
        box3: box3Persoon2,
        kortingen: kortingen2,
        iack: iack2
      },
      totaal: {
        box1Belasting: totaalBox1Belasting,
        box3Belasting: totaalBox3Belasting,
        brutoBelasting,
        heffingskortingen: totaalHeffingskortingen,
        nettoBelasting,
        ingehoudenLoonheffing: totaalIngehoudenLoonheffing,
        teBetalenOntvangen,
        kindgebondenBudget,
        verzamelinkomen
      }
    });
    
    setActiveTab('resultaten');
  };

  const formatEuro = (bedrag) => {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(bedrag);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Calculator className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Belasting en Toeslagen Calculator 2026</h1>
            </div>
            <p className="text-blue-100">Bereken uw Nederlandse belasting en toeslagen voor het jaar 2026</p>
          </div>

          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('stamgegevens')}
                className={'flex-1 px-6 py-4 font-semibold transition-colors ' + (activeTab === 'stamgegevens' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700' : 'text-gray-600 hover:bg-gray-50')}
              >
                <Users className="inline mr-2 w-5 h-5" />
                Stamgegevens
              </button>
              <button
                onClick={() => setActiveTab('box1')}
                className={'flex-1 px-6 py-4 font-semibold transition-colors ' + (activeTab === 'box1' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700' : 'text-gray-600 hover:bg-gray-50')}
              >
                <Euro className="inline mr-2 w-5 h-5" />
                Box 1: Werk en Woning
              </button>
              <button
                onClick={() => setActiveTab('box3')}
                className={'flex-1 px-6 py-4 font-semibold transition-colors ' + (activeTab === 'box3' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700' : 'text-gray-600 hover:bg-gray-50')}
              >
                <TrendingUp className="inline mr-2 w-5 h-5" />
                Box 3: Vermogen
              </button>
              <button
                onClick={() => setActiveTab('resultaten')}
                className={'flex-1 px-6 py-4 font-semibold transition-colors ' + (activeTab === 'resultaten' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700' : 'text-gray-600 hover:bg-gray-50')}
              >
                <FileText className="inline mr-2 w-5 h-5" />
                Resultaten
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'stamgegevens' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Stamgegevens</h2>
                
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fiscaalPartner}
                      onChange={(e) => setFiscaalPartner(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="font-semibold text-gray-800">Fiscaal partner</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Baby className="inline w-4 h-4 mr-1" />
                    Aantal kinderen
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={aantalKinderen}
                    onChange={(e) => setAantalKinderen(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold text-gray-800 flex items-center">
                    <Home className="w-5 h-5 mr-2" />
                    WOZ-waarde eigen woning
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                      <input
                        type="text"
                        value={adres}
                        onChange={(e) => setAdres(e.target.value)}
                        placeholder="Straatnaam en huisnummer"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Postcode</label>
                      <input
                        type="text"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        placeholder="1234 AB"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={haalWozWaarde}
                    disabled={wozLoading}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  >
                    {wozLoading ? 'Bezig met ophalen...' : 'Haal WOZ-waarde op'}
                  </button>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">WOZ-waarde (€)</label>
                    <input
                      type="number"
                      value={wozWaarde}
                      onChange={(e) => setWozWaarde(e.target.value)}
                      placeholder="Handmatig invoeren indien bekend"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'box1' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Box 1: Inkomsten uit werk en woning</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-bold text-lg text-gray-800">Persoon 1</h3>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Brutoloon (€)</label>
                      <input
                        type="number"
                        value={brutoLoon}
                        onChange={(e) => setBrutoLoon(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="50000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Betaalde hypotheekrente (€)</label>
                      <input
                        type="number"
                        value={eigenWoningRente}
                        onChange={(e) => setEigenWoningRente(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="8000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Arbeidsongeschiktheidsverzekering (€)</label>
                      <input
                        type="number"
                        value={arbeidsongeschiktheid}
                        onChange={(e) => setArbeidsongeschiktheid(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="2000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Ingehouden loonheffing (€)</label>
                      <input
                        type="number"
                        value={ingehoudenLoonheffing}
                        onChange={(e) => setIngehoudenLoonheffing(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="15000"
                      />
                    </div>
                  </div>

                  {fiscaalPartner && (
                    <div className="space-y-4 bg-indigo-50 p-6 rounded-lg">
                      <h3 className="font-bold text-lg text-gray-800">Persoon 2 (Partner)</h3>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Brutoloon (€)</label>
                        <input
                          type="number"
                          value={brutoLoonPartner}
                          onChange={(e) => setBrutoLoonPartner(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="40000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Betaalde hypotheekrente (€)</label>
                        <input
                          type="number"
                          value={eigenWoningRentePartner}
                          onChange={(e) => setEigenWoningRentePartner(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Arbeidsongeschiktheidsverzekering (€)</label>
                        <input
                          type="number"
                          value={arbeidsongeschiktheidPartner}
                          onChange={(e) => setArbeidsongeschiktheidPartner(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Ingehouden loonheffing (€)</label>
                        <input
                          type="number"
                          value={ingehoudenLoonheffingPartner}
                          onChange={(e) => setIngehoudenLoonheffingPartner(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="12000"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'box3' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Box 3: Sparen en beleggen</h2>
                <p className="text-sm text-gray-600 mb-4">Peildatum: 1 januari 2026</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-bold text-lg text-gray-800">Persoon 1</h3>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Bankrekeningen (€)</label>
                      <input
                        type="number"
                        value={bankrekeningen}
                        onChange={(e) => setBankrekeningen(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="30000"
                      />
                      <p className="text-xs text-gray-500 mt-1">Rendement: 1,28%</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Beleggingen (€)</label>
                      <input
                        type="number"
                        value={beleggingen}
                        onChange={(e) => setBeleggingen(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="50000"
                      />
                      <p className="text-xs text-gray-500 mt-1">Rendement: 6,00%</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Schulden (€)</label>
                      <input
                        type="number"
                        value={schulden}
                        onChange={(e) => setSchulden(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="10000"
                      />
                      <p className="text-xs text-gray-500 mt-1">Rendement: 2,70% (na drempel van €3.800)</p>
                    </div>
                  </div>

                  {fiscaalPartner && (
                    <div className="space-y-4 bg-indigo-50 p-6 rounded-lg">
                      <h3 className="font-bold text-lg text-gray-800">Persoon 2 (Partner)</h3>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Bankrekeningen (€)</label>
                        <input
                          type="number"
                          value={bankrekeningenPartner}
                          onChange={(e) => setBankrekeningenPartner(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="20000"
                        />
                        <p className="text-xs text-gray-500 mt-1">Rendement: 1,28%</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Beleggingen (€)</label>
                        <input
                          type="number"
                          value={beleggingenPartner}
                          onChange={(e) => setBeleggingenPartner(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="30000"
                        />
                        <p className="text-xs text-gray-500 mt-1">Rendement: 6,00%</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Schulden (€)</label>
                        <input
                          type="number"
                          value={schuldenPartner}
                          onChange={(e) => setSchuldenPartner(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="5000"
                        />
                        <p className="text-xs text-gray-500 mt-1">Rendement: 2,70% (na drempel van €3