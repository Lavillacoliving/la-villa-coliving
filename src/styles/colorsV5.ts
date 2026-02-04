// VERSION 5: MINIMALISTE + ÉNERGIE + MODERNITÉ
// Palette enrichie avec alternance de couleurs vibrantes mais harmonieuses

export const colors = {
  // Fonds (inchangés)
  white: '#ffffff',
  offWhite: '#fafafa',
  lightGray: '#f5f5f5',
  
  // Texte (inchangé)
  dark: '#1a1a1a',
  gray: '#666666',
  lightText: '#999999',
  
  // Bordures (inchangées)
  border: '#e5e5e5',
  
  // COULEURS D'ACCENT - Alternance moderne et énergique
  // Couleur principale: Corail vif (plus moderne que le rouge brique)
  primary: '#ff6b5b',      // Corail vif - énergie, chaleur
  primaryHover: '#e85a4a', // Corail foncé pour hover
  
  // Couleurs secondaires pour alternance
  accent1: '#4ecdc4',      // Turquoise - fraîcheur, modernité
  accent2: '#ffe66d',      // Jaune moutarde - énergie, optimisme
  accent3: '#a8e6cf',      // Menthe douce - calme, nature
  accent4: '#ff8b94',      // Rose saumon - chaleur, accueil
  
  // Gradients
  gradientPrimary: 'linear-gradient(135deg, #ff6b5b 0%, #ff8b94 100%)',
  gradientCool: 'linear-gradient(135deg, #4ecdc4 0%, #a8e6cf 100%)',
  gradientWarm: 'linear-gradient(135deg, #ffe66d 0%, #ff6b5b 100%)',
};

// Fonction pour obtenir une couleur d'accent selon l'index
export const getAccentColor = (index: number) => {
  const accents = [colors.primary, colors.accent1, colors.accent2, colors.accent3, colors.accent4];
  return accents[index % accents.length];
};

export default colors;
