
import * as vscode from 'vscode';

export type UpdatePythonAnalysisExtraPathsConfig = "replace" | "append" | "disable";

export interface PoetryMonorepoConfig {
    updatePythonAnalysisExtraPaths: UpdatePythonAnalysisExtraPathsConfig;
}

export interface PythonConfig {
    analysis: {
        extraPaths: string[];
    };
}

export interface IExtensionConfig {
    poetryMonorepo: PoetryMonorepoConfig;
    python: PythonConfig;
}

export class ExtensionConfig implements IExtensionConfig {
    poetryMonorepo: PoetryMonorepoConfig;
    python: PythonConfig;

    constructor() {
        const poetryMonorepoConfig = vscode.workspace.getConfiguration('poetryMonorepo');
        const pythonConfig = vscode.workspace.getConfiguration('python');

        this.poetryMonorepo = {
            updatePythonAnalysisExtraPaths: poetryMonorepoConfig.get('updatePythonAnalysisExtraPaths') as UpdatePythonAnalysisExtraPathsConfig,
        }

        this.python = {
            analysis: {
                extraPaths: pythonConfig.get('analysis.extraPaths') || [],
            }
        }
    }
}
