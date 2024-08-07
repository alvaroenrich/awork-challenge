(global as any).window = {
  innerHeight: 800,
  // add more props if needed
};

(global as any).document = {
  createElement: () => ({}),
};
