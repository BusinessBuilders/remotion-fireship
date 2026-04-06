# AI-Directed Video Workflow Design

**Date:** 2026-04-05
**Scope:** End-to-end AI-first viral video production workflow
**Applies to:** Script generation, previs, human capture, FFmpeg viral formatting, Remotion composition, FFmpeg finishing

## Goal

Design a workflow where AI creates the video first, then directs humans to record the exact footage needed to make the result feel human-led rather than AI-made. The system should produce a near-complete draft before filming, tell the human precisely what to record, ingest the returned footage, and conform the final cut into polished vertical and landscape exports.

The workflow should operate as a two-in-one system:

- an AI-directed story engine
- a viral formatting engine

## Product Shape

This is not a traditional editor workflow. The AI acts as director, writer, previs editor, and finishing system.

The pipeline starts by generating:

- a viral script and pacing structure
- synthetic voiceover and temp music
- Remotion-native motion scenes and transitions
- placeholder insert slots for real human footage
- a first-pass render that is publishable even before the human records anything

The human does not decide coverage. The AI decides which moments need a real person for authenticity, tension, humor, trust, or pattern break. It then asks for exact shots with minimal friction.

The second half of the system is not just export infrastructure. It is a dedicated viral formatting layer that transforms footage into short-form-native edits through clip-level motion, timing, and reframing treatments.

## Core Workflow

### 1. Intake

Collect:

- concept and audience
- platform targets
- host strategy
- CTA
- source material and claims
- brand assets if available

Host strategy must be an explicit workflow input:

- fixed host
- rotating host
- AI chooses per video

### 2. Previsualization

The AI writes the full script, assigns beat timing, chooses where human footage is necessary, and creates a complete draft video.

Outputs:

- `brief.json`
- `script.md` or `script.json`
- `timeline.json`
- `insert-slots.json`
- temp voiceover
- previs render

The previs is the first real product. It should be coherent enough to publish on its own if no human footage ever arrives.

### 3. Human Capture Plan

From the insert slots, the AI generates a very simple filming brief for lazy humans.

Each requested shot should include:

- slot id
- why the shot exists
- exact action
- framing
- duration
- whether to speak
- prop or background notes
- retake criteria

The default interaction model should be:

- simple in-chat asks like "Record this now"
- backed by a minimal structured shot manifest

### 4. Footage Ingest

The default mode is one batch upload after one filming session. This minimizes friction and keeps the workflow practical.

The ingest system should:

- inventory uploaded clips
- map clips to planned slots
- score clip usability
- request only minimal pickup shots if necessary

### 5. Conform And Composite

The AI replaces previs placeholders with human clips, trims them to beat timing, reframes them for each aspect ratio, and decides whether the clip stays under AI voiceover or locally replaces it.

Human footage should be treated as directed performance inside a locked AI timeline, not as raw footage that forces a new edit from scratch.

### 6. Viral Formatting

After ingest and slot replacement, the system should run a dedicated formatting stage that shapes footage for virality before final delivery.

This stage should support:

- punch-ins and push-ins
- zoom reframes
- cut-in and cut-out rhythm changes
- speed ramps
- freeze frames
- beat-emphasis crops
- impact trims
- caption-safe reframing for 9:16 and 16:9

This stage is where raw human footage starts to feel like platform-native short-form media instead of simply recorded inserts.

### 7. Finish

Remotion should own:

- canonical creative timeline
- motion scenes
- typography
- transitions
- insert-slot composition
- final visual rendering

FFmpeg should own:

- transcodes and proxies
- audio normalization
- clip preprocessing
- clip-level kinetic formatting
- zoom and crop transforms
- speed changes and freeze frames
- impact cuts and beat trims
- format conversion
- delivery packaging and muxing

### 8. Delivery

The system should render both:

- vertical short-form outputs
- landscape wide outputs

The architecture should treat orientation as a render target, not as two separate edits.

## Architecture Options

### Option 1: Remotion-first canonical timeline

Remotion owns the full edit. FFmpeg only preprocesses, formats, and packages media.

Pros:

- strongest fit with the current repo
- keeps timing and motion logic in one place
- easiest path to expressive transitions

Cons:

- media-heavy conform work can get awkward if overused

### Option 2: FFmpeg-first edit graph

FFmpeg owns the main edit and formatting graph while Remotion renders graphics and transition assets.

Pros:

- strong for clip assembly and hard media automation

Cons:

- fragmented
- weaker fit for this codebase
- slower creative iteration

### Option 3: Hybrid timeline compiler

A higher-level manifest defines beats, slots, transitions, timing, aspect-ratio behavior, and viral formatting directives. That manifest compiles into Remotion compositions and FFmpeg jobs.

Pros:

- strongest long-term architecture
- explicit and portable
- good fit for automation

Cons:

- more design overhead for v1

## Recommendation

Target a hybrid timeline compiler, but implement v1 as Remotion-first.

That means:

- define a master timeline manifest now
- let Remotion remain the canonical creative renderer
- use FFmpeg for preprocess, clip-level viral formatting, conform support, and delivery

