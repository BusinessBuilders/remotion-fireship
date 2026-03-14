# vLLM vs llama.cpp — Voiceover Script

## Section 1: The Serving Problem (0:04 - 0:10)
"You've got a seventy billion parameter model. Now serve it to a thousand users at once. That's the trillion-dollar question and two open source tools have completely different answers. vLLM is a GPU throughput monster. llama.cpp runs literally anywhere. Same goal, opposite philosophies."

## Section 2: How vLLM Works (0:10 - 0:16)
"vLLM was built at UC Berkeley and it uses something called PagedAttention. Think of it like virtual memory but for GPU KV caches. Instead of pre-allocating huge contiguous blocks, it pages the attention cache dynamically. No fragmentation, no wasted VRAM, maximum batch throughput."

## Section 3: vLLM by the Numbers (0:16 - 0:21)
"Let's talk numbers. On an RTX 5090, vLLM hits over eight thousand tokens per second. Time to first token? Ten point seven milliseconds. It handles a hundred twenty eight concurrent requests at a hundred percent success rate. That's sixteen point six X faster than sequential serving."

## Section 4: How llama.cpp Works (0:21 - 0:27)
"On the other side, Georgi Gerganov rewrote LLM inference in pure C and C plus plus. No Python dependency, no CUDA requirement. The magic is quantization — it compresses seventy billion parameter models from sixteen-bit floats down to four-bit integers using the GGUF format. That means you can run a seventy B model on a MacBook."

## Section 5: The Real Trade-off (0:27 - 0:34)
"Here's the actual trade-off. vLLM requires dot safetensor files — full precision weights that need serious GPU VRAM. But it handles hundreds of concurrent users without breaking a sweat. llama.cpp uses quantized GGUF files. Way smaller, runs on CPUs, but you're looking at maybe a hundred fifty tokens per second on an M4 Ultra. Pick your weapon."

## Section 6: Setup: Two Commands (0:34 - 0:42)
"Getting started is dead simple either way. vLLM? Pip install vllm, vllm serve your model, done. Two lines, GPU serving. llama.cpp? Git clone, cmake build, point it at a GGUF file and you're serving on localhost. The real difference isn't setup — it's what happens at scale."

## Section 7: The safetensor Question (0:42 - 0:48)
"The file format matters more than you think. Safetensors are full-precision, memory-mapped binaries. Fast to load, but a seventy B model eats a hundred forty gigs. GGUF quantizes that same model down to forty gigs at four-bit. vLLM trades disk space for raw speed. llama.cpp trades speed for fitting models that shouldn't fit."

## Section 8: Timeline (0:48 - 0:54)
"Both projects launched within months of each other in 2023, right after Meta dropped the LLaMA weights. llama.cpp hit in March, vLLM in June. By 2024, vLLM became the default production server. By 2025, llama.cpp added Vulkan and speculative decoding. Two diverging paths, both thriving."

## Section 9: When to Use What (0:54 - 1:00)
"So which one? vLLM if you're building a production API with NVIDIA GPUs and hundreds of concurrent users. llama.cpp if you're on edge devices, Macs, or need to serve a model bigger than your VRAM allows. They're not competitors — they solve fundamentally different problems. And honestly? A lot of teams use both."

---
Total duration: ~60 seconds (including 4s intro + 4s outro)
Tone: Fireship-style — fast, punchy, slightly irreverent, technical but accessible
