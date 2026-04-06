# AI-Directed Video Workflow Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a v1 AI-directed video pipeline that generates a script and previs first, requests precise human footage, applies FFmpeg-driven viral formatting, and renders final vertical and landscape videos through Remotion.

**Architecture:** Add a workflow layer above the existing Fireship template. The workflow is driven by a shared manifest that describes story beats, insert slots, and viral formatting directives. Remotion remains the canonical creative renderer, while FFmpeg handles preprocessing and clip-level formatting such as punch-ins, zooms, speed ramps, and final packaging.

**Tech Stack:** TypeScript, Remotion v4, Node scripts, FFmpeg/ffprobe, Zod, existing Fireship template system, Python TTS helpers where already present

---

### Task 1: Create the workflow manifest schema

**Files:**
- Create: `src/workflows/ai-directed/schema.ts`
- Create: `src/workflows/ai-directed/types.ts`
- Modify: `src/templates/fireship/schema.ts`
- Test: `src/workflows/ai-directed/schema.test.ts`

**Step 1: Write the failing test**

```ts
import {describe, expect, it} from "vitest";
import {AiDirectedWorkflowSchema} from "./schema";

describe("AiDirectedWorkflowSchema", () => {
	it("accepts a workflow with story beats, insert slots, and formatting directives", () => {
		const parsed = AiDirectedWorkflowSchema.parse({
			project: {
				slug: "hosted-demo",
				title: "Hosted Demo",
				targetFormats: ["vertical", "landscape"],
				hostStrategy: "fixed",
			},
			story: {
				hook: "A strong hook",
				beats: [
					{
						id: "beat-1",
						startMs: 0,
						endMs: 2500,
						voiceover: "Start here",
						sceneType: "content",
					},
				],
			},
			inserts: [
				{
					id: "insert-1",
					beatId: "beat-1",
					action: "Push the screen down with both hands",
					durationMs: 1800,
					speakingMode: "silent_under_vo",
				},
			],
			formatting: [
				{
					id: "fx-1",
					targetId: "insert-1",
					type: "punch_in",
					startMs: 200,
					endMs: 1200,
					intensity: 0.18,
				},
			],
		});

		expect(parsed.project.targetFormats).toEqual(["vertical", "landscape"]);
	});
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/workflows/ai-directed/schema.test.ts`
Expected: FAIL because the schema file and exports do not exist yet

**Step 3: Write minimal implementation**

Create a Zod schema that covers:

- `project`
  - `slug`
  - `title`
  - `targetFormats`
  - `hostStrategy`
- `story.beats[]`
  - ids
  - timing
  - voiceover text
  - scene routing hints
- `inserts[]`
  - slot ids
  - beat linkage
  - human direction fields
  - speaking mode
- `formatting[]`
  - target ids
  - formatting types
  - timing window
  - intensity or amount

Include string literal unions for:

- target format: `"vertical" | "landscape"`
- host strategy: `"fixed" | "rotating" | "ai_selects"`
- speaking mode: `"silent_under_vo" | "replace_vo" | "optional"`
- formatting type: `"punch_in" | "push_in" | "zoom_reframe" | "speed_ramp" | "freeze_frame" | "impact_trim"`

Re-export the relevant types from `types.ts`.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/workflows/ai-directed/schema.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/workflows/ai-directed/schema.ts src/workflows/ai-directed/types.ts src/workflows/ai-directed/schema.test.ts src/templates/fireship/schema.ts
git commit -m "feat: add AI-directed workflow schema"
```

### Task 2: Add example workflow data and slot manifest fixtures

**Files:**
- Create: `data/workflows/ai-directed-demo.json`
- Create: `data/workflows/fixtures/returned-clips.json`
- Create: `data/workflows/README.md`
- Test: `src/workflows/ai-directed/schema.test.ts`

**Step 1: Write the failing test**

Extend the schema test to load `data/workflows/ai-directed-demo.json` and assert it parses successfully.

```ts
import workflow from "../../../data/workflows/ai-directed-demo.json";

