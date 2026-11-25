import { StoryStateMachine } from '../src/logic/stateMachine.js';

console.log('=== RUNNING STATE MACHINE COMPREHENSIVE SIMULATION TESTS ===');

let testsPassed = 0;
let testsTotal = 0;

function assert(condition, message) {
  testsTotal++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    testsPassed++;
  } else {
    console.error(`[FAIL] ${message}`);
  }
}

// TEST 1: Initial state & Prologue progression
{
  const sm = new StoryStateMachine();
  assert(sm.state.currentScene === 'prologue', 'Starts at prologue');
  assert(sm.state.paranoiaLevel === 10, 'Initial paranoiaLevel is 10');
  assert(sm.state.knowsEmiliaSecret === false, 'knowsEmiliaSecret starts false');

  // Advance dialogues in Prologue until Choice 1
  while (!sm.isWaitingForChoice()) {
    sm.next();
  }
  const choice = sm.getCurrentChoice();
  assert(choice && choice.id === 'choice_1', 'Choice 1 reached in prologue');
  assert(choice.options.length === 3, 'Choice 1 has 3 options (A, B, C)');
}

// TEST 2: Choice 2B Option C (returnTo2B) Logic
{
  const sm = new StoryStateMachine();
  // Simulate jumping to Scene 1B
  sm.goToScene('scene_1b', 0);
  while (!sm.isWaitingForChoice()) {
    sm.next();
  }
  assert(sm.getCurrentChoice().id === 'choice_2b', 'Reached Choice 2B');

  // Select Option C: "Discuss the situation openly with Aflania. Return to Scene 1A and continue with Scene 2B."
  sm.selectChoice('C');
  assert(sm.state.currentScene === 'scene_1a', 'Redirected to Scene 1A');
  assert(sm.state.returnTo2B === true, 'returnTo2B flag is set to true');

  // Step through Scene 1A until "For that evening, they were at peace."
  let peaceLineHit = false;
  while (sm.state.currentScene === 'scene_1a') {
    const diag = sm.getCurrentDialogue();
    if (diag && diag.text.includes('For that evening, they were at peace.')) {
      peaceLineHit = true;
    }
    sm.next();
  }
  assert(peaceLineHit, 'Encountered peace line in Scene 1A');
  assert(sm.state.currentScene === 'scene_2b', 'Automatically redirected to Scene 2B after peace line');
  assert(sm.state.returnTo2B === false, 'returnTo2B flag reset');
  assert(sm.state.knowsEmiliaSecret === true, 'Scene 2B entrance set knowsEmiliaSecret = true');
}

// TEST 3: Scene 3B & 3C Conditional Routing based on knowsEmiliaSecret
{
  // Path A: with knowsEmiliaSecret = true
  const smA = new StoryStateMachine({ knowsEmiliaSecret: true });
  smA.goToScene('scene_3b', 0);
  while (smA.state.currentScene === 'scene_3b') {
    smA.next();
  }
  assert(smA.state.currentScene === 'scene_4a', 'Scene 3B with knowsEmiliaSecret=true routes to Scene 4A');

  // Path B: with knowsEmiliaSecret = false
  const smB = new StoryStateMachine({ knowsEmiliaSecret: false });
  smB.goToScene('scene_3b', 0);
  while (smB.state.currentScene === 'scene_3b') {
    smB.next();
  }
  assert(smB.state.currentScene === 'scene_3', 'Scene 3B with knowsEmiliaSecret=false routes to Scene 3');

  // Path C: Scene 3C with knowsEmiliaSecret = true
  const smC = new StoryStateMachine({ knowsEmiliaSecret: true });
  smC.goToScene('scene_3c', 0);
  while (smC.state.currentScene === 'scene_3c') {
    smC.next();
  }
  assert(smC.state.currentScene === 'scene_4a', 'Scene 3C with knowsEmiliaSecret=true routes to Scene 4A');

  // Path D: Scene 3C with knowsEmiliaSecret = false
  const smD = new StoryStateMachine({ knowsEmiliaSecret: false });
  smD.goToScene('scene_3c', 0);
  while (smD.state.currentScene === 'scene_3c') {
    smD.next();
  }
  assert(smD.state.currentScene === 'scene_3', 'Scene 3C with knowsEmiliaSecret=false routes to Scene 3');
}

// TEST 4: Scene 3D Decision follow-ups
{
  const sm = new StoryStateMachine();
  sm.goToScene('scene_3d', 0);
  while (!sm.isWaitingForChoice()) {
    sm.next();
  }
  const choice = sm.getCurrentChoice();
  assert(choice && choice.id === 'choice_3d', 'Scene 3D presents follow-up choices');
  assert(choice.options.length === 3, 'Scene 3D has 3 options: Scene 3, Scene 2B, Scene 3C');
  
  sm.selectChoice('A');
  assert(sm.state.currentScene === 'scene_3', 'Scene 3D Option A routes to Scene 3');
}

// TEST 5: Choice 4 Option D (destructive max paranoia) -> Ending C -> Epilogue
{
  const sm = new StoryStateMachine();
  sm.goToScene('scene_3', 0);
  while (!sm.isWaitingForChoice()) {
    sm.next();
  }
  const choice4 = sm.getCurrentChoice();
  assert(choice4.id === 'choice_4', 'Reached Choice 4');
  const optD = choice4.options.find(o => o.key === 'D');
  assert(optD.isDestructive === true, 'Choice 4 Option D is marked isDestructive');

  sm.selectChoice('D');
  assert(sm.state.currentScene === 'ending_c', 'Option D routes to Ending C');
  assert(sm.state.unlockedEndings.includes('ending_c'), 'Ending C recorded in unlockedEndings');
  assert(sm.state.paranoiaLevel >= 60, 'Paranoia spiked on destructive choice');

  // Proceed to Epilogue
  sm.proceedToEpilogue();
  assert(sm.state.currentScene === 'epilogue', 'Proceeded from Ending C to Epilogue');
  assert(sm.state.isCompleted === true, 'Game marked as completed in Epilogue');
}

// TEST 6: Paranoia Level Clamping
{
  const sm = new StoryStateMachine({ paranoiaLevel: 95 });
  sm._modifyParanoia(30);
  assert(sm.state.paranoiaLevel === 100, 'Paranoia clamped at max 100');
  sm._modifyParanoia(-150);
  assert(sm.state.paranoiaLevel === 0, 'Paranoia clamped at min 0');
}

console.log(`\nSimulation Results: ${testsPassed}/${testsTotal} tests passed.`);
if (testsPassed === testsTotal) {
  console.log('ALL STATE MACHINE LOGIC VERIFIED SUCCESSFULLY!');
}
