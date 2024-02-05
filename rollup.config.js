import { nodeResolve } from '@rollup/plugin-node-resolve';
import versionInjector from 'rollup-plugin-version-injector';
import metablock from 'rollup-plugin-userscript-metablock';
import pkg from './package.json' assert {type: 'json'};
///import { obfuscator } from 'rollup-obfuscator';

export default {
    input: 'src/main.js',
    watch: true,
    output: {
        file: 'dist/kekui.user.js',
        format: 'cjs'
    },
    plugins: [
        nodeResolve(),
        versionInjector(),
        // obfuscator({compact: true,identifierNamesGenerator: "mangled",renameProperties: true,})
        metablock({
            file: 'meta.json',
            override: {
                version: pkg.version,
            }
        }),
    ]
};