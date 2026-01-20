# Belasting & Toeslagen Calculator 2026

Een web applicatie voor het berekenen van Nederlandse belastingen en toeslagen over 2026.

## Functionaliteit

- **Box 1 berekening**: Inkomsten uit werk en woning
  - Brutoloon
  - Eigenwoningforfait (0,35% van WOZ-waarde)
  - Aftrek hypotheekrente
  - Aftrek arbeidsongeschiktheidsverzekering
  - Belastingtarieven: 35,75% / 37,56% / 49,5%

- **Box 3 berekening**: Sparen en beleggen
  - Bankrekeningen (rendement 1,28%)
  - Beleggingen (rendement 6,00%)
  - Schulden (rendement 2,70% na €3.800 drempel)
  - Heffingsvrij vermogen: €57.684 per persoon

- **Heffingskortingen**:
  - Algemene heffingskorting
  - Arbeidskorting
  - Inkomensafhankelijke combinatiekorting (IACK)

- **Toeslagen**:
  - Kindgebonden budget (automatisch berekend)
  - Kinderopvangtoeslag (automatisch berekend)
  - Kinderbijslag (automatisch berekend)

## Gebruik

1. Open `index.html` in een moderne webbrowser
2. Vul de stamgegevens in (fiscaal partner, kinderen, WOZ-waarde)
3. Vul Box 1 gegevens in (loon, hypotheek, etc.)
4. Vul Box 3 gegevens in (vermogen)
5. Klik op "Bereken belasting en toeslagen"

## Technologie

- React 18
- Tailwind CSS
- Vanilla JavaScript (geen build process nodig)

## Disclaimer

Deze calculator is bedoeld voor indicatieve doeleinden. De werkelijke belasting kan afwijken. Voor officiële berekeningen raadpleeg de Belastingdienst of een belastingadviseur.

## Licentie

MIT License
