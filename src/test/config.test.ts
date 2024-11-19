import * as vscode from "vscode";
import * as assert from "assert";
import { ConfigService } from "../config";

suite("ConfigService test", () => {
  suite("On instantiation", () => {
    test("Should fetch configured values from file", () => {
      let configService = new ConfigService();
      assert.deepEqual(configService.config.python.analysis.extraPaths, [
        "src/python/libs/mylib",
        "src/python/libs/anotherlib",
      ]);
    });

    test("Should fetch default values if not configured", () => {
      let configService = new ConfigService();
      assert.equal(
        configService.config.poetryMonorepo.updatePythonAnalysisExtraPaths,
        "replace"
      );
    });
  });

  suite("setPythonAnalysisExtraPaths()", () => {
    test("Should set the extraPaths value", () => {
      let configService = new ConfigService();
      configService.setPythonAnalysisExtraPaths(["src/python/libs/mylib"]);
      assert.deepEqual(configService.config.python.analysis.extraPaths, [
        "src/python/libs/mylib",
      ]);
    });

    test("Should store the extraPaths value for later retrieval", () => {
      let configService = new ConfigService();
      configService.setPythonAnalysisExtraPaths(["src/python/libs/mylib"]);
      let configService2 = new ConfigService();
      assert.deepEqual(configService2.config.python.analysis.extraPaths, [
        "src/python/libs/mylib",
      ]);
    });
  });
});