it("parses the checked-in workflow fixture", () => {
	expect(() => AiDirectedWorkflowSchema.parse(workflow)).not.toThrow();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/workflows/ai-directed/schema.test.ts`
Expected: FAIL because the fixture file does not exist yet

**Step 3: Write minimal implementation**

Create a representative fixture that includes:

- 3-5 story beats
- 2 human insert slots
- 3 formatting directives
- both vertical and landscape targets

Create a returned-clips fixture with clip metadata:

- file path
- duration
- width and height
- matched slot id
- whether the clip includes speech

Write a short README explaining how these fixtures relate to the workflow.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/workflows/ai-directed/schema.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add data/workflows/ai-directed-demo.json data/workflows/fixtures/returned-clips.json data/workflows/README.md src/workflows/ai-directed/schema.test.ts
git commit -m "feat: add AI-directed workflow fixtures"
```

### Task 3: Build the shot-direction generator

**Files:**
- Create: `src/workflows/ai-directed/generate-shot-sheet.ts`
- Create: `src/workflows/ai-directed/generate-shot-sheet.test.ts`
- Create: `src/workflows/ai-directed/templates/shot-sheet.md.ts`
- Test: `src/workflows/ai-directed/generate-shot-sheet.test.ts`

**Step 1: Write the failing test**

```ts
import {describe, expect, it} from "vitest";
import workflow from "../../../data/workflows/ai-directed-demo.json";
import {generateShotSheet} from "./generate-shot-sheet";

describe("generateShotSheet", () => {
	it("creates simple, directive human shot instructions", () => {
		const result = generateShotSheet(workflow);

		expect(result.markdown).toContain("Record this now");
		expect(result.markdown).toContain("Push the screen down with both hands");
		expect(result.slots).toHaveLength(2);
	});
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/workflows/ai-directed/generate-shot-sheet.test.ts`
Expected: FAIL because the generator does not exist yet

**Step 3: Write minimal implementation**

Implement a generator that:

- filters to human insert slots
- emits plain-language shot requests
- preserves structured slot metadata
- outputs:
  - markdown checklist
  - normalized slot objects

Keep the language directive and simple:

- exact action
- framing
- duration
- speaking mode
- retake rule

**Step 4: Run test to verify it passes**

Run: `npm test -- src/workflows/ai-directed/generate-shot-sheet.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/workflows/ai-directed/generate-shot-sheet.ts src/workflows/ai-directed/generate-shot-sheet.test.ts src/workflows/ai-directed/templates/shot-sheet.md.ts
git commit -m "feat: add human shot sheet generator"
```

### Task 4: Build FFmpeg metadata probing for uploaded clips

**Files:**
- Create: `src/workflows/ai-directed/ffmpeg/probe-clips.ts`
- Create: `src/workflows/ai-directed/ffmpeg/probe-clips.test.ts`
- Create: `src/workflows/ai-directed/ffmpeg/ffprobe.ts`
- Test: `src/workflows/ai-directed/ffmpeg/probe-clips.test.ts`

**Step 1: Write the failing test**

```ts
import {describe, expect, it, vi} from "vitest";
import {probeClips} from "./probe-clips";

describe("probeClips", () => {
	it("normalizes ffprobe metadata into clip records", async () => {
		const runFfprobe = vi.fn().mockResolvedValue({
			streams: [{width: 1080, height: 1920, codec_type: "video"}],
			format: {duration: "2.400"},
		});

		const clips = await probeClips(
			["public/footage/demo.mp4"],
			runFfprobe,
		);

		expect(clips[0]).toMatchObject({
			path: "public/footage/demo.mp4",
			width: 1080,
			height: 1920,
		});
	});
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/workflows/ai-directed/ffmpeg/probe-clips.test.ts`
Expected: FAIL because the probe functions do not exist yet

**Step 3: Write minimal implementation**

Add a thin ffprobe wrapper and a normalizer that returns:

- file path
- durationMs
- width and height
- aspect ratio
- whether audio exists

Keep the command boundary isolated so it can be mocked in tests.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/workflows/ai-directed/ffmpeg/probe-clips.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/workflows/ai-directed/ffmpeg/probe-clips.ts src/workflows/ai-directed/ffmpeg/probe-clips.test.ts src/workflows/ai-directed/ffmpeg/ffprobe.ts
git commit -m "feat: add clip probing for AI-directed workflow"
```

### Task 5: Build clip-to-slot matching

**Files:**
- Create: `src/workflows/ai-directed/match-clips-to-slots.ts`
- Create: `src/workflows/ai-directed/match-clips-to-slots.test.ts`
- Test: `src/workflows/ai-directed/match-clips-to-slots.test.ts`

**Step 1: Write the failing test**

```ts
import {describe, expect, it} from "vitest";
import workflow from "../../../data/workflows/ai-directed-demo.json";
import returnedClips from "../../../data/workflows/fixtures/returned-clips.json";
import {matchClipsToSlots} from "./match-clips-to-slots";

describe("matchClipsToSlots", () => {
	it("assigns uploaded clips to the best matching insert slots", () => {
		const result = matchClipsToSlots(workflow.inserts, returnedClips);

		expect(result.matches).toHaveLength(2);
		expect(result.pickupsRequested).toEqual([]);
	});
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/workflows/ai-directed/match-clips-to-slots.test.ts`
Expected: FAIL because the matcher does not exist yet

**Step 3: Write minimal implementation**

Implement a deterministic matcher using simple heuristics:

- explicit slot id metadata wins
- aspect-ratio compatibility next
- duration coverage next
- speaking mode compatibility next

Return:

- `matches`
- `unmatchedClips`
- `pickupsRequested`

Do not add ML scoring in v1.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/workflows/ai-directed/match-clips-to-slots.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/workflows/ai-directed/match-clips-to-slots.ts src/workflows/ai-directed/match-clips-to-slots.test.ts
git commit -m "feat: add clip-to-slot matching"
```

### Task 6: Build the viral formatting plan compiler

**Files:**
- Create: `src/workflows/ai-directed/ffmpeg/build-formatting-plan.ts`
- Create: `src/workflows/ai-directed/ffmpeg/build-formatting-plan.test.ts`
- Test: `src/workflows/ai-directed/ffmpeg/build-formatting-plan.test.ts`

**Step 1: Write the failing test**

```ts
import {describe, expect, it} from "vitest";
import workflow from "../../../data/workflows/ai-directed-demo.json";
import {buildFormattingPlan} from "./build-formatting-plan";

describe("buildFormattingPlan", () => {
	it("compiles workflow formatting directives into ffmpeg-ready operations", () => {
		const result = buildFormattingPlan(workflow.formatting);

		expect(result.operations[0]).toMatchObject({
			type: "punch_in",
			startMs: expect.any(Number),
			endMs: expect.any(Number),
		});
	});
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/workflows/ai-directed/ffmpeg/build-formatting-plan.test.ts`
Expected: FAIL because the plan compiler does not exist yet

**Step 3: Write minimal implementation**

Compile formatting directives into an intermediate plan with:

- target clip id
- source time range
- output time range
- filter intent
- intensity

Keep this plan declarative so FFmpeg command generation stays separate.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/workflows/ai-directed/ffmpeg/build-formatting-plan.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/workflows/ai-directed/ffmpeg/build-formatting-plan.ts src/workflows/ai-directed/ffmpeg/build-formatting-plan.test.ts
git commit -m "feat: add viral formatting plan compiler"
```

### Task 7: Build FFmpeg command generation for viral formatting

**Files:**
- Create: `src/workflows/ai-directed/ffmpeg/build-ffmpeg-command.ts`
- Create: `src/workflows/ai-directed/ffmpeg/build-ffmpeg-command.test.ts`
- Test: `src/workflows/ai-directed/ffmpeg/build-ffmpeg-command.test.ts`

**Step 1: Write the failing test**

```ts
import {describe, expect, it} from "vitest";
import {buildFfmpegCommand} from "./build-ffmpeg-command";

describe("buildFfmpegCommand", () => {
	it("builds an ffmpeg command for punch-in formatting", () => {
		const command = buildFfmpegCommand({
			input: "public/footage/demo.mp4",
			output: "tmp/formatted/demo.mp4",
			operations: [
				{type: "punch_in", startMs: 200, endMs: 1200, intensity: 0.18},
			],
		});

		expect(command.join(" ")).toContain("ffmpeg");
		expect(command.join(" ")).toContain("crop");
		expect(command.join(" ")).toContain("scale");
	});
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/workflows/ai-directed/ffmpeg/build-ffmpeg-command.test.ts`
Expected: FAIL because the command builder does not exist yet

**Step 3: Write minimal implementation**

Generate commands for v1 operations:

- punch-in
- push-in
- zoom reframe
- freeze frame
- speed ramp

Keep command generation pure. Execution should happen elsewhere.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/workflows/ai-directed/ffmpeg/build-ffmpeg-command.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/workflows/ai-directed/ffmpeg/build-ffmpeg-command.ts src/workflows/ai-directed/ffmpeg/build-ffmpeg-command.test.ts
git commit -m "feat: add ffmpeg command generation for viral formatting"
```

### Task 8: Add workflow orchestration script

**Files:**
- Create: `scripts/ai-directed-workflow.ts`
- Create: `src/workflows/ai-directed/run-workflow.ts`
- Modify: `package.json`
- Test: `src/workflows/ai-directed/run-workflow.test.ts`

**Step 1: Write the failing test**

```ts
import {describe, expect, it, vi} from "vitest";
import {runWorkflow} from "./run-workflow";

describe("runWorkflow", () => {
	it("returns previs, shot-sheet, and formatting outputs", async () => {
		const result = await runWorkflow({
			workflowPath: "data/workflows/ai-directed-demo.json",
			execFfmpeg: vi.fn(),
		});

		expect(result).toHaveProperty("shotSheetPath");
		expect(result).toHaveProperty("formattingOutputs");
	});
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/workflows/ai-directed/run-workflow.test.ts`
Expected: FAIL because the orchestration layer does not exist yet

**Step 3: Write minimal implementation**

Wire together:

- workflow loading
- shot-sheet generation
- clip probing
- slot matching
- formatting plan compilation
- FFmpeg command execution hooks

Add an npm script such as:

```json
"workflow:ai-directed": "tsx scripts/ai-directed-workflow.ts"
```

Keep Remotion render calls stubbed or delegated for now if needed; the task is to establish orchestration shape.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/workflows/ai-directed/run-workflow.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add scripts/ai-directed-workflow.ts src/workflows/ai-directed/run-workflow.ts src/workflows/ai-directed/run-workflow.test.ts package.json
git commit -m "feat: add AI-directed workflow orchestrator"
```

### Task 9: Integrate workflow output with Fireship composition props

**Files:**
- Create: `src/templates/fireship/from-ai-directed-workflow.ts`
- Create: `src/templates/fireship/from-ai-directed-workflow.test.ts`
- Modify: `src/templates/fireship/index.tsx`
- Test: `src/templates/fireship/from-ai-directed-workflow.test.ts`

**Step 1: Write the failing test**

```ts
import {describe, expect, it} from "vitest";
import workflow from "../../../data/workflows/ai-directed-demo.json";
import {fromAiDirectedWorkflow} from "./from-ai-directed-workflow";

describe("fromAiDirectedWorkflow", () => {
	it("maps workflow beats into Fireship sections", () => {
		const props = fromAiDirectedWorkflow(workflow);
		expect(props.sections.length).toBeGreaterThan(0);
	});
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/templates/fireship/from-ai-directed-workflow.test.ts`
Expected: FAIL because the adapter does not exist yet

**Step 3: Write minimal implementation**

Create an adapter that translates workflow beats into the existing Fireship schema:

- beat -> section
- voiceover text -> body/copy
- insert metadata -> image/video slot metadata
- theme defaults -> existing Fireship props

Do not rebuild the Fireship schema. Adapt into it.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/templates/fireship/from-ai-directed-workflow.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/templates/fireship/from-ai-directed-workflow.ts src/templates/fireship/from-ai-directed-workflow.test.ts src/templates/fireship/index.tsx
git commit -m "feat: map AI-directed workflow into Fireship props"
```

### Task 10: Add insert-slot rendering support for human footage

**Files:**
- Create: `src/templates/fireship/components/HumanInsertSlot.tsx`
- Modify: `src/templates/fireship/scenes/ContentScene.tsx`
- Modify: `src/templates/fireship/scenes/IntroScene.tsx`
- Modify: `src/templates/fireship/scenes/OutroScene.tsx`
- Test: `src/templates/fireship/components/HumanInsertSlot.test.tsx`

**Step 1: Write the failing test**

```tsx
import {describe, expect, it} from "vitest";
import {render} from "@testing-library/react";
import {HumanInsertSlot} from "./HumanInsertSlot";

describe("HumanInsertSlot", () => {
	it("renders a video asset when insert footage is available", () => {
		const {container} = render(
			<HumanInsertSlot src="public/footage/demo.mp4" mode="silent_under_vo" />,
		);

		expect(container.querySelector("video")).not.toBeNull();
	});
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/templates/fireship/components/HumanInsertSlot.test.tsx`
Expected: FAIL because the component does not exist yet

**Step 3: Write minimal implementation**

Create a small Remotion-friendly component that can render:

- placeholder state
- formatted human clip state
- optional local speech override marker

Use Remotion media primitives and keep the component narrow.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/templates/fireship/components/HumanInsertSlot.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/templates/fireship/components/HumanInsertSlot.tsx src/templates/fireship/components/HumanInsertSlot.test.tsx src/templates/fireship/scenes/ContentScene.tsx src/templates/fireship/scenes/IntroScene.tsx src/templates/fireship/scenes/OutroScene.tsx
git commit -m "feat: add human insert slot rendering"
```

### Task 11: Add vertical and landscape framing rules

**Files:**
- Create: `src/workflows/ai-directed/format-adapter.ts`
- Create: `src/workflows/ai-directed/format-adapter.test.ts`
- Modify: `src/templates/fireship/Fireship.tsx`
- Test: `src/workflows/ai-directed/format-adapter.test.ts`

**Step 1: Write the failing test**

```ts
import {describe, expect, it} from "vitest";
import {getFormatFraming} from "./format-adapter";

describe("getFormatFraming", () => {
	it("returns different framing rules for vertical and landscape", () => {
		expect(getFormatFraming("vertical")).not.toEqual(getFormatFraming("landscape"));
	});
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/workflows/ai-directed/format-adapter.test.ts`
Expected: FAIL because the adapter does not exist yet

**Step 3: Write minimal implementation**

Add explicit framing rules for:

- safe title area
- caption zone
- crop preference
- insert slot treatment

Thread these values into the Remotion layer through props rather than hardcoding scene behavior.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/workflows/ai-directed/format-adapter.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/workflows/ai-directed/format-adapter.ts src/workflows/ai-directed/format-adapter.test.ts src/templates/fireship/Fireship.tsx
git commit -m "feat: add multi-format framing rules"
```

### Task 12: Add CLI documentation and end-to-end verification steps

**Files:**
- Modify: `README.md`
- Modify: `docs/plans/2026-04-05-ai-directed-video-workflow-design.md`
- Create: `docs/AI-DIRECTED-WORKFLOW.md`
- Test: manual verification notes in `docs/AI-DIRECTED-WORKFLOW.md`

**Step 1: Write the failing test**

Write a short manual verification checklist and mark missing commands as TODOs before implementation:

```md
- [ ] Run workflow manifest validation
- [ ] Generate shot sheet
- [ ] Probe uploaded clips
- [ ] Build formatting plan
- [ ] Render previs
- [ ] Render vertical final
- [ ] Render landscape final
```

Expected: the checklist cannot yet be completed because the docs do not exist

**Step 2: Run verification to confirm the gap**

Run: `test -f docs/AI-DIRECTED-WORKFLOW.md`
Expected: exit code 1 because the file does not exist yet

**Step 3: Write minimal implementation**

Document:

- workflow manifest location
- orchestration command
- required FFmpeg/ffprobe availability
- expected output folders
- manual verification flow
- external Remotion review checkpoint

Keep docs concise and operational.

**Step 4: Run verification to confirm docs exist**

Run: `test -f docs/AI-DIRECTED-WORKFLOW.md`
Expected: exit code 0

**Step 5: Commit**

```bash
git add README.md docs/AI-DIRECTED-WORKFLOW.md docs/plans/2026-04-05-ai-directed-video-workflow-design.md
git commit -m "docs: add AI-directed workflow usage guide"
```

### Task 13: Final verification

**Files:**
- Verify: `src/workflows/ai-directed/*`
- Verify: `src/templates/fireship/*`
- Verify: `scripts/ai-directed-workflow.ts`

**Step 1: Run targeted tests**

Run:

```bash
npm test -- src/workflows/ai-directed/schema.test.ts
npm test -- src/workflows/ai-directed/generate-shot-sheet.test.ts
npm test -- src/workflows/ai-directed/ffmpeg/probe-clips.test.ts
npm test -- src/workflows/ai-directed/match-clips-to-slots.test.ts
npm test -- src/workflows/ai-directed/ffmpeg/build-formatting-plan.test.ts
npm test -- src/workflows/ai-directed/ffmpeg/build-ffmpeg-command.test.ts
npm test -- src/workflows/ai-directed/run-workflow.test.ts
npm test -- src/templates/fireship/from-ai-directed-workflow.test.ts
npm test -- src/templates/fireship/components/HumanInsertSlot.test.tsx
npm test -- src/workflows/ai-directed/format-adapter.test.ts
```

Expected: PASS

**Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS except for the pre-existing `server.tsx:72` issue noted in project instructions

**Step 3: Run one manual workflow**

Run:

```bash
npm run workflow:ai-directed -- --workflow data/workflows/ai-directed-demo.json
```

Expected:

- shot sheet output generated
- formatting plan output generated
- no missing-schema failures

**Step 4: Run Remotion preview or render**

Run one of:

```bash
npm run start
```

or

```bash
npx remotion render src/index.tsx Fireship out/ai-directed-demo.mp4 --props="data/videos/ai-directed-demo.json"
```

Expected: the composition loads with workflow-derived data

**Step 5: External review gate**

Have Claude or another reviewer verify:

- Remotion API usage
- composition boundaries
- media asset assumptions
- FFmpeg command strategy

**Step 6: Final commit**

```bash
git add src/workflows/ai-directed src/templates/fireship scripts/ai-directed-workflow.ts data/workflows README.md docs/AI-DIRECTED-WORKFLOW.md
git commit -m "feat: implement AI-directed viral video workflow"
```
