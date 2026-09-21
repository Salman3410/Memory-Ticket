export const DEFAULT_TICKET_CUSTOMIZATION = {
  ticketStyle: "classic",
  ticketAccent: "coral",
  ticketOptions: {
    showLocation: true,
    showDate: true,
    showDescription: true,
    showAdmission: true,
    showTicketNumber: true,
  },
};

export const TICKET_STYLE_OPTIONS = [
  {
    id: "classic",
    label: "Classic",
    description: "The original Memento ticket",
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "Clean and simple",
  },
  {
    id: "vintage",
    label: "Vintage",
    description: "Warm archival style",
  },
];

export const TICKET_ACCENT_OPTIONS = [
  {
    id: "coral",
    label: "Coral",
    color: "#E76F51",
    textColor: "#E76F51",
  },
  {
    id: "navy",
    label: "Navy",
    color: "#34345C",
    textColor: "#34345C",
  },
  {
    id: "yellow",
    label: "Yellow",
    color: "#F5C842",
    textColor: "#8A6900",
  },
  {
    id: "green",
    label: "Green",
    color: "#6C8B74",
    textColor: "#4F6756",
  },
];

const VALID_STYLES = new Set(TICKET_STYLE_OPTIONS.map((item) => item.id));

const VALID_ACCENTS = new Map(
  TICKET_ACCENT_OPTIONS.map((item) => [item.id, item]),
);

export const normalizeTicketCustomization = (value = {}) => {
  const ticketStyle = VALID_STYLES.has(value?.ticketStyle)
    ? value.ticketStyle
    : DEFAULT_TICKET_CUSTOMIZATION.ticketStyle;

  const ticketAccent = VALID_ACCENTS.has(value?.ticketAccent)
    ? value.ticketAccent
    : DEFAULT_TICKET_CUSTOMIZATION.ticketAccent;

  const options =
    value?.ticketOptions &&
    typeof value.ticketOptions === "object" &&
    !Array.isArray(value.ticketOptions)
      ? value.ticketOptions
      : {};

  return {
    ticketStyle,
    ticketAccent,
    ticketOptions: {
      showLocation:
        typeof options.showLocation === "boolean" ? options.showLocation : true,

      showDate: typeof options.showDate === "boolean" ? options.showDate : true,

      showDescription:
        typeof options.showDescription === "boolean"
          ? options.showDescription
          : true,

      showAdmission:
        typeof options.showAdmission === "boolean"
          ? options.showAdmission
          : true,

      showTicketNumber:
        typeof options.showTicketNumber === "boolean"
          ? options.showTicketNumber
          : true,
    },
  };
};

export const getTicketTheme = (customization = {}) => {
  const normalized = normalizeTicketCustomization(customization);

  const accent =
    VALID_ACCENTS.get(normalized.ticketAccent) || TICKET_ACCENT_OPTIONS[0];

  if (normalized.ticketStyle === "minimal") {
    return {
      accentColor: accent.color,
      textColor: accent.textColor,
      backgroundColor: "#FFFFFF",
      imagePlaceholderColor: "#F1F0F6",
      borderColor: "#D9D8E2",
    };
  }

  if (normalized.ticketStyle === "vintage") {
    return {
      accentColor: accent.color,
      textColor: accent.textColor,
      backgroundColor: "#F3E7CF",
      imagePlaceholderColor: "#E8D6B2",
      borderColor: "#C5A978",
    };
  }

  return {
    accentColor: accent.color,
    textColor: accent.textColor,
    backgroundColor: "#F7B900",
    imagePlaceholderColor: "#EAAE00",
    borderColor: "transparent",
  };
};
