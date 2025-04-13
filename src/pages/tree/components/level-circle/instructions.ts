export const instructions = {
  1: {
    desc: 'In the frozen realm of Niflheim, decrypt the runic word before time runs out. Type your answer to test your knowledge of ancient Norse runes.',
    buttons: [
      {
        keys: ['A-Z'],
        action: 'Type letters',
      },
      {
        keys: ['Enter'],
        action: 'Submit answer',
      },
    ],
  },
  2: {
    desc: 'Navigate through the dark maze of Helheim, using your torch to light the way. Reach the glowing exit before time reduces your score.',
    buttons: [
      {
        keys: ['W', 'arrowUp'],
        action: 'Move up',
      },
      {
        keys: ['S', 'arrowDown'],
        action: 'Move down',
      },
      {
        keys: ['A', 'arrowLeft'],
        action: 'Move left',
      },
      {
        keys: ['D', 'arrowRight'],
        action: 'Move right',
      },
    ],
  },
  3: {
    desc: 'Slide across the  🥶 i c y 🥶  plains of Jotunheim to collect Mjolnir pieces. Once moving, you cannot stop until hitting an obstacle.',
    buttons: [
      {
        keys: ['w', 'arrowUp'],
        action: 'Slide up',
      },
      {
        keys: ['s', 'arrowDown'],
        action: 'Slide down',
      },
      {
        keys: ['a', 'arrowLeft'],
        action: 'Slide left',
      },
      {
        keys: ['d', 'arrowRight'],
        action: 'Slide right',
      },
    ],
  },
  4: {
    desc: 'In the dwarven realm of Nidavellir, catch the falling Mjolnir hammers while avoiding the deadly skulls. Click on the items to catch them.',
    buttons: [
      {
        keys: ['mouseClick'],
        action: 'Catch hammers (+1 point)',
      },
      {
        keys: ['mouseClick'],
        action: 'Avoid skulls (-2 points)',
      },
    ],
  },
  5: {
    desc: 'Match three or more identical runes in Vanaheim to harness their magical powers. Reach the target score before time runs out.',
    buttons: [
      {
        keys: ['mouseClick', 'mouseDrag'],
        action: 'Swap runes',
      },
    ],
  },
  6: {
    desc: 'Test your memory in Midgard by matching pairs of Norse symbols. Find all matching pairs with the fewest moves possible.',
    buttons: [
      {
        keys: ['mouseClick'],
        action: 'Flip cards',
      },
    ],
  },
  7: {
    desc: 'Survive the fiery realm of Muspelheim by dodging falling fireballs. Move your viking left and right to avoid getting hit.',
    buttons: [
      {
        keys: ['arrowLeft'],
        action: 'Move left',
      },
      {
        keys: ['arrowRight'],
        action: 'Move right',
      },
      {
        keys: ['space'],
        action: 'Start/restart game',
      },
    ],
  },
  8: {
    desc: 'Test your knowledge of Norse mythology in Alfheim. Answer questions correctly before time runs out to prove your wisdom.',
    buttons: [
      {
        keys: ['mouseClick'],
        action: 'Select answer',
      },
    ],
  },
  9: {
    desc: 'Face your final challenge in Asgard, the realm of the gods. Use all your accumulated knowledge to overcome this ultimate test.',
    buttons: [
      {
        keys: ['space'],
        action: 'Start challenge',
      },
    ],
  },
};
