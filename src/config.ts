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
  setPythonAnalysisExtraPaths(paths: string[]): Promise<void>;
  setPytestArgs(pytestArgs: string[]): Promise<void>;
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

  private async updatePythonConfig(path: string, value: any) {
    await vscode.workspace.getConfiguration("python").update(path, value);
    this.fetchPythonConfig();
  }

  async setPythonAnalysisExtraPaths(paths: string[]) {
    await this.updatePythonConfig("analysis.extraPaths", paths);
  }

  async setPytestArgs(pytestArgs: string[]) {
    await this.updatePythonConfig("testing.pytestArgs", pytestArgs);
  }
}
