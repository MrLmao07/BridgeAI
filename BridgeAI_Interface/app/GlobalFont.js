import React from "react";
import * as RN from "react-native";
import { Platform } from "react-native";

const DEFAULT_FONT_FAMILY = "SourGummy";

const withDefaultFont = (NativeComponent, displayName) => {
  const PatchedComponent = React.forwardRef((props, ref) =>
    React.createElement(NativeComponent, {
      ...props,
      ref,
      style: [{ fontFamily: DEFAULT_FONT_FAMILY }, props.style],
    })
  );
  PatchedComponent.displayName = displayName;
  return PatchedComponent;
};

const applyFontPatch = (componentKey) => {
  try {
    Object.defineProperty(RN, componentKey, {
      get: () => withDefaultFont(RN[componentKey], componentKey),
      configurable: true,
    });
  } catch {
    // defineProperty may fail if the property was already patched — safe to ignore
  }
};

// Web's module system doesn't support monkey-patching RN exports
if (Platform.OS !== "web") {
  applyFontPatch("Text");
  applyFontPatch("TextInput");
}