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
    this.fetchConfig(this.config);
  }

  private fetchConfig(config: any, path: string[] = []) {
    for (const [key, value] of Object.entries(config)) {
      let newPath = [...path, key];
      if (
        typeof value === "object" &&
        !Array.isArray(value) &&
        value !== null
      ) {
        this.fetchConfig(value, newPath);
      } else {
        config[key] =
          vscode.workspace
            .getConfiguration(newPath[0])
            .get(newPath.slice(1).join(".")) ?? value;
      }
    }
  }

  private async updatePythonConfig(path: string, value: any) {
    await vscode.workspace.getConfiguration("python").update(path, value);
    this.fetchConfig(this.config);
  }

  async setPythonAnalysisExtraPaths(paths: string[]) {
    await this.updatePythonConfig("analysis.extraPaths", paths);
  }

  async setPytestArgs(pytestArgs: string[]) {
    await this.updatePythonConfig("testing.pytestArgs", pytestArgs);
  }
}
