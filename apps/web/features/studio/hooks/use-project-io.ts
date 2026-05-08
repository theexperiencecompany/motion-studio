import type { Project } from "@workspace/compositions/project";
import { type Dispatch, useCallback } from "react";
import { downloadProject, parseProjectJson } from "../lib/project-io";
import type { StudioAction } from "../state/reducer";

/**
 * Save / load handlers for the studio's Project JSON. Save triggers a
 * timestamped download; load reads a file, validates the JSON, and dispatches
 * `LOAD_PROJECT` (warnings surface as a non-fatal alert; hard errors abort).
 */
export function useProjectIO(
  project: Project,
  dispatch: Dispatch<StudioAction>,
) {
  const handleSaveProject = useCallback(() => {
    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    downloadProject(project, `project-${stamp}.json`);
  }, [project]);

  const handleLoadProjectFile = useCallback(
    async (file: File) => {
      const text = await file.text();
      const result = parseProjectJson(text);

      if (!result.ok) {
        window.alert(`Couldn't load project:\n${result.error}`);
        return;
      }
      if (result.warnings.length > 0) {
        window.alert(`Loaded with warnings:\n\n${result.warnings.join("\n")}`);
      }
      dispatch({ type: "LOAD_PROJECT", project: result.project });
    },
    [dispatch],
  );

  return { handleSaveProject, handleLoadProjectFile };
}
