module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          // Expo sets transform.engine=hermes, which defaults to the
          // hermes-stable profile. That profile assumes Hermes can run
          // native private fields (#foo), but the Hermes build used by Expo
          // Go / hermesc still rejects them at runtime. Force the default
          // profile so RN's private web APIs (e.g. DOMRectReadOnly) are
          // transpiled.
          unstable_transformProfile: "default",
        },
      ],
    ],
  };
};
