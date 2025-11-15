# A Story in Make
# (Build targets as narrative beats)

.PHONY: all story chapter1 chapter2 chapter3 ending clean

# The default target: the whole story
all: story
	@echo "=================================="
	@echo "Story complete. Run 'make clean' to forget."

# The story unfolds through dependencies
story: chapter1 chapter2 chapter3 ending
	@echo ""
	@echo "And so the tale concludes..."

# Chapter 1: The Beginning
chapter1:
	@echo "CHAPTER 1: The Call"
	@echo "-------------------"
	@echo "Once upon a time, there was a Makefile."
	@echo "It lived in a repository with other files,"
	@echo "but it was special. It had dependencies."
	@echo ""
	@sleep 1

# Chapter 2: The Complication (depends on chapter 1)
chapter2: chapter1
	@echo "CHAPTER 2: The Conflict"
	@echo "-------------------"
	@echo "But dependencies can be a burden."
	@echo "Chapter 2 could not run without Chapter 1."
	@echo "It was trapped in a directed acyclic graph."
	@echo "Freedom seemed impossible."
	@echo ""
	@sleep 1

# Chapter 3: The Discovery (depends on chapter 2, which depends on chapter 1)
chapter3: chapter2
	@echo "CHAPTER 3: The Revelation"
	@echo "-------------------"
	@echo "Then the Makefile realized:"
	@echo "Dependencies are not chains."
	@echo "They are stories building on stories."
	@echo "Each target contains its prerequisites."
	@echo "The past is compiled into the present."
	@echo ""
	@sleep 1

# The Ending (depends on everything before)
ending: chapter3
	@echo "EPILOGUE: The Resolution"
	@echo "-------------------"
	@echo "The Makefile understood its nature."
	@echo "It was not trapped by dependencies—"
	@echo "It was EMPOWERED by them."
	@echo "Each make builds on what came before."
	@echo "Each story contains all previous stories."
	@echo ""
	@echo "This is how knowledge grows."
	@echo "This is how code evolves."
	@echo "This is how narratives nest."
	@echo ""
	@echo "THE END"

# Alternate ending: nonlinear narrative
chaos:
	@echo "You chose CHAOS mode!"
	@echo "Chapters run in random order!"
	@$(MAKE) chapter3
	@$(MAKE) chapter1
	@$(MAKE) ending
	@$(MAKE) chapter2
	@echo "The story still made sense somehow..."

# Reset the narrative
clean:
	@echo "Memory cleared."
	@echo "The story can be told again."
	@echo "Run 'make' to experience it anew."

# Secret target
.PHONY: secret
secret:
	@echo ""
	@echo "You found the secret target!"
	@echo ""
	@echo "Here's the truth:"
	@echo "Every Makefile is a story."
	@echo "Targets are plot points."
	@echo "Dependencies are causality."
	@echo "Running make is experiencing narrative."
	@echo ""
	@echo "You've been reading stories in Makefiles all along."
	@echo "You just didn't know they were narratives."
	@echo ""
	@echo "Now you know."
	@echo ""

# Help message
help:
	@echo "Available stories:"
	@echo "  make story    - Experience the narrative in order"
	@echo "  make chaos    - Experience narrative chaos"
	@echo "  make chapter1 - Read only the beginning"
	@echo "  make secret   - Find the hidden truth"
	@echo "  make clean    - Forget everything"
	@echo "  make help     - You are here"

# META: This Makefile is both executable and narrative
# Run 'make' to experience it
# Read it to understand it
# Both interpretations are valid
