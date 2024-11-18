
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
    readonly poetryMonorepo: PoetryMonorepoConfig;
    readonly python: PythonConfig;
    setPythonAnalysisExtraPaths(paths: string[]): void;
}

export class ExtensionConfig implements IExtensionConfig {
    public poetryMonorepo!: PoetryMonorepoConfig;
    public python!: PythonConfig;

    constructor() {
        this.fetchPoetryMonorepoConfig();
        this.fetchPythonConfig();
    }

    private fetchPoetryMonorepoConfig() {
        const poetryMonorepoConfig = vscode.workspace.getConfiguration('poetryMonorepo');

        this.poetryMonorepo = {
            updatePythonAnalysisExtraPaths: poetryMonorepoConfig.get('updatePythonAnalysisExtraPaths') as UpdatePythonAnalysisExtraPathsConfig,
        }
}

    private fetchPythonConfig() {
        const pythonConfig = vscode.workspace.getConfiguration('python');

        this.python = {
            analysis: {
                extraPaths: pythonConfig.get('analysis.extraPaths') || [],
            }
        }

    }

    setPythonAnalysisExtraPaths(paths: string[]){
        vscode.workspace.getConfiguration('python').update('analysis.extraPaths', paths);
        this.fetchPythonConfig();
    }
}
