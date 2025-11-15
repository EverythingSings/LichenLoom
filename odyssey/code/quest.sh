#!/bin/bash
# A hero's journey, executable edition
# chmod +x this file to begin the adventure

echo "You wake up in a directory you don't recognize."
sleep 1

COURAGE=0
WISDOM=0
CHAOS=0

echo ""
echo "What is your name, adventurer?"
read -p "> " HERO_NAME

if [ -z "$HERO_NAME" ]; then
    HERO_NAME="Unnamed Hero"
    echo "Silent, are we? Very mysterious."
fi

echo ""
echo "Welcome, $HERO_NAME."
echo "Your quest: Find the Sacred File hidden somewhere in this repository."
sleep 1

echo ""
echo "You see three items on the ground:"
echo "  [1] A rusty grep"
echo "  [2] A shiny find command"
echo "  [3] An ancient git log"
echo ""
read -p "Which do you take? " WEAPON

case $WEAPON in
    1)
        echo "You pick up grep. +10 to pattern matching!"
        COURAGE=$((COURAGE + 10))
        TOOL="grep"
        ;;
    2)
        echo "You take find. +10 to exploration!"
        WISDOM=$((WISDOM + 10))
        TOOL="find"
        ;;
    3)
        echo "You claim git log. +10 to temporal awareness!"
        CHAOS=$((CHAOS + 10))
        TOOL="git"
        ;;
    *)
        echo "You pick up a stick. It's not very effective."
        TOOL="stick"
        ;;
esac

sleep 1
echo ""
echo "Suddenly, a wild MERGE CONFLICT appears!"
echo "It blocks your path!"
echo ""
echo "  [1] Fight it"
echo "  [2] Flee"
echo "  [3] Try to resolve it peacefully"
echo ""
read -p "What do you do? " ACTION

case $ACTION in
    1)
        echo "You engage in mortal combat!"
        echo "You roll a d20..."
        ROLL=$((RANDOM % 20 + 1))
        echo "You rolled: $ROLL"
        if [ $ROLL -gt 10 ]; then
            echo "Critical hit! The merge conflict is defeated!"
            echo "You gain the artifact: CLEAN_WORKING_TREE"
            COURAGE=$((COURAGE + 20))
        else
            echo "Miss! The conflict damages you with cryptic error messages!"
            echo "You lose 10 HP (hypothetical points)"
            COURAGE=$((COURAGE - 10))
        fi
        ;;
    2)
        echo "You run away! git stash hides your changes."
        echo "You are safe but accomplished nothing."
        WISDOM=$((WISDOM - 5))
        ;;
    3)
        echo "You carefully read both sides of the conflict."
        echo "You craft a thoughtful resolution."
        echo "The conflict dissipates peacefully."
        echo "+50 Wisdom!"
        WISDOM=$((WISDOM + 50))
        ;;
    *)
        echo "You stand there confused."
        echo "The conflict gets bored and leaves."
        CHAOS=$((CHAOS + 100))
        ;;
esac

sleep 1
echo ""
echo "Your journey continues..."
echo ""
echo "Final Stats:"
echo "  Courage: $COURAGE"
echo "  Wisdom: $WISDOM"
echo "  Chaos: $CHAOS"
echo ""

# Determine ending based on highest stat
MAX_STAT="COURAGE"
MAX_VAL=$COURAGE

if [ $WISDOM -gt $MAX_VAL ]; then
    MAX_STAT="WISDOM"
    MAX_VAL=$WISDOM
fi

if [ $CHAOS -gt $MAX_VAL ]; then
    MAX_STAT="CHAOS"
    MAX_VAL=$CHAOS
fi

case $MAX_STAT in
    COURAGE)
        echo "Through bravery, you found the Sacred File!"
        echo "It was inside you all along. (Also in /dev/null)"
        ;;
    WISDOM)
        echo "Through understanding, you realized the truth:"
        echo "The Sacred File was a metaphor for self-knowledge."
        echo "The real treasure was learning to read documentation."
        ;;
    CHAOS)
        echo "You achieved MAXIMUM CHAOS!"
        echo "The Sacred File spontaneously combusted!"
        echo "The repository is now in an undefined state!"
        echo "You win? You lose? Who can say?"
        echo ""
        echo "rm -rf / 2>/dev/null  # (just kidding, don't do this)"
        ;;
esac

echo ""
echo "THE END"
echo ""
echo "Your story has been written to: /dev/null"
echo "(Actually it was written to your memory)"
echo ""
echo "Thanks for playing, $HERO_NAME!"

# Secret achievement
if [ "$HERO_NAME" = "Ada" ]; then
    echo ""
    echo "ACHIEVEMENT UNLOCKED: Mother of Computing"
fi

exit 0
