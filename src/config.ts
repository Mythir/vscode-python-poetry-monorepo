import * as vscode from "vscode";

export type UpdatePythonAnalysisExtraPathsConfig =
  | "replace"
  | "append"
  | "disable";

export interface PoetryMonorepoPytestConfig {
  enabled: boolean;
  setCovConfig: boolean;
}

export interface PoetryMonorepoConfig {
  updatePythonAnalysisExtraPaths: UpdatePythonAnalysisExtraPathsConfig;
  pytest: PoetryMonorepoPytestConfig;
}

export interface PythonConfig {
  analysis: {
    extraPaths: string[];
  };
  testing: {
    pytestArgs: string[];
  };
}

export interface ExtensionConfig {
  poetryMonorepo: PoetryMonorepoConfig;
  python: PythonConfig;
}

export interface IConfigService {
  readonly config: ExtensionConfig;
  setPythonAnalysisExtraPaths(paths: string[]): void;
  setPytestArgs(pytestArgs: string[]): void;
}

export function extensionConfigDefaults(): ExtensionConfig {
  return {
    poetryMonorepo: {
      updatePythonAnalysisExtraPaths: "replace",
      pytest: {
        enabled: false,
        setCovConfig: false,
      },
    },
    python: {
      analysis: {
        extraPaths: [],
      },
      testing: {
        pytestArgs: [],
      },
    },
  };
}

export class ConfigService implements IConfigService {
  public config!: ExtensionConfig;

  constructor() {
    this.config = extensionConfigDefaults();
    this.fetchPoetryMonorepoConfig();
    this.fetchPythonConfig();
  }

  private fetchPoetryMonorepoConfig() {
    const poetryMonorepoConfig =
      vscode.workspace.getConfiguration("poetryMonorepo");

    this.config.poetryMonorepo = {
      updatePythonAnalysisExtraPaths: poetryMonorepoConfig.get(
        "updatePythonAnalysisExtraPaths"
      ) as UpdatePythonAnalysisExtraPathsConfig,
      pytest: {
        enabled: poetryMonorepoConfig.get("pytest.enabled") || false,
        setCovConfig: poetryMonorepoConfig.get("pytest.setCovConfig") || false,
      },
    };
  }

  private fetchPythonConfig() {
    const pythonConfig = vscode.workspace.getConfiguration("python");

    this.config.python = {
      analysis: {
        extraPaths: pythonConfig.get("analysis.extraPaths") || [],
      },
      testing: {
        pytestArgs: pythonConfig.get("testing.pytestArgs") || [],
      },
    };
  }

  private updatePythonConfig(path: string, value: any) {
    vscode.workspace.getConfiguration("python").update(path, value);
    this.fetchPythonConfig();
  }

  setPythonAnalysisExtraPaths(paths: string[]) {
    this.updatePythonConfig("analysis.extraPaths", paths);
  }

  setPytestArgs(pytestArgs: string[]) {
    this.updatePythonConfig("testing.pytestArgs", pytestArgs);
  }
}
