// Copyright (c) 2019 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const ScenarioCircle = require('./scenario-circle');
const ScenarioStraight = require('./scenario-straight');

const Scenario = {
  ...ScenarioCircle,
  ...ScenarioStraight
};

function loadScenario(name, isLive, duration, rateHz) {
  // Construct proper scenario for live vs log
  const scenarioName = isLive ? name : name + '_log';

  const scenario = Scenario[scenarioName];
  if (!scenario) {
    throw new Error('No scenario named ' + scenario + 'found.');
  }

  const data = {
    metadata: JSON.stringify(scenario.metadata),
    frames: [],
    timing: []
  };

  const frameLimit = duration * rateHz;
  const frameLength = 1.0 / rateHz;

  for (let i = 0; i < frameLimit; i++) {
    const timeOffset = frameLength * i;
    const frame = scenario.generator.getFrame(timeOffset);
    data.timing.push(frame.data.updates[0].timestamp);
    data.frames.push(JSON.stringify(frame));
  }

  return data;
}

module.exports = {
  loadScenario
};
