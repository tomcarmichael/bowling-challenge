const Frame = require('./frame');

class Game {
  constructor(FrameClass = Frame) {
    this.grandTotal = 0;
    this.frames = [];
    this.FrameClass = FrameClass;
    this.initialiseFrames();
  }

  initialiseFrames() {
    for (let i = 0; i < 10; i++) {
      const frame = new this.FrameClass();
      this.frames.push(frame);
    }
  }

  play(scoresArray) { // take a 2D array, 1 array for each frame. If strike, array length will be 1
    this.frames.forEach((frame, i) => {
      // no bonus points to allocate after first frame
      frame.play(scoresArray[i]);
      if (i > 0) { this.allocateBonusPoints(i); }
    });
    const finalFrame = this.frames[9];
    if (finalFrame.isStrike() || finalFrame.isSpare()) {
      // Bonus rolls after the final frame provided from UI as addl array element
      this.playFinalFrameBonusRolls(scoresArray[10]);
    }
    this.calculateGrandTotal();
  }

  allocateBonusPoints(index) {
    const currentFrame = this.frames[index];
    const previousFrame = this.frames[index - 1];
    const frameBeforeLast = this.frames[index - 2];

    if (previousFrame.isSpare()) {
      previousFrame.bonusPoints += currentFrame.rolls[0];
    } else if (previousFrame.isStrike()) {
      previousFrame.bonusPoints += currentFrame.regularPoints;
      // if this is at least the 3rd frame & have been 2 consecutive strikes before this frame
      if (index >= 2 && frameBeforeLast.isStrike()) {
        frameBeforeLast.bonusPoints += currentFrame.rolls[0];
      }
    }
  }

  playFinalFrameBonusRolls(bonusRollsArray) {
    const finalFrame = this.frames[9];
    const penultimateFrame = this.frames[8];

    bonusRollsArray.forEach((points) => {
      finalFrame.bonusPoints += points;
    });
    // If strike in frame 9 and 10, allocate the first bonus roll as bonus point to frame 9:
    if (finalFrame.isStrike() && penultimateFrame.isStrike()) {
      penultimateFrame.bonusPoints += bonusRollsArray[0];
    }
  }

  calculateGrandTotal() {
    this.frames.forEach((frame) => {
      this.grandTotal += (frame.regularPoints + frame.bonusPoints);
    });
  }

  isGutterGame() {
    return this.grandTotal === 0;
  }

  isPerfectGame() {
    return this.grandTotal === 300;
  }
}

module.exports = Game;
