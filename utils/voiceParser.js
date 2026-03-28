const ACTIONS = {
  ADD: 'add',
  REMOVE: 'remove',
  MARK_PURCHASED: 'mark_purchased',
};

const normalizeText = (input = '') =>
  input
    .toLowerCase()
    .replace(/[.,!?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const parseVoiceCommand = (inputText) => {
  const text = normalizeText(inputText);

  if (!text) {
    return null;
  }

  // Examples: "add milk", "add 2 apples"
  const addMatch = text.match(/^(add|insert)\s+(?:(\d+)\s+)?(.+)$/);
  if (addMatch) {
    return {
      action: ACTIONS.ADD,
      item: addMatch[3].trim(),
      quantity: addMatch[2] ? Number(addMatch[2]) : 1,
    };
  }

  // Examples: "remove eggs", "delete bread"
  const removeMatch = text.match(/^(remove|delete)\s+(.+)$/);
  if (removeMatch) {
    return {
      action: ACTIONS.REMOVE,
      item: removeMatch[2].trim(),
      quantity: 1,
    };
  }

  // Examples: "mark milk as bought", "mark apples as purchased"
  const markMatch = text.match(/^(mark)\s+(.+)\s+as\s+(bought|purchased|done)$/);
  if (markMatch) {
    return {
      action: ACTIONS.MARK_PURCHASED,
      item: markMatch[2].trim(),
      quantity: 1,
    };
  }

  return null;
};

export { ACTIONS };