This preserves momentum for v1 while creating a clean migration path to a more compiler-driven workflow later.

## Key Components

### Brief Builder

Normalizes concept, audience, targets, host strategy, brand context, and constraints.

### Script And Beat Planner

Writes the hook, narrative beats, and decides where real human presence is required to maximize virality.

### Previs Generator

Creates the AI-first draft with synthetic narration, placeholder inserts, Remotion scenes, and temp transitions.

### Shot Director

Turns insert slots into exact filming asks. The system should behave like a director, not a generic prompt generator.

### Clip Ingest And Matcher

Maps uploaded files to slot ids, validates usability, and keeps pickup requests minimal.

### Edit Conformer

Replaces placeholders with human footage and preserves pacing while adapting timing and audio treatment.

### Viral Formatting Engine

Applies the short-form editing language that makes clips feel viral rather than merely correct.

It should own:

- punch-ins
- push-ins
- crop and zoom moves
- speed ramps
- freeze frames
- beat-driven in and out trims
- framing adjustments per platform

This engine should be primarily FFmpeg-driven in v1.

### Format Adapter

Applies framing rules, safe zones, caption zones, and focal crops for 9:16 and 16:9.

### Render Orchestrator

Runs Remotion renders and FFmpeg preprocessing and delivery jobs.

### Review Gate

The required Remotion skill and API verification tooling are not available in this session, so the workflow must include an explicit external review step before implementation or merge.

## Human Direction Rules

The human capture experience should optimize for low effort and low ambiguity.

Rules:

- never ask for generic b-roll
- always give exact action and framing
- default to one filming session and one upload
- keep pickup requests short
- prefer salvage in edit before asking for a reshoot

The AI should ask for shots like:

- push the screen down with both hands for two seconds
- hold eye contact after the gesture
- pause for a beat before the screen reveal
- deliver one direct-to-camera line with a specified tone

## Voiceover Strategy

The default draft should include full synthetic voiceover. Human speaking moments are planned intentionally, not assumed everywhere.

The edit system should support both:

- silent performance clips under AI narration
- on-camera speaking moments that replace AI voiceover locally

This keeps the workflow fast while still allowing human-led moments where they materially improve performance.

## Capture Modes

### Default: Batch capture

The AI asks for all critical shots at once. The human records them in one session, uploads one batch, and the AI finishes the video.

### Fallback: Two-pass hybrid

If the first upload misses critical beats, the system asks for a very small pickup batch.

### Deferred: Fully iterative

One-shot-at-a-time direction should not be the default because it creates too much user friction.

## Two-In-One Architecture

The workflow should be understood as two connected engines operating on the same manifest.

### 1. AI-Directed Story Engine

Owns:

- topic framing
- hook
- script
- beat timing
- host usage
- insert-slot planning
- human shot direction
- previs generation

### 2. Viral Formatting Engine

Owns:

- punch-ins
- push-ins
- zoom reframes
- speed changes
- freeze frames
- impact cuts
- crop behavior
- short-form pacing polish

The story engine decides what the video means and where human presence matters. The formatting engine makes the footage feel native to viral distribution platforms.

The final system should keep both engines separate conceptually, but synchronized through one timeline manifest.

## Error Handling

- If a requested shot is missing, preserve the project with AI-only coverage rather than fail.
- If a clip is imperfect but usable, prefer reframing, trimming, speed changes, captions, punch-ins, and cutaway masking before requesting a reshoot.
- If a speaking clip fails, mute it and fall back to AI voiceover while keeping the visual performance when useful.
- If crop behavior differs across formats, maintain approved framing rules per target instead of blind center-cropping.
- If no human footage is ever returned, the previs remains publishable.

## Success Criteria

- AI can generate a full draft video without human footage.
- AI can identify insert slots that genuinely benefit from human presence.
- AI can generate exact filming directions for those slots.
- A human can upload one batch of clips and receive a finished video without manual timeline editing.
- The pipeline can apply viral formatting moves automatically to returned clips.
- The project can export both 9:16 and 16:9 versions.
- Human footage feels intentionally directed, not randomly inserted.
- The system degrades gracefully when some planned shots are missing.

## Recommended v1 Scope

Include:

- AI-written script
- AI-first previs render with synthetic voiceover
- structured timeline and insert-slot manifests
- simple human shot checklist
- batch clip ingest
- placeholder replacement and conform
- FFmpeg-driven viral formatting pass for clip motion and punch-ins
- vertical and landscape exports
- FFmpeg-assisted preprocess and packaging
- mandatory external Remotion review checkpoint

Exclude:

- fully iterative live capture loops by default
- automatic lip-sync as a core dependency
- multi-user production coordination
- full NLE replacement ambitions
- a requirement that every placeholder must be replaced

## Implementation Notes

This repo already contains a strong foundation for a Remotion-first v1:

- Fireship template scenes
- JSON-driven schema and timing
- composition registration and rendering
- reusable visual components and transitions

The implementation should build a new workflow layer above the existing template rather than bypass it entirely.
