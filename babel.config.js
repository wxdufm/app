/* 
this is a transpiler. 
it converts modern JavaScript into code older devices can run.
expo uses this automatically.
*/

module.exports = function (api) {
    api.cache(true); //caches config so it doesn't recompute on every file
    return {
        presets : [
            ["babel-preset-expo", { jsxImportSource: "nativewind"}], //Expo's default setup but telling it to use NativeWind for jsx
            "nativewind/babel", //NW's Babel plugin that transforms className into ReactNative styles
        ],
    };
};