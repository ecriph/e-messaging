export const Colors = {
  green: '#5fce73',
  strongGreen: '#4d500a',
  lightgreen: '#cbf0d2',
  orange: '#FFD6D4',
  red: '#DC231E',
  white: '#fff',
  black: '#000000',
  grey: '#737070',
  offwhite: '#E5E5E5',
  overlay: '#F4F5F7',
  error: 'red',
  blue: '#1455d8',
  buttons: {
    primary: {
      background: '#5fce73',
      color: '#000',
      disabled: 'rgba(240, 92, 40, 0.3)',
    },

    secondary: {
      background: '#fff',
      color: '#000',
      disabled: 'rgba(0, 0, 0, 0.5)',
    },

    transparent: {
      background: 'rgba(34, 187, 156, 0.15)',
      color: '#22BB9C',
      disabled: 'rgba(240, 92, 40, 0.3)',
    },

    gradient: {
      background:
        'linear-gradient(90deg, #F05C28 42.14%, rgba(43, 12, 2, 0.71) 102.5%)',
      color: '#fff',
      disabled: 'rgba(240, 92, 40, 0.3)',
    },
    outlined: {
      border: '#c7d119',
      color: '#fff',
      disabled: 'rgba(240, 92, 40, 0.3)',
    },
  },

  inputs: {
    placeholder: '#737070',
    textInput: {
      background: '#fff',
      border: '#C4C4C4',
    },
    pin: {
      background: 'rgba(196, 196, 196, 0.33)',
      border: 'rgba(196, 196, 196, 0.33)',
      foreColor: 'black',
      focus: '#227eff',
      error: '#FE5F55',
    },
    outline: {
      background: '#fff',
      border: '#C64848',
      color: '#737070',
    },
  },
};

export const FontSize = {
  small: 8,
  normal2: 10,
  normal1: 12,
  header1: 14,
  header2: 18,
  header3: 20,
  header4: 24,
  header5: 26,
  header6: 28,
  header7: 30,
  subheader: 16,
};

export const NavigationColors = {
  primary: Colors.buttons.primary,
};

export const Font = {
  Bold: 'Bold',
  Light: 'Light',
  Regular: 'Regular',
  Medium: 'Medium',
  SemiBold: 'SemiBold',
};

export default {
  Colors,
  NavigationColors,
  FontSize,
  Font,
};
