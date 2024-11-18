import * as assert from 'assert';
import { IExtensionConfig, PoetryMonorepoConfig, PythonConfig } from '../config';
import { updatePythonAnalysisExtraPaths } from '../extension';

suite('Extension Test Suite', () => {

    suite('updatePythonAnalysisExtraPaths()', () => {
        let config: IExtensionConfig;

        class MockExtensionConfig implements IExtensionConfig {
            public poetryMonorepo: PoetryMonorepoConfig;
            public python: PythonConfig;

            constructor() {
                this.poetryMonorepo = {updatePythonAnalysisExtraPaths: 'replace'};
                this.python = {analysis: {extraPaths: []}};
            }

            setPythonAnalysisExtraPaths(paths: string[]): void {
                this.python.analysis.extraPaths = paths;
            }
        }
        setup(() => {
            config = new MockExtensionConfig();
            config.python.analysis = {extraPaths: ['path1', 'path2']};
        })

        test('Should replace the extra paths when set to replace', () => {
            config.poetryMonorepo.updatePythonAnalysisExtraPaths = 'replace';
            updatePythonAnalysisExtraPaths('git/root/src/package/package', 'git/root', config);
            assert.deepEqual(config.python.analysis.extraPaths, ['src/package/package']);
        });

        test('Should append the extra paths when set to append', () => {
            config.poetryMonorepo.updatePythonAnalysisExtraPaths = 'append';
            updatePythonAnalysisExtraPaths('git/root/src/package/package', 'git/root', config);
            assert.deepEqual(config.python.analysis.extraPaths, ['src/package/package', 'path1', 'path2']);
        });

        test('Should not append the extra path when set to append and already in paths', () => {
            config.poetryMonorepo.updatePythonAnalysisExtraPaths = 'append';
            config.python.analysis.extraPaths = ['path1', 'path2', 'src/package/package'];
            updatePythonAnalysisExtraPaths('git/root/src/package/package', 'git/root', config);
            assert.deepEqual(config.python.analysis.extraPaths, ['src/package/package', 'path1', 'path2']);
        });

        test('Should not update the extra paths when set to disable', () => {
            config.poetryMonorepo.updatePythonAnalysisExtraPaths = 'disable';
            updatePythonAnalysisExtraPaths('git/root/src/package/package', 'git/root', config);
            assert.deepEqual(config.python.analysis.extraPaths, ['path1', 'path2']);
        });
    })
});
