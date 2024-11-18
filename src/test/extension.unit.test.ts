import * as assert from 'assert';
import { IExtensionConfig, PoetryMonorepoConfig, PythonConfig } from '../config';
import { updatePytestSettings, updatePythonAnalysisExtraPaths } from '../extension';

suite('Extension Unit Test Suite', () => {
    let config: IExtensionConfig;

    class MockExtensionConfig implements IExtensionConfig {
        public poetryMonorepo: PoetryMonorepoConfig;
        public python: PythonConfig;

        constructor() {
            this.poetryMonorepo = { updatePythonAnalysisExtraPaths: 'replace', pytest: { enabled: false, setCovConfig: false } };
            this.python = { analysis: { extraPaths: [] }, testing: { pytestArgs: [] } };
        }

        setPythonAnalysisExtraPaths(paths: string[]): void {
            this.python.analysis.extraPaths = paths;
        }

        setPytestArgs(args: string[]): void {
            this.python.testing.pytestArgs = args;
        }
    }

    setup(() => {
        config = new MockExtensionConfig();
    });

    suite('updatePytestSettings()', () => {
        suite('When enabled', () => {
            setup(() => {
                config.poetryMonorepo.pytest.enabled = true;
                config.poetryMonorepo.pytest.setCovConfig = true;
            });

            test('Should update pytest settings when enabled', () => {
                updatePytestSettings('git/root/src/package', 'git/root', config);
                assert.deepEqual(config.python.testing.pytestArgs, ['src/package', '--cov-config=src/package/pyproject.toml']);
            });

            suite('When setCovConfig is false', () => {
                setup(() => {
                    config.poetryMonorepo.pytest.setCovConfig = false;
                });

                test('Should not set --cov-config when setCovConfig is false', () => {
                    updatePytestSettings('git/root/src/package', 'git/root', config);
                    assert.deepEqual(config.python.testing.pytestArgs, ['src/package']);
                });
            });
        });

        suite('When disabled', () => {
            setup(() => {
                config.poetryMonorepo.pytest.enabled = false;
            });

            test('Should not update pytest settings when disabled', () => {
                updatePytestSettings('git/root/src/package', 'git/root', config);
                assert.deepEqual(config.python.testing.pytestArgs, []);
            });
        });
    });

    suite('updatePythonAnalysisExtraPaths()', () => {
        setup(() => {
            config = new MockExtensionConfig();
            config.python.analysis = {extraPaths: ['path1', 'path2']};
        })
        
        suite('When set to replace', () => {
            setup(() => {
                config.poetryMonorepo.updatePythonAnalysisExtraPaths = 'replace';
            })

            test('Should replace the extra paths when set to replace', () => {
                updatePythonAnalysisExtraPaths('git/root/src/package/package', 'git/root', config);
                assert.deepEqual(config.python.analysis.extraPaths, ['src/package/package']);
            });
        })

        suite('When set to append', () => {
            setup(() => {
                config.poetryMonorepo.updatePythonAnalysisExtraPaths = 'append';
            })

            test('Should append the extra paths when set to append', () => {
                updatePythonAnalysisExtraPaths('git/root/src/package/package', 'git/root', config);
                assert.deepEqual(config.python.analysis.extraPaths, ['src/package/package', 'path1', 'path2']);
            });

            test('Should not append the extra path when set to append and already in paths', () => {
                config.python.analysis.extraPaths = ['path1', 'path2', 'src/package/package'];
                updatePythonAnalysisExtraPaths('git/root/src/package/package', 'git/root', config);
                assert.deepEqual(config.python.analysis.extraPaths, ['src/package/package', 'path1', 'path2']);
            });
        })

        suite('When set to disable', () => {
            setup(() => {
                config.poetryMonorepo.updatePythonAnalysisExtraPaths = 'disable';
            })

            test('Should not update the extra paths when set to disable', () => {
                updatePythonAnalysisExtraPaths('git/root/src/package/package', 'git/root', config);
                assert.deepEqual(config.python.analysis.extraPaths, ['path1', 'path2']);
            });
        })
    })
});
