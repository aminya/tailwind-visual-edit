export interface SpacingState {
  paddingTop: string | null;
  paddingRight: string | null;
  paddingBottom: string | null;
  paddingLeft: string | null;
  marginTop: string | null;
  marginRight: string | null;
  marginBottom: string | null;
  marginLeft: string | null;
  gap: string | null;
}

export interface TypographyState {
  fontSize: string | null;
  fontFamily: string | null;
  fontWeight: string | null;
  fontStyle: string | null;
  lineHeight: string | null;
  letterSpacing: string | null;
  textTransform: string | null;
  textAlign: string | null;
  textDecoration: string | null;
}

export interface ColorState {
  textColor: string | null;
  backgroundColor: string | null;
}

export interface EffectsState {
  borderRadius: string | null;
  shadow: string | null;
  opacity: string | null;
  borderWidth: string | null;
  borderStyle: string | null;
  borderColor: string | null;
}

export interface PanelState {
  elementTag: string | null;
  allClasses: string[];
  spacing: SpacingState;
  typography: TypographyState;
  color: ColorState;
  effects: EffectsState;
  cursorInClassAttribute: boolean;
}

export function createEmptyPanelState(): PanelState {
  return {
    elementTag: null,
    allClasses: [],
    spacing: {
      paddingTop: null, paddingRight: null, paddingBottom: null, paddingLeft: null,
      marginTop: null, marginRight: null, marginBottom: null, marginLeft: null,
      gap: null,
    },
    typography: {
      fontSize: null, fontFamily: null, fontWeight: null, fontStyle: null,
      lineHeight: null, letterSpacing: null, textTransform: null, textAlign: null,
      textDecoration: null,
    },
    color: {
      textColor: null, backgroundColor: null,
    },
    effects: {
      borderRadius: null, shadow: null, opacity: null,
      borderWidth: null, borderStyle: null, borderColor: null,
    },
    cursorInClassAttribute: false,
  };
}
